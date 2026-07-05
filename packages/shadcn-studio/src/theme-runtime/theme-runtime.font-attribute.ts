import type { ThemeFont } from "../theme-config/config.preset.contract.js";

/** Human labels for ThemeCustomizer and inventory docs. */
export const THEME_FONT_LABELS: Record<ThemeFont, string> = {
  geist: "Geist",
  inter: "Inter",
  system: "System UI",
};

/**
 * Runtime font stacks applied via `[data-theme-font]` on `documentElement`.
 * `--font-geist-*` vars are optional (Next.js `next/font`); fallbacks keep Storybook working.
 */
export const THEME_FONT_STACKS = {
  geist: {
    sans: 'var(--font-geist-sans, "Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif)',
    mono: 'var(--font-geist-mono, "Geist Mono", "Geist Mono Fallback", ui-monospace, monospace)',
    heading:
      'var(--font-geist-sans, "Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif)',
  },
  inter: {
    sans: 'var(--font-inter, "Inter", ui-sans-serif, system-ui, sans-serif)',
    mono: 'ui-monospace, "Cascadia Code", "Segoe UI Mono", monospace',
    heading: 'var(--font-inter, "Inter", ui-sans-serif, system-ui, sans-serif)',
  },
  system: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'ui-monospace, "Cascadia Code", "Segoe UI Mono", monospace',
    heading:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
} as const satisfies Record<
  ThemeFont,
  { sans: string; mono: string; heading: string }
>;

export function syncThemeFontAttribute(
  root: HTMLElement,
  font: ThemeFont
): void {
  root.setAttribute("data-theme-font", font);
}
