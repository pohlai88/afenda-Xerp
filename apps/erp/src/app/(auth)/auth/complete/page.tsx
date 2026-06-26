import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { AuthPostAuthCompleteClient } from "@/lib/auth/auth-post-auth-complete.client";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";
import { gatePasswordlessTwoFactorBeforePostAuth } from "@/lib/auth/gate-passwordless-two-factor.server";
import { gateSecurityReviewBeforePostAuth } from "@/lib/auth/gate-security-review-before-post-auth.server";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.signIn.metadata;

export default async function AuthPostAuthCompletePage({
  searchParams,
}: {
  readonly searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  await gatePasswordlessTwoFactorBeforePostAuth(params.next ?? null, (next) =>
    buildAuthPath("mfa", next.length > 0 ? { next } : undefined)
  );
  await gateSecurityReviewBeforePostAuth(params.next ?? null);

  return (
    <AuthEntryPage route="signIn">
      <Suspense fallback={<p role="status">Completing sign-in…</p>}>
        <AuthPostAuthCompleteClient signInPath={buildAuthPath("signIn")} />
      </Suspense>
    </AuthEntryPage>
  );
}
