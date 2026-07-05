"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { SettingsProvider } from "./theme-runtime.settings-provider.js";

export interface ErpPresentationProvidersProps {
  readonly children: ReactNode;
}

/** Theme + settings providers for ERP and Storybook lab shells (PAS-006). */
export function ErpPresentationProviders({
  children,
}: ErpPresentationProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <SettingsProvider>{children}</SettingsProvider>
    </ThemeProvider>
  );
}
