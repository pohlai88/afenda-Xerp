// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React context filenames.
"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import { studioPackageConfig } from "../configs/studio-config";
import { studioThemeConfig } from "../configs/theme-config";
import type { StudioPackageConfig, StudioRuntimeState } from "../types/studio";
import type { StudioThemeConfig } from "../types/theme";

export type StudioContextValue = StudioRuntimeState;

export interface StudioProviderProps {
  readonly children: ReactNode;
  readonly packageConfig?: StudioPackageConfig;
  readonly themeConfig?: StudioThemeConfig;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({
  children,
  packageConfig = studioPackageConfig,
  themeConfig = studioThemeConfig,
}: StudioProviderProps) {
  const value = useMemo<StudioContextValue>(
    () => ({
      packageConfig,
      themeConfig,
    }),
    [packageConfig, themeConfig]
  );

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  );
}

export function useStudioContext(): StudioContextValue {
  const context = useContext(StudioContext);

  if (!context) {
    throw new Error("useStudioContext must be used within StudioProvider.");
  }

  return context;
}
