import {
  AUTH_SHELL_BRAND_FOOTER_COPY,
  AUTH_SHELL_BRAND_HEADLINE,
  AUTH_SHELL_BRAND_HEADLINE_EMPHASIS,
  AUTH_SHELL_BRAND_KICKER,
  AUTH_SHELL_BRAND_PRINCIPLES,
  AUTH_SHELL_BRAND_PRODUCT_LABEL,
  AUTH_SHELL_BRAND_READINESS_LABEL,
  AUTH_SHELL_BRAND_READINESS_SCORE,
  AUTH_SHELL_BRAND_SECURITY_LABEL,
  AUTH_SHELL_BRAND_SUPPORTING_TEXT,
  type AuthShellEntryBrandPanelProps,
} from "./auth-shell.contract.js";
import { AuthShellBrandArtifactPlane } from "./auth-shell-brand-artifact-plane.client.js";

export { AuthShellEntryBrand } from "./auth-shell-brand.compound.js";

/**
 * Compatibility adapter for the auth entry brand panel.
 *
 * Maps the older AuthShellEntryBrandPanelProps shape into the newer
 * Memory Gate brand artifact plane.
 *
 * Ownership:
 * - This component resolves legacy prop aliases.
 * - AuthShellBrandArtifactPlane owns the editorial visual composition.
 * - AuthShellEntryBrand owns the compound API export.
 */
export function AuthShellEntryBrandPanel({
  artifactAlt,
  artifactSrc,
  description,
  footerCopy = AUTH_SHELL_BRAND_FOOTER_COPY,
  headline,
  highlightedHeadline = AUTH_SHELL_BRAND_HEADLINE_EMPHASIS,
  kicker = AUTH_SHELL_BRAND_KICKER,
  principles = AUTH_SHELL_BRAND_PRINCIPLES,
  productLabel = AUTH_SHELL_BRAND_PRODUCT_LABEL,
  readinessLabel = AUTH_SHELL_BRAND_READINESS_LABEL,
  readinessScore = AUTH_SHELL_BRAND_READINESS_SCORE,
  securityLabel = AUTH_SHELL_BRAND_SECURITY_LABEL,
  supportingText,
  title,
}: AuthShellEntryBrandPanelProps = {}) {
  return (
    <AuthShellBrandArtifactPlane
      artifactAlt={artifactAlt}
      artifactSrc={artifactSrc}
      eyebrow={kicker}
      footerCopy={footerCopy}
      headline={headline ?? title ?? AUTH_SHELL_BRAND_HEADLINE}
      highlightedHeadline={highlightedHeadline}
      principles={principles}
      productLabel={productLabel}
      readinessLabel={readinessLabel}
      readinessScore={readinessScore}
      securityLabel={securityLabel}
      supportingText={
        supportingText ?? description ?? AUTH_SHELL_BRAND_SUPPORTING_TEXT
      }
    />
  );
}
