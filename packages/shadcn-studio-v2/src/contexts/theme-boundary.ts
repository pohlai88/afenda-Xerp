"use client";

import { createElement, type ReactNode } from "react";
import { ThemeCustomizer as ThemeCustomizerComponent } from "../components/shared/theme-customizer";
import { ThemeScript as ThemeScriptComponent } from "../components/shared/theme-script";
import { ThemeToggle as ThemeToggleComponent } from "../components/shared/theme-toggle";
import { studioThemeConfig as studioThemeConfigValue } from "../configs/theme-config";
import { useStudio as useStudioHook } from "../hooks/use-studio";
import { useTheme as useThemeHook } from "../hooks/use-theme";
import { StudioProvider as StudioProviderComponent } from "./studio-provider";
import {
  ThemeProvider as ThemeProviderComponent,
  type ThemeProviderProps,
} from "./theme-provider";

export interface StudioPresentationProvidersProps
  extends Pick<
    ThemeProviderProps,
    "initialMode" | "initialThemeId" | "lockedThemeId" | "storageKey"
  > {
  readonly children: ReactNode;
}

export function StudioPresentationProviders({
  children,
  initialMode,
  initialThemeId,
  lockedThemeId,
  storageKey,
}: StudioPresentationProvidersProps) {
  const themeProviderProps: ThemeProviderProps = {
    children,
    ...(initialMode === undefined ? {} : { initialMode }),
    ...(initialThemeId === undefined ? {} : { initialThemeId }),
    ...(lockedThemeId === undefined ? {} : { lockedThemeId }),
    ...(storageKey === undefined ? {} : { storageKey }),
  };

  return createElement(
    StudioProviderComponent,
    undefined,
    createElement(ThemeProviderComponent, themeProviderProps)
  );
}

export type { ThemeCustomizerProps } from "../components/shared/theme-customizer";
export type { ThemeScriptProps } from "../components/shared/theme-script";
export type { ThemeToggleProps } from "../components/shared/theme-toggle";
export type {
  StudioResolvedThemeMode,
  StudioThemeConfig,
  StudioThemeId,
  StudioThemeMode,
  StudioThemeOption,
  StudioThemeState,
  StudioThemeTokenMap,
  StudioThemeTokenModeMap,
  StudioThemeTokenName,
  StudioThemeUpdate,
} from "../types/theme";
export type {
  StudioContextValue,
  StudioProviderProps,
} from "./studio-provider";
export type { ThemeProviderProps } from "./theme-provider";

export const ThemeCustomizer = ThemeCustomizerComponent;
export const ThemeScript = ThemeScriptComponent;
export const ThemeToggle = ThemeToggleComponent;
export const studioThemeConfig = studioThemeConfigValue;
export const useStudio = useStudioHook;
export const useTheme = useThemeHook;
export const StudioProvider = StudioProviderComponent;
export const ThemeProvider = ThemeProviderComponent;
