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
  RADIUS_VALUES,
  type ThemeFont,
  type ThemeMode,
  type ThemePresetSlug,
  type ThemeRadius,
  type ThemeScale,
} from "./theme-preset.contract.js";

export interface Settings {
  font: ThemeFont;
  mode: ThemeMode;
  radius: ThemeRadius;
  scale: ThemeScale;
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
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export interface SettingsProviderProps {
  children: ReactNode;
  initial?: Partial<Settings>;
}

export function SettingsProvider({ children, initial }: SettingsProviderProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(() => ({
    ...initialSettings,
    ...initial,
  }));

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    if (partial.themePreset !== undefined) {
      assertThemePresetSlug(partial.themePreset);
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
