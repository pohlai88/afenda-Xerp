"use server";

import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";

export interface SwitchOperatingContextResult {
  readonly message: string;
  readonly ok: boolean;
}

/**
 * Minimal PAS-001A R1a context switch action — full switch UX returns in R1b.
 */
export async function switchOperatingContextAction(
  _input: unknown
): Promise<SwitchOperatingContextResult> {
  const contextResult = await resolveActionOperatingContext();

  if (!contextResult.ok) {
    return {
      ok: false,
      message: contextResult.error.userMessage,
    };
  }

  return {
    ok: true,
    message: "Operating context verified for context switch ingress.",
  };
}
