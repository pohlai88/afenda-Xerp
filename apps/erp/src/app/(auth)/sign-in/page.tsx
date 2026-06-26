import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthFormFallback } from "@/app/(auth)/_components/auth-form-fallback";
import { AuthSignInForm } from "@/app/(auth)/_components/auth-sign-in-form";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";
import { resolveDevLoginPanelState } from "@/lib/auth/resolve-dev-login-panel.server";
import { resolveSignInSurface } from "@/lib/auth/resolve-sign-in-surface.server";

export const metadata = AUTH_ROUTE_REGISTRY.signIn.metadata;
export const dynamic = "force-dynamic";

export default async function AuthSignInPage() {
  const surface = await resolveSignInSurface();
  const devLoginPanel = resolveDevLoginPanelState();

  return (
    <AuthEntryPage route="signIn">
      <Suspense fallback={<AuthFormFallback route="signIn" />}>
        <AuthSignInForm devLoginPanel={devLoginPanel} surface={surface} />
      </Suspense>
    </AuthEntryPage>
  );
}
