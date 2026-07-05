import { createElement, type ReactNode } from "react";
import { ThemeToggle as ThemeToggleComponent } from "../components/shared/ThemeToggle";
import { studioThemeConfig as studioThemeConfigValue } from "../configs/theme-config";
import { useTheme as useThemeHook } from "../hooks/use-theme";
import { ThemeProvider as ThemeProviderComponent } from "./ThemeProvider";

export interface ErpPresentationProvidersProps {
  readonly children: ReactNode;
}

export function ErpPresentationProviders({
  children,
}: ErpPresentationProvidersProps) {
  return createElement(ThemeProviderComponent, undefined, children);
}

export type { ThemeToggleProps } from "../components/shared/ThemeToggle";
export type {
  StudioResolvedThemeMode,
  StudioThemeConfig,
  StudioThemeId,
  StudioThemeMode,
  StudioThemeOption,
  StudioThemeState,
  StudioThemeUpdate,
} from "../types/theme";
export type { ThemeProviderProps } from "./ThemeProvider";

export const ThemeToggle = ThemeToggleComponent;
export const studioThemeConfig = studioThemeConfigValue;
export const useTheme = useThemeHook;
export const ThemeProvider = ThemeProviderComponent;
