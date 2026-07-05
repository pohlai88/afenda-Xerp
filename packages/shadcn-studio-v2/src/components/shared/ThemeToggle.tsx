// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { studioThemeConfig } from "../../configs/theme-config";
import { useTheme } from "../../hooks/use-theme";
import type { StudioThemeMode } from "../../types/theme";
import { Button } from "../ui/Button";

const THEME_MODE_SEQUENCE: readonly StudioThemeMode[] = [
  "light",
  "dark",
  "system",
];

function getNextThemeMode(currentMode: StudioThemeMode): StudioThemeMode {
  const currentIndex = THEME_MODE_SEQUENCE.indexOf(currentMode);
  const nextIndex = (currentIndex + 1) % THEME_MODE_SEQUENCE.length;

  return THEME_MODE_SEQUENCE[nextIndex] ?? studioThemeConfig.defaultMode;
}

export interface ThemeToggleProps {
  readonly className?: string;
  readonly label?: string;
}

export function ThemeToggle({
  className,
  label = "Toggle theme",
}: ThemeToggleProps) {
  const { mode, resolvedMode, setTheme, themeId } = useTheme();
  const nextMode = getNextThemeMode(mode);

  return (
    <Button
      aria-label={label}
      className={className}
      data-mode={mode}
      data-resolved-mode={resolvedMode}
      data-theme-id={themeId}
      onClick={() => setTheme({ mode: nextMode })}
      type="button"
      variant="outline"
    >
      {mode}
    </Button>
  );
}
