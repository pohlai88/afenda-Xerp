"use client";

import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { AuthShellV2Compound } from "./auth-shell.compound.js";
import {
  AUTH_SHELL_ERROR_DEFAULT_EYEBROW,
  AUTH_SHELL_ERROR_DEFAULT_RETRY_LABEL,
} from "./auth-shell.constants.js";
import type { AuthShellErrorSurfaceProps } from "./auth-shell.types.js";

export type AuthShellErrorSurfaceGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

function AuthShellErrorAlert({
  title,
  description,
  tone = "neutral",
  reason,
  actions,
}: AuthShellErrorSurfaceProps) {
  return (
    <AuthShellV2Compound.ErrorAlert tone={tone}>
      <AuthShellV2Compound.ErrorEyebrow>
        {AUTH_SHELL_ERROR_DEFAULT_EYEBROW}
      </AuthShellV2Compound.ErrorEyebrow>
      <AuthShellV2Compound.ErrorTitle>{title}</AuthShellV2Compound.ErrorTitle>
      {description === undefined ? null : (
        <AuthShellV2Compound.ErrorDescription>
          {description}
        </AuthShellV2Compound.ErrorDescription>
      )}
      {reason === undefined ? null : (
        <p className="af-auth-shell__error-reason" data-diagnostic="true">
          Reference: {reason}
        </p>
      )}
      {actions === undefined ? null : (
        <AuthShellV2Compound.ErrorActions>
          {actions}
        </AuthShellV2Compound.ErrorActions>
      )}
    </AuthShellV2Compound.ErrorAlert>
  );
}

export function AuthShellErrorSurface({
  embedded = false,
  ...surfaceProps
}: AuthShellErrorSurfaceProps) {
  const alert = <AuthShellErrorAlert {...surfaceProps} />;

  if (embedded) {
    return alert;
  }

  return <AuthShellV2Compound.ErrorRoot>{alert}</AuthShellV2Compound.ErrorRoot>;
}

export interface AuthShellErrorSurfaceLegacyRetryProps
  extends AuthShellErrorSurfaceProps {
  readonly isRetrying?: boolean;
  readonly onRetry?: () => void;
  readonly retryLabel?: string;
}

/** @deprecated Prefer `actions` slot with governed Button. */
export function AuthShellErrorSurfaceWithRetry({
  isRetrying = false,
  onRetry,
  retryLabel = AUTH_SHELL_ERROR_DEFAULT_RETRY_LABEL,
  actions,
  ...surfaceProps
}: AuthShellErrorSurfaceLegacyRetryProps) {
  const resolvedActions =
    actions ??
    (onRetry === undefined ? null : (
      <Button
        aria-busy={isRetrying || undefined}
        disabled={isRetrying}
        emphasis="solid"
        intent="primary"
        onClick={onRetry}
        presentation="default"
        size="md"
        type="button"
      >
        {isRetrying ? "Retrying…" : retryLabel}
      </Button>
    ));

  return <AuthShellErrorSurface {...surfaceProps} actions={resolvedActions} />;
}
