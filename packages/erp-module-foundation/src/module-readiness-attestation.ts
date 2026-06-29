import type {
  ErpModuleFoundationBundle,
  ErpRuntimeModuleStatus,
  ModuleReadinessReportRow,
} from "./erp-module-foundation.types.js";

/** Statuses where readiness Pass attests foundation contracts only — not operational runtime. */
export const FOUNDATION_ATTESTATION_STATUSES = [
  "wire_only",
  "foundation_authorized",
  "foundation_verified",
] as const satisfies readonly ErpRuntimeModuleStatus[];

export type FoundationAttestationStatus =
  (typeof FOUNDATION_ATTESTATION_STATUSES)[number];

export function isFoundationAttestationStatus(
  status: ErpRuntimeModuleStatus
): status is FoundationAttestationStatus {
  return (FOUNDATION_ATTESTATION_STATUSES as readonly string[]).includes(
    status
  );
}

export function resolveModuleReadinessVerdict(
  bundle: ErpModuleFoundationBundle,
  baseVerdict: ModuleReadinessReportRow["verdict"]
): ModuleReadinessReportRow["verdict"] {
  if (
    baseVerdict === "Pass" &&
    isFoundationAttestationStatus(bundle.module.runtimeStatus)
  ) {
    return "Foundation Pass";
  }

  return baseVerdict;
}

export function formatReadinessReportPreamble(
  bundle: ErpModuleFoundationBundle
): readonly string[] {
  const { runtimeStatus, lifecycle, runtimePackage, ownerPackage } =
    bundle.module;

  return [
    `> **Attestation scope:** \`${runtimeStatus}\` · lifecycle \`${lifecycle}\` — foundation bundle evidence only; **not** operational runtime authorization.`,
    `> **LAW K6:** Accepted Knowledge Atoms (${bundle.knowledge.terms.filter((t) => t.status === "accepted").length} in map) permit meaning — semantic runtime remains gated by \`${runtimePackage}\` / \`${ownerPackage}\`.`,
    "",
  ];
}
