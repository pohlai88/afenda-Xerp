const MASTER_DATA_NATURAL_KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u;

export const MAX_MASTER_DATA_NATURAL_KEY_LENGTH = 64;

export class InvalidMasterDataNaturalKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMasterDataNaturalKeyError";
  }
}

export function assertMasterDataNaturalKey(
  value: string,
  fieldLabel: string
): string {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new InvalidMasterDataNaturalKeyError(
      `${fieldLabel} must be non-empty.`
    );
  }

  if (trimmed.length > MAX_MASTER_DATA_NATURAL_KEY_LENGTH) {
    throw new InvalidMasterDataNaturalKeyError(
      `${fieldLabel} must be ${MAX_MASTER_DATA_NATURAL_KEY_LENGTH} characters or less.`
    );
  }

  if (!MASTER_DATA_NATURAL_KEY_PATTERN.test(trimmed)) {
    throw new InvalidMasterDataNaturalKeyError(
      `${fieldLabel} "${value}" is invalid. Use letters, digits, dot, underscore, or hyphen.`
    );
  }

  return trimmed;
}
