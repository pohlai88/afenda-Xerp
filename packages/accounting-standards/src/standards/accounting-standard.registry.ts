import type { AccountingStandardRegistryEntry } from "./accounting-standard.contract.js";

export const ACCOUNTING_STANDARD_REGISTRY: readonly AccountingStandardRegistryEntry[] =
  [
    {
      standardKey: "IFRS_9",
      family: "IFRS",
      standardCode: "IFRS 9",
      standardTitle: "Financial Instruments",
      scopeSummary:
        "Recognition, classification, measurement, impairment, and derecognition of financial instruments.",
      lifecycleStatus: "current",
      defaultAuthorityVersionKey: "IFRS_9_REQUIRED_2026",
    },
    {
      standardKey: "IFRS_10",
      family: "IFRS",
      standardCode: "IFRS 10",
      standardTitle: "Consolidated Financial Statements",
      scopeSummary:
        "Control assessment and consolidated financial statement preparation.",
      lifecycleStatus: "current",
      defaultAuthorityVersionKey: "IFRS_10_REQUIRED_2026",
    },
    {
      standardKey: "IFRS_11",
      family: "IFRS",
      standardCode: "IFRS 11",
      standardTitle: "Joint Arrangements",
      scopeSummary: "Classification and accounting for joint arrangements.",
      lifecycleStatus: "current",
      defaultAuthorityVersionKey: "IFRS_11_REQUIRED_2026",
    },
    {
      standardKey: "IFRS_12",
      family: "IFRS",
      standardCode: "IFRS 12",
      standardTitle: "Disclosure of Interests in Other Entities",
      scopeSummary:
        "Disclosure requirements for interests in subsidiaries, joint arrangements, associates, and unconsolidated structured entities.",
      lifecycleStatus: "current",
      defaultAuthorityVersionKey: "IFRS_12_REQUIRED_2026",
    },
    {
      standardKey: "IFRS_16",
      family: "IFRS",
      standardCode: "IFRS 16",
      standardTitle: "Leases",
      scopeSummary:
        "Lessee and lessor accounting for leases, including right-of-use assets and lease liabilities.",
      lifecycleStatus: "current",
      defaultAuthorityVersionKey: "IFRS_16_REQUIRED_2026",
    },
    {
      standardKey: "IFRS_18",
      family: "IFRS",
      standardCode: "IFRS 18",
      standardTitle: "Presentation and Disclosure in Financial Statements",
      scopeSummary:
        "Presentation and disclosure requirements for financial statements.",
      lifecycleStatus: "current",
      defaultAuthorityVersionKey: "IFRS_18_REQUIRED_2026",
    },
    {
      standardKey: "IAS_28",
      family: "IFRS",
      standardCode: "IAS 28",
      standardTitle: "Investments in Associates and Joint Ventures",
      scopeSummary:
        "Equity method accounting for associates and certain joint ventures.",
      lifecycleStatus: "current",
      defaultAuthorityVersionKey: "IAS_28_REQUIRED_2026",
    },
  ] as const;

export function getAccountingStandardRegistryEntry(
  standardKey: string
): AccountingStandardRegistryEntry | undefined {
  return ACCOUNTING_STANDARD_REGISTRY.find(
    (entry) => entry.standardKey === standardKey
  );
}
