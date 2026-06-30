"use client";

import { useTheme } from "next-themes";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { applyThemePresetStyles } from "./apply-theme-preset.js";
import themeConfig from "./theme-config.js";
import {
  assertThemePresetSlug,
  isThemeLayout,
  isThemeSidebarCollapsible,
  isThemeSidebarVariant,
  RADIUS_VALUES,
  type ThemeFont,
  type ThemeLayout,
  type ThemeMode,
  type ThemePresetSlug,
  type ThemeRadius,
  type ThemeScale,
  type ThemeSidebarCollapsible,
  type ThemeSidebarVariant,
} from "./theme-preset.contract.js";

export interface Settings {
  font: ThemeFont;
  layout: ThemeLayout;
  mode: ThemeMode;
  radius: ThemeRadius;
  scale: ThemeScale;
  sidebarCollapsible: ThemeSidebarCollapsible;
  sidebarOpen: boolean;
  sidebarVariant: ThemeSidebarVariant;
  themePreset: ThemePresetSlug;
}

export interface SettingsContextValue {
  resetSettings: () => void;
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

export const initialSettings: Settings = {
  mode: themeConfig.mode,
  themePreset: themeConfig.themePreset,
  font: themeConfig.font,
  radius: themeConfig.radius,
  scale: themeConfig.scale,
  layout: themeConfig.layout,
  sidebarVariant: themeConfig.sidebarVariant,
  sidebarCollapsible: themeConfig.sidebarCollapsible,
  sidebarOpen: themeConfig.sidebarOpen,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function parseStoredSettings(raw: string): Partial<Settings> | null {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    const partial: Partial<Settings> = {};

    if (typeof record["mode"] === "string") {
      partial.mode = record["mode"] as ThemeMode;
    }

    if (typeof record["themePreset"] === "string") {
      partial.themePreset = record["themePreset"] as ThemePresetSlug;
    }

    if (typeof record["radius"] === "string") {
      partial.radius = record["radius"] as ThemeRadius;
    }

    if (typeof record["scale"] === "string") {
      partial.scale = record["scale"] as ThemeScale;
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

    return partial;
  } catch {
    return null;
  }
}

function readStoredSettings(): Partial<Settings> | undefined {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(themeConfig.settingsStorageKey);

  if (raw === null) {
    return;
  }

  return parseStoredSettings(raw) ?? undefined;
}

export interface SettingsProviderProps {
  children: ReactNode;
  initial?: Partial<Settings>;
}

export function SettingsProvider({ children, initial }: SettingsProviderProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(() => ({
    ...initialSettings,
    ...readStoredSettings(),
    ...initial,
  }));

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    if (partial.themePreset !== undefined) {
      assertThemePresetSlug(partial.themePreset);
    }

    if (partial.layout !== undefined && !isThemeLayout(partial.layout)) {
      throw new Error(`Invalid theme layout: "${partial.layout}"`);
    }

    if (
      partial.sidebarVariant !== undefined &&
      !isThemeSidebarVariant(partial.sidebarVariant)
    ) {
      throw new Error(`Invalid sidebar variant: "${partial.sidebarVariant}"`);
    }

    if (
      partial.sidebarCollapsible !== undefined &&
      !isThemeSidebarCollapsible(partial.sidebarCollapsible)
    ) {
      throw new Error(
        `Invalid sidebar collapsible: "${partial.sidebarCollapsible}"`
      );
    }

    setSettings((current) => ({ ...current, ...partial }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(initialSettings);
  }, []);

  useEffect(() => {
    setTheme(settings.mode);
  }, [settings.mode, setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    const colorMode = resolvedTheme === "dark" ? "dark" : "light";

    applyThemePresetStyles(root, settings.themePreset, colorMode);
  }, [settings.themePreset, resolvedTheme]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--radius",
      RADIUS_VALUES[settings.radius]
    );
  }, [settings.radius]);

  useEffect(() => {
    if (settings.scale === "md") {
      document.documentElement.removeAttribute("data-theme-scale");
    } else {
      document.documentElement.setAttribute("data-theme-scale", settings.scale);
    }
  }, [settings.scale]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-content-layout",
      settings.layout
    );
  }, [settings.layout]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-sidebar-variant",
      settings.sidebarVariant
    );
  }, [settings.sidebarVariant]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-sidebar-collapsible",
      settings.sidebarCollapsible
    );
  }, [settings.sidebarCollapsible]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      themeConfig.settingsStorageKey,
      JSON.stringify(settings)
    );
  }, [settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      updateSettings,
      resetSettings,
    }),
    [settings, updateSettings, resetSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);

  if (context === null) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}
