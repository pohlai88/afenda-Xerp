/**
 * PAS-001B §3.1 — wire classification label trace (meaning defers to PAS-004).
 * Kernel stores atom id pointers only; no @afenda/enterprise-knowledge import.
 */
export const PAS004_MEANING_OWNER = "PAS-004" as const;

export const PAS004_GLOSSARY_PATH =
  "docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md" as const;

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
