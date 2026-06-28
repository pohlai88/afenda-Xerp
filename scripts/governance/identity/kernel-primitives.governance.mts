/**
 * PAS-001 §4.1.5 — kernel primitives contract source guard.
 *
 * Primitive type contracts must not reference enterprise ID parser/registry symbols.
 */

export const PRIMITIVE_CONTRACT_SOURCE_FILES = [
  "locale-code.contract.ts",
  "timezone-id.contract.ts",
  "date-format.contract.ts",
  "number-format.contract.ts",
  "currency-code.contract.ts",
  "country-code.contract.ts",
  "uom-code.contract.ts",
] as const;

export type PrimitiveContractSourceRule = "primitive-contract-forbidden-import";

export interface PrimitiveContractSource {
  readonly path: string;
  readonly source: string;
}

export interface PrimitiveContractSourceViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: PrimitiveContractSourceRule;
}

export function isPrimitiveContractSourcePath(path: string): boolean {
  const normalized = path.replace(/\\/g, "/");
  return PRIMITIVE_CONTRACT_SOURCE_FILES.some((fileName) =>
    normalized.endsWith(`identity/primitives/${fileName}`)
  );
}

export function collectPrimitiveContractSourceViolations(
  sources: readonly PrimitiveContractSource[]
): PrimitiveContractSourceViolation[] {
  const violations: PrimitiveContractSourceViolation[] = [];

  for (const file of sources) {
    const relativePath = file.path.replace(/\\/g, "/");
    if (!isPrimitiveContractSourcePath(relativePath)) {
      continue;
    }

    if (/\bparseCanonicalId\b/.test(file.source)) {
      violations.push({
        rule: "primitive-contract-forbidden-import",
        file: relativePath,
        message:
          "Primitive contracts must not reference parseCanonicalId — use rejectIfMisclassifiedId for misclassification guards",
      });
    }

    if (/\bID_FAMILIES\b/.test(file.source)) {
      violations.push({
        rule: "primitive-contract-forbidden-import",
        file: relativePath,
        message:
          "Primitive contracts must not import ID_FAMILIES — primitives live in PRIMITIVE_REFERENCES registry",
      });
    }
  }

  return violations;
}
