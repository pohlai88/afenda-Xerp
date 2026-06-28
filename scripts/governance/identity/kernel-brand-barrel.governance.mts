/**
 * PAS-001 §4.1.2 — kernel brand barrel import guard.
 *
 * Only `identity/brand/index.ts` may import `brand.contract.ts` directly.
 * All other kernel modules must use `identity/brand/index.js`.
 */

export const ALLOWED_DIRECT_BRAND_CONTRACT_IMPORT_PATHS = [
  "packages/kernel/src/identity/brand/index.ts",
  "packages/kernel/src/identity/brand/brand.contract.ts",
] as const;

export const FORBIDDEN_DIRECT_BRAND_CONTRACT_IMPORT_PATTERN =
  /\bfrom\s+["'][^"']*brand\/brand\.contract(?:\.js)?["']/;

export type DirectBrandContractImportRule = "direct-brand-contract-import";

export interface DirectBrandContractImportSource {
  readonly path: string;
  readonly source: string;
}

export interface DirectBrandContractImportViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: DirectBrandContractImportRule;
}

export function isAllowedDirectBrandContractImportPath(path: string): boolean {
  const normalized = path.replace(/\\/g, "/");
  return (
    ALLOWED_DIRECT_BRAND_CONTRACT_IMPORT_PATHS as readonly string[]
  ).includes(normalized);
}

export function collectDirectBrandContractImportViolations(
  sources: readonly DirectBrandContractImportSource[]
): DirectBrandContractImportViolation[] {
  const violations: DirectBrandContractImportViolation[] = [];

  for (const file of sources) {
    const relativePath = file.path.replace(/\\/g, "/");
    if (isAllowedDirectBrandContractImportPath(relativePath)) {
      continue;
    }

    if (FORBIDDEN_DIRECT_BRAND_CONTRACT_IMPORT_PATTERN.test(file.source)) {
      violations.push({
        rule: "direct-brand-contract-import",
        file: relativePath,
        message:
          "Import Brand/unbrand via identity/brand/index.js — direct brand.contract.js imports bypass the barrel",
      });
    }
  }

  return violations;
}
