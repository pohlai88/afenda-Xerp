import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { describe, expect, it } from "vitest";

import { createModuleRouteOperatingContext } from "@/lib/modules/__tests__/module-route-test-fixtures";

import {
  resolveMetadataPolicyDecisionFromAuthorizationEvaluation,
  resolveMetadataPolicyDecisionFromOperatingContext,
} from "../resolve-metadata-policy-decision.server";

describe("resolveMetadataPolicyDecisionFromOperatingContext", () => {
  it("defaults to allow for verified operating context", () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-policy-default",
    });

    expect(
      resolveMetadataPolicyDecisionFromOperatingContext({ operatingContext })
    ).toEqual({ kind: "allow" });
  });

  it("honors explicit policy decision overrides", () => {
    const operatingContext = createModuleRouteOperatingContext({
      correlationId: "corr-policy-override",
    });

    expect(
      resolveMetadataPolicyDecisionFromOperatingContext({
        operatingContext,
        override: { kind: "gate", reason: "plan_required" },
      })
    ).toEqual({ kind: "gate", reason: "plan_required" });
  });
});

describe("resolveMetadataPolicyDecisionFromAuthorizationEvaluation", () => {
  it("maps permission denial to metadata deny", () => {
    expect(
      resolveMetadataPolicyDecisionFromAuthorizationEvaluation({
        decision: {
          action: "read",
          actorId: "actor",
          companyId: "company",
          correlationId: "corr",
          entityGroupId: null,
          evaluatedAt: "2026-01-01T00:00:00.000Z",
          membershipId: null,
          organizationId: null,
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
          reason: "denied",
          result: "deny",
          roleId: null,
          targetId: null,
          targetType: null,
          tenantId: "tenant",
          workspaceId: null,
        },
        denialCode: "permission_denied",
      })
    ).toEqual({ kind: "deny", reason: "unauthorized" });
  });

  it("maps policy gate results to metadata gate", () => {
    expect(
      resolveMetadataPolicyDecisionFromAuthorizationEvaluation({
        decision: {
          action: "read",
          actorId: "actor",
          companyId: "company",
          correlationId: "corr",
          entityGroupId: null,
          evaluatedAt: "2026-01-01T00:00:00.000Z",
          membershipId: "membership",
          organizationId: null,
          permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
          reason: "gated",
          result: "require_approval",
          roleId: "role",
          targetId: null,
          targetType: null,
          tenantId: "tenant",
          workspaceId: null,
        },
      })
    ).toEqual({ kind: "gate", reason: "plan_required" });
  });
});
