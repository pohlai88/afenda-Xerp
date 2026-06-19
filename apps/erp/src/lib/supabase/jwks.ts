export interface SupabaseJwk {
  readonly alg: string;
  readonly crv?: string;
  readonly ext?: boolean;
  readonly key_ops?: readonly string[];
  readonly kid: string;
  readonly kty: string;
  readonly use?: string;
  readonly x?: string;
  readonly y?: string;
}

export interface SupabaseJwks {
  readonly keys: readonly SupabaseJwk[];
}

export class InvalidSupabaseJwksError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSupabaseJwksError";
  }
}

export class SupabaseJwtKeyNotFoundError extends Error {
  constructor(kid: string) {
    super(`Supabase JWT key id "${kid}" was not found in JWKS.`);
    this.name = "SupabaseJwtKeyNotFoundError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSupabaseJwk(value: unknown): value is SupabaseJwk {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.kid === "string" &&
    typeof value.kty === "string" &&
    typeof value.alg === "string"
  );
}

export function parseSupabaseJwks(payload: unknown): SupabaseJwks {
  if (!(isRecord(payload) && Array.isArray(payload.keys))) {
    throw new InvalidSupabaseJwksError(
      "JWKS payload must contain a keys array."
    );
  }

  const keys = payload.keys.filter(isSupabaseJwk);

  if (keys.length === 0) {
    throw new InvalidSupabaseJwksError(
      "JWKS payload did not include any valid keys."
    );
  }

  return { keys };
}

export function findSupabaseJwkByKid(
  jwks: SupabaseJwks,
  kid: string
): SupabaseJwk | undefined {
  return jwks.keys.find((key) => key.kid === kid);
}

export function resolveSupabaseJwtKey(
  jwks: SupabaseJwks,
  kid: string
): SupabaseJwk {
  const key = findSupabaseJwkByKid(jwks, kid);

  if (!key) {
    throw new SupabaseJwtKeyNotFoundError(kid);
  }

  return key;
}

export function isSupabaseJwtVerificationKey(key: SupabaseJwk): boolean {
  const keyOps = key.key_ops ?? [];

  return (
    key.kty === "EC" &&
    key.alg === "ES256" &&
    key.crv === "P-256" &&
    (keyOps.length === 0 || keyOps.includes("verify"))
  );
}

export async function fetchSupabaseJwks(
  jwksUrl: string,
  fetchImpl: typeof fetch = fetch
): Promise<SupabaseJwks> {
  const response = await fetchImpl(jwksUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new InvalidSupabaseJwksError(
      `Failed to fetch JWKS (${response.status} ${response.statusText}).`
    );
  }

  return parseSupabaseJwks(await response.json());
}

export async function fetchActiveSupabaseJwtKey(
  jwksUrl: string,
  kid: string,
  fetchImpl: typeof fetch = fetch
): Promise<SupabaseJwk> {
  const jwks = await fetchSupabaseJwks(jwksUrl, fetchImpl);
  const key = resolveSupabaseJwtKey(jwks, kid);

  if (!isSupabaseJwtVerificationKey(key)) {
    throw new InvalidSupabaseJwksError(
      `JWT key "${kid}" is present but is not an ES256 P-256 verification key.`
    );
  }

  return key;
}
