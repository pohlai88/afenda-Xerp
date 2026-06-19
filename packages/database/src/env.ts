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
      `${SUPABASE_PROJECT_REF_ENV} or ${SUPABASE_PUBLIC_URL_ENV} is required to build Supabase Postgres URLs.`
    );
    this.name = "MissingSupabaseProjectRefError";
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

function readTrimmedEnv(
  env: NodeJS.ProcessEnv,
  key: string
): string | undefined {
  const value = env[key]?.trim();
  return value ? value : undefined;
}

export function getSupabaseProjectRef(
  env: NodeJS.ProcessEnv = process.env
): string {
  const explicitRef = readTrimmedEnv(env, SUPABASE_PROJECT_REF_ENV);

  if (explicitRef) {
    return explicitRef;
  }

  const projectUrl =
    readTrimmedEnv(env, SUPABASE_PUBLIC_URL_ENV) ??
    readTrimmedEnv(env, SUPABASE_SERVER_URL_ENV);

  if (!projectUrl) {
    throw new MissingSupabaseProjectRefError();
  }

  const hostname = new URL(projectUrl).hostname;
  const [projectRef] = hostname.split(".");

  if (!projectRef) {
    throw new MissingSupabaseProjectRefError();
  }

  return projectRef;
}

export function getSupabaseDbRegion(
  env: NodeJS.ProcessEnv = process.env
): string {
  const region = readTrimmedEnv(env, SUPABASE_DB_REGION_ENV);

  if (!region) {
    throw new MissingSupabaseDbRegionError();
  }

  return region;
}

export function getSupabasePoolerHost(
  env: NodeJS.ProcessEnv = process.env
): string {
  const explicitHost = readTrimmedEnv(env, SUPABASE_DB_POOLER_HOST_ENV);

  if (explicitHost) {
    return explicitHost;
  }

  const prefix = readTrimmedEnv(env, SUPABASE_DB_POOLER_PREFIX_ENV) ?? "aws-0";
  const region = getSupabaseDbRegion(env);

  return `${prefix}-${region}.pooler.supabase.com`;
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
  | MissingSupabaseDbRegionError {
  return (
    error instanceof MissingSupabaseDbPasswordError ||
    error instanceof MissingSupabaseProjectRefError ||
    error instanceof MissingSupabaseDbRegionError
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

export function hasDatabaseUrl(env: NodeJS.ProcessEnv = process.env): boolean {
  if (readTrimmedEnv(env, DATABASE_URL_ENV)) {
    return true;
  }

  try {
    getDatabaseUrl(env);
    return true;
  } catch {
    return false;
  }
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
