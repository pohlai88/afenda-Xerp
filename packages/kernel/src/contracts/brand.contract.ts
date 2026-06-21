/**
 * Nominal brand marker for platform identifiers.
 *
 * Branded values remain plain strings at runtime and serialize as JSON strings.
 * Brand only at trust boundaries (DB rows, auth session, validated input).
 */

export type Brand<T, B extends string> = T & { readonly _brand: B };

/** Strip the compile-time brand — safe for logging and wire formats. */
export function unbrand<T extends string, B extends string>(
  value: Brand<T, B>
): T {
  return value;
}

export function brandOptionalId<B extends string>(
  value: string | Brand<string, B> | null | undefined,
  label: string
): Brand<string, B> | null {
  if (value == null) {
    return null;
  }

  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, B>;
}

export function brandRequiredId<B extends string>(
  value: string | Brand<string, B>,
  label: string
): Brand<string, B> {
  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, B>;
}
