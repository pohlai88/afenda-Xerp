import { getAfendaAuthSession } from "@afenda/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";

import type { AuthIngressCanonicalPath } from "./auth-ingress-surface.registry";
import { resolveAuthSurfaceConfig } from "./auth-surface-config.server";
import {
  loadAuthIngressSurfacePage,
  resolveAuthIngressDescription,
  resolveAuthIngressTitle,
} from "./load-auth-ingress-surface-page.server";
import { resolveSafeInternalPath } from "./resolve-safe-internal-path";

type RedirectableAuthSearchParams = Promise<{
  readonly next?: string;
}>;

export function createAuthIngressMetadata(
  path: AuthIngressCanonicalPath
): Metadata {
  return {
    description: resolveAuthIngressDescription(path),
    title: resolveAuthIngressTitle(path),
  };
}

export function renderAuthIngressPage(
  path: AuthIngressCanonicalPath,
  input?: { readonly next?: string }
): React.JSX.Element {
  const data = loadAuthIngressSurfacePage(path);
  return (
    <AuthIngressSurfacePage
      data={data}
      runtimeConfig={resolveAuthSurfaceConfig(input)}
    />
  );
}

export async function redirectAuthenticatedAuthIngress(
  searchParams: RedirectableAuthSearchParams
): Promise<void> {
  const requestHeaders = await headers();
  const session = await getAfendaAuthSession(requestHeaders);

  if (session === null) {
    return;
  }

  const { next } = await searchParams;
  redirect(resolveSafeInternalPath(next));
}
