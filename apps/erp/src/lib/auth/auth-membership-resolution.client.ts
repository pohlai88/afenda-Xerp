"use client";

import {
  type AuthMembershipsGetResponseDto,
  authMembershipsGetResponseSchema,
} from "@/server/api/contracts/auth/auth-memberships.api-contract";

export async function fetchAuthMembershipResolution(): Promise<AuthMembershipsGetResponseDto> {
  const response = await fetch("/api/internal/v1/auth/memberships", {
    cache: "no-store",
    credentials: "same-origin",
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Unable to resolve authenticated workspace memberships.");
  }

  const payload: unknown = await response.json();
  return authMembershipsGetResponseSchema.parse(payload);
}
