import { AuthShellV2Compound } from "./auth-shell-v2.compound.js";
import {
  AUTH_SHELL_V2_ENTRY_DEFAULT_DESCRIPTION,
  AUTH_SHELL_V2_ENTRY_DEFAULT_EYEBROW,
} from "./auth-shell-v2.constants.js";
import {
  AuthShell,
  AuthShellAlternateAction,
  AuthShellEscapeAction,
  AuthShellFormFrame,
  AuthShellVisualPanel,
} from "./auth-shell-v2.js";
import type {
  AuthShellEntryPageProps,
  AuthShellErrorEntryPageProps,
} from "./auth-shell-v2.types.js";
import { AuthShellErrorSurface } from "./auth-shell-v2-error-surface.client.js";

/**
 * Convenience wrapper for form pages (`access` | `verify` | `recover` lanes).
 */
export function AuthShellEntryPage({
  lane,
  title,
  eyebrow = AUTH_SHELL_V2_ENTRY_DEFAULT_EYEBROW,
  description = AUTH_SHELL_V2_ENTRY_DEFAULT_DESCRIPTION,
  children,
  alternateAction,
  escapeAction,
  legalNotice,
  support,
  shellStyle,
  visual,
}: AuthShellEntryPageProps) {
  const resolvedVisual = visual ?? <AuthShellVisualPanel />;

  return (
    <AuthShell
      footer={legalNotice}
      lane={lane}
      {...(shellStyle ? { shellStyle } : {})}
      support={support}
      title={title}
      visual={resolvedVisual}
    >
      <AuthShellV2Compound.FormColumn>
        <AuthShellFormFrame>
          <AuthShellV2Compound.FormHeader
            description={description}
            eyebrow={eyebrow}
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
  const resolvedVisual = visual ?? <AuthShellVisualPanel />;

  return (
    <AuthShell
      footer={legalNotice}
      lane="error"
      {...(shellStyle ? { shellStyle } : {})}
      support={support}
      title={errorProps.title}
      visual={resolvedVisual}
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
