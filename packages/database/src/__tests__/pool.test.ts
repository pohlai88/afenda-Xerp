import { afterEach, describe, expect, it, vi } from "vitest";

const poolConfigs: Array<{ connectionString: string }> = [];

vi.mock("pg", () => ({
  Pool: vi.fn((config: { connectionString: string }) => {
    poolConfigs.push(config);
    return { end: vi.fn(async () => undefined) };
  }),
}));

import { Pool } from "pg";

import { createPgPool } from "../pool.js";
import * as connectionRouting from "../supabase/connection-routing.contract.js";

describe("createPgPool", () => {
  afterEach(() => {
    poolConfigs.length = 0;
    vi.mocked(Pool).mockClear();
    vi.restoreAllMocks();
  });

  it("uses platform-db-pool routing by default", () => {
    const resolveSpy = vi
      .spyOn(connectionRouting, "resolveDatabaseUrlForConsumer")
      .mockReturnValue("postgresql://platform-db-pool/test");

    createPgPool();

    expect(resolveSpy).toHaveBeenCalledOnce();
    expect(resolveSpy).toHaveBeenCalledWith("platform-db-pool");
    expect(poolConfigs[0]?.connectionString).toBe(
      "postgresql://platform-db-pool/test"
    );
  });

  it("uses auth-db-pool routing when connectionConsumer is set", () => {
    const resolveSpy = vi
      .spyOn(connectionRouting, "resolveDatabaseUrlForConsumer")
      .mockReturnValue("postgresql://auth-db-pool/test");

    createPgPool({ connectionConsumer: "auth-db-pool" });

    expect(resolveSpy).toHaveBeenCalledOnce();
    expect(resolveSpy).toHaveBeenCalledWith("auth-db-pool");
    expect(poolConfigs[0]?.connectionString).toBe(
      "postgresql://auth-db-pool/test"
    );
  });

  it("prefers explicit connectionString over registry routing", () => {
    const resolveSpy = vi.spyOn(
      connectionRouting,
      "resolveDatabaseUrlForConsumer"
    );
    const explicit = "postgresql://local/test";

    createPgPool({
      connectionConsumer: "auth-db-pool",
      connectionString: explicit,
    });

    expect(resolveSpy).not.toHaveBeenCalled();
    expect(poolConfigs[0]?.connectionString).toBe(explicit);
  });
});
