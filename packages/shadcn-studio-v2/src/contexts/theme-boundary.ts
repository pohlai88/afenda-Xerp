"use client";

import { createElement, type ReactNode } from "react";
import { ThemeScript as ThemeScriptComponent } from "../components/shared/ThemeScript";
import { ThemeToggle as ThemeToggleComponent } from "../components/shared/ThemeToggle";
import { ThemeCustomizer as ThemeCustomizerComponent } from "../components/shared/theme-customizer";
import { studioThemeConfig as studioThemeConfigValue } from "../configs/theme-config";
import { useStudio as useStudioHook } from "../hooks/use-studio";
import { useTheme as useThemeHook } from "../hooks/use-theme";
import { StudioProvider as StudioProviderComponent } from "./StudioProvider";
import {
  ThemeProvider as ThemeProviderComponent,
  type ThemeProviderProps,
} from "./ThemeProvider";

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

export type { ThemeScriptProps } from "../components/shared/ThemeScript";
export type { ThemeToggleProps } from "../components/shared/ThemeToggle";
export type { ThemeCustomizerProps } from "../components/shared/theme-customizer";
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
} from "./StudioProvider";
export type { ThemeProviderProps } from "./ThemeProvider";

export const ThemeCustomizer = ThemeCustomizerComponent;
export const ThemeScript = ThemeScriptComponent;
export const ThemeToggle = ThemeToggleComponent;
export const studioThemeConfig = studioThemeConfigValue;
export const useStudio = useStudioHook;
export const useTheme = useThemeHook;
export const StudioProvider = StudioProviderComponent;
export const ThemeProvider = ThemeProviderComponent;
