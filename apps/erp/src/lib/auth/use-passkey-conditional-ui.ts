"use client";

import { signIn } from "@afenda/auth/client";
import { useEffect } from "react";

function isPasskeyConditionalUiAvailable(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  const credential = window.PublicKeyCredential;

  if (!credential?.isConditionalMediationAvailable) {
    return Promise.resolve(false);
  }

  return credential.isConditionalMediationAvailable();
}

/** Preloads passkey autofill when the browser supports conditional UI. */
export function usePasskeyConditionalUi(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    void (async () => {
      if (!(await isPasskeyConditionalUiAvailable())) {
        return;
      }

      await signIn.passkey({ autoFill: true });
    })();
  }, [enabled]);
}
