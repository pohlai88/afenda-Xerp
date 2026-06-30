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

import {
  applyThemePresetStyles,
  type ResolvedColorMode,
} from "./apply-theme-preset.js";
import { initialSettings, type Settings } from "./settings.contract.js";
import { readStoredSettings, serializeSettings } from "./settings-storage.js";
import { themeConfig } from "./theme-config.js";
import {
  assertThemePresetSlug,
  isThemeLayout,
  isThemeSidebarCollapsible,
  isThemeSidebarVariant,
  RADIUS_VALUES,
} from "./theme-preset.contract.js";

export type { Settings } from "./settings.contract.js";
export { initialSettings } from "./settings.contract.js";

export interface SettingsContextValue {
  resetSettings: () => void;
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function resolveColorMode(
  resolvedTheme: string | undefined
): ResolvedColorMode {
  return resolvedTheme === "dark" ? "dark" : "light";
}

function syncPresentationAttributes(
  root: HTMLElement,
  settings: Settings,
  colorMode: ResolvedColorMode
): void {
  applyThemePresetStyles(root, settings.themePreset, colorMode);
  root.style.setProperty("--radius", RADIUS_VALUES[settings.radius]);

  if (settings.scale === "md") {
    root.removeAttribute("data-theme-scale");
  } else {
    root.setAttribute("data-theme-scale", settings.scale);
  }

  root.setAttribute("data-content-layout", settings.layout);
  root.setAttribute("data-sidebar-variant", settings.sidebarVariant);
  root.setAttribute("data-sidebar-collapsible", settings.sidebarCollapsible);
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
    syncPresentationAttributes(
      document.documentElement,
      settings,
      resolveColorMode(resolvedTheme)
    );
  }, [settings, resolvedTheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      themeConfig.settingsStorageKey,
      serializeSettings(settings)
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
