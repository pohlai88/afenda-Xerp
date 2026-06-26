"use client";

import { AppShellOptimizedImage } from "../components/appshell-optimized-image.client.js";
import {
  AUTH_SHELL_BRAND_ARTIFACT_ALT,
  AUTH_SHELL_BRAND_ARTIFACT_SRC,
  type AuthShellEntryBrandPanelProps,
} from "./auth-shell.contract.js";

export interface AuthShellBrandArtifactImageProps {
  readonly alt?: string;
  readonly priority?: boolean;
  readonly src?: AuthShellEntryBrandPanelProps["artifactSrc"];
}

/**
 * Full-bleed brand artifact image.
 *
 * This component is intentionally image-only:
 * - no overlay ownership
 * - no copy ownership
 * - no layout ownership beyond image fill behavior
 *
 * The parent artifact plane owns editorial composition.
 */
export function AuthShellBrandArtifactImage({
  alt = AUTH_SHELL_BRAND_ARTIFACT_ALT,
  priority = true,
  src = AUTH_SHELL_BRAND_ARTIFACT_SRC,
}: AuthShellBrandArtifactImageProps) {
  return (
    <AppShellOptimizedImage
      alt={alt}
      className="app-shell-studio-auth-memory-gate__artifact-image"
      fetchPriority={priority ? "high" : undefined}
      fill
      priority={priority}
      sizes="(min-width: 80rem) 56vw, (min-width: 64rem) 58vw, 100vw"
      src={src}
    />
  );
}
