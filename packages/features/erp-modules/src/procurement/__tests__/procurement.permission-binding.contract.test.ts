import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PROCUREMENT_OWNERSHIP_CONTRACT } from "../procurement.ownership.contract.js";
import {
  PROCUREMENT_KERNEL_PERMISSION_KEYS,
  PROCUREMENT_PERMISSION_BINDING_ATTESTATION,
  PROCUREMENT_PERMISSION_BINDING_CONTRACT,
  PROCUREMENT_PERMISSION_BINDING_SLICE_ID,
  PROCUREMENT_PERMISSION_BINDING_STATUS,
} from "../procurement.permission-binding.contract.js";

const REPO_ROOT = join(import.meta.dirname, "../../../../../../");
const PERMISSION_CONTRACT_PATH = join(
  REPO_ROOT,
  "packages/permissions/src/grants/permission.contract.ts"
);

describe("procurement.permission-binding.contract (ERP-PROC-OP-004)", () => {
  it("declares ERP-PROC-OP-004 declared attestation", () => {
    expect(PROCUREMENT_PERMISSION_BINDING_SLICE_ID).toBe("ERP-PROC-OP-004");
    expect(PROCUREMENT_PERMISSION_BINDING_STATUS).toBe("declared");
    expect(PROCUREMENT_PERMISSION_BINDING_ATTESTATION.sliceId).toBe(
      "ERP-PROC-OP-004"
    );
    expect(PROCUREMENT_PERMISSION_BINDING_ATTESTATION.status).toBe("declared");
    expect(
      PROCUREMENT_PERMISSION_BINDING_ATTESTATION.registryWiringProhibitedUntil
    ).toContain("PERMISSION_REGISTRY");
  });

  it("matches ownership contract permissionRegistry owner", () => {
    expect(
      PROCUREMENT_PERMISSION_BINDING_CONTRACT.permissionRegistryOwner
    ).toBe(PROCUREMENT_OWNERSHIP_CONTRACT.permissionRegistry);
    expect(
      PROCUREMENT_PERMISSION_BINDING_CONTRACT.permissionRegistryOwner
    ).toBe("@afenda/permissions");
  });

  it("declares eighteen deferred kernel keys across four domains", () => {
    expect(PROCUREMENT_KERNEL_PERMISSION_KEYS).toHaveLength(18);
    expect(
      PROCUREMENT_PERMISSION_BINDING_CONTRACT.kernelPermissionKeys
    ).toHaveLength(18);
    expect(PROCUREMENT_PERMISSION_BINDING_CONTRACT.permissionParity).toBe(
      "deferred"
    );
    expect(PROCUREMENT_PERMISSION_BINDING_CONTRACT.registryWiringStatus).toBe(
      "deferred"
    );

    for (const key of PROCUREMENT_KERNEL_PERMISSION_KEYS) {
      expect(key.startsWith("procurement.")).toBe(true);
    }
  });

  it("does not wire procurement into PERMISSION_REGISTRY yet", () => {
    const permissionContract = readFileSync(PERMISSION_CONTRACT_PATH, "utf8");
    expect(permissionContract).not.toMatch(/^\s*procurement\s*:/m);
    expect(permissionContract).not.toMatch(
      /definePermissionKey\s*\(\s*["']procurement["']/
    );
  });
});
