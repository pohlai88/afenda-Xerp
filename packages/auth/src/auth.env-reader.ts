/**
 * Env bag accepted by auth config readers.
 * Tests may pass partial stubs — full `ProcessEnv` is not required.
 */
export type AuthEnvReaderSource = Readonly<Record<string, string | undefined>>;

/**
 * Minimal env slice for readers that consult one or more known keys.
 */
export type AuthEnvReaderSlice<Keys extends string> = Readonly<
  Partial<Record<Keys, string | undefined>>
>;

/** Accept either a full env bag or a partial slice containing required keys. */
export type AuthEnvReaderInput<Keys extends string = string> =
  | AuthEnvReaderSource
  | AuthEnvReaderSlice<Keys>;

/**
 * Runtime ProcessEnv bridge — the single cast site for auth env readers.
 * Callers pass partial slices in tests; production defaults to `process.env`.
 */
export function readAuthRuntimeEnv(
  env?: AuthEnvReaderInput<string>
): AuthEnvReaderSource {
  if (env !== undefined) {
    return env;
  }

  return process.env as AuthEnvReaderSource;
}
