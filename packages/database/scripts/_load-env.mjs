import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
export const dbDir = path.resolve(scriptDir, "..");
export const repoRoot = path.resolve(dbDir, "../..");
export const migrationsDir = path.join(dbDir, "src", "migrations");
export const journalPath = path.join(migrationsDir, "meta", "_journal.json");

export function loadDatabaseEnv() {
  loadEnv({ path: path.join(repoRoot, ".env") });
  loadEnv({ path: path.join(repoRoot, ".env.local"), override: true });
  loadEnv({ path: path.join(dbDir, ".env"), override: true });
}

function readTrimmed(key) {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
}

function getSupabaseProjectRef() {
  const explicitRef = readTrimmed("SUPABASE_PROJECT_REF");
  if (explicitRef) {
    return explicitRef;
  }

  const projectUrl =
    readTrimmed("NEXT_PUBLIC_SUPABASE_URL") ?? readTrimmed("SUPABASE_URL");

  if (!projectUrl) {
    throw new Error(
      "SUPABASE_PROJECT_REF or NEXT_PUBLIC_SUPABASE_URL is required to build Supabase Postgres URLs."
    );
  }

  const [projectRef] = new URL(projectUrl).hostname.split(".");
  if (!projectRef) {
    throw new Error("Could not parse Supabase project ref from project URL.");
  }

  return projectRef;
}

function getSupabasePoolerHost() {
  const explicitHost = readTrimmed("SUPABASE_DB_POOLER_HOST");
  if (explicitHost) {
    return explicitHost;
  }

  const region = readTrimmed("SUPABASE_DB_REGION");
  if (!region) {
    throw new Error(
      "SUPABASE_DB_REGION or SUPABASE_DB_POOLER_HOST is required for shared pooler URLs."
    );
  }

  const prefix = readTrimmed("SUPABASE_DB_POOLER_PREFIX") ?? "aws-0";
  return `${prefix}-${region}.pooler.supabase.com`;
}

function buildSessionPoolerUrl() {
  const password = encodeURIComponent(
    readTrimmed("SUPABASE_DB_PASSWORD") ?? ""
  );
  const projectRef = getSupabaseProjectRef();
  const poolerHost = getSupabasePoolerHost();

  if (!password) {
    throw new Error(
      "SUPABASE_DB_PASSWORD is required to build shared pooler URL."
    );
  }

  return `postgresql://postgres.${projectRef}:${password}@${poolerHost}:5432/postgres`;
}

function buildDirectSupabaseUrl() {
  const password = encodeURIComponent(
    readTrimmed("SUPABASE_DB_PASSWORD") ?? ""
  );
  const projectRef = getSupabaseProjectRef();

  if (!password) {
    throw new Error(
      "SUPABASE_DB_PASSWORD is required to build direct Supabase URL."
    );
  }

  return `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;
}

function buildDedicatedPoolerUrl() {
  const password = encodeURIComponent(
    readTrimmed("SUPABASE_DB_PASSWORD") ?? ""
  );
  const projectRef = getSupabaseProjectRef();

  if (!password) {
    throw new Error(
      "SUPABASE_DB_PASSWORD is required to build dedicated pooler URL."
    );
  }

  return `postgresql://postgres:${password}@db.${projectRef}.supabase.co:6543/postgres`;
}

export function resolveMigrationDatabaseUrl() {
  const directUrl = readTrimmed("DATABASE_URL_DIRECT");
  if (directUrl) {
    return directUrl;
  }

  const dedicatedUrl = readTrimmed("DATABASE_URL_DEDICATED");
  if (dedicatedUrl) {
    return dedicatedUrl;
  }

  const sessionUrl = readTrimmed("DATABASE_URL_SESSION");
  if (sessionUrl) {
    return sessionUrl;
  }

  try {
    return buildSessionPoolerUrl();
  } catch {
    // fall through
  }

  const databaseUrl = readTrimmed("DATABASE_URL");
  if (databaseUrl) {
    return databaseUrl;
  }

  try {
    return buildDedicatedPoolerUrl();
  } catch {
    // fall through
  }

  try {
    return buildDirectSupabaseUrl();
  } catch {
    return readTrimmed("DATABASE_URL_TRANSACTION") ?? "";
  }
}
