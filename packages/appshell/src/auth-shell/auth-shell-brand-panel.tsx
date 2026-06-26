import type { CSSProperties } from "react";

import {
  AUTH_SHELL_BRAND_HEADLINE,
  AUTH_SHELL_BRAND_PRODUCT_LABEL,
  AUTH_SHELL_BRAND_SUPPORTING_TEXT,
} from "./auth-shell.constants.js";
import type { AuthShellBrandPanelProps } from "./auth-shell.types.js";

/**
 * V2 brand / trust panel — isolated from legacy AuthShellEntryBrandPanel.
 */
export function AuthShellBrandPanel({
  brandColor,
  headline = AUTH_SHELL_BRAND_HEADLINE,
  logoAlt,
  logoUrl,
  supportingText = AUTH_SHELL_BRAND_SUPPORTING_TEXT,
  productLabel = AUTH_SHELL_BRAND_PRODUCT_LABEL,
}: AuthShellBrandPanelProps) {
  const resolvedLogoAlt =
    logoAlt ??
    (typeof productLabel === "string" ? `${productLabel} logo` : "Tenant logo");

  return (
    <aside
      aria-label="Authentication brand"
      className="af-auth-shell__brand"
      style={
        brandColor
          ? ({ "--af-auth-brand": brandColor } as CSSProperties)
          : undefined
      }
    >
      <div className="af-auth-shell__brand-mark">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- package shell chrome; signed URL from server
          <img
            alt={resolvedLogoAlt}
            className="af-auth-shell__brand-logo"
            src={logoUrl}
          />
        ) : (
          <span className="af-auth-shell__brand-product">{productLabel}</span>
        )}
      </div>
      <h2 className="af-auth-shell__brand-headline">{headline}</h2>
      <p className="af-auth-shell__brand-supporting">{supportingText}</p>
    </aside>
  );
}
