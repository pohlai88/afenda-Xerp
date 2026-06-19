import { describe, expect, it } from "vitest";

import {
  fetchActiveSupabaseJwtKey,
  findSupabaseJwkByKid,
  InvalidSupabaseJwksError,
  isSupabaseJwtVerificationKey,
  parseSupabaseJwks,
  resolveSupabaseJwtKey,
  SupabaseJwtKeyNotFoundError,
} from "../lib/supabase/jwks";

const ACTIVE_SUPABASE_JWKS = {
  keys: [
    {
      alg: "ES256",
      crv: "P-256",
      ext: true,
      key_ops: ["verify"],
      kid: "a9b24fa2-cca6-427d-941f-538cd36c1a0f",
      kty: "EC",
      use: "sig",
      x: "uSPJn3soIan-0z0LbyLCI00hn1h7ST0Bz6-3DhZbK0A",
      y: "wX22f3ne4dtfxxy2Aq6BMiaeUFKGJ2caiaSBQdYPvHg",
    },
  ],
} as const;

describe("Supabase JWKS", () => {
  it("parses the active ES256 verification key", () => {
    const jwks = parseSupabaseJwks(ACTIVE_SUPABASE_JWKS);
    const key = resolveSupabaseJwtKey(
      jwks,
      "a9b24fa2-cca6-427d-941f-538cd36c1a0f"
    );

    expect(findSupabaseJwkByKid(jwks, key.kid)).toEqual(key);
    expect(isSupabaseJwtVerificationKey(key)).toBe(true);
  });

  it("rejects invalid JWKS payloads", () => {
    expect(() => parseSupabaseJwks({})).toThrow(InvalidSupabaseJwksError);
    expect(() =>
      resolveSupabaseJwtKey(parseSupabaseJwks(ACTIVE_SUPABASE_JWKS), "missing")
    ).toThrow(SupabaseJwtKeyNotFoundError);
  });

  it("fetches and resolves the configured key id from JWKS", async () => {
    const fetchImpl = async () =>
      new Response(JSON.stringify(ACTIVE_SUPABASE_JWKS), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    const key = await fetchActiveSupabaseJwtKey(
      "https://example.supabase.co/auth/v1/.well-known/jwks.json",
      "a9b24fa2-cca6-427d-941f-538cd36c1a0f",
      fetchImpl
    );

    expect(key.alg).toBe("ES256");
    expect(key.kid).toBe("a9b24fa2-cca6-427d-941f-538cd36c1a0f");
  });
});
