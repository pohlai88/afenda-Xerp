/**
 * Auth Pattern Lab SSOT — sign-in design patterns (Phase A, L4 only).
 * Primary login candidates (Swiss / Verdant) plus reference layouts P1–P6.
 * Orthogonal to auth lanes (access/verify/recover/error).
 */

export type AuthPatternId =
  | "swiss-noir-verification-gate"
  | "verdant-milk-identity-vault"
  | "verdant-centered-portal"
  | "swiss-noir-operator-rail"
  | "p1-noir-editorial"
  | "p2-split-product-proof"
  | "p3-centered-monolith"
  | "p4-operator-console"
  | "p5-immersive-brand"
  | "p6-bento-trust";

export type AuthPatternRegistryEntry = {
  readonly id: AuthPatternId;
  readonly label: string;
  readonly thesis: string;
  readonly layoutInvariant: string;
  readonly tone: string;
  readonly motion: string;
  readonly usesNoirPreset?: boolean;
};

export const AUTH_PATTERN_LAB_REGISTRY = [
  {
    id: "swiss-noir-verification-gate",
    label: "Swiss Noir Sign In",
    thesis:
      "Quiet editorial sign-in — Control Room orb and scale with a compact credential jewel, minimal copy.",
    layoutInvariant: "Editorial hero + floating side panel (no proof strip)",
    tone: "Cinematic, calm authority",
    motion: "Orb atmosphere, serif panel line, brutal quiet scale",
  },
  {
    id: "verdant-milk-identity-vault",
    label: "Verdant Milk Sign In",
    thesis:
      "Long-hour calm sign-in — ghost hero, milk typography, gold hairline jewel, almost no copy.",
    layoutInvariant: "Ghost hero + floating jewel panel (no proof strip)",
    tone: "Premium, quiet, enterprise-durable",
    motion: "Vignette, jewel elevation, hairline threshold",
  },
  {
    id: "verdant-centered-portal",
    label: "Verdant Centered Portal",
    thesis:
      "Control Room ghost hero beside a gold-hairline portal vault — long-word typographic fill, laptop-fit, no proof strip.",
    layoutInvariant: "Ghost hero left + portal vault right (laptop-fit, no side jewel)",
    tone: "Calm threshold, vertical focus, long-hour readable",
    motion: "Vignette depth, portal elevation, hairline threshold ring",
  },
  {
    id: "swiss-noir-operator-rail",
    label: "Swiss Noir Operator Rail",
    thesis:
      "Industrial operator ingress — narrow mono credential rail beside a live governance readout; telemetry is the hero, not a decorative hero word.",
    layoutInvariant: "Narrow access rail + system readout column (no orb, no jewel)",
    tone: "Industrial ERP operator, mono discipline",
    motion: "Scan grid, status ticks, monospace readout rhythm",
  },
  {
    id: "p1-noir-editorial",
    label: "Noir Editorial",
    thesis:
      "Cinematic hero typography owns the canvas while a floating jewel panel carries access — dark editorial, not a rearranged split.",
    layoutInvariant: "Hero typography left + floating jewel panel right",
    tone: "Editorial, cinematic",
    motion: "Orb drift, hairline borders, serif/mono rhythm",
    usesNoirPreset: true,
  },
  {
    id: "p2-split-product-proof",
    label: "Split Product Proof",
    thesis:
      "Classic enterprise SaaS 50/50 — product preview proves value on a light marketing column beside a calm form stack.",
    layoutInvariant: "50/50 marketing preview + form column",
    tone: "Classic enterprise SaaS",
    motion: "Static product frame, stock shadcn elevation",
  },
  {
    id: "p3-centered-monolith",
    label: "Centered Monolith",
    thesis:
      "One centered card on a quiet canvas — hierarchy lives in whitespace and a single focal panel, not grid complexity.",
    layoutInvariant: "Single centered card on quiet canvas",
    tone: "Refined minimal",
    motion: "Subtle shadow lift, no ambient motion",
  },
  {
    id: "p4-operator-console",
    label: "Operator Console",
    thesis:
      "Industrial mono readout column frames a narrow credential rail — governance telemetry is the hero, not decoration.",
    layoutInvariant: "Narrow form rail + live system readout column",
    tone: "Industrial ERP operator",
    motion: "Blinking status ticks, monospace scan lines",
  },
  {
    id: "p5-immersive-brand",
    label: "Immersive Brand",
    thesis:
      "Full-bleed brand imagery sets atmosphere; credentials anchor in a bottom sheet so the brand moment stays primary.",
    layoutInvariant: "Full-bleed imagery + bottom-anchored sheet",
    tone: "Bold brand immersion",
    motion: "Parallax-ready hero, sheet slide-in affordance",
  },
  {
    id: "p6-bento-trust",
    label: "Bento Trust",
    thesis:
      "Asymmetric bento grid pairs access with trust/KPI tiles — confidence is distributed across the grid, not a sidebar.",
    layoutInvariant: "Asymmetric bento: form cell + trust/KPI tiles",
    tone: "Calm confidence",
    motion: "Tile hover lift, staggered KPI emphasis",
  },
] as const satisfies readonly AuthPatternRegistryEntry[];

export const AUTH_PATTERN_IDS = AUTH_PATTERN_LAB_REGISTRY.map(
  (entry) => entry.id
);

export function getAuthPatternEntry(
  patternId: AuthPatternId
): AuthPatternRegistryEntry {
  const entry = AUTH_PATTERN_LAB_REGISTRY.find(
    (candidate) => candidate.id === patternId
  );

  if (!entry) {
    throw new Error(`Unknown auth pattern: ${patternId}`);
  }

  return entry;
}

export function isAuthPatternId(value: string): value is AuthPatternId {
  return (AUTH_PATTERN_IDS as readonly string[]).includes(value);
}
