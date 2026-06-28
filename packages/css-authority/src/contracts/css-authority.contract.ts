/**
 * PAS-005 — CSS Authority contract types (serializable only).
 * Authority JSON sources validate against these shapes; generator emits registry rows.
 */

export const CSS_TOKEN_ID_PATTERN = /^CSS-TOKEN-\d{3,}$/;

export const CSS_TOKEN_LIFECYCLES = [
  "experimental",
  "preview",
  "accepted",
  "stable",
  "deprecated",
  "removed",
] as const;

export type CssTokenLifecycle = (typeof CSS_TOKEN_LIFECYCLES)[number];

export const CSS_TOKEN_CATEGORIES = [
  "surface",
  "text",
  "border",
  "interactive",
  "feedback",
  "chart",
  "layout",
  "motion",
  "spacing",
  "radius",
  "shadow",
  "typography",
  "animation",
  "accessibility",
  "density",
] as const;

export type CssTokenCategory = (typeof CSS_TOKEN_CATEGORIES)[number];

/** Token authority domains merged into the CSS Authority Registry. */
export const CSS_TOKEN_AUTHORITY_DOMAINS = [
  "shadcn-theme",
  "afenda-extensions",
  "appshell",
  "auth-editorial",
] as const;

export type CssTokenAuthorityDomain =
  (typeof CSS_TOKEN_AUTHORITY_DOMAINS)[number];

/** @deprecated Use CSS_TOKEN_AUTHORITY_DOMAINS — css-files is a file inventory, not a token domain. */
export const CSS_AUTHORITY_DOMAINS = CSS_TOKEN_AUTHORITY_DOMAINS;

/** @deprecated Use CssTokenAuthorityDomain */
export type CssAuthorityDomain = CssTokenAuthorityDomain;

export interface CssAuthorityToken {
  readonly authority: CssTokenAuthorityDomain;
  readonly category: CssTokenCategory;
  readonly definesPackage?: string;
  readonly editable: boolean;
  readonly id: string;
  readonly introducedIn: string;
  readonly lifecycle: CssTokenLifecycle;
  readonly name: string;
  readonly owner: string;
  readonly parentId?: string;
  readonly reasoning?: string;
  readonly source: string;
}

export interface CssAuthorityDomainSource {
  readonly domain: CssTokenAuthorityDomain;
  readonly owner: string;
  readonly schemaVersion: number;
  readonly tokens: readonly CssAuthorityToken[];
}

export interface CssAuthorityIdSequence {
  readonly nextTokenId: number;
  readonly schemaVersion: number;
}

export interface CssAuthorityRegistry {
  readonly generatedAt: string;
  readonly schemaVersion: number;
  readonly tokens: readonly CssAuthorityToken[];
}

export interface CssAuthorityFileEntry {
  readonly definesPackage?: string;
  readonly introducedIn: string;
  readonly lifecycle: CssTokenLifecycle;
  readonly owner: string;
  readonly path: string;
}

export interface CssAuthorityFileRegistry {
  readonly files: readonly CssAuthorityFileEntry[];
  readonly owner: string;
  readonly schemaVersion: number;
}

export function isCssTokenLifecycle(value: string): value is CssTokenLifecycle {
  return (CSS_TOKEN_LIFECYCLES as readonly string[]).includes(value);
}

export function isCssTokenCategory(value: string): value is CssTokenCategory {
  return (CSS_TOKEN_CATEGORIES as readonly string[]).includes(value);
}

export function isCssTokenAuthorityDomain(
  value: string
): value is CssTokenAuthorityDomain {
  return (CSS_TOKEN_AUTHORITY_DOMAINS as readonly string[]).includes(value);
}

export function isCssTokenIdFormat(value: string): boolean {
  return CSS_TOKEN_ID_PATTERN.test(value);
}

export function assertCssTokenId(id: string): void {
  if (!isCssTokenIdFormat(id)) {
    throw new Error(`Invalid CSS token id "${id}" — expected CSS-TOKEN-NNN`);
  }
}
