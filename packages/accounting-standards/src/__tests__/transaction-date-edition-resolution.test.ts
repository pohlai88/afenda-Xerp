import { describe, expect, it } from "vitest";
import { resolveAuthorityEditionForTransactionDate } from "../policy/transaction-date-edition-resolution.policy.js";

describe("transaction-date edition resolution (B17)", () => {
  it("resolves IFRS 16 2019 edition for pre-2026 transaction dates", () => {
    const resolved = resolveAuthorityEditionForTransactionDate(
      "IFRS 16",
      "2024-06-15",
      "IFRS_16_REQUIRED_2026"
    );

    expect(resolved).not.toBeNull();
    expect(resolved?.versionKey).toBe("IFRS_16_REQUIRED_2019");
    expect(resolved?.edition).toContain("2019");
  });

  it("resolves IFRS 16 2026 edition for post-2025 transaction dates", () => {
    const resolved = resolveAuthorityEditionForTransactionDate(
      "IFRS 16",
      "2026-06-15",
      "IFRS_16_REQUIRED_2026"
    );

    expect(resolved).not.toBeNull();
    expect(resolved?.versionKey).toBe("IFRS_16_REQUIRED_2026");
    expect(resolved?.edition).toContain("2026");
  });
});
