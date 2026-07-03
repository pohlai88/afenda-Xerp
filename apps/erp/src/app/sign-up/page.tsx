import { getAfendaAuthSession } from "@afenda/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { loadAuthIngressSurfacePage } from "@/lib/auth/load-auth-ingress-surface-page.server";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

export const metadata: Metadata = {
  title: "Accept invitation",
};

type SignUpPageProps = {
  readonly searchParams: Promise<{
    readonly next?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const requestHeaders = await headers();
  const session = await getAfendaAuthSession(requestHeaders);

  if (session !== null) {
    const { next } = await searchParams;
    redirect(resolveSafeInternalPath(next));
  }

  const data = loadAuthIngressSurfacePage("/sign-up");

  return <AuthIngressSurfacePage data={data} />;
}
