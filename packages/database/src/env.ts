const DATABASE_URL_ENV = "DATABASE_URL";
const DATABASE_URL_DIRECT_ENV = "DATABASE_URL_DIRECT";
const DATABASE_URL_DEDICATED_ENV = "DATABASE_URL_DEDICATED";
const DATABASE_URL_SESSION_ENV = "DATABASE_URL_SESSION";
const DATABASE_URL_TRANSACTION_ENV = "DATABASE_URL_TRANSACTION";
const SUPABASE_DB_PASSWORD_ENV = "SUPABASE_DB_PASSWORD";
const SUPABASE_DB_REGION_ENV = "SUPABASE_DB_REGION";
const SUPABASE_DB_POOLER_HOST_ENV = "SUPABASE_DB_POOLER_HOST";
const SUPABASE_DB_POOLER_PREFIX_ENV = "SUPABASE_DB_POOLER_PREFIX";
const SUPABASE_PROJECT_REF_ENV = "SUPABASE_PROJECT_REF";
const SUPABASE_PUBLIC_URL_ENV = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_SERVER_URL_ENV = "SUPABASE_URL";

const SUPABASE_PROJECT_REF_PATTERN = /^[a-z0-9]{20}$/u;
const SUPABASE_REGION_PATTERN = /^[a-z]+-[a-z]+-\d+$/u;
const SUPABASE_POOLER_HOST_PATTERN =
  /^[a-z0-9-]+-[a-z]+-[a-z]+-\d+\.pooler\.supabase\.com$/u;

export type SupabaseConnectionMethod =
  | "direct"
  | "dedicated"
  | "session"
  | "transaction";

const CONNECTION_METHOD_ENV: Record<SupabaseConnectionMethod, string> = {
  direct: DATABASE_URL_DIRECT_ENV,
  dedicated: DATABASE_URL_DEDICATED_ENV,
  session: DATABASE_URL_SESSION_ENV,
  transaction: DATABASE_URL_TRANSACTION_ENV,
};

export class MissingDatabaseUrlError extends Error {
  constructor(message?: string) {
    super(
      message ??
        `${DATABASE_URL_ENV} is required. Set it in .env.secret, or provide ` +
          `${SUPABASE_DB_PASSWORD_ENV} with ${SUPABASE_PUBLIC_URL_ENV} and ` +
          `${SUPABASE_DB_REGION_ENV} so Afenda can build Supabase connection strings.`
    );
    this.name = "MissingDatabaseUrlError";
  }
}

export class MissingSupabaseDbPasswordError extends Error {
  constructor() {
    super(
      `${SUPABASE_DB_PASSWORD_ENV} is required to build Supabase Postgres URLs. ` +
        "Set it in .env.secret (Project Settings → Database → Database password)."
    );
    this.name = "MissingSupabaseDbPasswordError";
  }
}

export class MissingSupabaseProjectRefError extends Error {
  constructor() {
    super(
      `${SUPABASE_PROJECT_REF_ENV} or ${SUPABASE_PUBLIC_URL_ENV} is required to build Supabase Postgres URLs. ` +
        "Project refs must be exactly 20 lowercase alphanumeric characters."
    );
    this.name = "MissingSupabaseProjectRefError";
  }
}

export class InvalidSupabaseProjectUrlError extends Error {
  constructor(projectUrl: string) {
    super(
      `Invalid Supabase project URL "${projectUrl}". Expected a valid URL like https://<project-ref>.supabase.co.`
    );
    this.name = "InvalidSupabaseProjectUrlError";
  }
}

export class MissingSupabaseDbRegionError extends Error {
  constructor() {
    super(
      `${SUPABASE_DB_REGION_ENV} or ${SUPABASE_DB_POOLER_HOST_ENV} is required to build Supabase shared pooler URLs. ` +
        "Example region: ap-southeast-2 (from Dashboard → Connect → pooler host)."
    );
    this.name = "MissingSupabaseDbRegionError";
  }
}

export class InvalidSupabaseDbPoolerHostError extends Error {
  constructor() {
    super(
      `${SUPABASE_DB_POOLER_HOST_ENV} must match a Supabase pooler host like aws-0-ap-southeast-2.pooler.supabase.com.`
    );
    this.name = "InvalidSupabaseDbPoolerHostError";
  }
}

export class MissingMigrationDatabaseUrlError extends Error {
  constructor() {
    super(
      "Migration database URL is required. Set DATABASE_URL_DIRECT, DATABASE_URL_DEDICATED, DATABASE_URL_SESSION, or valid Supabase DB config."
    );
    this.name = "MissingMigrationDatabaseUrlError";
  }
}

export type DatabaseConfigSource = "database_url" | "supabase";

export const DATABASE_CONFIG_ISSUES = [
  "missing_supabase_db_password",
  "missing_supabase_project_ref",
  "invalid_supabase_project_ref",
  "invalid_supabase_project_url",
  "missing_supabase_db_region",
  "invalid_supabase_db_region",
  "invalid_supabase_db_pooler_host",
] as const;

export type DatabaseConfigIssue = (typeof DATABASE_CONFIG_ISSUES)[number];

export interface DatabaseConfigStatus {
  readonly issues: readonly DatabaseConfigIssue[];
  readonly ready: boolean;
  readonly source: DatabaseConfigSource | null;
}

function readTrimmedEnv(
  env: NodeJS.ProcessEnv,
  key: string
): string | undefined {
  const value = env[key]?.trim();
  return value ? value : undefined;
}

function assertSupabaseProjectRef(value: string): string {
  if (!SUPABASE_PROJECT_REF_PATTERN.test(value)) {
    throw new MissingSupabaseProjectRefError();
  }

  return value;
}

function assertSupabaseRegion(value: string): string {
  if (!SUPABASE_REGION_PATTERN.test(value)) {
    throw new MissingSupabaseDbRegionError();
  }

  return value;
}

function assertSupabasePoolerHost(value: string): string {
  if (!SUPABASE_POOLER_HOST_PATTERN.test(value)) {
    throw new InvalidSupabaseDbPoolerHostError();
  }

  return value;
}

function parseSupabaseProjectRefFromUrl(projectUrl: string): string {
  let hostname: string;

  try {
    hostname = new URL(projectUrl).hostname;
  } catch {
    throw new InvalidSupabaseProjectUrlError(projectUrl);
  }

  const [projectRef] = hostname.split(".");

  if (!projectRef) {
    throw new MissingSupabaseProjectRefError();
  }

  return assertSupabaseProjectRef(projectRef);
}

export function getSupabaseProjectRef(
  env: NodeJS.ProcessEnv = process.env
): string {
  const explicitRef = readTrimmedEnv(env, SUPABASE_PROJECT_REF_ENV);

  if (explicitRef) {
    return assertSupabaseProjectRef(explicitRef);
  }

  const projectUrl =
    readTrimmedEnv(env, SUPABASE_PUBLIC_URL_ENV) ??
    readTrimmedEnv(env, SUPABASE_SERVER_URL_ENV);

  if (!projectUrl) {
    throw new MissingSupabaseProjectRefError();
  }

  return parseSupabaseProjectRefFromUrl(projectUrl);
}

export function getSupabaseDbRegion(
  env: NodeJS.ProcessEnv = process.env
): string {
  const region = readTrimmedEnv(env, SUPABASE_DB_REGION_ENV);

  if (!region) {
    throw new MissingSupabaseDbRegionError();
  }

  return assertSupabaseRegion(region);
}

export function getSupabasePoolerHost(
  env: NodeJS.ProcessEnv = process.env
): string {
  const explicitHost = readTrimmedEnv(env, SUPABASE_DB_POOLER_HOST_ENV);

  if (explicitHost) {
    return assertSupabasePoolerHost(explicitHost);
  }

  const prefix = readTrimmedEnv(env, SUPABASE_DB_POOLER_PREFIX_ENV) ?? "aws-0";
  const region = getSupabaseDbRegion(env);

  return assertSupabasePoolerHost(`${prefix}-${region}.pooler.supabase.com`);
}

export function getSupabaseDbPassword(
  env: NodeJS.ProcessEnv = process.env
): string {
  const password = readTrimmedEnv(env, SUPABASE_DB_PASSWORD_ENV);

  if (!password) {
    throw new MissingSupabaseDbPasswordError();
  }

  return password;
}

export function buildSupabaseDatabaseUrl(
  method: SupabaseConnectionMethod,
  env: NodeJS.ProcessEnv = process.env
): string {
  const password = encodeURIComponent(getSupabaseDbPassword(env));
  const projectRef = getSupabaseProjectRef(env);

  if (method === "direct") {
    return `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;
  }

  if (method === "dedicated") {
    return `postgresql://postgres:${password}@db.${projectRef}.supabase.co:6543/postgres`;
  }

  const poolerHost = getSupabasePoolerHost(env);
  const port = method === "transaction" ? "6543" : "5432";

  return `postgresql://postgres.${projectRef}:${password}@${poolerHost}:${port}/postgres`;
}

export function getDatabaseUrlForMethod(
  method: SupabaseConnectionMethod,
  env: NodeJS.ProcessEnv = process.env
): string {
  const explicitUrl = readTrimmedEnv(env, CONNECTION_METHOD_ENV[method]);

  if (explicitUrl) {
    return explicitUrl;
  }

  return buildSupabaseDatabaseUrl(method, env);
}

function isMissingDatabaseConfigurationError(
  error: unknown
): error is
  | MissingSupabaseDbPasswordError
  | MissingSupabaseProjectRefError
  | MissingSupabaseDbRegionError
  | InvalidSupabaseProjectUrlError
  | InvalidSupabaseDbPoolerHostError {
  return (
    error instanceof MissingSupabaseDbPasswordError ||
    error instanceof MissingSupabaseProjectRefError ||
    error instanceof MissingSupabaseDbRegionError ||
    error instanceof InvalidSupabaseProjectUrlError ||
    error instanceof InvalidSupabaseDbPoolerHostError
  );
}

export function getDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const explicitUrl = readTrimmedEnv(env, DATABASE_URL_ENV);

  if (explicitUrl) {
    return explicitUrl;
  }

  try {
    return getDatabaseUrlForMethod("transaction", env);
  } catch (error) {
    if (isMissingDatabaseConfigurationError(error)) {
      throw new MissingDatabaseUrlError();
    }

    throw error;
  }
}

export function getDirectDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env
): string {
  return getDatabaseUrlForMethod("direct", env);
}

export function getDedicatedDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env
): string {
  return getDatabaseUrlForMethod("dedicated", env);
}

export function getSessionDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env
): string {
  return getDatabaseUrlForMethod("session", env);
}

export function getTransactionDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env
): string {
  return getDatabaseUrlForMethod("transaction", env);
}

/**
 * Migration URL priority (ARCH-SUPA-001 · `drizzle-migrations` consumer = direct only):
 * 1. DATABASE_URL_DIRECT
 * 2. Generated direct URL from Supabase config (`getDirectDatabaseUrl`)
 *
 * Fail-safe: no silent fallback to DATABASE_URL, session pooler, or local Postgres.
 */
export function resolveMigrationDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env
): string {
  const directUrl = readTrimmedEnv(env, DATABASE_URL_DIRECT_ENV);
  if (directUrl) {
    return directUrl;
  }

  try {
    return getDirectDatabaseUrl(env);
  } catch (error) {
    if (isMissingDatabaseConfigurationError(error)) {
      throw new MissingMigrationDatabaseUrlError();
    }

    throw error;
  }
}

function collectSupabasePasswordIssues(
  env: NodeJS.ProcessEnv,
  issues: DatabaseConfigIssue[]
): void {
  if (!readTrimmedEnv(env, SUPABASE_DB_PASSWORD_ENV)) {
    issues.push("missing_supabase_db_password");
  }
}

function collectProjectRefIssues(
  env: NodeJS.ProcessEnv,
  issues: DatabaseConfigIssue[]
): void {
  const explicitRef = readTrimmedEnv(env, SUPABASE_PROJECT_REF_ENV);
  const projectUrl =
    readTrimmedEnv(env, SUPABASE_PUBLIC_URL_ENV) ??
    readTrimmedEnv(env, SUPABASE_SERVER_URL_ENV);

  if (explicitRef) {
    if (!SUPABASE_PROJECT_REF_PATTERN.test(explicitRef)) {
      issues.push("invalid_supabase_project_ref");
    }
    return;
  }

  if (projectUrl) {
    try {
      parseSupabaseProjectRefFromUrl(projectUrl);
    } catch (error) {
      if (error instanceof InvalidSupabaseProjectUrlError) {
        issues.push("invalid_supabase_project_url");
        return;
      }

      if (error instanceof MissingSupabaseProjectRefError) {
        issues.push("invalid_supabase_project_ref");
        return;
      }

      issues.push("missing_supabase_project_ref");
    }
    return;
  }

  issues.push("missing_supabase_project_ref");
}

function collectPoolerIssues(
  env: NodeJS.ProcessEnv,
  issues: DatabaseConfigIssue[]
): void {
  const explicitPoolerHost = readTrimmedEnv(env, SUPABASE_DB_POOLER_HOST_ENV);
  const region = readTrimmedEnv(env, SUPABASE_DB_REGION_ENV);

  if (explicitPoolerHost) {
    if (!SUPABASE_POOLER_HOST_PATTERN.test(explicitPoolerHost)) {
      issues.push("invalid_supabase_db_pooler_host");
    }
    return;
  }

  if (!region) {
    issues.push("missing_supabase_db_region");
    return;
  }

  if (!SUPABASE_REGION_PATTERN.test(region)) {
    issues.push("invalid_supabase_db_region");
  }
}

export function getDatabaseConfigStatus(
  env: NodeJS.ProcessEnv = process.env
): DatabaseConfigStatus {
  if (readTrimmedEnv(env, DATABASE_URL_ENV)) {
    return { issues: [], ready: true, source: "database_url" };
  }

  const issues: DatabaseConfigIssue[] = [];

  collectSupabasePasswordIssues(env, issues);
  collectProjectRefIssues(env, issues);
  collectPoolerIssues(env, issues);

  const ready = issues.length === 0;

  return {
    issues,
    ready,
    source: ready ? "supabase" : null,
  };
}

export function hasDatabaseUrl(env: NodeJS.ProcessEnv = process.env): boolean {
  if (readTrimmedEnv(env, DATABASE_URL_ENV)) {
    return true;
  }

  return getDatabaseConfigStatus(env).ready;
}

export function hasSupabaseDatabaseConfig(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  try {
    getSupabaseDbPassword(env);
    getSupabaseProjectRef(env);
    return true;
  } catch {
    return false;
  }
}
