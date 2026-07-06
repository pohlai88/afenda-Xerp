export const V2_PROOF_SURFACE_KEYS = ["authShell"] as const;

export type V2ProofSurfaceKey = (typeof V2_PROOF_SURFACE_KEYS)[number];

export type V2ProofSurfaceVisibility = Readonly<
  Record<V2ProofSurfaceKey, boolean>
>;

export const DEFAULT_V2_PROOF_SURFACE_VISIBILITY = {
  authShell: false,
} satisfies V2ProofSurfaceVisibility;

export const V2_PROOF_SURFACE_VISIBILITY_STORAGE_KEY =
  "v2-proof:surface-visibility";

export function mergeSurfaceVisibility(
  base: V2ProofSurfaceVisibility,
  overrides: Partial<V2ProofSurfaceVisibility> | undefined
): V2ProofSurfaceVisibility {
  if (overrides == null) {
    return base;
  }

  return {
    authShell: overrides.authShell ?? base.authShell,
  };
}

export function visibilityFromVerifyAll(): V2ProofSurfaceVisibility {
  return {
    authShell: true,
  };
}

export function parseV2ProofSearchParams(searchParams: {
  readonly verify?: string | undefined;
  readonly surfaces?: string | undefined;
}): Partial<V2ProofSurfaceVisibility> {
  if (searchParams.verify === "1") {
    return visibilityFromVerifyAll();
  }

  const surfacesParam = searchParams.surfaces?.trim();

  if (surfacesParam == null || surfacesParam.length === 0) {
    return {};
  }

  const requested = new Set(
    surfacesParam.split(",").map((entry) => entry.trim().toLowerCase())
  );
  if (requested.has("auth") || requested.has("authshell")) {
    return { authShell: true };
  }

  return {};
}

export function parseStoredSurfaceVisibility(
  raw: string | null
): Partial<V2ProofSurfaceVisibility> | undefined {
  if (raw == null || raw.length === 0) {
    return;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== "object" || parsed == null) {
      return;
    }

    const record = parsed as Record<string, unknown>;

    const authShell = record["authShell"];

    return {
      ...(typeof authShell === "boolean" ? { authShell } : {}),
    };
  } catch {
    return;
  }
}

export function serializeSurfaceVisibility(
  visibility: V2ProofSurfaceVisibility
): string {
  return JSON.stringify(visibility);
}
