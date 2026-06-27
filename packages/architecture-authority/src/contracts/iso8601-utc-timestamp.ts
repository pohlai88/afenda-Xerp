const ISO_8601_UTC_DATE_TIME_PREFIX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?/u;

const ISO_8601_UTC_SUFFIX = /(?:Z|[+-]00:00(?::00)?)$/u;

/**
 * Parses ISO-8601 timestamps that are explicitly UTC (`Z` or `+00:00`).
 * Rejects non-UTC offsets for registry boundary safety.
 */
export function parseIso8601UtcTimestamp(value: string): number | undefined {
  const trimmed = value.trim();

  if (
    !(
      ISO_8601_UTC_DATE_TIME_PREFIX.test(trimmed) &&
      ISO_8601_UTC_SUFFIX.test(trimmed)
    )
  ) {
    return;
  }

  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? undefined : parsed;
}
