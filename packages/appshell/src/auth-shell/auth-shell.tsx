import type { ReactNode } from "react";

import { AuthShellV2Compound } from "./auth-shell.compound.js";
import type {
  AuthShellFormFrameProps,
  AuthShellProps,
  AuthShellSlotProps,
  AuthShellStatusSurfaceProps,
  AuthShellVisualPanelProps,
} from "./auth-shell.types.js";
import { AuthShellBrandPanel } from "./auth-shell-brand-panel.js";

/**
 * Canonical AUTH-SHELL-V2 viewport root.
 *
 * Isolated from legacy `src/auth-shell` — no shared imports.
 */
export function AuthShell({
  lane,
  title,
  children,
  visual,
  support,
  footer,
  className,
  shellStyle,
}: AuthShellProps) {
  const rootClassName = ["af-auth-shell", className].filter(Boolean).join(" ");

  return (
    <div
      aria-label={title}
      className={rootClassName}
      data-lane={lane}
      style={shellStyle}
    >
      <AuthShellV2Compound.SkipLink />

      <AuthShellV2Compound.Viewport>
        <AuthShellV2Compound.Panel>
          {visual}
          {children}
          {footer === undefined ? null : (
            <div className="af-auth-shell__card-footer" data-auth-slot="footer">
              {footer}
            </div>
          )}
        </AuthShellV2Compound.Panel>
      </AuthShellV2Compound.Viewport>

      {support === undefined ? null : (
        <div className="af-auth-shell__support" data-auth-slot="support">
          {support}
        </div>
      )}
    </div>
  );
}

export function AuthShellFormFrame({
  children,
  footer,
}: AuthShellFormFrameProps) {
  return (
    <AuthShellV2Compound.FormInner>
      {children}
      {footer === undefined ? null : (
        <AuthShellV2Compound.FormFooter>
          {footer}
        </AuthShellV2Compound.FormFooter>
      )}
    </AuthShellV2Compound.FormInner>
  );
}

export function AuthShellStatusSurface({
  title,
  description,
  tone = "neutral",
  headingLevel = 2,
  actions,
}: AuthShellStatusSurfaceProps) {
  const HeadingTag = headingLevel === 1 ? "h1" : "h2";

  return (
    <section
      aria-live="polite"
      className="af-auth-shell__status"
      data-auth-slot="status"
      data-tone={tone}
      role="status"
    >
      <HeadingTag className="af-auth-shell__status-heading">{title}</HeadingTag>
      {description === undefined ? null : (
        <p className="af-auth-shell__status-description">{description}</p>
      )}
      {actions === undefined ? null : (
        <div className="af-auth-shell__status-actions">{actions}</div>
      )}
    </section>
  );
}

export function AuthShellLegalNotice({ children }: AuthShellSlotProps) {
  return (
    <footer
      className="af-auth-shell__legal-notice"
      data-auth-slot="legal-notice"
    >
      {children}
    </footer>
  );
}

export function AuthShellAlternateAction({ children }: AuthShellSlotProps) {
  return (
    <div
      className="af-auth-shell__alternate-action"
      data-auth-slot="alternate-action"
    >
      {children}
    </div>
  );
}

export function AuthShellEscapeAction({ children }: AuthShellSlotProps) {
  return (
    <div
      className="af-auth-shell__escape-action"
      data-auth-slot="escape-action"
    >
      {children}
    </div>
  );
}

export { AuthShellBrandPanel } from "./auth-shell-brand-panel.js";

export function AuthShellVisualPanel({ children }: AuthShellVisualPanelProps) {
  const resolvedChildren: ReactNode = children ?? <AuthShellBrandPanel />;

  return (
    <div className="af-auth-shell__visual" data-auth-slot="visual-panel">
      {resolvedChildren}
    </div>
  );
}
