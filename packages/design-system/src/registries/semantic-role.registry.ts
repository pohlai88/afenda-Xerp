import { AFENDA_TOKEN_REGISTRY } from "./token.registry";

/** Lifecycle states for governed design tokens and recipes. */
export const TOKEN_LIFECYCLE = {
  stable: "stable",
  deprecated: "deprecated",
  experimental: "experimental",
} as const;

export type TokenLifecycle = (typeof TOKEN_LIFECYCLE)[keyof typeof TOKEN_LIFECYCLE];

export interface SemanticRoleEntry {
  readonly category: string;
  readonly cssVariable: string;
  readonly description: string;
  readonly key: string;
  readonly lifecycle: TokenLifecycle;
  readonly owner: "@afenda/design-system";
  readonly token: string;
  readonly value: string;
}

const SEMANTIC_PREFIX = "afenda.semantic.";

function buildSemanticRoles(): readonly SemanticRoleEntry[] {
  return AFENDA_TOKEN_REGISTRY.tokens
    .filter((token) => token.name.startsWith(SEMANTIC_PREFIX))
    .map((token) => ({
      key: token.name,
      category: token.category,
      description: token.description,
      cssVariable: token.cssVariable,
      value: token.value,
      lifecycle: token.stable ? TOKEN_LIFECYCLE.stable : TOKEN_LIFECYCLE.experimental,
      owner: "@afenda/design-system" as const,
      token: token.name,
    }));
}

/** Canonical semantic role registry — maps role names to governed tokens. */
export const AFENDA_SEMANTIC_ROLE_REGISTRY = {
  roles: buildSemanticRoles(),
  prefixes: {
    semantic: SEMANTIC_PREFIX,
    table: "afenda.table.",
    formField: "afenda.form-field.",
  },
} as const;

export type AfendaSemanticRoleRegistry = typeof AFENDA_SEMANTIC_ROLE_REGISTRY;
