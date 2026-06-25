import { describe, expect, it } from "vitest";

import {
  isStorageProductionProviderId,
  STORAGE_ADDITIONAL_APPROVED_PROVIDERS,
  STORAGE_PRODUCTION_PROVIDER_IDS,
} from "../contracts/storage-additional-providers.contract.js";

describe("storage-additional-providers.contract", () => {
  it("keeps R2 in production provider union", () => {
    expect(STORAGE_PRODUCTION_PROVIDER_IDS).toContain("r2");
    expect(isStorageProductionProviderId("r2")).toBe(true);
  });

  it("documents Supabase Storage as additional approved option only", () => {
    expect(STORAGE_ADDITIONAL_APPROVED_PROVIDERS).toContain("supabase");
    expect(isStorageProductionProviderId("supabase")).toBe(false);
  });
});
