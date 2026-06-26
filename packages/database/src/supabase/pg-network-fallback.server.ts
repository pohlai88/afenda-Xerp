import { Pool, type PoolConfig } from "pg";

import { getSessionDatabaseUrl } from "../env.js";
import { DEFAULT_POOL_CONFIG } from "../pool.js";
import {
  type DatabaseConnectionConsumer,
  resolveDatabaseUrlForConsumer,
} from "./connection-routing.contract.js";

const PG_NETWORK_ERROR_CODES = new Set([
  "ENOTFOUND",
  "EAI_AGAIN",
  "ETIMEDOUT",
  "ECONNREFUSED",
]);

export function isPgNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const code = (error as NodeJS.ErrnoException).code;
  return typeof code === "string" && PG_NETWORK_ERROR_CODES.has(code);
}

export function buildPgConnectionCandidates(
  consumer: DatabaseConnectionConsumer,
  options: { includeNetworkFallbacks?: boolean } = {}
): Array<{ label: string; url: string }> {
  const primaryUrl = resolveDatabaseUrlForConsumer(consumer);
  const candidates: Array<{ label: string; url: string }> = [
    { label: consumer, url: primaryUrl },
  ];

  if (!options.includeNetworkFallbacks) {
    return candidates;
  }

  const databaseUrl = process.env["DATABASE_URL"]?.trim();
  if (databaseUrl && databaseUrl !== primaryUrl) {
    candidates.push({ label: "DATABASE_URL", url: databaseUrl });
  }

  try {
    const sessionUrl = getSessionDatabaseUrl();
    if (!candidates.some((candidate) => candidate.url === sessionUrl)) {
      candidates.push({ label: "session pooler", url: sessionUrl });
    }
  } catch {
    // Session pooler is optional when Supabase pooler config is incomplete.
  }

  return candidates;
}

export async function connectPgPoolWithFallback(options: {
  connectionConsumer: DatabaseConnectionConsumer;
  poolConfig?: PoolConfig;
  fallbackOnNetworkError?: boolean;
  purpose?: string;
}): Promise<Pool> {
  const candidates = options.fallbackOnNetworkError
    ? buildPgConnectionCandidates(options.connectionConsumer, {
        includeNetworkFallbacks: true,
      })
    : buildPgConnectionCandidates(options.connectionConsumer);

  const poolConfig: PoolConfig = {
    ...DEFAULT_POOL_CONFIG,
    ...options.poolConfig,
  };

  let lastError: unknown;

  for (const candidate of candidates) {
    const pool = new Pool({
      ...poolConfig,
      connectionString: candidate.url,
    });

    try {
      await pool.query("SELECT 1");
      if (
        options.fallbackOnNetworkError &&
        candidate.label !== options.connectionConsumer
      ) {
        console.log(
          `database: ${options.connectionConsumer} unreachable — using ${candidate.label} for ${options.purpose ?? "live probe"}`
        );
      }
      return pool;
    } catch (error) {
      lastError = error;
      await pool.end();

      if (!(options.fallbackOnNetworkError && isPgNetworkError(error))) {
        throw error;
      }
    }
  }

  throw lastError;
}
