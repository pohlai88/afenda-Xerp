import type { ReportingPurpose } from "../standards/accounting-standard.contract.js";
import type {
  JurisdictionCode,
  JurisdictionReportingProfile,
} from "./jurisdiction-profile.contract.js";

export const JURISDICTION_REPORTING_PROFILES: Readonly<
  Record<JurisdictionCode, JurisdictionReportingProfile>
> = {
  MY: {
    jurisdictionCode: "MY",
    mandatoryReportingFamily: "MFRS",
    statutoryRouteTag: "MFRS_STATUTORY",
  },
  SG: {
    jurisdictionCode: "SG",
    mandatoryReportingFamily: "SFRS",
    statutoryRouteTag: "SFRS_STATUTORY",
  },
  EU: {
    jurisdictionCode: "EU",
    mandatoryReportingFamily: "IFRS",
    statutoryRouteTag: "IFRS_STATUTORY",
  },
  US: {
    jurisdictionCode: "US",
    mandatoryReportingFamily: "US_GAAP",
    statutoryRouteTag: "US_GAAP_STATUTORY",
  },
  GLOBAL: {
    jurisdictionCode: "GLOBAL",
    mandatoryReportingFamily: "IFRS",
    statutoryRouteTag: "IFRS_GROUP",
  },
} as const;

export const JURISDICTION_PROCESS_ROUTING: Readonly<
  Record<string, readonly string[]>
> = {
  "jurisdiction:MY:statutory:lease_contract_recognition": [
    "LOCAL_POLICY_REVIEW",
  ],
  "jurisdiction:SG:statutory:lease_contract_recognition": [
    "LOCAL_POLICY_REVIEW",
  ],
  "jurisdiction:US:statutory:holding_relationship_minority_investment": [
    "LOCAL_POLICY_REVIEW",
  ],
  "jurisdiction:GLOBAL:group_consolidation:holding_relationship_subsidiary": [
    "IFRS_10",
  ],
} as const;

export function isJurisdictionCode(value: string): value is JurisdictionCode {
  return value in JURISDICTION_REPORTING_PROFILES;
}

export function normalizeCountryCodeToJurisdiction(
  countryCode: string
): JurisdictionCode | null {
  const upper = countryCode.toUpperCase();
  if (upper === "MY" || upper === "MYS") {
    return "MY";
  }
  if (upper === "SG" || upper === "SGP") {
    return "SG";
  }
  if (upper === "US" || upper === "USA") {
    return "US";
  }
  if (["DE", "FR", "NL", "EU", "IE"].includes(upper)) {
    return "EU";
  }
  return null;
}

export function resolveJurisdictionReportingProfile(
  jurisdictionCode: JurisdictionCode
): JurisdictionReportingProfile {
  return JURISDICTION_REPORTING_PROFILES[jurisdictionCode];
}

export function resolveJurisdictionProcessRoute(
  jurisdictionCode: JurisdictionCode,
  reportingPurpose: ReportingPurpose | undefined,
  eventType: string
): readonly string[] {
  const purpose = reportingPurpose ?? "statutory";
  const routeKey = `jurisdiction:${jurisdictionCode}:${purpose}:${eventType}`;
  return JURISDICTION_PROCESS_ROUTING[routeKey] ?? [];
}
