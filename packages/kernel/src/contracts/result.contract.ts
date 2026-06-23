/**
 * Canonical fallible result shape for platform contracts.
 *
 * Domain packages may define narrower result aliases; this is the shared
 * discriminated union for new cross-cutting contracts.
 */

export interface ResultSuccess<TValue> {
  readonly ok: true;
  readonly value: TValue;
}

export interface ResultFailure<E = Error> {
  readonly error: E;
  readonly ok: false;
}

export type Result<TValue, E = Error> =
  | ResultSuccess<TValue>
  | ResultFailure<E>;

export function ok<TValue>(value: TValue): ResultSuccess<TValue> {
  return { ok: true, value };
}

export function err<E = Error>(error: E): ResultFailure<E> {
  return { ok: false, error };
}

export function isOk<TValue, E>(
  result: Result<TValue, E>
): result is ResultSuccess<TValue> {
  return result.ok;
}

export function isErr<TValue, E>(
  result: Result<TValue, E>
): result is ResultFailure<E> {
  return !result.ok;
}
