import type { Decorator, Meta, StoryObj } from "@storybook/react";

import { Button } from "./components/ui/button.js";
import { shadcnStudioThemeDecorator } from "./_storybook/shadcn-studio-theme.decorator.js";
import {
  PresetMatrix,
  slugToPresetStoryExportName,
  ThemeCustomizerLabSurface,
} from "./_storybook/shadcn-studio-theme-lab.compositions.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioStoryA11y,
  shadcnStudioThemeLabDocs,
} from "./_storybook/story-parameters.js";
import { ThemeCustomizer } from "./theme/theme-customizer.js";
import {
  THEME_PRESET_SLUGS,
  type ThemePresetSlug,
} from "./theme/theme-preset.contract.js";
import { themePresets } from "./theme/theme-presets.js";

const meta = {
  title: "Shadcn Studio/Theme Lab",
  component: ThemeCustomizer,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component: shadcnStudioThemeLabDocs.component,
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
  decorators: [shadcnStudioThemeDecorator],
} satisfies Meta<typeof ThemeCustomizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemeCustomizerLab: Story = {
  render: () => <ThemeCustomizerLabSurface />,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive ThemeCustomizer with SettingsProvider — preset, color mode, and radius controls.",
      },
    },
  },
};

export const AllPresetsLight: Story = {
  render: () => <PresetMatrix colorMode="light" />,
  parameters: {
    docs: {
      description: {
        story: `All ${THEME_PRESET_SLUGS.length} theme preset slugs in light mode.`,
      },
    },
  },
};

export const AllPresetsDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => <PresetMatrix colorMode="dark" />,
  parameters: {
    docs: {
      description: {
        story: `All ${THEME_PRESET_SLUGS.length} theme preset slugs in dark mode.`,
      },
    },
  },
};

const presetStoryDecorator =
  (slug: ThemePresetSlug, colorMode: "light" | "dark"): Decorator =>
  (Story, context) => {
    const forcedContext = {
      ...context,
      globals: { ...context.globals, theme: colorMode },
      parameters: { ...context.parameters, shadcnStudioPreset: slug },
    };

    return shadcnStudioThemeDecorator(Story, forcedContext);
  };

function createPresetStory(
  slug: ThemePresetSlug,
  colorMode: "light" | "dark"
): Story {
  const label =
    slug === "default"
      ? "Default"
      : themePresets[slug as keyof typeof themePresets].label;

  return {
    name: `${label} (${colorMode})`,
    decorators: [presetStoryDecorator(slug, colorMode)],
    render: () => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">{label}</p>
        <Button type="button">Primary</Button>
      </div>
    ),
  };
}

const presetExports = Object.fromEntries(
  THEME_PRESET_SLUGS.flatMap((slug) => [
    [
      slugToPresetStoryExportName(slug, "light"),
      createPresetStory(slug, "light"),
    ],
    [
      slugToPresetStoryExportName(slug, "dark"),
      createPresetStory(slug, "dark"),
    ],
  ])
) as Record<string, Story>;

export const DefaultLight: Story = presetExports["DefaultLight"] as Story;
export const DefaultDark: Story = presetExports["DefaultDark"] as Story;
export const CaffeineLight: Story = presetExports["CaffeineLight"] as Story;
export const CaffeineDark: Story = presetExports["CaffeineDark"] as Story;
export const ClaudeLight: Story = presetExports["ClaudeLight"] as Story;
export const ClaudeDark: Story = presetExports["ClaudeDark"] as Story;
export const CorporateLight: Story = presetExports["CorporateLight"] as Story;
export const CorporateDark: Story = presetExports["CorporateDark"] as Story;
export const GhibliStudioLight: Story = presetExports[
  "GhibliStudioLight"
] as Story;
export const GhibliStudioDark: Story = presetExports[
  "GhibliStudioDark"
] as Story;
export const MarvelLight: Story = presetExports["MarvelLight"] as Story;
export const MarvelDark: Story = presetExports["MarvelDark"] as Story;
export const MaterialDesignLight: Story = presetExports[
  "MaterialDesignLight"
] as Story;
export const MaterialDesignDark: Story = presetExports[
  "MaterialDesignDark"
] as Story;
export const ModernMinimalLight: Story = presetExports[
  "ModernMinimalLight"
] as Story;
export const ModernMinimalDark: Story = presetExports[
  "ModernMinimalDark"
] as Story;
export const NatureLight: Story = presetExports["NatureLight"] as Story;
export const NatureDark: Story = presetExports["NatureDark"] as Story;
export const PerplexityLight: Story = presetExports["PerplexityLight"] as Story;
export const PerplexityDark: Story = presetExports["PerplexityDark"] as Story;
export const SlackLight: Story = presetExports["SlackLight"] as Story;
export const SlackDark: Story = presetExports["SlackDark"] as Story;
export const PastelDreamsLight: Story = presetExports[
  "PastelDreamsLight"
] as Story;
export const PastelDreamsDark: Story = presetExports[
  "PastelDreamsDark"
] as Story;
