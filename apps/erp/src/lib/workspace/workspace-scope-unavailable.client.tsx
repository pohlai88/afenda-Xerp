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
    <div className="app-shell-page">
      <header className="app-shell-page-header">
        <h1 className="app-shell-page-title">Workspace unavailable</h1>
        {isUnknownTenant ? (
          <p className="app-shell-page-description">
            The requested tenant workspace was not found or is not available.
            Check the tenant subdomain or path prefix and try again.
          </p>
        ) : (
          <p className="app-shell-page-description">
            A tenant workspace could not be resolved for this request. Sign in
            on a tenant subdomain (for example{" "}
            <code>{DEV_DEFAULT_TENANT_SLUG}.localhost</code>) or use the path
            prefix <code>/t/{DEV_DEFAULT_TENANT_SLUG}</code>.
          </p>
        )}
        <p className="app-shell-page-description">
          Organization paths such as <code>/o/dev-hq</code> select an
          organization unit within an already-resolved tenant — they do not
          establish tenant authority.
        </p>
        <p className="app-shell-page-description">
          Protected API calls are blocked until workspace scope is verified.
        </p>
      </header>
    </div>
  );
}
