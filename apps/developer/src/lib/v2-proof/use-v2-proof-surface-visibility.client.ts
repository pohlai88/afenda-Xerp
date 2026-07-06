"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_V2_PROOF_SURFACE_VISIBILITY,
  mergeSurfaceVisibility,
  parseStoredSurfaceVisibility,
  serializeSurfaceVisibility,
  V2_PROOF_SURFACE_VISIBILITY_STORAGE_KEY,
  type V2ProofSurfaceKey,
  type V2ProofSurfaceVisibility,
} from "./surface-visibility";

function hasUrlVerification(
  fromUrl: Partial<V2ProofSurfaceVisibility> | undefined
): boolean {
  return fromUrl?.authShell === true;
}

function resolveInitialVisibility({
  fromUrl,
  testOverrides,
}: {
  readonly fromUrl: Partial<V2ProofSurfaceVisibility> | undefined;
  readonly testOverrides: Partial<V2ProofSurfaceVisibility> | undefined;
}): V2ProofSurfaceVisibility {
  if (testOverrides != null) {
    return mergeSurfaceVisibility(
      DEFAULT_V2_PROOF_SURFACE_VISIBILITY,
      testOverrides
    );
  }

  return mergeSurfaceVisibility(DEFAULT_V2_PROOF_SURFACE_VISIBILITY, fromUrl);
}

export function useV2ProofSurfaceVisibility({
  fromUrl,
  testOverrides,
}: {
  readonly fromUrl?: Partial<V2ProofSurfaceVisibility> | undefined;
  readonly testOverrides?: Partial<V2ProofSurfaceVisibility> | undefined;
} = {}) {
  const urlVisibility = useMemo(() => fromUrl ?? {}, [fromUrl]);
  const urlVerified = hasUrlVerification(urlVisibility);
  const persistPreference = testOverrides == null;

  const [visibility, setVisibilityState] = useState<V2ProofSurfaceVisibility>(
    () =>
      resolveInitialVisibility({
        fromUrl: urlVisibility,
        testOverrides,
      })
  );

  useEffect(() => {
    if (!persistPreference || urlVerified) {
      return;
    }

    const stored = parseStoredSurfaceVisibility(
      window.localStorage.getItem(V2_PROOF_SURFACE_VISIBILITY_STORAGE_KEY)
    );

    if (stored == null) {
      return;
    }

    setVisibilityState((current) => mergeSurfaceVisibility(current, stored));
  }, [persistPreference, urlVerified]);

  const setSurface = useCallback(
    (key: V2ProofSurfaceKey, enabled: boolean) => {
      setVisibilityState((current) => {
        const next = {
          ...current,
          [key]: enabled,
        } satisfies V2ProofSurfaceVisibility;

        if (persistPreference) {
          window.localStorage.setItem(
            V2_PROOF_SURFACE_VISIBILITY_STORAGE_KEY,
            serializeSurfaceVisibility(next)
          );
        }

        return next;
      });
    },
    [persistPreference]
  );

  const setVerificationMode = useCallback(
    (enabled: boolean) => {
      setVisibilityState(() => {
        const next = {
          authShell: enabled,
        } satisfies V2ProofSurfaceVisibility;

        if (persistPreference) {
          window.localStorage.setItem(
            V2_PROOF_SURFACE_VISIBILITY_STORAGE_KEY,
            serializeSurfaceVisibility(next)
          );
        }

        return next;
      });
    },
    [persistPreference]
  );

  return {
    setSurface,
    setVerificationMode,
    visibility,
  };
}
