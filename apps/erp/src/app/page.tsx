import { getAfendaAuthSession, isAfendaAuthSessionLinked } from "@afenda/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import { resolveOperatingContext } from "@/lib/context/resolve-operating-context.server";
import { resolveDefaultOperatorLandingPath } from "@/lib/navigation/resolve-default-operator-landing-path.server";

export default async function HomePage() {
  const requestHeaders = await headers();
  const session = await getAfendaAuthSession(requestHeaders);

  if (session !== null) {
    if (!isAfendaAuthSessionLinked(session)) {
      redirect("/sign-in?error=unlinked");
    }

    const operatingResult = await resolveOperatingContext({
      requestHeaders,
      session,
    });

    if (!operatingResult.ok) {
      redirect(AUTH_PATHS.accessDenied);
    }

    const landingPath = await resolveDefaultOperatorLandingPath(
      operatingResult.value
    );

    if (landingPath !== null) {
      redirect(landingPath);
    }

    redirect(AUTH_PATHS.accessDenied);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="font-semibold text-2xl text-foreground">Afenda ERP</h1>
      <p className="max-w-md text-center text-muted-foreground text-sm">
        Enterprise resource planning for governed operator workflows.
      </p>
      <Link
        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm"
        href={AUTH_PATHS.signIn}
      >
        Sign in
      </Link>
    </main>
  );
}
