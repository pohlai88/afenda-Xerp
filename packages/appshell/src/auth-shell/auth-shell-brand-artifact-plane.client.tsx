"use client";

import {
  AUTH_SHELL_BRAND_ARTIFACT_ALT,
  AUTH_SHELL_BRAND_ARTIFACT_SRC,
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
  type AuthShellBrandPrinciple,
  type AuthShellEntryBrandPanelProps,
} from "./auth-shell.contract.js";
import { AuthShellBrandArtifactImage } from "./auth-shell-brand-artifact-image.client.js";

export type { AuthShellBrandPrinciple } from "./auth-shell.contract.js";

import type { ReactNode } from "react";

export interface AuthShellBrandArtifactPlaneProps {
  readonly artifactAlt?: string | undefined;
  readonly artifactSrc?:
    | AuthShellEntryBrandPanelProps["artifactSrc"]
    | undefined;
  readonly eyebrow?: ReactNode;
  readonly footerCopy?: ReactNode;
  readonly headline?: ReactNode;
  readonly highlightedHeadline?: ReactNode;
  readonly principles?: readonly AuthShellBrandPrinciple[];
  readonly priority?: boolean | undefined;
  readonly productLabel?: ReactNode;
  readonly readinessLabel?: ReactNode;
  readonly readinessScore?: ReactNode;
  readonly securityLabel?: ReactNode;
  readonly supportingText?: ReactNode;
}

/**
 * Editorial full-bleed authentication brand plane.
 *
 * Owns the visual brand environment for the authentication ecosystem:
 * - image-led full-bleed artifact
 * - editorial memory-gate copy
 * - authentication principles
 * - readiness signal
 *
 * Does not own:
 * - auth form behavior
 * - route mutation
 * - session validation
 * - provider error mapping
 */
export function AuthShellBrandArtifactPlane({
  artifactAlt = AUTH_SHELL_BRAND_ARTIFACT_ALT,
  artifactSrc = AUTH_SHELL_BRAND_ARTIFACT_SRC,
  eyebrow = AUTH_SHELL_BRAND_KICKER,
  footerCopy = AUTH_SHELL_BRAND_FOOTER_COPY,
  headline = AUTH_SHELL_BRAND_HEADLINE,
  highlightedHeadline = AUTH_SHELL_BRAND_HEADLINE_EMPHASIS,
  priority = true,
  principles = AUTH_SHELL_BRAND_PRINCIPLES,
  productLabel = AUTH_SHELL_BRAND_PRODUCT_LABEL,
  readinessLabel = AUTH_SHELL_BRAND_READINESS_LABEL,
  readinessScore = AUTH_SHELL_BRAND_READINESS_SCORE,
  securityLabel = AUTH_SHELL_BRAND_SECURITY_LABEL,
  supportingText = AUTH_SHELL_BRAND_SUPPORTING_TEXT,
}: AuthShellBrandArtifactPlaneProps) {
  return (
    <aside
      aria-label="Afenda authentication brand environment"
      className="app-shell-studio-auth-memory-gate__brand-plane"
    >
      <AuthShellBrandArtifactImage
        alt={artifactAlt}
        priority={priority}
        src={artifactSrc}
      />

      <div
        aria-hidden="true"
        className="app-shell-studio-auth-memory-gate__artifact-scrim"
      />

      <DecorativeConstellation />

      <header className="app-shell-studio-auth-memory-gate__brand-header">
        <div className="app-shell-studio-auth-memory-gate__brand-lockup">
          <span
            aria-hidden="true"
            className="app-shell-studio-auth-memory-gate__brand-sigil"
          />
          <span>{productLabel}</span>
        </div>

        <span className="app-shell-studio-auth-memory-gate__edition-tag">
          {securityLabel}
        </span>
      </header>

      <section
        aria-labelledby="auth-brand-headline"
        className="app-shell-studio-auth-memory-gate__brand-story"
      >
        <p className="app-shell-studio-auth-memory-gate__eyebrow">
          <span aria-hidden="true" />
          {eyebrow}
        </p>

        <h2
          className="app-shell-studio-auth-memory-gate__headline"
          id="auth-brand-headline"
        >
          {headline}
          <br />
          <em>{highlightedHeadline}</em>
        </h2>

        <p className="app-shell-studio-auth-memory-gate__supporting-text">
          {supportingText}
        </p>

        <AuthShellBrandPrinciples principles={principles} />
      </section>

      <footer className="app-shell-studio-auth-memory-gate__brand-footer">
        <p>{footerCopy}</p>

        <div
          aria-label={`${readinessLabel}: ${readinessScore}`}
          className="app-shell-studio-auth-memory-gate__readiness"
        >
          <span>{readinessLabel}</span>
          <strong>{readinessScore}</strong>
        </div>
      </footer>
    </aside>
  );
}

function DecorativeConstellation() {
  return (
    <div
      aria-hidden="true"
      className="app-shell-studio-auth-memory-gate__constellation"
    >
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function AuthShellBrandPrinciples({
  principles,
}: {
  readonly principles: readonly AuthShellBrandPrinciple[];
}) {
  return (
    <dl className="app-shell-studio-auth-memory-gate__principles">
      {principles.map((principle, index) => (
        <div
          key={
            typeof principle.label === "string"
              ? principle.label
              : `auth-shell-principle-${index}`
          }
        >
          <dt>{principle.label}</dt>
          <dd>{principle.statement}</dd>
        </div>
      ))}
    </dl>
  );
}
