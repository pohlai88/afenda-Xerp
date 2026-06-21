export class MetadataUiError extends Error {
  override readonly name = "MetadataUiError";

  constructor(message: string) {
    super(message);
  }
}

export function isMetadataUiError(error: unknown): error is MetadataUiError {
  return error instanceof MetadataUiError;
}
