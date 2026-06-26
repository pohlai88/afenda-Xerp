/**
 * Env bag accepted by config readers.
 * Tests may pass partial stubs — full `ProcessEnv` is not required.
 */
export type EnvReaderSource = Record<string, string | undefined>;
