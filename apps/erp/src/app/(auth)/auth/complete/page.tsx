import { getAfendaAuthSession } from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthCompleteResolver } from "@/components/auth/auth-complete-resolver.client";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";

export const metadata = {
  title: "Completing sign-in",
};

export default async function AuthCompletePage() {
  const session = await getAfendaAuthSession(await headers());

  if (session === null) {
    redirect(AUTH_PATHS.signIn);
  }

  return <AuthCompleteResolver />;
}
