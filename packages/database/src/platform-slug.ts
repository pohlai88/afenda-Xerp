const PLATFORM_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
export const MAX_PLATFORM_SLUG_LENGTH = 128;

export class InvalidPlatformSlugError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPlatformSlugError";
  }
}

/** Normalizes platform slugs to lowercase kebab-case. */
export function normalizePlatformSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function assertPlatformSlug(value: string): string {
  const normalized = normalizePlatformSlug(value);

  if (!normalized) {
    throw new InvalidPlatformSlugError(
      "Slug must be non-empty after normalization."
    );
  }

  if (normalized.length > MAX_PLATFORM_SLUG_LENGTH) {
    throw new InvalidPlatformSlugError(
      `Slug must be ${MAX_PLATFORM_SLUG_LENGTH} characters or less.`
    );
  }

  if (!PLATFORM_SLUG_PATTERN.test(normalized)) {
    throw new InvalidPlatformSlugError(
      `Invalid slug "${value}". Expected lowercase kebab-case.`
    );
  }

  return normalized;
}
