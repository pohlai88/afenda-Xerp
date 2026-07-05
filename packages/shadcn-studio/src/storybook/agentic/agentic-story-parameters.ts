/**
 * SB 10.4 Parameters + Autodocs — shared CSF metadata for agentic pilot stories.
 * Inheritance: global (`preview.tsx`) → component (meta) → story (export).
 * Keys merge; more specific levels override sub-keys only.
 * CSF: https://storybook.js.org/docs/api/csf · Parameters: writing-stories/parameters
 */

import {
  shadcnStudioCenteredLayout,
  shadcnStudioFullscreenLayout,
  shadcnStudioStoryA11y,
} from "../story-parameters.js";

/** Component-level docs prose for all agentic pilot metas. */
export const agenticAutodocsParameters = {
  docs: {
    description: {
      component:
        "Agentic pilot catalog (Storybook 10.4 Autodocs from CSF). Remove the `ai-generated` tag after human review. Long-form PAS docs live in `apps/docs` — this lab stays CSF-only (no MDX).",
    },
  },
} as const;

/** Component-level parameters — centered primitives and composition demos. */
export const agenticCenteredMetaParameters = {
  ...agenticAutodocsParameters,
  ...shadcnStudioCenteredLayout,
  a11y: shadcnStudioStoryA11y,
} as const;

/** Component-level parameters — fullscreen auth / page blocks. */
export const agenticFullscreenMetaParameters = {
  ...agenticAutodocsParameters,
  ...shadcnStudioFullscreenLayout,
  a11y: shadcnStudioStoryA11y,
} as const;

/**
 * Meta-level tags (SB 10.4) — copy these **string literals** into each CSF file.
 * Do not spread these arrays in `tags` — Storybook 10 indexer requires literal tags.
 * `lab-smoke` is story-level on exports that define `play` (Vitest CI filter).
 */
export const agenticPilotMetaTags = ["autodocs", "ai-generated"] as const;

/** Story-level tag — copy literal `["lab-smoke"]` on stories with `play`. */
export const agenticPilotSmokeStoryTags = ["lab-smoke"] as const;
