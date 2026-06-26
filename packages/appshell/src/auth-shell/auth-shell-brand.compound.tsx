import {
  Building2,
  KeyRound,
  type LucideIcon,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  AUTH_SHELL_BRAND_MANIFESTO,
  AUTH_SHELL_ENTRY_CAPABILITIES,
  AUTH_SHELL_ENTRY_PREVIEW_CAPTION,
  type AuthShellEntryBrandCapabilitiesProps,
  type AuthShellEntryBrandManifestoProps,
  type AuthShellEntryCapability,
} from "./auth-shell.contract.js";
import { AuthShellBrandArtifactImage } from "./auth-shell-brand-artifact-image.client.js";
import { AuthShellBrandArtifactPlane } from "./auth-shell-brand-artifact-plane.client.js";
import {
  AuthShellBrandBackground,
  AuthShellBrandBackgroundArtifact,
  AuthShellBrandBackgroundGrain,
  AuthShellBrandBackgroundScrim,
} from "./auth-shell-brand-background.js";
import { AuthShellPreviewImage } from "./auth-shell-preview-image.client.js";

const AUTH_SHELL_CAPABILITY_ICON_MAP = {
  "Multi-tenant context": Building2,
  "Better Auth identity": KeyRound,
  "Governed enterprise UI": ShieldCheck,
} as const satisfies Record<AuthShellEntryCapability, LucideIcon>;

function resolveCapabilityIcon(capability: string): LucideIcon | undefined {
  return AUTH_SHELL_CAPABILITY_ICON_MAP[capability as AuthShellEntryCapability];
}

export interface AuthShellEntryBrandRootProps {
  readonly children: ReactNode;
}

export interface AuthShellEntryBrandChildrenProps {
  readonly children: ReactNode;
}

export interface AuthShellEntryBrandArtifactImageProps {
  readonly src?: string;
}

export interface AuthShellEntryBrandPreviewCaptionProps {
  readonly children?: ReactNode;
}

export function AuthShellEntryBrandRoot({
  children,
}: AuthShellEntryBrandRootProps) {
  return (
    <aside
      aria-label="Afenda ERP authentication brand environment"
      className="app-shell-studio-auth-memory-gate__brand"
    >
      {children}
    </aside>
  );
}

export function AuthShellEntryBrandLockup() {
  return (
    <div className="app-shell-studio-auth-memory-gate__brand-lockup">
      <div
        aria-hidden="true"
        className="app-shell-studio-auth-memory-gate__brand-sigil"
      />
      <p
        className="app-shell-studio-auth-memory-gate__brand-wordmark"
        translate="no"
      >
        Afenda ERP
      </p>
    </div>
  );
}

export function AuthShellEntryBrandManifesto({
  children = AUTH_SHELL_BRAND_MANIFESTO,
}: AuthShellEntryBrandManifestoProps) {
  return (
    <p className="app-shell-studio-auth-memory-gate__brand-manifesto">
      {children}
    </p>
  );
}

export function AuthShellEntryBrandAccentRule() {
  return (
    <div
      aria-hidden="true"
      className="app-shell-studio-auth-memory-gate__brand-accent"
    />
  );
}

export function AuthShellEntryBrandCopy({
  children,
}: AuthShellEntryBrandChildrenProps) {
  return (
    <div className="app-shell-studio-auth-memory-gate__brand-copy">
      {children}
    </div>
  );
}

export function AuthShellEntryBrandKicker({
  children,
}: AuthShellEntryBrandChildrenProps) {
  return (
    <p
      className="app-shell-studio-auth-memory-gate__brand-kicker"
      translate="no"
    >
      {children}
    </p>
  );
}

export function AuthShellEntryBrandTitle({
  children,
}: AuthShellEntryBrandChildrenProps) {
  return (
    <h2 className="app-shell-studio-auth-memory-gate__brand-title">
      {children}
    </h2>
  );
}

export function AuthShellEntryBrandDescription({
  children,
}: AuthShellEntryBrandChildrenProps) {
  return (
    <p className="app-shell-studio-auth-memory-gate__brand-description">
      {children}
    </p>
  );
}

export function AuthShellEntryBrandArtifactImage({
  src,
}: AuthShellEntryBrandArtifactImageProps) {
  return <AuthShellBrandArtifactImage src={src} />;
}

export function AuthShellEntryBrandPreview({
  children,
}: AuthShellEntryBrandChildrenProps) {
  return (
    <figure className="app-shell-studio-auth-memory-gate__preview">
      {children}
    </figure>
  );
}

export function AuthShellEntryBrandPreviewFrame({
  children,
}: AuthShellEntryBrandChildrenProps) {
  return (
    <div className="app-shell-studio-auth-memory-gate__preview-frame">
      {children}
    </div>
  );
}

export function AuthShellEntryBrandPreviewCaption({
  children = AUTH_SHELL_ENTRY_PREVIEW_CAPTION,
}: AuthShellEntryBrandPreviewCaptionProps) {
  return (
    <figcaption className="app-shell-studio-auth-memory-gate__preview-caption">
      {children}
    </figcaption>
  );
}

export function AuthShellEntryBrandCapabilities({
  capabilities = AUTH_SHELL_ENTRY_CAPABILITIES,
}: AuthShellEntryBrandCapabilitiesProps) {
  if (capabilities.length === 0) {
    return null;
  }

  return (
    <ul
      aria-label="Authentication platform capabilities"
      className="app-shell-studio-auth-memory-gate__capabilities"
    >
      {capabilities.map((capability) => {
        const CapabilityIcon = resolveCapabilityIcon(capability);

        return (
          <li
            className="app-shell-studio-auth-memory-gate__capability"
            key={capability}
          >
            {CapabilityIcon === undefined ? null : (
              <span
                aria-hidden="true"
                className="app-shell-studio-auth-memory-gate__capability-icon"
              >
                <CapabilityIcon />
              </span>
            )}

            <span>{capability}</span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Compound brand API.
 *
 * Preferred 9.5 path:
 * - Use ArtifactPlane for the new Memory Gate editorial authentication system.
 *
 * Compatibility path:
 * - Root / Lockup / Copy / Preview / Capabilities remain available for older
 *   composed auth layouts.
 */
export const AuthShellEntryBrand = {
  Root: AuthShellEntryBrandRoot,

  Background: AuthShellBrandBackground,
  BackgroundArtifact: AuthShellBrandBackgroundArtifact,
  BackgroundScrim: AuthShellBrandBackgroundScrim,
  BackgroundGrain: AuthShellBrandBackgroundGrain,

  Lockup: AuthShellEntryBrandLockup,
  AccentRule: AuthShellEntryBrandAccentRule,
  Copy: AuthShellEntryBrandCopy,
  Kicker: AuthShellEntryBrandKicker,
  Title: AuthShellEntryBrandTitle,
  Description: AuthShellEntryBrandDescription,
  Manifesto: AuthShellEntryBrandManifesto,

  ArtifactImage: AuthShellEntryBrandArtifactImage,
  ArtifactPlane: AuthShellBrandArtifactPlane,

  Preview: AuthShellEntryBrandPreview,
  PreviewFrame: AuthShellEntryBrandPreviewFrame,
  PreviewCaption: AuthShellEntryBrandPreviewCaption,
  PreviewImage: AuthShellPreviewImage,

  Capabilities: AuthShellEntryBrandCapabilities,
} as const;
