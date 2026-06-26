import type { AuthShellBrandPanelProps } from "./auth-shell.types.js";

/**
 * Compact card-header brand mark (login-page-01 DNA) — logo or product label only.
 */
export function AuthShellBrandHeader({
  logoAlt,
  logoUrl,
  productLabel,
}: Pick<AuthShellBrandPanelProps, "logoAlt" | "logoUrl" | "productLabel">) {
  const resolvedLogoAlt =
    logoAlt ??
    (typeof productLabel === "string" ? `${productLabel} logo` : "Tenant logo");

  return (
    <div className="af-auth-shell__brand-header">
      <div className="af-auth-shell__brand-header-mark">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- package shell chrome; signed URL from server
          <img
            alt={resolvedLogoAlt}
            className="af-auth-shell__brand-header-logo"
            src={logoUrl}
          />
        ) : (
          <span className="af-auth-shell__brand-header-label">
            {productLabel}
          </span>
        )}
      </div>
    </div>
  );
}
