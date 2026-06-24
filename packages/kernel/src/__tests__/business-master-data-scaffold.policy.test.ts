import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  assertAuthorityOnlyRuntimeStatus,
  BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY,
  BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS,
  BUSINESS_MASTER_DATA_RESERVED_PACKAGES,
  BUSINESS_MASTER_DATA_RUNTIME_STATUS,
  isBusinessMasterDataReservedPackage,
} from "../contracts/business-master-data/index.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));

describe("@afenda/kernel business master data scaffold policy (TIP-008B Slice 4)", () => {
  it("keeps authority_only as the sole runtime status literal", () => {
    expect(BUSINESS_MASTER_DATA_RUNTIME_STATUS).toBe("authority_only");

    for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
      expect(() =>
        assertAuthorityOnlyRuntimeStatus(entry.runtimeStatus)
      ).not.toThrow();
    }

    expect(() => assertAuthorityOnlyRuntimeStatus("implemented")).toThrow(
      /authority_only/
    );
  });

  it("lists PKG-R02–R05 reserved packages without filesystem packages present", () => {
    expect(BUSINESS_MASTER_DATA_RESERVED_PACKAGES).toEqual([
      "@afenda/crm",
      "@afenda/inventory",
      "@afenda/hrm",
      "@afenda/procurement",
    ]);

    for (const packageId of BUSINESS_MASTER_DATA_RESERVED_PACKAGES) {
      expect(isBusinessMasterDataReservedPackage(packageId)).toBe(true);
    }

    for (const relativeDir of BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS) {
      expect(
        existsSync(join(repoRoot, relativeDir)),
        `${relativeDir} must not exist until domain TIPs`
      ).toBe(false);
    }
  });
});
