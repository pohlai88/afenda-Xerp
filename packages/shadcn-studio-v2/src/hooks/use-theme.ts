"use client";

import {
  type ThemeContextValue,
  useThemeContext,
} from "../contexts/ThemeProvider";

export function useTheme(): ThemeContextValue {
  return useThemeContext();
}
