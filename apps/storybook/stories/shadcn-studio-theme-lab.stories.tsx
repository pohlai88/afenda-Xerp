import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "next-themes";

import {
  Button,
  SettingsProvider,
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioStoryA11y,
  shadcnStudioThemeLabDocs,
  THEME_PRESET_SLUGS,
  ThemeCustomizer,
  themePresets,
  type ThemePresetSlug,
} from "@afenda/shadcn-studio";
import { shadcnStudioThemeDecorator } from "./_storybook/shadcn-studio-decorators";

function PresetSwatch({
  slug,
  colorMode,
}: {
  slug: ThemePresetSlug;
  colorMode: "light" | "dark";
}) {
  const label =
    slug === "default"
      ? "Default"
      : themePresets[slug as keyof typeof themePresets].label;
  const primary =
    slug === "default"
      ? colorMode === "dark"
        ? "oklch(0.922 0 0)"
        : "oklch(0.205 0 0)"
      : (themePresets[slug as keyof typeof themePresets].styles[colorMode]
          .primary ?? "transparent");

  return (
    <ThemeProvider
      attribute="class"
      enableSystem={false}
      forcedTheme={colorMode}
    >
      <SettingsProvider initial={{ themePreset: slug, mode: colorMode }}>
        <div className="flex min-w-40 flex-col gap-2 rounded-md border border-border bg-card p-3 text-card-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-3 shrink-0 rounded-full border border-border"
              style={{ background: primary }}
            />
            <span className="font-medium text-sm">{label}</span>
          </div>
          <Button size="sm" type="button">
            Primary
          </Button>
        </div>
      </SettingsProvider>
    </ThemeProvider>
  );
}

function PresetMatrix({ colorMode }: { colorMode: "light" | "dark" }) {
  return (
    <div className="grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {THEME_PRESET_SLUGS.map((slug) => (
        <PresetSwatch
          colorMode={colorMode}
          key={`${slug}-${colorMode}`}
          slug={slug}
        />
      ))}
    </div>
  );
}

function ThemeCustomizerLabSurface() {
  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      <ThemeCustomizer />
      <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-4 text-card-foreground shadow-sm">
        <p className="font-medium">Sample surface</p>
        <p className="text-muted-foreground text-sm">
          Adjust preset, mode, and radius — tokens apply via SettingsProvider.
        </p>
        <Button type="button">Primary action</Button>
        <Button type="button" variant="secondary">
          Secondary
        </Button>
      </div>
    </div>
  );
}

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

function slugToExportName(
  slug: ThemePresetSlug,
  colorMode: "light" | "dark"
): string {
  const base =
    slug === "default"
      ? "Default"
      : slug
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("");
  return `${base}${colorMode === "light" ? "Light" : "Dark"}`;
}

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
    [slugToExportName(slug, "light"), createPresetStory(slug, "light")],
    [slugToExportName(slug, "dark"), createPresetStory(slug, "dark")],
  ])
) as Record<string, Story>;

export const DefaultLight = presetExports["DefaultLight"];
export const DefaultDark = presetExports["DefaultDark"];
export const CaffeineLight = presetExports["CaffeineLight"];
export const CaffeineDark = presetExports["CaffeineDark"];
export const ClaudeLight = presetExports["ClaudeLight"];
export const ClaudeDark = presetExports["ClaudeDark"];
export const CorporateLight = presetExports["CorporateLight"];
export const CorporateDark = presetExports["CorporateDark"];
export const GhibliStudioLight = presetExports["GhibliStudioLight"];
export const GhibliStudioDark = presetExports["GhibliStudioDark"];
export const MarvelLight = presetExports["MarvelLight"];
export const MarvelDark = presetExports["MarvelDark"];
export const MaterialDesignLight = presetExports["MaterialDesignLight"];
export const MaterialDesignDark = presetExports["MaterialDesignDark"];
export const ModernMinimalLight = presetExports["ModernMinimalLight"];
export const ModernMinimalDark = presetExports["ModernMinimalDark"];
export const NatureLight = presetExports["NatureLight"];
export const NatureDark = presetExports["NatureDark"];
export const PerplexityLight = presetExports["PerplexityLight"];
export const PerplexityDark = presetExports["PerplexityDark"];
export const SlackLight = presetExports["SlackLight"];
export const SlackDark = presetExports["SlackDark"];
export const PastelDreamsLight = presetExports["PastelDreamsLight"];
export const PastelDreamsDark = presetExports["PastelDreamsDark"];
