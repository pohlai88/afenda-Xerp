import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { OperatingContext } from "@afenda/kernel";
import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import { ERP_SRC_ROOT } from "@/__tests__/support/erp-test-paths";

import { guardModuleRoute } from "../guard-module-route.server";

function createStubOperatingContext(): OperatingContext {
  const tenantId = createTestEnterpriseId(
    "tenant",
    "01ARZ3NDEKTSV4RRFFQ69G5FAV"
  );
  const companyId = createTestEnterpriseId(
    "company",
    "01ARZ3NDEKTSV4RRFFQ69G5FAW"
  );
  const userId = createTestEnterpriseId("user", "01ARZ3NDEKTSV4RRFFQ69G5FAX");

  return {
    correlationId: "corr_test_001",
    tenant: {
      tenantId,
      displayName: "Dev Local",
      slug: "dev-local",
      saasLifecyclePhase: "active",
    },
    legalEntity: {
      companyId,
      displayName: "Dev Local Co",
      slug: "dev-local-co",
    },
    actor: {
      userId,
      displayName: "Operator",
    },
    permissionScope: {
      scopeType: "company",
      membershipEnterpriseId: createTestEnterpriseId(
        "membership",
        "01ARZ3NDEKTSV4RRFFQ69G5FAY"
      ),
      roleEnterpriseId: createTestEnterpriseId(
        "role",
        "01ARZ3NDEKTSV4RRFFQ69G5FAZ"
      ),
    },
  } satisfies OperatingContext;
}

describe("guardModuleRoute", () => {
  it("returns MODULE_NOT_FOUND for blank module ids", async () => {
    const result = await guardModuleRoute({
      moduleId: "   ",
      operatingContext: createStubOperatingContext(),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("MODULE_NOT_FOUND");
    }
  });

  it("passes through spine operating context for valid module ids", async () => {
    const operatingContext = createStubOperatingContext();

    const result = await guardModuleRoute({
      moduleId: "inventory",
      operatingContext,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.operatingContext).toBe(operatingContext);
    }
  });

  it("is referenced as future module route stub on disk", () => {
    const modulePath = join(
      ERP_SRC_ROOT,
      "lib/modules/guard-module-route.server.ts"
    );
    expect(existsSync(modulePath)).toBe(true);
    expect(readFileSync(modulePath, "utf8")).toContain("guardModuleRoute");
  });
});
