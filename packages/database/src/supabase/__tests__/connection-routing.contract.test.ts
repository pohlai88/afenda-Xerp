import { describe, expect, it } from "vitest";

import {
  assertDatabaseConnectionConsumer,
  DATABASE_CONNECTION_CONSUMERS,
  DATABASE_CONNECTION_ROUTING,
  InvalidDatabaseConnectionConsumerError,
  resolveConnectionMethodForConsumer,
  resolveDatabaseUrlForConsumer,
} from "../connection-routing.contract.js";

const TEST_PROJECT_REF = "abcdefghijklmnopqrst";
const SUPABASE_ENV: NodeJS.ProcessEnv = {
  SUPABASE_DB_PASSWORD: "p@ss!word",
  SUPABASE_DB_REGION: "ap-southeast-2",
  SUPABASE_DB_POOLER_HOST: "aws-1-ap-southeast-2.pooler.supabase.com",
  NEXT_PUBLIC_SUPABASE_URL: `https://${TEST_PROJECT_REF}.supabase.co`,
};

describe("connection-routing.contract", () => {
  it("lists every consumer in the routing registry", () => {
    for (const consumer of DATABASE_CONNECTION_CONSUMERS) {
      expect(DATABASE_CONNECTION_ROUTING[consumer]).toBeDefined();
    }
  });

  it("routes migrations and live probes to direct connection", () => {
    expect(resolveConnectionMethodForConsumer("drizzle-migrations")).toBe(
      "direct"
    );
    expect(resolveConnectionMethodForConsumer("rls-live-probe")).toBe("direct");
  });

  it("routes app pools and workers to transaction pooler", () => {
    expect(resolveConnectionMethodForConsumer("platform-db-pool")).toBe(
      "transaction"
    );
    expect(resolveConnectionMethodForConsumer("auth-db-pool")).toBe(
      "transaction"
    );
    expect(resolveConnectionMethodForConsumer("execution-workers")).toBe(
      "transaction"
    );
  });

  it("builds URLs from the routing registry without duplicating env builders", () => {
    expect(
      resolveDatabaseUrlForConsumer("drizzle-migrations", SUPABASE_ENV)
    ).toBe(
      `postgresql://postgres:p%40ss!word@db.${TEST_PROJECT_REF}.supabase.co:5432/postgres`
    );
    expect(
      resolveDatabaseUrlForConsumer("platform-db-pool", SUPABASE_ENV)
    ).toBe(
      `postgresql://postgres.${TEST_PROJECT_REF}:p%40ss!word@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres`
    );
  });

  it("rejects unknown consumers", () => {
    expect(() => assertDatabaseConnectionConsumer("postgrest-api")).toThrow(
      InvalidDatabaseConnectionConsumerError
    );
  });
});
