import type { Settings } from "./settings.contract.js";
import { themeConfig } from "./theme-config.js";
import {
  isThemeLayout,
  isThemeMode,
  isThemePresetSlug,
  isThemeRadius,
  isThemeScale,
  isThemeSidebarCollapsible,
  isThemeSidebarVariant,
  isThemeFont,
} from "./theme-preset.contract.js";

/** JSON-safe subset persisted to localStorage (boundary contract). */
export type StoredSettings = Settings;

function readRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  return value as Record<string, unknown>;
}

/** Fail-closed parse for localStorage payloads — ignores unknown or invalid keys. */
export function parseStoredSettings(raw: string): Partial<Settings> | null {
  try {
    const record = readRecord(JSON.parse(raw));

    if (record === null) {
      return null;
    }

    const partial: Partial<Settings> = {};

    if (typeof record["mode"] === "string" && isThemeMode(record["mode"])) {
      partial.mode = record["mode"];
    }

    if (
      typeof record["themePreset"] === "string" &&
      isThemePresetSlug(record["themePreset"])
    ) {
      partial.themePreset = record["themePreset"];
    }

    if (
      typeof record["radius"] === "string" &&
      isThemeRadius(record["radius"])
    ) {
      partial.radius = record["radius"];
    }

    if (typeof record["scale"] === "string" && isThemeScale(record["scale"])) {
      partial.scale = record["scale"];
    }

    if (
      typeof record["layout"] === "string" &&
      isThemeLayout(record["layout"])
    ) {
      partial.layout = record["layout"];
    }

    if (
      typeof record["sidebarVariant"] === "string" &&
      isThemeSidebarVariant(record["sidebarVariant"])
    ) {
      partial.sidebarVariant = record["sidebarVariant"];
    }

    if (
      typeof record["sidebarCollapsible"] === "string" &&
      isThemeSidebarCollapsible(record["sidebarCollapsible"])
    ) {
      partial.sidebarCollapsible = record["sidebarCollapsible"];
    }

    if (typeof record["sidebarOpen"] === "boolean") {
      partial.sidebarOpen = record["sidebarOpen"];
    }

    if (typeof record["font"] === "string" && isThemeFont(record["font"])) {
      partial.font = record["font"];
    }

    return partial;
  } catch {
    return null;
  }
}

export function readStoredSettings(): Partial<Settings> | undefined {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(themeConfig.settingsStorageKey);

  if (raw === null) {
    return;
  }

  return parseStoredSettings(raw) ?? undefined;
}

export function serializeSettings(settings: Settings): string {
  return JSON.stringify(settings satisfies StoredSettings);
}
