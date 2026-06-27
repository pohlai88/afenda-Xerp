/**
 * Low-level nominal brand marker.
 *
 * This file provides compile-time nominal typing only.
 *
 * It must not:
 * - validate enterprise identifiers
 * - parse external input
 * - convert unchecked strings into IDs
 * - be imported directly by application packages for ID creation
 *
 * Canonical enterprise IDs must be parsed through Kernel identity parsers.
 */

declare const brandSymbol: unique symbol;

export type Brand<TValue, TBrand extends string> = TValue & {
  readonly [brandSymbol]: TBrand;
};

/**
 * Strip the compile-time brand for logging, persistence, JSON, and wire formats.
 *
 * This does not validate, parse, or transform the value.
 */
export function unbrand<TValue extends string, TBrand extends string>(
  value: Brand<TValue, TBrand>
): TValue {
  return value;
}
