"use client";

import { useTheme } from "next-themes";

import { useSettings } from "./settings-context.js";
import {
  NAMED_THEME_PRESET_SLUGS,
  RADIUS_VALUES,
  type ThemeMode,
  type ThemePresetSlug,
  type ThemeRadius,
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

const DEFAULT_PRIMARY: Record<"light" | "dark", string> = {
  light: "oklch(0.205 0 0)",
  dark: "oklch(0.922 0 0)",
};

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
      className="flex w-72 flex-col gap-4 rounded-md border border-border bg-popover p-4 text-popover-foreground text-sm shadow-md"
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-medium text-lg">Theme Customizer</h2>
          <p className="text-muted-foreground text-sm">
            Customize preset, mode, and radius.
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

      <fieldset className="flex flex-col gap-2">
        <legend className="font-medium">Color Mode</legend>
        <div className="grid grid-cols-3 gap-1">
          {MODES.map(({ value, label }) => (
            <label
              className="flex cursor-pointer items-center justify-center rounded-md border border-border px-2 py-2 has-checked:bg-accent"
              key={value}
            >
              <input
                checked={settings.mode === value}
                className="sr-only"
                name="theme-mode"
                onChange={() => updateSettings({ mode: value })}
                type="radio"
                value={value}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-medium">Radius</legend>
        <div className="grid grid-cols-4 gap-1">
          {RADII.map(({ value, label }) => (
            <label
              className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-border px-2 py-2 has-checked:bg-accent"
              key={value}
              title={RADIUS_VALUES[value]}
            >
              <input
                checked={settings.radius === value}
                className="sr-only"
                name="theme-radius"
                onChange={() => updateSettings({ radius: value })}
                type="radio"
                value={value}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
