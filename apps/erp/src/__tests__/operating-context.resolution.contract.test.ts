import { describe, expect, it } from "vitest";

import {
  verifyEntityGroupBoundary,
  verifyProjectSelection,
} from "@/lib/context/operating-context.resolution.contract";

const TENANT_ID = "tenant-001";
const ENTITY_GROUP_ID = "group-001";

describe("operating-context.resolution.contract", () => {
  describe("verifyEntityGroupBoundary", () => {
    it("allows legal entities without an entity group", () => {
      expect(
        verifyEntityGroupBoundary({
          entityGroupId: null,
          entityGroupRow: null,
          tenantId: TENANT_ID,
        })
      ).toBeNull();
    });

    it("rejects missing entity group rows fail-closed", () => {
      expect(
        verifyEntityGroupBoundary({
          entityGroupId: ENTITY_GROUP_ID,
          entityGroupRow: null,
          tenantId: TENANT_ID,
        })
      ).toEqual({
        code: "ENTITY_GROUP_NOT_FOUND",
        userMessage: "Corporate group for this legal entity was not found.",
      });
    });

    it("rejects entity groups outside tenant boundary", () => {
      expect(
        verifyEntityGroupBoundary({
          entityGroupId: ENTITY_GROUP_ID,
          entityGroupRow: {
            id: ENTITY_GROUP_ID,
            tenantId: "other-tenant",
            slug: "acme-group",
            displayName: "Acme Group",
            parentLegalEntityId: null,
            status: "active",
          },
          tenantId: TENANT_ID,
        })
      ).toEqual({
        code: "ENTITY_GROUP_SCOPE_MISMATCH",
        userMessage: "Corporate group does not belong to this tenant.",
      });
    });

    it("rejects non-operational entity groups", () => {
      expect(
        verifyEntityGroupBoundary({
          entityGroupId: ENTITY_GROUP_ID,
          entityGroupRow: {
            id: ENTITY_GROUP_ID,
            tenantId: TENANT_ID,
            slug: "acme-group",
            displayName: "Acme Group",
            parentLegalEntityId: null,
            status: "suspended",
          },
          tenantId: TENANT_ID,
        })
      ).toEqual({
        code: "ENTITY_GROUP_NOT_OPERATIONAL",
        userMessage:
          "Corporate group is suspended and workspace access is blocked.",
      });
    });
  });

  describe("verifyProjectSelection", () => {
    it("allows requests without project hints", () => {
      expect(verifyProjectSelection({ projectId: null })).toBeNull();
      expect(verifyProjectSelection({})).toBeNull();
    });

    it("rejects project hints until TIP-030 persistence exists", () => {
      expect(
        verifyProjectSelection({ projectId: "project-001" })
      ).toEqual({
        code: "PROJECT_SCOPE_MISMATCH",
        userMessage: "Project scope is not available in this workspace yet.",
      });
    });
  });
});
