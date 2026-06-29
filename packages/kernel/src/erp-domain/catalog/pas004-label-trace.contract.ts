/**
 * PAS-001B §3.1 — wire classification label trace (meaning defers to PAS-004).
 * Kernel stores atom id pointers only; no @afenda/enterprise-knowledge import.
 */
export const PAS004_MEANING_OWNER = "PAS-004" as const;

export const PAS004_GLOSSARY_PATH =
  "docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md" as const;

/** Filename suffixes requiring PAS-004 label traces (contested closed vocabulary). */
export const ERP_DOMAIN_PAS004_CONTESTED_CLASSIFICATION_SUFFIXES = [
  "-type.contract.ts",
  "-method.contract.ts",
  "-priority.contract.ts",
] as const;

/** Standalone contested classification contracts (not suffix-matched). */
export const ERP_DOMAIN_PAS004_CONTESTED_CLASSIFICATION_STANDALONE_FILES = [
  "pricing-context.contract.ts",
  "fiscal-period-state.contract.ts",
  "billing-cycle.contract.ts",
  "renewal-intent.contract.ts",
] as const;

export type ErpDomainWireShapeRole = "classification" | "enumeration" | "event";

export interface WireClassificationPas004LabelTraceEntry {
  readonly classificationId: string;
  readonly constantExport: string;
  readonly contractFile: string;
  readonly moduleSlug: string;
  readonly traces: Readonly<Record<string, Pas004LabelTrace>>;
  readonly values: readonly string[];
  readonly wireShapeRole?: ErpDomainWireShapeRole;
}

export function isErpDomainPas004ContestedClassificationContract(
  fileName: string
): boolean {
  if (
    (
      ERP_DOMAIN_PAS004_CONTESTED_CLASSIFICATION_STANDALONE_FILES as readonly string[]
    ).includes(fileName)
  ) {
    return true;
  }

  return ERP_DOMAIN_PAS004_CONTESTED_CLASSIFICATION_SUFFIXES.some((suffix) =>
    fileName.endsWith(suffix)
  );
}

export interface Pas004LabelTrace {
  readonly atomId: string;
  readonly glossaryPath: typeof PAS004_GLOSSARY_PATH;
  readonly meaningOwner: typeof PAS004_MEANING_OWNER;
}

export function buildPas004LabelTraces<T extends string>(
  moduleSlug: string,
  classificationId: string,
  values: readonly T[]
): Readonly<Record<T, Pas004LabelTrace>> {
  const traces = {} as Record<T, Pas004LabelTrace>;

  for (const value of values) {
    traces[value] = {
      atomId: `wire.${moduleSlug}.${classificationId}.${value}`,
      meaningOwner: PAS004_MEANING_OWNER,
      glossaryPath: PAS004_GLOSSARY_PATH,
    };
  }

  return traces;
}
