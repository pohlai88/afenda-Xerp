/**
 * Returns a process-scoped singleton stored on `globalThis`.
 * Survives Next.js dev hot reload without creating duplicate pools.
 */
export function getRuntimeSingleton<T>(globalKey: string, factory: () => T): T {
  const root = globalThis as typeof globalThis & Record<string, T | undefined>;
  const existing = root[globalKey];

  if (existing) {
    return existing;
  }

  const created = factory();
  root[globalKey] = created;
  return created;
}

/** Clears a runtime singleton. Intended for tests and controlled shutdown. */
export function resetRuntimeSingleton(globalKey: string): void {
  const root = globalThis as typeof globalThis & Record<string, unknown>;
  delete root[globalKey];
}
