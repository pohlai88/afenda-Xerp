import { getAfendaAuthSession } from "@afenda/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthIngressSurfacePage } from "@/components/auth/auth-ingress-surface-page";
import { AuthWorkspaceSelectIngressSurface } from "@/components/auth/auth-workspace-select-ingress.client";

import type { AuthIngressCanonicalPath } from "./auth-ingress-surface.registry";
import type { AUTH_PATHS } from "./auth-path.registry";
import { resolveAuthSurfaceConfig } from "./auth-surface-config.server";
import type { AuthWorkspaceSelectionKind } from "./auth-workspace-selection.helpers";
import {
  loadAuthIngressSurfacePage,
  resolveAuthIngressDescription,
  resolveAuthIngressTitle,
} from "./load-auth-ingress-surface-page.server";
import { resolveSafeInternalPath } from "./resolve-safe-internal-path";

type RedirectableAuthSearchParams = Promise<{
  readonly next?: string;
}>;

const AUTH_SESSION_LOOKUP_TIMEOUT_MS = 1500;

function waitForAuthSessionLookup(
  requestHeaders: Headers
): Promise<unknown | undefined> {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(undefined);
    }, AUTH_SESSION_LOOKUP_TIMEOUT_MS);

    void getAfendaAuthSession(requestHeaders)
      .then((session) => {
        clearTimeout(timeoutId);
        resolve(session);
      })
      .catch(() => {
        clearTimeout(timeoutId);
        resolve(undefined);
      });
  });
}

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

export function renderAuthWorkspaceSelectIngressPage(
  path:
    | typeof AUTH_PATHS.workspaceSelect
    | typeof AUTH_PATHS.organizationSelect,
  kind: AuthWorkspaceSelectionKind
): React.JSX.Element {
  const data = loadAuthIngressSurfacePage(path);
  return <AuthWorkspaceSelectIngressSurface data={data} kind={kind} />;
}

export async function redirectAuthenticatedAuthIngress(
  searchParams: RedirectableAuthSearchParams
): Promise<void> {
  const requestHeaders = await headers();
  const session = await waitForAuthSessionLookup(requestHeaders);

  if (session === undefined || session === null) {
    return;
  }

  const { next } = await searchParams;
  redirect(resolveSafeInternalPath(next));
}
