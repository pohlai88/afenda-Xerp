import { describe, expect, it } from "vitest";
import {
  ACCOUNTING_STANDARD_FAMILIES,
  isAccountingStandardFamily,
} from "../standards/accounting-standard-family.registry.js";

describe("accounting standard family registry (B1)", () => {
  it("declares initial reporting frameworks", () => {
    expect(ACCOUNTING_STANDARD_FAMILIES).toEqual([
      "IFRS",
      "MFRS",
      "SFRS",
      "US_GAAP",
      "LOCAL_POLICY",
    ]);
  });

  it("narrows family strings", () => {
    expect(isAccountingStandardFamily("IFRS")).toBe(true);
    expect(isAccountingStandardFamily("UNKNOWN")).toBe(false);
  });
});
