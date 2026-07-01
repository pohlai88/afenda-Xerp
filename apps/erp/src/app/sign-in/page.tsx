import { getAfendaAuthSession } from "@afenda/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

export const metadata: Metadata = {
  title: "Sign in",
};

type SignInPageProps = {
  readonly searchParams: Promise<{
    readonly error?: string;
    readonly next?: string;
    readonly notice?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const requestHeaders = await headers();
  const session = await getAfendaAuthSession(requestHeaders);

  if (session !== null) {
    const { next } = await searchParams;
    redirect(resolveSafeInternalPath(next));
  }

  const data = loadAuthIngressSurfacePage("/sign-in");

  return <AuthIngressSurfacePage data={data} />;
}
