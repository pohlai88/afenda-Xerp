"use server";

import { isUnauthenticatedError } from "@afenda/auth";

import { requireSession } from "@/lib/auth/require-session";

export type ProtectedDemoActionResult =
  | { ok: true; message: string; userId: string }
  | { ok: false; code: "unauthenticated" };

export async function recordProtectedDemoAction(
  message: string
): Promise<ProtectedDemoActionResult> {
  try {
    const session = await requireSession();

    return {
      ok: true,
      message,
      userId: session.user.userId,
    };
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return {
        ok: false,
        code: "unauthenticated",
      };
    }

    throw error;
  }
}
