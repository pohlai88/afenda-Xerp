import { createElement, type ReactNode } from "react";
import { ThemeScript as ThemeScriptComponent } from "../components/shared/ThemeScript";
import { ThemeToggle as ThemeToggleComponent } from "../components/shared/ThemeToggle";
import { studioThemeConfig as studioThemeConfigValue } from "../configs/theme-config";
import { useStudio as useStudioHook } from "../hooks/use-studio";
import { useTheme as useThemeHook } from "../hooks/use-theme";
import { StudioProvider as StudioProviderComponent } from "./StudioProvider";
import { ThemeProvider as ThemeProviderComponent } from "./ThemeProvider";

export interface ErpPresentationProvidersProps {
  readonly children: ReactNode;
}

export function ErpPresentationProviders({
  children,
}: ErpPresentationProvidersProps) {
  return createElement(
    StudioProviderComponent,
    undefined,
    createElement(ThemeProviderComponent, undefined, children)
  );
}

export type { ThemeScriptProps } from "../components/shared/ThemeScript";
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
export type {
  StudioContextValue,
  StudioProviderProps,
} from "./StudioProvider";
export type { ThemeProviderProps } from "./ThemeProvider";

export const ThemeScript = ThemeScriptComponent;
export const ThemeToggle = ThemeToggleComponent;
export const studioThemeConfig = studioThemeConfigValue;
export const useStudio = useStudioHook;
export const useTheme = useThemeHook;
export const StudioProvider = StudioProviderComponent;
export const ThemeProvider = ThemeProviderComponent;
