"use client";

import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  AUTH_SHELL_ERROR_DEFAULT_RETRY_LABEL,
  AUTH_SHELL_ERROR_EYEBROW,
  type AuthShellErrorSurfaceProps,
} from "./auth-shell.contract.js";
import { AuthShellError } from "./auth-shell-error.compound.js";

export { AuthShellError } from "./auth-shell-error.compound.js";

export type AuthShellErrorSurfaceRuntimeGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

export function AuthShellErrorSurface({
  description,
  eyebrow = AUTH_SHELL_ERROR_EYEBROW,
  isRetrying = false,
  onRetry,
  retryLabel = AUTH_SHELL_ERROR_DEFAULT_RETRY_LABEL,
  title,
}: AuthShellErrorSurfaceProps) {
  return (
    <AuthShellError.Root>
      <AuthShellError.Alert>
        <AuthShellError.Illustration />
        <AuthShellError.Copy>
          <AuthShellError.Eyebrow>{eyebrow}</AuthShellError.Eyebrow>
          <AuthShellError.Title>{title}</AuthShellError.Title>
          <AuthShellError.Description>{description}</AuthShellError.Description>
          {onRetry === undefined ? null : (
            <AuthShellError.Actions>
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
            </AuthShellError.Actions>
          )}
        </AuthShellError.Copy>
      </AuthShellError.Alert>
    </AuthShellError.Root>
  );
}
