"use client";

import type { OperatingContextErrorCode } from "@afenda/kernel";

import { DEV_DEFAULT_TENANT_SLUG } from "@/lib/context/context.constants";

export interface WorkspaceScopeUnavailableProps {
  readonly errorCode?: OperatingContextErrorCode | "MISSING_TENANT";
}

export function WorkspaceScopeUnavailable({
  errorCode = "MISSING_TENANT",
}: WorkspaceScopeUnavailableProps) {
  const isUnknownTenant = errorCode === "TENANT_NOT_FOUND";

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">Workspace unavailable</h1>
        {isUnknownTenant ? (
          <p className="text-muted-foreground text-sm">
            The requested tenant workspace was not found or is not available.
            Check the tenant subdomain or path prefix and try again.
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            A tenant workspace could not be resolved for this request. Sign in
            on a tenant subdomain (for example{" "}
            <code>{DEV_DEFAULT_TENANT_SLUG}.localhost</code>) or use the path
            prefix <code>/t/{DEV_DEFAULT_TENANT_SLUG}</code>.
          </p>
        )}
        <p className="text-muted-foreground text-sm">
          Organization paths such as <code>/o/dev-hq</code> select an
          organization unit within an already-resolved tenant — they do not
          establish tenant authority.
        </p>
        <p className="text-muted-foreground text-sm">
          Protected API calls are blocked until workspace scope is verified.
        </p>
      </header>
    </main>
  );
}
