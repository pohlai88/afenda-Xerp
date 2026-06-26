import { readApiEnvelope } from "@/lib/api/api-envelope.client";
import {
  assertApiSuccessEnvelope,
  createApiClientErrorFromEnvelope,
} from "@/lib/api/api-policy-gate.error";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";
import type { AuthMembershipsGetResponseDto } from "@/server/api/contracts/auth/auth-memberships.api-contract";
import { authMembershipsGetContract } from "@/server/api/contracts/auth/auth-memberships.contract";

export async function fetchPostAuthEntryPath(
  nextParam: string | null | undefined
): Promise<string> {
  const safeNext = resolveSafeInternalPath(nextParam, "");
  if (safeNext.length > 0 && safeNext !== "/") {
    return safeNext;
  }

  const response = await fetch(authMembershipsGetContract.path, {
    cache: "no-store",
    credentials: "include",
  });

  const envelope =
    await readApiEnvelope<AuthMembershipsGetResponseDto>(response);

  if (!response.ok) {
    throw createApiClientErrorFromEnvelope(
      envelope,
      "Could not validate workspace membership after sign-in."
    );
  }

  const data = assertApiSuccessEnvelope(
    envelope,
    "Could not validate workspace membership after sign-in."
  );

  return data.entryPath;
}
