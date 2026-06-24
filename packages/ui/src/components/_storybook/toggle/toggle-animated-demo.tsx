"use client";

import { HeartIcon } from "lucide-react";
import type { ReactNode } from "react";
import { MotionToggle } from "./motion-toggle";
import {
  TOGGLE_ANIMATED_ARIA_LABEL,
  TOGGLE_ANIMATED_LABEL,
} from "./toggle-fixtures";

export interface StorybookToggleAnimatedProps {
  readonly ariaLabel?: string;
  readonly label?: string;
  readonly particleColor?: string;
}

/**
 * Storybook-only animated toggle — normalized from shadcn-studio toggle-13.
 *
 * Phase 3 normalization:
 *   - Zero className on governed Toggle
 *   - Lucide Heart icon (repo icon set) with on-state styling in preview CSS
 *   - Particle burst via motion/react; skipped when prefers-reduced-motion
 */
export function StorybookToggleAnimated({
  ariaLabel = TOGGLE_ANIMATED_ARIA_LABEL,
  label = TOGGLE_ANIMATED_LABEL,
  particleColor = "var(--destructive)",
}: StorybookToggleAnimatedProps): ReactNode {
  return (
    <div className="afenda-storybook-toggle">
      <MotionToggle aria-label={ariaLabel} particleColor={particleColor}>
        <HeartIcon
          aria-hidden="true"
          className="afenda-storybook-toggle__icon"
        />
        {label}
      </MotionToggle>
    </div>
  );
}
