import { describe, expect, it } from "vitest";

import {
  collectIdentityBoundaryViolations,
  collectUnsafeIdCastViolations,
  IDENTITY_BOUNDARY_SCAN_ROOTS,
} from "../identity/identity-boundary.governance.mts";

describe("check:identity-boundary", () => {
  it("flags forbidden enterprise ID casts in ERP source", () => {
    const violations = collectIdentityBoundaryViolations([
      {
        path: "apps/erp/src/example.ts",
        source: "const tenantId = wire as TenantId;",
      },
    ]);

    expect(violations).toMatchObject([
      {
        rule: "enterprise-id-cast",
        file: "apps/erp/src/example.ts",
        message: "forbidden cast as TenantId",
      },
    ]);
  });

  it("flags CanonicalEnterpriseId casts in consumer packages", () => {
    const violations = collectIdentityBoundaryViolations([
      {
        path: "apps/erp/src/example.ts",
        source: 'const id = wire as CanonicalEnterpriseId<"customer">;',
      },
    ]);

    expect(violations).toMatchObject([
      {
        rule: "canonical-enterprise-id-cast",
        file: "apps/erp/src/example.ts",
      },
    ]);
  });

  it("flags kernel Brand imports outside identity package", () => {
    const violations = collectIdentityBoundaryViolations([
      {
        path: "packages/appshell/src/example.ts",
        source: 'import type { Brand } from "@afenda/kernel";',
      },
    ]);

    expect(violations).toMatchObject([
      {
        rule: "kernel-brand-import",
        file: "packages/appshell/src/example.ts",
      },
    ]);
  });

  it("flags local enterprise ID string aliases", () => {
    const violations = collectIdentityBoundaryViolations([
      {
        path: "apps/erp/src/example.ts",
        source: "type CustomerId = string;",
      },
    ]);

    expect(violations).toMatchObject([
      {
        rule: "local-enterprise-id-alias",
        file: "apps/erp/src/example.ts",
        message: "local ID alias type CustomerId = string",
      },
    ]);
  });

  it("allows kernel identity internals", () => {
    const violations = collectIdentityBoundaryViolations([
      {
        path: "packages/kernel/src/identity/canonical/canonical-id-parser.contract.ts",
        source: "return value as CanonicalId<TFamily>;",
      },
    ]);

    expect(violations).toEqual([]);
  });

  it("does not flag enterprise ID type names inside test description strings", () => {
    const violations = collectIdentityBoundaryViolations([
      {
        path: "apps/erp/src/lib/context/__tests__/operating-context.mappers.test.ts",
        source: `
          describe("toTenantContext", () => {
            it("brands enterpriseId as TenantId — not uuid PK", () => {
              expect(true).toBe(true);
            });
          });
        `,
      },
    ]);

    expect(violations).toEqual([]);
  });

  it("scans metadata-ui and ui-composition consumer roots", () => {
    expect(IDENTITY_BOUNDARY_SCAN_ROOTS).toEqual(
      expect.arrayContaining([
        "packages/metadata-ui/src",
        "packages/ui-composition/src",
      ])
    );
  });

  it("flags legacy brandRequiredId usage in consumer packages", () => {
    const violations = collectIdentityBoundaryViolations([
      {
        path: "apps/erp/src/example.ts",
        source:
          'const customerId = brandRequiredId(input.customerId, "customerId");',
      },
    ]);

    expect(violations).toMatchObject([
      {
        rule: "legacy-brand-helper",
        file: "apps/erp/src/example.ts",
        message:
          "forbidden legacy brand helper brandRequiredId — use parse* at trust boundaries",
      },
    ]);
  });

  it("flags legacy brandOptionalId usage in consumer packages", () => {
    const violations = collectIdentityBoundaryViolations([
      {
        path: "apps/erp/src/example.ts",
        source: "const tenantId = brandOptionalId(input.tenantId, 'tenantId');",
      },
    ]);

    expect(violations).toMatchObject([
      {
        rule: "legacy-brand-helper",
        file: "apps/erp/src/example.ts",
      },
    ]);
  });

  it("preserves legacy collectUnsafeIdCastViolations string format", () => {
    const violations = collectUnsafeIdCastViolations([
      {
        path: "apps/erp/src/example.ts",
        source: "const customerId = brandCustomerId(input.customerId);",
      },
    ]);

    expect(violations).toEqual([
      "apps/erp/src/example.ts: forbidden legacy brand helper brandCustomerId — use parse* at trust boundaries",
    ]);
  });
});
