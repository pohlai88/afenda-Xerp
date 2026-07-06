"use client";

/** PAS-006A L4 — Storybook theme decorator for v2 presentation providers. */

import type { ReactElement } from "react";
import { TooltipProvider } from "../components/ui/tooltip";
import { StudioPresentationProviders } from "../contexts/theme-boundary";
import type { StudioResolvedThemeMode } from "../types/theme";
import { resolveStorybookThemeId } from "./resolve-storybook-theme-id";

export interface ShadcnStudioStoryParameters {
  readonly layout?: string;
  readonly shadcnStudioPreset?: string;
}

export type StorybookLabDecorator = (
  Story: () => ReactElement,
  context: {
    globals: Record<string, unknown>;
    parameters: Record<string, unknown>;
  }
) => ReactElement;

export const shadcnStudioThemeDecorator: StorybookLabDecorator = (
  Story,
  context
) => {
  const parameters = context.parameters as ShadcnStudioStoryParameters;
  const preset = parameters.shadcnStudioPreset ?? "default";
  const themeId = resolveStorybookThemeId(preset);
  const colorMode: StudioResolvedThemeMode =
    context.globals["theme"] === "dark" ? "dark" : "light";
  const isFullscreen = parameters.layout === "fullscreen";

  return (
    <StudioPresentationProviders
      initialMode={colorMode}
      initialThemeId={themeId}
      storageKey="afenda-storybook-v2-theme"
    >
      <TooltipProvider delay={0}>
        <div
          className={
            isFullscreen
              ? "min-h-svh bg-background font-sans text-foreground antialiased"
              : "bg-background p-4 font-sans text-foreground antialiased"
          }
        >
          <Story />
        </div>
      </TooltipProvider>
    </StudioPresentationProviders>
  );
};
