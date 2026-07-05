// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps } from "react";
import { studioThemeConfig } from "../../configs/theme-config";
import type { StudioThemeId, StudioThemeMode } from "../../types/theme";

export interface ThemeScriptProps
  extends Omit<
    ComponentProps<"script">,
    "children" | "dangerouslySetInnerHTML"
  > {
  readonly initialMode?: StudioThemeMode;
  readonly initialThemeId?: StudioThemeId;
  readonly storageKey?: string | null;
}

interface ThemeScriptPayload {
  readonly darkClassName: string;
  readonly defaultMode: StudioThemeMode;
  readonly defaultThemeId: StudioThemeId;
  readonly storageKey: string | null;
  readonly themeAttribute: string;
  readonly themeIds: readonly StudioThemeId[];
}

function createThemeScript(payload: ThemeScriptPayload): string {
  const serializedPayload = JSON.stringify(payload);

  return `(() => {try {const config = ${serializedPayload};const root = document.documentElement;let mode = config.defaultMode;let themeId = config.defaultThemeId;if (config.storageKey) {const stored = window.localStorage.getItem(config.storageKey);if (stored) {const parsed = JSON.parse(stored);if (config.themeIds.includes(parsed.themeId)) themeId = parsed.themeId;if (parsed.mode === "light" || parsed.mode === "dark" || parsed.mode === "system") mode = parsed.mode;}}const resolvedMode = mode === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode;root.setAttribute(config.themeAttribute, themeId);root.classList.toggle(config.darkClassName, resolvedMode === "dark");} catch {}})();`;
}

export function ThemeScript({
  initialMode = studioThemeConfig.defaultMode,
  initialThemeId = studioThemeConfig.defaultThemeId,
  storageKey = studioThemeConfig.storageKey,
  ...props
}: ThemeScriptProps) {
  const themeScript = createThemeScript({
    darkClassName: studioThemeConfig.darkClassName,
    defaultMode: initialMode,
    defaultThemeId: initialThemeId,
    storageKey,
    themeAttribute: studioThemeConfig.themeAttribute,
    themeIds: studioThemeConfig.themes.map((theme) => theme.id),
  });

  return (
    <script {...props} data-slot="theme-script" suppressHydrationWarning={true}>
      {themeScript}
    </script>
  );
}
