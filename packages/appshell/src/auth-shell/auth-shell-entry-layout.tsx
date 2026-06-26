import { AuthShellV2Compound } from "./auth-shell.compound.js";
import { AUTH_SHELL_ENTRY_DEFAULT_DESCRIPTION } from "./auth-shell.constants.js";
import {
  AuthShell,
  AuthShellAlternateAction,
  AuthShellEscapeAction,
  AuthShellFormFrame,
} from "./auth-shell.js";
import type {
  AuthShellEntryPageProps,
  AuthShellErrorEntryPageProps,
} from "./auth-shell.types.js";
import { AuthShellErrorSurface } from "./auth-shell-error-surface.client.js";

/**
 * Convenience wrapper for form pages (`access` | `verify` | `recover` lanes).
 */
export function AuthShellEntryPage({
  lane,
  title,
  eyebrow: _eyebrow,
  description = AUTH_SHELL_ENTRY_DEFAULT_DESCRIPTION,
  children,
  alternateAction,
  escapeAction,
  legalNotice,
  support,
  shellStyle,
  visual,
}: AuthShellEntryPageProps) {
  return (
    <AuthShell
      footer={legalNotice}
      lane={lane}
      {...(shellStyle ? { shellStyle } : {})}
      support={support}
      title={title}
      {...(visual === undefined ? {} : { visual })}
    >
      <AuthShellV2Compound.FormColumn>
        <AuthShellFormFrame>
          <AuthShellV2Compound.FormHeader
            description={description}
            heading={title}
          />
          <AuthShellV2Compound.FormBody>
            {children}
          </AuthShellV2Compound.FormBody>
          {alternateAction === undefined ? null : (
            <AuthShellAlternateAction>
              {alternateAction}
            </AuthShellAlternateAction>
          )}
          {escapeAction === undefined ? null : (
            <AuthShellEscapeAction>{escapeAction}</AuthShellEscapeAction>
          )}
        </AuthShellFormFrame>
      </AuthShellV2Compound.FormColumn>
    </AuthShell>
  );
}

/**
 * Split-layout error entry — brand visual + embedded error alert in form column.
 */
export function AuthShellErrorEntryPage({
  escapeAction,
  legalNotice,
  shellStyle,
  support,
  visual,
  embedded: _embedded,
  ...errorProps
}: AuthShellErrorEntryPageProps) {
  return (
    <AuthShell
      footer={legalNotice}
      lane="error"
      {...(shellStyle ? { shellStyle } : {})}
      support={support}
      title={errorProps.title}
      {...(visual === undefined ? {} : { visual })}
    >
      <AuthShellV2Compound.FormColumn>
        <AuthShellFormFrame>
          <AuthShellV2Compound.FormBody>
            <AuthShellErrorSurface embedded {...errorProps} />
          </AuthShellV2Compound.FormBody>
          {escapeAction === undefined ? null : (
            <AuthShellEscapeAction>{escapeAction}</AuthShellEscapeAction>
          )}
        </AuthShellFormFrame>
      </AuthShellV2Compound.FormColumn>
    </AuthShell>
  );
}
