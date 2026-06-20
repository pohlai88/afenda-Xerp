import type { AfendaTokenName } from "../tokens/registry.js";

export type AfendaTokenCssVariable = `--token-${string}`;

/**
 * Converts a dot-namespaced token name to a CSS custom property.
 *
 * Dots become dashes and camelCase word boundaries are expanded to kebab-case
 * so that all generated properties use standard all-lowercase-kebab format:
 *   "color.surface.canvas"       → "--token-color-surface-canvas"
 *   "statusTone.neutral.surface" → "--token-status-tone-neutral-surface"
 */
export function tokenNameToCssVariable(name: AfendaTokenName): AfendaTokenCssVariable {
  const kebab = name
    .replaceAll(".", "-")
    .replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
  return `--token-${kebab}`;
}
