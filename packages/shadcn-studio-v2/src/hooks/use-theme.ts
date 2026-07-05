"use client";

import { useThemeContext } from "../contexts/ThemeProvider";

export function useTheme() {
  return useThemeContext();
}
