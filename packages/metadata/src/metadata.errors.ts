export const METADATA_GOVERNANCE_ERROR_CODES = [
  "metadata-governance.invalid-authority",
  "metadata-governance.invalid-contract-version",
  "metadata-governance.invalid-governed-array",
  "metadata-governance.duplicate-governed-value",
  "metadata-governance.unsupported-surface-type",
  "metadata-governance.unsupported-layout-type",
  "metadata-governance.unsupported-section-type",
  "metadata-governance.unsupported-renderer-capability",
  "metadata-governance.prohibited-ownership",
  "metadata-governance.cross-package-violation",
  "metadata-governance.invalid-registry-entry",
] as const;

export type MetadataGovernanceErrorCode =
  (typeof METADATA_GOVERNANCE_ERROR_CODES)[number];

export interface MetadataGovernanceErrorDetails {
  /**
   * Native error cause.
   */
  readonly cause?: unknown;
  readonly code: MetadataGovernanceErrorCode;

  /**
   * Optional machine-readable context for diagnostics.
   *
   * Keep this serializable. Do not place Error instances, functions,
   * React elements, database clients, or request objects here.
   */
  readonly context?: Readonly<Record<string, unknown>>;
  readonly message: string;
}

export interface SerializedMetadataGovernanceError {
  readonly code: MetadataGovernanceErrorCode;
  readonly context?: Readonly<Record<string, unknown>>;
  readonly message: string;
  readonly name: "MetadataGovernanceError";
}

/** Typed governance error for metadata contract violations. */
export class MetadataGovernanceError extends Error {
  readonly code: MetadataGovernanceErrorCode;
  readonly context?: Readonly<Record<string, unknown>>;

  constructor(details: MetadataGovernanceErrorDetails) {
    super(details.message, { cause: details.cause });

    this.name = "MetadataGovernanceError";
    this.code = details.code;

    if (details.context !== undefined) {
      this.context = details.context;
    }

    Object.setPrototypeOf(this, MetadataGovernanceError.prototype);
  }

  toJSON(): SerializedMetadataGovernanceError {
    return {
      name: "MetadataGovernanceError",
      code: this.code,
      message: this.message,
      ...(this.context ? { context: this.context } : {}),
    };
  }
}

export function isMetadataGovernanceError(
  error: unknown
): error is MetadataGovernanceError {
  return error instanceof MetadataGovernanceError;
}

export function createMetadataGovernanceError(
  details: MetadataGovernanceErrorDetails
): MetadataGovernanceError {
  return new MetadataGovernanceError(details);
}
