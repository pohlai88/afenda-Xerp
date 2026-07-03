import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { ThemeProvider } from "next-themes";

import StatisticsCard01Block from "../components-layouts/statistics-card-01.js";
import StatisticsCard02Block from "../components-layouts/statistics-card-02.js";
import StatisticsCard03Block from "../components-layouts/statistics-card-03.js";
import StatisticsCard04Block from "../components-layouts/statistics-card-04.js";
import { SettingsProvider } from "../theme/settings-context.js";
import { ThemeCustomizer } from "../theme/theme-customizer.js";
import {
  THEME_PRESET_SLUGS,
  type ThemePresetSlug,
} from "../theme/theme-preset.contract.js";
import { themePresets } from "../theme/theme-presets.js";

/** Self-contained preview for Storybook autodocs `meta.component` (docs iframe skips decorators). */
export function ThemeCustomizerDocumentationPreview() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
    >
      <SettingsProvider initial={{ themePreset: "default", mode: "light" }}>
        <ThemeCustomizer />
      </SettingsProvider>
    </ThemeProvider>
  );
}

function TotalOrdersCardSvg() {
  return (
    <svg
      aria-hidden
      className="size-4 text-primary"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 18h16M6 14h12M8 10h8M10 6h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

/** MCP statistics-component grid (statistics-card-01…04) for token verification. */
export function ThemePreviewStatisticsGrid() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
      <StatisticsCard01Block
        changePercentage="+12.5%"
        icon={<DollarSign className="size-4" />}
        title="Total revenue"
        value="$45,231"
      />
      <StatisticsCard02Block
        changePercentage={18}
        icon={<Users className="size-4" />}
        title="Active users"
        value="8,420"
      />
      <StatisticsCard03Block
        badgeContent="Monthly"
        changePercentage="+6.2%"
        icon={<ShoppingCart className="size-4" />}
        title="Orders"
        trend="up"
        value="1,284"
      />
      <StatisticsCard04Block
        badgeContent="Monthly"
        changePercentage={4.8}
        svg={<TotalOrdersCardSvg />}
        title="Conversion rate"
        value="3.42%"
      />
    </div>
  );
}

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
        <div className="flex min-w-48 flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <span
              aria-hidden
              className="size-3 shrink-0 rounded-full border border-border"
              style={{ background: primary }}
            />
            <span className="font-medium text-sm">{label}</span>
          </div>
          <StatisticsCard01Block
            changePercentage="+8.4%"
            icon={<TrendingUp className="size-4" />}
            title="Sample KPI"
            value="$12,480"
          />
        </div>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export function PresetMatrix({ colorMode }: { colorMode: "light" | "dark" }) {
  return (
    <div className="grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-start">
      <ThemeCustomizer />
      <div className="flex w-full min-w-0 flex-col gap-4">
        <div>
          <p className="font-medium">MCP statistics preview</p>
          <p className="max-w-xl text-muted-foreground text-sm">
            Live @ss-blocks statistics-component inventory (statistics-card-01
            through 04). Adjust preset, mode, and radius — tokens apply via
            SettingsProvider.
          </p>
        </div>
        <ThemePreviewStatisticsGrid />
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
