import { ThemeProvider } from "next-themes";
import { DollarSign } from "lucide-react";

import StatisticsCard01Block from "../components/shadcn-studio/blocks/statistics-card-01.js";
import { Button } from "../components/ui/button.js";
import { SettingsProvider } from "../theme/settings-context.js";
import { ThemeCustomizer } from "../theme/theme-customizer.js";
import {
  THEME_PRESET_SLUGS,
  type ThemePresetSlug,
} from "../theme/theme-preset.contract.js";
import { themePresets } from "../theme/theme-presets.js";

export function PresetSwatch({
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

export function PresetMatrix({ colorMode }: { colorMode: "light" | "dark" }) {
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

export function ThemeCustomizerLabSurface() {
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

export function StatisticsCardSample() {
  return (
    <StatisticsCard01Block
      changePercentage="+12.5%"
      icon={<DollarSign className="size-4" />}
      title="Total revenue"
      value="$45,231"
    />
  );
}

export function slugToPresetStoryExportName(
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
