import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY,
  getBusinessMasterDataAuthority,
} from "../data/business-master-data-authority.registry.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const boundaryContractPath = join(
  repoRoot,
  "packages/kernel/src/identity/wire/business-reference-wire.contract.ts"
);

describe("business master data authority ↔ kernel wire parity", () => {
  it("points every registry entry at the kernel id-boundary contract on disk", () => {
    for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
      expect(entry.kernelContractPath).toBeTruthy();
      expect(
        existsSync(join(repoRoot, entry.kernelContractPath as string))
      ).toBe(true);
    }
  });

  it("exports every registry kernelContractExport from the boundary module", () => {
    const boundarySource = readFileSync(boundaryContractPath, "utf8");

    for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
      expect(entry.kernelContractExport).toBeTruthy();
      expect(
        boundarySource.includes(entry.kernelContractExport as string),
        `${entry.kernelContractExport} missing from boundary contract`
      ).toBe(true);
    }
  });

  it("maps product and customer identity scopes for downstream wire guards", () => {
    expect(getBusinessMasterDataAuthority("product").identityScope).toBe(
      "tenant_catalog"
    );
    expect(getBusinessMasterDataAuthority("customer").identityScope).toBe(
      "tenant_and_company"
    );
  });
});
