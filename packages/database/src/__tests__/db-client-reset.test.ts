import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getAuthDbClient,
  getDbClient,
  resetAllDbClients,
  resetAuthDbClient,
  resetDbClient,
  resetRuntimeSingleton,
} from "../index.js";

const TEST_SINGLETON_KEY = "__afendaTestSingleton__";

describe("database client reset hooks", () => {
  afterEach(async () => {
    await resetAllDbClients();
    resetRuntimeSingleton(TEST_SINGLETON_KEY);
  });

  it("resetDbClient is safe when no singleton exists", async () => {
    await expect(resetDbClient()).resolves.toBeUndefined();
  });

  it("resetAuthDbClient is safe when no singleton exists", async () => {
    await expect(resetAuthDbClient()).resolves.toBeUndefined();
  });

  it("resetAllDbClients clears both singleton slots", async () => {
    await expect(resetAllDbClients()).resolves.toBeUndefined();
  });

  it("resetDbClient closes an existing client before clearing the singleton", async () => {
    const close = vi.fn(async () => undefined);
    const root = globalThis as typeof globalThis &
      Record<string, { close: () => Promise<void> } | undefined>;

    root['__afendaDbClient__'] = { close };

    await resetDbClient();

    expect(close).toHaveBeenCalledOnce();
    expect(root['__afendaDbClient__']).toBeUndefined();
  });

  it("does not recreate clients when reset helpers run without prior get* calls", () => {
    expect(() => getDbClient).not.toThrow();
    expect(() => getAuthDbClient).not.toThrow();
  });
});
