/**
 * PAS-API-001 — API style binding registry (family layer).
 * REST is the active binding; other styles are reserved per North Star §0.2.
 */

export type ApiStyleBinding =
  | { readonly kind: "rest"; readonly status: "active" }
  | { readonly kind: "rpc"; readonly status: "reserved" }
  | { readonly kind: "graphql"; readonly status: "reserved" }
  | { readonly kind: "event"; readonly status: "reserved" }
  | { readonly kind: "agent"; readonly status: "reserved" };

export const API_STYLE_BINDINGS = {
  agent: { kind: "agent", status: "reserved" },
  event: { kind: "event", status: "reserved" },
  graphql: { kind: "graphql", status: "reserved" },
  rest: { kind: "rest", status: "active" },
  rpc: { kind: "rpc", status: "reserved" },
} as const satisfies {
  readonly agent: { readonly kind: "agent"; readonly status: "reserved" };
  readonly event: { readonly kind: "event"; readonly status: "reserved" };
  readonly graphql: { readonly kind: "graphql"; readonly status: "reserved" };
  readonly rest: { readonly kind: "rest"; readonly status: "active" };
  readonly rpc: { readonly kind: "rpc"; readonly status: "reserved" };
};

export type ApiStyleKind = keyof typeof API_STYLE_BINDINGS;

export function getActiveStyleBindings(): readonly ApiStyleBinding[] {
  return (Object.values(API_STYLE_BINDINGS) as ApiStyleBinding[]).filter(
    (binding) => binding.status === "active"
  );
}
