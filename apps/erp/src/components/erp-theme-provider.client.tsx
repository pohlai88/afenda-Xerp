"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function ErpThemeProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
