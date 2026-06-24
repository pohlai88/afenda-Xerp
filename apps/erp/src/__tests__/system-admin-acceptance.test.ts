import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getAfendaAuthSession } from "@afenda/auth";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { headers } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST as inviteUserPost } from "@/app/api/internal/v1/system-admin/users/invite/route";
import type { recordErpAuditEvent } from "@/lib/observability/record-erp-audit-event";
import {
  systemAdminAuditEventsGetContract,
  systemAdminMembershipRolePostContract,
  systemAdminUserInvitePostContract,
} from "@/server/api/contracts/system-admin/system-admin.contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

const appSrcRoot = join(import.meta.dirname, "..");
const ACCOUNTING_ADMIN_SOURCE_PATTERN =
  /chart of accounts|journal admin|ledger admin|\bcoa\b/i;
const MANIFEST_ACCOUNTING_ADMIN_PATTERN = /chart of accounts|journal admin/i;
const CLIENT_MUTATION_PATTERN =
  /"use client"|useFormState|useActionState|method=["']post["']/i;

const auditMocks = vi.hoisted(() => ({
  recordErpAuditEvent: vi
    .fn<typeof recordErpAuditEvent>()
    .mockResolvedValue(undefined),
}));

vi.mock("@/lib/observability/record-erp-audit-event", () => ({
  recordErpAuditEvent: auditMocks.recordErpAuditEvent,
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@afenda/auth", () => ({
  getAfendaAuthSession: vi.fn(),
}));

vi.mock("@/server/api/runtime/api-request-context", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/server/api/runtime/api-request-context")
    >();
  return {
    ...actual,
    assertRoutePermission: vi.fn(() => {
      throw new ApiRouteError("forbidden", "Permission denied.");
    }),
  };
});

function readAppSource(relativePath: string): string {
  return readFileSync(join(appSrcRoot, relativePath), "utf8");
}

describe("TIP-013 acceptance criteria", () => {
  beforeEach(() => {
    auditMocks.recordErpAuditEvent.mockClear();
    vi.mocked(getAfendaAuthSession).mockResolvedValue({
      user: { userId: "user-001" },
    } as Awaited<ReturnType<typeof getAfendaAuthSession>>);
    vi.mocked(headers).mockResolvedValue(new Headers());
  });

  describe("GIVEN Tenant A + users.manage + Company A WHEN invite THEN company membership + audit", () => {
    it("is covered by system-admin.integration invite service test", () => {
      expect(PERMISSION_REGISTRY.systemAdmin.users.manage).toBe(
        "system_admin.users_manage"
      );
      expect(systemAdminUserInvitePostContract.permission?.permission).toBe(
        PERMISSION_REGISTRY.systemAdmin.users.manage
      );
    });
  });

  describe("GIVEN Company A admin WHEN assign role to Company B THEN 403 + audit denial", () => {
    it("is covered by cross-company assignMembershipRole integration test", () => {
      expect(systemAdminMembershipRolePostContract.method).toBe("POST");
      expect(systemAdminMembershipRolePostContract.permission?.permission).toBe(
        PERMISSION_REGISTRY.systemAdmin.roles.manage
      );
    });
  });

  describe("GIVEN audit.read WHEN open audit viewer THEN tenant read-only list", () => {
    it("audit page loads tenant events without client mutations", () => {
      const source = readAppSource(
        "app/(protected)/system-admin/audit/page.tsx"
      );

      expect(source).toContain("listRecentAuditEvents");
      expect(source).toContain("permissionScope.tenantId");
      expect(source).not.toMatch(CLIENT_MUTATION_PATTERN);
      expect(source).not.toMatch(ACCOUNTING_ADMIN_SOURCE_PATTERN);
    });

    it("audit API contract is GET-only with audit.read permission", () => {
      expect(systemAdminAuditEventsGetContract.method).toBe("GET");
      expect(systemAdminAuditEventsGetContract.permission?.permission).toBe(
        PERMISSION_REGISTRY.systemAdmin.audit.read
      );
    });
  });

  describe("GIVEN no users.manage WHEN invite via API THEN 403 + audit denial with actor", () => {
    it("records denied audit with actor and correlation ID on permission failure", async () => {
      const correlationId = "corr-invite-denied-acceptance";
      const response = await inviteUserPost(
        new Request(
          "http://localhost/api/internal/v1/system-admin/users/invite",
          {
            body: JSON.stringify({
              displayName: "Denied User",
              email: "denied@example.com",
              roleId: "role-001",
            }),
            headers: {
              "content-type": "application/json",
              "x-correlation-id": correlationId,
            },
            method: "POST",
          }
        )
      );

      expect(response.status).toBe(403);
      expect(auditMocks.recordErpAuditEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "system_admin.user.invited",
          actorUserId: "user-001",
          correlationId,
          result: "denied",
        })
      );
    });
  });

  describe("GIVEN Phase 9 gate not passed WHEN accounting module settings THEN placeholder only", () => {
    it("module placeholder excludes accounting admin surfaces", () => {
      const modulePage = readAppSource(
        "app/(protected)/modules/[moduleId]/page.tsx"
      );
      const settingsPage = readAppSource(
        "app/(protected)/system-admin/settings/page.tsx"
      );

      expect(modulePage).toContain("Shell placeholder surface");
      expect(modulePage).not.toMatch(ACCOUNTING_ADMIN_SOURCE_PATTERN);
      expect(settingsPage).not.toMatch(ACCOUNTING_ADMIN_SOURCE_PATTERN);
      expect(settingsPage).toContain("No accounting settings");
    });

    it("accounting manifest route remains placeholder-only (no COA/journal admin)", () => {
      const manifestSource = readFileSync(
        join(
          import.meta.dirname,
          "../../../../packages/entitlements/src/evaluation/feature-manifest.registry.ts"
        ),
        "utf8"
      );

      expect(manifestSource).toContain('moduleId: "accounting"');
      expect(manifestSource).not.toMatch(MANIFEST_ACCOUNTING_ADMIN_PATTERN);
    });
  });
});
