"use client";

import type { Decorator } from "@storybook/react";
import { ThemeProvider } from "next-themes";

import { SettingsProvider } from "../theme/settings-context.js";
import type { ThemePresetSlug } from "../theme/theme-preset.contract.js";

export interface ShadcnStudioStoryParameters {
  shadcnStudioPreset?: ThemePresetSlug;
}

export const shadcnStudioThemeDecorator: Decorator = (Story, context) => {
  const preset =
    (context.parameters as ShadcnStudioStoryParameters).shadcnStudioPreset ??
    "default";
  const colorMode = context.globals["theme"] === "dark" ? "dark" : "light";

  return (
    <ThemeProvider
      attribute="class"
      enableSystem={false}
      forcedTheme={colorMode}
    >
      <SettingsProvider initial={{ themePreset: preset, mode: colorMode }}>
        <Story />
      </SettingsProvider>
    </ThemeProvider>
  );
};
