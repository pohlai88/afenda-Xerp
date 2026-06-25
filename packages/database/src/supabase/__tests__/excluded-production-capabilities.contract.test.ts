import { describe, expect, it } from "vitest";

import {
  isSupabaseExcludedProductionCapability,
  SUPABASE_EXCLUDED_PRODUCTION_CAPABILITIES,
} from "../excluded-production-capabilities.contract.js";

describe("excluded-production-capabilities.contract", () => {
  it("registers Realtime and related excluded capabilities", () => {
    expect(SUPABASE_EXCLUDED_PRODUCTION_CAPABILITIES).toContain("realtime");
    expect(SUPABASE_EXCLUDED_PRODUCTION_CAPABILITIES).toContain(
      "gotrue_erp_identity"
    );
  });

  it("identifies excluded capability keys", () => {
    expect(isSupabaseExcludedProductionCapability("realtime")).toBe(true);
    expect(isSupabaseExcludedProductionCapability("postgres")).toBe(false);
  });
});
