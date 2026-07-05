"use client";

/** PAS-006A L4 — Storybook theme decorator (canonical). */
/** SB 10.4 context decorator — reads `globals.theme`, `parameters.layout`, `parameters.shadcnStudioPreset`. */
/** @see https://storybook.js.org/docs/writing-stories/decorators#context-for-mocking */

import type { Decorator } from "@storybook/react";
import { ThemeProvider } from "next-themes";

import { TooltipProvider } from "../components-ui/tooltip.js";
import type { ThemePresetSlug } from "../theme-config/config.preset.contract.js";
import { SettingsProvider } from "../theme-runtime/theme-runtime.settings-provider.js";

export interface ShadcnStudioStoryParameters {
  shadcnStudioPreset?: ThemePresetSlug;
}

export const shadcnStudioThemeDecorator: Decorator = (Story, context) => {
  const preset =
    (context.parameters as ShadcnStudioStoryParameters).shadcnStudioPreset ??
    "default";
  const colorMode = context.globals["theme"] === "dark" ? "dark" : "light";
  const isFullscreen = context.parameters["layout"] === "fullscreen";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={colorMode}
      enableSystem={false}
      forcedTheme={colorMode}
    >
      <SettingsProvider initial={{ themePreset: preset, mode: colorMode }}>
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
      </SettingsProvider>
    </ThemeProvider>
  );
};
