import type { ReactNode } from "react";

/**
 * login-page-04 (shadcn/studio Pro) — Afenda ERP auth shell.
 *
 * Source: @ss-blocks/login-page-04 (ADR-0017). Two-column branded panel + form
 * column. Form logic and Better Auth wiring remain in apps/erp sign-in route.
 *
 * Normalization:
 *   Q1 — no @afenda/ui primitives in this layout shell
 *   Q2 — Semantic `.app-shell-studio-auth-login-page-04-*` classes
 *   Q3 — Layout flex/grid on plain HTML wrappers only
 */

export interface AppShellAuthLoginPage04Props {
  readonly children: ReactNode;
  readonly formDescription?: string;
  readonly formHeading?: string;
}

export function AppShellAuthLoginPage04({
  children,
  formDescription = "Sign in with your organization credentials to access Afenda ERP.",
  formHeading = "Sign in",
}: AppShellAuthLoginPage04Props) {
  return (
    <div className="app-shell-studio-auth-login-page-04">
      <aside
        aria-label="Afenda ERP platform overview"
        className="app-shell-studio-auth-login-page-04__brand"
      >
        <div className="app-shell-studio-auth-login-page-04__brand-copy">
          <p className="app-shell-studio-auth-login-page-04__brand-kicker">
            Afenda ERP
          </p>
          <h2 className="app-shell-studio-auth-login-page-04__brand-title">
            Operating platform for manufacturing and operations-heavy
            enterprises
          </h2>
          <p className="app-shell-studio-auth-login-page-04__brand-description">
            Application-owned identity with tenant-aware access, governed UI,
            and audit-ready administration.
          </p>
        </div>

        <figure className="app-shell-studio-auth-login-page-04__preview">
          <img
            alt="Afenda ERP workspace preview"
            className="app-shell-studio-auth-login-page-04__preview-image"
            height={472}
            src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-1.png"
            width={640}
          />
        </figure>

        <ul className="app-shell-studio-auth-login-page-04__capabilities">
          <li className="app-shell-studio-auth-login-page-04__capability">
            Multi-tenant context
          </li>
          <li className="app-shell-studio-auth-login-page-04__capability">
            Better Auth identity
          </li>
          <li className="app-shell-studio-auth-login-page-04__capability">
            Governed enterprise UI
          </li>
        </ul>
      </aside>

      <div className="app-shell-studio-auth-login-page-04__form-column">
        <div className="app-shell-studio-auth-login-page-04__form-inner">
          <header className="app-shell-studio-auth-login-page-04__form-header">
            <h1 className="app-shell-studio-auth-login-page-04__form-title">
              {formHeading}
            </h1>
            <p className="app-shell-studio-auth-login-page-04__form-description">
              {formDescription}
            </p>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
