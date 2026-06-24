/**
 * Single source of truth for docs font CSS variables.
 * `docs-fonts.ts` next/font loaders must use these exact string literals
 * (`variable: "--font-docs-body"`) — Next.js rejects non-literal references.
 */
export const docsFontVariables = {
  body: "--font-docs-body",
  display: "--font-docs-display",
} as const;

export type DocsFontVariable =
  (typeof docsFontVariables)[keyof typeof docsFontVariables];

/** All loader `variable` literals — use in drift contract tests. */
export const docsFontVariableLiterals: readonly DocsFontVariable[] =
  Object.values(docsFontVariables);
