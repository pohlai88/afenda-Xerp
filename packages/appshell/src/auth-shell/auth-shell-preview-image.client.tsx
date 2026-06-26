"use client";

import { AppShellOptimizedImage } from "../components/appshell-optimized-image.client.js";
import {
  AUTH_SHELL_ENTRY_PREVIEW_ALT,
  AUTH_SHELL_ENTRY_PREVIEW_SRC,
  type AuthShellEntryBrandPanelProps,
} from "./auth-shell.contract.js";

export interface AuthShellPreviewImageProps {
  readonly alt?: string;
  readonly priority?: boolean;
  readonly src?: AuthShellEntryBrandPanelProps["previewSrc"];
}

/**
 * Optional ERP workspace preview image.
 *
 * This is a supporting preview asset, not the primary Memory Gate artifact.
 *
 * Ownership:
 * - renders a bounded workspace preview image
 * - keeps sizing stable for layout
 * - delegates image optimization to AppShellOptimizedImage
 *
 * Does not own:
 * - brand background artifact
 * - auth shell layout
 * - editorial overlay
 * - route/security messaging
 */
export function AuthShellPreviewImage({
  alt = AUTH_SHELL_ENTRY_PREVIEW_ALT,
  priority = false,
  src = AUTH_SHELL_ENTRY_PREVIEW_SRC,
}: AuthShellPreviewImageProps) {
  return (
    <AppShellOptimizedImage
      alt={alt}
      className="app-shell-studio-auth-memory-gate__preview-image"
      fetchPriority={priority ? "high" : undefined}
      height={472}
      priority={priority}
      sizes="(min-width: 64rem) 32rem, 100vw"
      src={src}
      width={640}
    />
  );
}
