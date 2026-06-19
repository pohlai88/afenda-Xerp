import {
  METADATA_SECTION_TYPES,
  type MetadataSectionContract,
  type MetadataSectionType,
} from "../contracts/metadata-section.contract";

export const metadataSectionSchemas = METADATA_SECTION_TYPES.map((type) => ({
  type,
  requiresRenderer: true,
})) as readonly {
  readonly requiresRenderer: boolean;
  readonly type: MetadataSectionType;
}[];

export interface MetadataSchemaValidationResult {
  readonly errors: readonly string[];
  readonly valid: boolean;
}

export const isMetadataSectionType = (
  value: string
): value is MetadataSectionType =>
  METADATA_SECTION_TYPES.includes(value as MetadataSectionType);

export const validateMetadataSection = (
  section: MetadataSectionContract
): MetadataSchemaValidationResult => {
  const errors: string[] = [];

  if (!isMetadataSectionType(section.type)) {
    errors.push(`Unsupported section type "${section.type}".`);
  }

  if (section.type === "list" && (section.columns?.length ?? 0) === 0) {
    errors.push("List sections must declare at least one governed column.");
  }

  if (section.type === "form" && (section.fields?.length ?? 0) === 0) {
    errors.push("Form sections must declare at least one governed field.");
  }

  if (section.type === "audit-panel" && !section.auditPanel) {
    errors.push("Audit panel sections must include an audit panel contract.");
  }

  return {
    errors,
    valid: errors.length === 0,
  };
};
