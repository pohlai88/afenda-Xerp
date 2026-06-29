import { IFRS_16_LEASE_WARNING_MESSAGE } from "../standards/ifrs/ifrs-16-leases.registry.js";
import { getAccountingStandardVersionRef } from "../standards/standard-version.registry.js";
import type { AccountingStandardExplanation } from "./accounting-standard-explanation.contract.js";

function explanation(
  entry: Omit<AccountingStandardExplanation, "authorityRefs"> & {
    readonly versionKey: string;
  }
): AccountingStandardExplanation {
  const authorityRef = getAccountingStandardVersionRef(entry.versionKey);
  return {
    explanationKey: entry.explanationKey,
    title: entry.title,
    plainLanguageSummary: entry.plainLanguageSummary,
    whyItMatters: entry.whyItMatters,
    recommendedAction: entry.recommendedAction,
    boundaryStatement: entry.boundaryStatement,
    authorityRefs: authorityRef ? [authorityRef] : [],
  };
}

export const ACCOUNTING_STANDARD_EXPLANATIONS: Readonly<
  Record<string, AccountingStandardExplanation>
> = {
  "ifrs16-lessee-rou-liability-warning": explanation({
    explanationKey: "ifrs16-lessee-rou-liability-warning",
    versionKey: "IFRS_16_REQUIRED_2026",
    title: "IFRS 16 lessee lease recognition",
    plainLanguageSummary: IFRS_16_LEASE_WARNING_MESSAGE,
    whyItMatters: [
      "Qualifying leases require right-of-use asset and lease liability recognition.",
      "Simple rent expense posting may misstate the balance sheet.",
    ],
    recommendedAction:
      "Route this transaction through the lease accounting workflow before posting.",
    boundaryStatement:
      "This package validates against cited IFRS 16 evidence; it does not post journals or compute lease measurements.",
  }),
  "ifrs9-minority-investment-info": explanation({
    explanationKey: "ifrs9-minority-investment-info",
    versionKey: "IFRS_9_REQUIRED_2026",
    title: "IFRS 9 minority investment classification",
    plainLanguageSummary:
      "Minority investments may require IFRS 9 financial instrument classification review.",
    whyItMatters: [
      "Measurement and disclosure depend on instrument classification.",
    ],
    recommendedAction: "Review classification with finance policy owners.",
    boundaryStatement:
      "Validation cites IFRS 9 evidence; final treatment remains with the consumer workflow.",
  }),
  "ifrs10-subsidiary-consolidation-info": explanation({
    explanationKey: "ifrs10-subsidiary-consolidation-info",
    versionKey: "IFRS_10_REQUIRED_2026",
    title: "IFRS 10 subsidiary consolidation",
    plainLanguageSummary:
      "Subsidiary relationships may require consolidation under IFRS 10.",
    whyItMatters: ["Group reporting depends on control assessment."],
    recommendedAction: "Route to consolidation workflow when control exists.",
    boundaryStatement:
      "This package routes to standards evidence; consolidation calculation is downstream.",
  }),
  "ifrs11-jv-classification-info": explanation({
    explanationKey: "ifrs11-jv-classification-info",
    versionKey: "IFRS_11_REQUIRED_2026",
    title: "IFRS 11 joint arrangement classification",
    plainLanguageSummary:
      "Joint ventures require IFRS 11 joint arrangement classification.",
    whyItMatters: [
      "Joint operation vs joint venture drives accounting treatment.",
    ],
    recommendedAction: "Complete joint arrangement classification review.",
    boundaryStatement:
      "Classification guidance only; posting execution belongs to Accounting.",
  }),
  "ifrs12-disclosure-interests-info": explanation({
    explanationKey: "ifrs12-disclosure-interests-info",
    versionKey: "IFRS_12_REQUIRED_2026",
    title: "IFRS 12 disclosure of interests",
    plainLanguageSummary:
      "Interests in other entities may trigger IFRS 12 disclosure requirements.",
    whyItMatters: [
      "Regulatory and group reporting rely on complete disclosures.",
    ],
    recommendedAction: "Review disclosure checklist for the relationship.",
    boundaryStatement:
      "Disclosure metadata only; filing execution is downstream.",
  }),
  "ias28-associate-equity-method-info": explanation({
    explanationKey: "ias28-associate-equity-method-info",
    versionKey: "IAS_28_REQUIRED_2026",
    title: "IAS 28 associate equity method",
    plainLanguageSummary:
      "Associates are generally accounted for using the equity method under IAS 28.",
    whyItMatters: [
      "Investment balances and profit recognition depend on equity method.",
    ],
    recommendedAction: "Route to equity method workflow.",
    boundaryStatement:
      "Standards-backed routing only; equity method calculation is downstream.",
  }),
  "ifrs18-presentation-disclosure-info": explanation({
    explanationKey: "ifrs18-presentation-disclosure-info",
    versionKey: "IFRS_18_REQUIRED_2026",
    title: "IFRS 18 presentation and disclosure",
    plainLanguageSummary:
      "Financial statement presentation may require IFRS 18 disclosure alignment.",
    whyItMatters: [
      "Presentation categories affect comparability across periods.",
    ],
    recommendedAction:
      "Review presentation mapping against IFRS 18 requirements.",
    boundaryStatement:
      "Presentation guidance only; statement generation is downstream.",
  }),
  "local-policy-judgment-escalation": explanation({
    explanationKey: "local-policy-judgment-escalation",
    versionKey: "IFRS_9_REQUIRED_2026",
    title: "Local policy judgment escalation",
    plainLanguageSummary:
      "This event may require local policy review in addition to IFRS evidence.",
    whyItMatters: [
      "Statutory and group books may diverge on minority investment treatment.",
    ],
    recommendedAction:
      "Escalate to qualified accountant sign-off before final posting.",
    boundaryStatement:
      "Escalation signals judgment zones; this package does not provide professional advice.",
  }),
  "ifrs9-fv-oci-classification-warning": explanation({
    explanationKey: "ifrs9-fv-oci-classification-warning",
    versionKey: "IFRS_9_REQUIRED_2026",
    title: "IFRS 9 FVOCI classification review",
    plainLanguageSummary:
      "Equity and debt instruments may require fair-value-through-OCI classification review before posting.",
    whyItMatters: [
      "Classification drives measurement, P&L vs OCI presentation, and impairment treatment.",
    ],
    recommendedAction:
      "Complete IFRS 9 business model and SPPI assessment before posting.",
    boundaryStatement:
      "Classification guidance only; measurement and posting remain downstream.",
  }),
  "ifrs10-control-percentage-missing-warning": explanation({
    explanationKey: "ifrs10-control-percentage-missing-warning",
    versionKey: "IFRS_10_REQUIRED_2026",
    title: "IFRS 10 control percentage missing",
    plainLanguageSummary:
      "Consolidation assessment requires documented control percentage before group reporting decisions.",
    whyItMatters: ["Control drives consolidation scope and NCI presentation."],
    recommendedAction:
      "Capture control percentage and reassess consolidation scope.",
    boundaryStatement:
      "Validation flags missing evidence; consolidation calculation is downstream.",
  }),
  "ifrs11-joint-type-missing-warning": explanation({
    explanationKey: "ifrs11-joint-type-missing-warning",
    versionKey: "IFRS_11_REQUIRED_2026",
    title: "IFRS 11 joint arrangement type missing",
    plainLanguageSummary:
      "Joint arrangements must be classified as joint operations or joint ventures before accounting treatment is selected.",
    whyItMatters: [
      "Joint operation vs joint venture drives recognition and measurement.",
    ],
    recommendedAction: "Document joint arrangement type with supporting facts.",
    boundaryStatement:
      "Classification metadata only; journal posting remains downstream.",
  }),
  "ias28-voting-interest-missing-warning": explanation({
    explanationKey: "ias28-voting-interest-missing-warning",
    versionKey: "IAS_28_REQUIRED_2026",
    title: "IAS 28 significant influence evidence missing",
    plainLanguageSummary:
      "Associate accounting requires evidence of significant influence, commonly supported by voting interest analysis.",
    whyItMatters: [
      "Equity method eligibility depends on influence assessment.",
    ],
    recommendedAction:
      "Document voting interest and significant influence assessment.",
    boundaryStatement:
      "Evidence check only; equity method calculation is downstream.",
  }),
  "ifrs16-short-term-exemption-info": explanation({
    explanationKey: "ifrs16-short-term-exemption-info",
    versionKey: "IFRS_16_REQUIRED_2026",
    title: "IFRS 16 short-term lease exemption",
    plainLanguageSummary:
      "Leases with a term of 12 months or less may qualify for the short-term lease exemption.",
    whyItMatters: [
      "Exemption can simplify expense recognition for qualifying leases.",
    ],
    recommendedAction:
      "Confirm short-term exemption policy and document lease term.",
    boundaryStatement:
      "Exemption guidance only; lease measurement and posting are downstream.",
  }),
  "ifrs16-low-value-exemption-info": explanation({
    explanationKey: "ifrs16-low-value-exemption-info",
    versionKey: "IFRS_16_REQUIRED_2026",
    title: "IFRS 16 low-value lease exemption",
    plainLanguageSummary:
      "Low-value underlying assets may qualify for the IFRS 16 recognition exemption.",
    whyItMatters: [
      "Exemption reduces ROU asset and lease liability recognition burden.",
    ],
    recommendedAction:
      "Confirm low-value threshold policy and retain supporting evidence.",
    boundaryStatement:
      "Exemption guidance only; lease measurement and posting are downstream.",
  }),
  "ifrs18-presentation-category-missing-warning": explanation({
    explanationKey: "ifrs18-presentation-category-missing-warning",
    versionKey: "IFRS_18_REQUIRED_2026",
    title: "IFRS 18 presentation category missing",
    plainLanguageSummary:
      "IFRS 18-aligned disclosure requires an explicit presentation category mapping before publication.",
    whyItMatters: [
      "Category mapping drives statement comparability and disclosure completeness.",
    ],
    recommendedAction:
      "Assign presentation category before disclosure workflow completion.",
    boundaryStatement:
      "Presentation metadata only; statement rendering is downstream.",
  }),
};

export function getAccountingStandardExplanation(
  explanationKey: string
): AccountingStandardExplanation | undefined {
  return ACCOUNTING_STANDARD_EXPLANATIONS[explanationKey];
}
