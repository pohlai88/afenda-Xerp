import type { ReactNode } from "react";

/**
 * Image-led brand background layers.
 *
 * Ownership:
 * - Artifact owns the full-bleed visual slot.
 * - Scrim owns tonal readability.
 * - Grain owns subtle editorial texture.
 *
 * This file does not own:
 * - brand copy
 * - readiness score
 * - principles
 * - authentication form layout
 */
export interface AuthShellBrandBackgroundArtifactProps {
  readonly children?: ReactNode;
}

export interface AuthShellBrandBackgroundProps {
  readonly children?: ReactNode;
}

/**
 * Full-bleed artifact slot.
 *
 * Expected child:
 * - AuthShellBrandArtifactImage
 *
 * The artifact wrapper is not aria-hidden because the child image owns
 * meaningful alt text when the artifact is informative.
 */
export function AuthShellBrandBackgroundArtifact({
  children,
}: AuthShellBrandBackgroundArtifactProps) {
  return (
    <div className="app-shell-studio-auth-memory-gate__brand-artifact">
      {children}
    </div>
  );
}

/** Tonal scrim for text readability over the artifact image. */
export function AuthShellBrandBackgroundScrim() {
  return (
    <div
      aria-hidden="true"
      className="app-shell-studio-auth-memory-gate__brand-scrim"
    />
  );
}

/** Subtle editorial grain layer. Decorative only. */
export function AuthShellBrandBackgroundGrain() {
  return (
    <div
      aria-hidden="true"
      className="app-shell-studio-auth-memory-gate__brand-grain"
    />
  );
}

/**
 * Default composed backdrop.
 *
 * Layer order:
 * 1. Artifact image slot
 * 2. Tonal scrim
 * 3. Editorial grain
 */
export function AuthShellBrandBackground({
  children,
}: AuthShellBrandBackgroundProps) {
  return (
    <>
      <AuthShellBrandBackgroundArtifact>
        {children}
      </AuthShellBrandBackgroundArtifact>
      <AuthShellBrandBackgroundScrim />
      <AuthShellBrandBackgroundGrain />
    </>
  );
}

/**
 * @deprecated Mesh was removed from the Memory Gate direction.
 * Use AuthShellBrandBackground with an image-led artifact plane instead.
 */
export function AuthShellBrandBackgroundMesh() {
  return null;
}

/**
 * @deprecated Abstract shapes were removed from the Memory Gate direction.
 * Use AuthShellBrandBackground with an image-led artifact plane instead.
 */
export function AuthShellBrandBackgroundShapes() {
  return null;
}
