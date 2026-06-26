import { AppShellAuthLoginPage04 } from "@afenda/appshell";
import { Suspense } from "react";

import { resolveSignInSurface } from "@/lib/auth/resolve-sign-in-surface.server";

import { SignInForm } from "./sign-in-form";

function SignInLoadingFallback() {
  return (
    <AppShellAuthLoginPage04 formDescription="Loading sign-in options…">
      <p className="erp-sign-in-form__loading" role="status">
        Loading sign-in…
      </p>
    </AppShellAuthLoginPage04>
  );
}

export default async function SignInPage() {
  const surface = await resolveSignInSurface();

  return (
    <Suspense fallback={<SignInLoadingFallback />}>
      <AppShellAuthLoginPage04>
        <SignInForm surface={surface} />
      </AppShellAuthLoginPage04>
    </Suspense>
  );
}
