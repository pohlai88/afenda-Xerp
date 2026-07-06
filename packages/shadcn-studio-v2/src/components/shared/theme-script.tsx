import type { ComponentProps } from "react";
import {
  CANONICAL_THEME_TOKEN_NAMES,
  studioThemeConfig,
} from "../../configs/theme-config";
import type {
  StudioResolvedThemeMode,
  StudioThemeId,
  StudioThemeMode,
  StudioThemeOption,
  StudioThemeTokenName,
} from "../../types/theme";

export interface ThemeScriptProps
  extends Omit<
    ComponentProps<"script">,
    "children" | "dangerouslySetInnerHTML"
  > {
  readonly initialMode?: StudioThemeMode;
  readonly initialThemeId?: StudioThemeId;
  readonly lockedThemeId?: StudioThemeId;
  readonly storageKey?: string | null;
}

interface ThemeScriptPayload {
  readonly darkClassName: string;
  readonly defaultMode: StudioThemeMode;
  readonly defaultThemeId: StudioThemeId;
  readonly lockedThemeId?: StudioThemeId;
  readonly storageKey: string | null;
  readonly themes: readonly Pick<StudioThemeOption, "id" | "tokens">[];
  readonly themeTokenNames: readonly StudioThemeTokenName[];
}

function createThemeScript(payload: ThemeScriptPayload): string {
  const serializedPayload = JSON.stringify(payload);

  return `(() => {try {const config = ${serializedPayload};const root = document.documentElement;let mode = config.defaultMode;let themeId = config.lockedThemeId || config.defaultThemeId;if (config.storageKey) {const stored = window.localStorage.getItem(config.storageKey);if (stored) {const parsed = JSON.parse(stored);if (!config.lockedThemeId && config.themes.some((theme) => theme.id === parsed.themeId)) themeId = parsed.themeId;if (parsed.mode === "light" || parsed.mode === "dark" || parsed.mode === "system") mode = parsed.mode;}}const resolvedMode = mode === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode;root.classList.toggle(config.darkClassName, resolvedMode === "dark");for (const tokenName of config.themeTokenNames) root.style.removeProperty("--" + tokenName);if (themeId !== config.defaultThemeId) {const theme = config.themes.find((candidate) => candidate.id === themeId);const tokens = theme && theme.tokens[resolvedMode];if (tokens) {for (const tokenName of config.themeTokenNames) root.style.setProperty("--" + tokenName, tokens[tokenName]);}}} catch {}})();`;
}

export function ThemeScript({
  initialMode = studioThemeConfig.defaultMode,
  initialThemeId = studioThemeConfig.defaultThemeId,
  lockedThemeId,
  storageKey = studioThemeConfig.storageKey,
  ...props
}: ThemeScriptProps) {
  const themes = studioThemeConfig.themes.map((theme) => ({
    id: theme.id,
    tokens: theme.tokens satisfies Record<
      StudioResolvedThemeMode,
      Record<StudioThemeTokenName, string>
    >,
  }));
  const themeScript = createThemeScript({
    darkClassName: studioThemeConfig.darkClassName,
    defaultMode: initialMode,
    defaultThemeId: initialThemeId,
    ...(lockedThemeId === undefined ? {} : { lockedThemeId }),
    storageKey,
    themeTokenNames: CANONICAL_THEME_TOKEN_NAMES,
    themes,
  });

  return (
    <script {...props} data-slot="theme-script" suppressHydrationWarning={true}>
      {themeScript}
    </script>
  );
}
