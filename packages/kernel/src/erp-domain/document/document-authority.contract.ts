/**
 * PAS-001B B103 — Document domain authority (kernel contracts-only lifecycle).
 */

export const DOCUMENT_AUTHORITY_PAS = "PAS-001B" as const;

export const DOCUMENT_REGISTRY_ID = "PKGR01B_DOCUMENT_VOCABULARY" as const;

export const DOCUMENT_MODULE_KV_ID = "KV-DOC" as const;

export const DOCUMENT_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/document" as const;

export const DOCUMENT_AUTHORITY_FINGERPRINT =
  "DOCUMENT-AUTHORITY-2026-06-28-v1" as const;

export const DOCUMENT_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type DocumentPackageLifecyclePhase =
  (typeof DOCUMENT_PACKAGE_LIFECYCLE_PHASES)[number];

export const DOCUMENT_PACKAGE_LIFECYCLE: DocumentPackageLifecyclePhase =
  "contracts-only";

export function isDocumentPackageLifecyclePhase(
  value: string
): value is DocumentPackageLifecyclePhase {
  return (DOCUMENT_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
