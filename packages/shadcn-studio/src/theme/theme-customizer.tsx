"use client";

import { useTheme } from "next-themes";

import { useSettings } from "./settings-context.js";
import {
  NAMED_THEME_PRESET_SLUGS,
  RADIUS_VALUES,
  THEME_LAYOUTS,
  THEME_SIDEBAR_COLLAPSIBLES,
  THEME_SIDEBAR_VARIANTS,
  type ThemeMode,
  type ThemePresetSlug,
  type ThemeRadius,
  type ThemeScale,
} from "./theme-preset.contract.js";
import { themePresets } from "./theme-presets.js";

const MODES: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const RADII: { value: ThemeRadius; label: string }[] = [
  { value: "none", label: "None" },
  { value: "sm", label: "SM" },
  { value: "md", label: "MD" },
  { value: "lg", label: "LG" },
];

const SCALES: { value: ThemeScale; label: string }[] = [
  { value: "sm", label: "SM" },
  { value: "md", label: "MD" },
  { value: "lg", label: "LG" },
];

const DEFAULT_PRIMARY: Record<"light" | "dark", string> = {
  light: "oklch(0.205 0 0)",
  dark: "oklch(0.922 0 0)",
};

function RadioGrid<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  onChange: (value: T) => void;
  options: { value: T; label: string; title?: string }[];
  value: T;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-medium">{legend}</legend>
      <div className="grid grid-cols-3 gap-1">
        {options.map((option) => (
          <label
            className="flex cursor-pointer items-center justify-center rounded-md border border-border px-2 py-2 has-checked:bg-accent"
            key={option.value}
            title={option.title}
          >
            <input
              checked={value === option.value}
              className="sr-only"
              name={name}
              onChange={() => onChange(option.value)}
              type="radio"
              value={option.value}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ThemeCustomizer() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { resolvedTheme } = useTheme();
  const colorMode = resolvedTheme === "dark" ? "dark" : "light";

  const activePreset =
    settings.themePreset === "default"
      ? null
      : themePresets[settings.themePreset];

  const activePrimaryColor =
    activePreset?.styles[colorMode].primary ?? DEFAULT_PRIMARY[colorMode];
  const activeLabel = activePreset?.label ?? "Default";

  return (
    <section
      aria-label="Theme customizer"
      className="flex max-h-[min(32rem,80vh)] w-72 flex-col gap-4 overflow-y-auto rounded-md border border-border bg-popover p-4 text-popover-foreground text-sm shadow-md"
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-medium text-lg">Theme Customizer</h2>
          <p className="text-muted-foreground text-sm">
            Preset, layout, sidebar, and density.
          </p>
        </div>
        <button
          className="rounded-md border border-border px-2 py-1 text-xs"
          onClick={() => resetSettings()}
          type="button"
        >
          Reset
        </button>
      </header>

      <label className="flex flex-col gap-1">
        <span className="font-medium">Theme Preset</span>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: activePrimaryColor }}
          />
          <select
            className="w-full rounded-md border border-border bg-background px-2 py-1.5"
            onChange={(event) =>
              updateSettings({
                themePreset: event.target.value as ThemePresetSlug,
              })
            }
            value={settings.themePreset}
          >
            <option value="default">Default</option>
            {NAMED_THEME_PRESET_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {themePresets[slug].label}
              </option>
            ))}
          </select>
        </div>
        <span className="text-muted-foreground text-xs">
          Active: {activeLabel}
        </span>
      </label>

      <RadioGrid
        legend="Color Mode"
        name="theme-mode"
        onChange={(value) => updateSettings({ mode: value })}
        options={MODES}
        value={settings.mode}
      />

      <RadioGrid
        legend="Radius"
        name="theme-radius"
        onChange={(value) => updateSettings({ radius: value })}
        options={RADII.map((entry) => ({
          ...entry,
          title: RADIUS_VALUES[entry.value],
        }))}
        value={settings.radius}
      />

      <RadioGrid
        legend="Scale"
        name="theme-scale"
        onChange={(value) => updateSettings({ scale: value })}
        options={SCALES}
        value={settings.scale}
      />

      <RadioGrid
        legend="Content layout"
        name="theme-layout"
        onChange={(value) => updateSettings({ layout: value })}
        options={THEME_LAYOUTS.map((layout) => ({
          label: layout === "compact" ? "Compact" : "Full",
          value: layout,
        }))}
        value={settings.layout}
      />

      <RadioGrid
        legend="Sidebar variant"
        name="theme-sidebar-variant"
        onChange={(value) => updateSettings({ sidebarVariant: value })}
        options={THEME_SIDEBAR_VARIANTS.map((variant) => ({
          label:
            variant === "default"
              ? "Default"
              : variant.charAt(0).toUpperCase() + variant.slice(1),
          value: variant,
        }))}
        value={settings.sidebarVariant}
      />

      <RadioGrid
        legend="Sidebar collapse"
        name="theme-sidebar-collapsible"
        onChange={(value) => updateSettings({ sidebarCollapsible: value })}
        options={THEME_SIDEBAR_COLLAPSIBLES.map((mode) => ({
          label: mode.charAt(0).toUpperCase() + mode.slice(1),
          value: mode,
        }))}
        value={settings.sidebarCollapsible}
      />

      <label className="flex items-center gap-2">
        <input
          checked={settings.sidebarOpen}
          onChange={(event) =>
            updateSettings({ sidebarOpen: event.target.checked })
          }
          type="checkbox"
        />
        <span>Sidebar open by default</span>
      </label>
    </section>
  );
}
