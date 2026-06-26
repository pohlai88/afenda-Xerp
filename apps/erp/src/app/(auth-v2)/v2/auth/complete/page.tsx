import { Suspense } from "react";

import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthPostAuthCompleteClient } from "@/lib/auth/auth-post-auth-complete.client";
import { gatePasswordlessTwoFactorBeforePostAuth } from "@/lib/auth/gate-passwordless-two-factor.server";
import { gateSecurityReviewBeforePostAuth } from "@/lib/auth/gate-security-review-before-post-auth.server";
import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";

export const metadata = {
  title: "Completing sign-in (V2)",
};

export default async function AuthV2PostAuthCompletePage({
  searchParams,
}: {
  readonly searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  await gatePasswordlessTwoFactorBeforePostAuth(params.next ?? null);
  await gateSecurityReviewBeforePostAuth(params.next ?? null);

  return (
    <AuthV2EntryPage route="signIn" showRouteLinks={false}>
      <Suspense fallback={<p role="status">Completing sign-in…</p>}>
        <AuthPostAuthCompleteClient signInPath={buildAuthV2Path("signIn")} />
      </Suspense>
    </AuthV2EntryPage>
  );
}
