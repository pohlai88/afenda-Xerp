"use client";

import {
  type ThemeContextValue,
  useThemeContext,
} from "../contexts/theme-provider";

export function useTheme(): ThemeContextValue {
  return useThemeContext();
}
