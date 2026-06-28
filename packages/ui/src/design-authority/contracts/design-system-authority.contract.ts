export const DESIGN_AUTHORITY_DOMAINS = [
  "token",
  "recipe",
  "variant",
  "component",
  "slot",
  "state",
  "motion",
  "accessibility",
  "classNamePolicy",
  "exportSurface",
  "examplePolicy",
] as const;

export type DesignAuthorityDomain = (typeof DESIGN_AUTHORITY_DOMAINS)[number];

export const GOVERNED_UI_DOWNSTREAM_CONTRACTS = [
  "token.contract.ts",
  "recipe.contract.ts",
  "component.contract.ts",
  "slot.contract.ts",
  "variant.contract.ts",
  "state.contract.ts",
  "motion.contract.ts",
  "accessibility.contract.ts",
  "export.contract.ts",
  "example.contract.ts",
  "class-name-policy.contract.ts",
] as const;

export type GovernedUiDownstreamContract =
  (typeof GOVERNED_UI_DOWNSTREAM_CONTRACTS)[number];

export interface DesignAuthorityIdentity {
  readonly contractId: "afenda.design-system.authority";
  readonly decisionAuthority: "ADR-governed Design System Authority";
  readonly downstreamContractsOwnedByGovernedUi: readonly GovernedUiDownstreamContract[];
  readonly owner: "Afenda Architecture Authority";
  readonly packageOwner: "@afenda/ui/design-authority";
  readonly relatedStandards: readonly ["PAS-005", "Governed UI"];
  readonly supersessionRule: "May be superseded only by accepted ADR and versioned authority contract update";
  readonly version: "0.1.0";
}

export interface OwnershipDomainAuthority {
  readonly boundary: string;
  readonly domain: DesignAuthorityDomain;
  readonly owner: string;
  readonly owns: string;
}

export interface ProhibitedOverlapRule {
  readonly id: string;
  readonly rule: string;
}

export interface AiAntiDriftRules {
  readonly may: readonly string[];
  readonly mayNot: readonly string[];
}

export interface DesignSystemPackageBoundary {
  readonly mayNotOwn: readonly string[];
  readonly mayOwn: readonly string[];
}

export interface DesignAuthorityAcceptanceCriteria {
  readonly given: "Foundation phase 03 is complete";
  readonly outcomes: readonly string[];
  readonly when: "future UI work begins";
}

export interface DesignSystemAuthorityContract {
  readonly acceptanceCriteria: DesignAuthorityAcceptanceCriteria;
  readonly aiAntiDriftRules: AiAntiDriftRules;
  readonly identity: DesignAuthorityIdentity;
  readonly immutability: {
    readonly rule: "Authority contract is immutable except by ADR";
    readonly mutationPath: "accepted ADR -> version bump -> contract update -> tests";
  };
  readonly ownershipDomains: readonly OwnershipDomainAuthority[];
  readonly packageBoundary: DesignSystemPackageBoundary;
  readonly prohibitedOverlap: readonly ProhibitedOverlapRule[];
}

const ownershipDomains = Object.freeze([
  {
    domain: "token",
    owner: "Governed UI token contract",
    owns: "Raw and semantic design values",
    boundary:
      "Tokens define values only; they do not define component behavior or layout recipes",
  },
  {
    domain: "recipe",
    owner: "Governed UI recipe contract",
    owns: "Styling composition from approved tokens and variants",
    boundary:
      "Recipes compose styling only; they do not invent behavior, state meaning, or accessibility rules",
  },
  {
    domain: "variant",
    owner: "Governed UI variant contract",
    owns: "Visual meaning and governed option vocabulary",
    boundary: "Variants name meaning only; they do not invent raw values",
  },
  {
    domain: "component",
    owner: "Governed UI component contract",
    owns: "Behavior and accessibility wiring",
    boundary:
      "Components consume tokens, variants, recipes, slots, states, and motion; they do not create them",
  },
  {
    domain: "slot",
    owner: "Governed UI slot contract",
    owns: "Component structure and named composition positions",
    boundary:
      "Slots define structure only; they do not invent styling or behavior",
  },
  {
    domain: "state",
    owner: "Governed UI state contract",
    owns: "UI state meaning for loading, empty, error, forbidden, invalid, and ready surfaces",
    boundary:
      "States define meaning only; data fetching and business workflows remain outside the design system",
  },
  {
    domain: "motion",
    owner: "Governed UI motion contract",
    owns: "Movement safety, duration intent, and reduced-motion obligations",
    boundary:
      "Motion defines safe movement rules only; it does not create component APIs",
  },
  {
    domain: "accessibility",
    owner: "Governed UI accessibility contract",
    owns: "Interaction safety, semantic obligations, keyboard reachability, focus, and announced state",
    boundary:
      "Accessibility rules govern UI interaction only; they do not own domain permissions",
  },
  {
    domain: "classNamePolicy",
    owner: "Governed UI class-name policy contract",
    owns: "Layout escape rules and prohibited semantic class overrides",
    boundary:
      "Class names may support layout only; they must not override design meaning",
  },
  {
    domain: "exportSurface",
    owner: "Governed UI export contract",
    owns: "Public access surface for approved design-system contracts and runtime values",
    boundary:
      "Export governance controls access only; it does not create design primitives",
  },
  {
    domain: "examplePolicy",
    owner: "Governed UI example contract",
    owns: "Approved AI imitation patterns and example provenance",
    boundary:
      "Examples demonstrate approved APIs only; they must not invent new APIs",
  },
] as const satisfies readonly OwnershipDomainAuthority[]);

const prohibitedOverlap = Object.freeze([
  {
    id: "components-must-not-invent-tokens",
    rule: "Components must not invent tokens",
  },
  {
    id: "recipes-must-not-invent-behavior",
    rule: "Recipes must not invent behavior",
  },
  {
    id: "variants-must-not-invent-raw-values",
    rule: "Variants must not invent raw values",
  },
  {
    id: "slots-must-not-invent-styling",
    rule: "Slots must not invent styling",
  },
  {
    id: "examples-must-not-invent-apis",
    rule: "Examples must not invent APIs",
  },
  {
    id: "class-name-must-not-override-design-meaning",
    rule: "className must not override design meaning",
  },
  {
    id: "apps-must-not-define-design-primitives",
    rule: "App packages must not define design primitives",
  },
  {
    id: "metadata-ui-must-not-bypass-authority",
    rule: "metadata-ui must not bypass design-system authority",
  },
  {
    id: "app-shell-must-not-invent-local-visual-rules",
    rule: "AppShell must not invent local visual rules",
  },
  {
    id: "business-modules-must-not-own-ui-governance",
    rule: "Business modules must not own UI governance",
  },
] as const satisfies readonly ProhibitedOverlapRule[]);

const aiMay = Object.freeze([
  "Consume exported contracts",
  "Extend only through approved contract surfaces",
  "Generate examples only from approved examples",
  "Implement UI only after Governed UI contracts exist",
] as const);

const aiMayNot = Object.freeze([
  "Invent tokens",
  "Invent variants",
  "Invent recipes",
  "Invent component behavior",
  "Invent class naming policy",
  "Infer ownership",
  "Create visual authority in app packages",
  "Duplicate design contracts in metadata-ui or apps",
] as const);

const packageMayOwn = Object.freeze([
  "Design authority contracts",
  "Token vocabulary",
  "Variant vocabulary",
  "Recipe authority",
  "Component responsibility boundaries",
  "Visual governance documentation",
] as const);

const packageMayNotOwn = Object.freeze([
  "ERP business rules",
  "Metadata rendering logic",
  "AppShell navigation logic",
  "Permission logic",
  "Database schema",
  "Domain workflows",
] as const);

export const designSystemAuthorityContract = Object.freeze({
  identity: Object.freeze({
    contractId: "afenda.design-system.authority",
    version: "0.1.0",
    owner: "Afenda Architecture Authority",
    packageOwner: "@afenda/ui/design-authority",
    decisionAuthority: "ADR-governed Design System Authority",
    supersessionRule:
      "May be superseded only by accepted ADR and versioned authority contract update",
    relatedStandards: Object.freeze(["PAS-005", "Governed UI"] as const),
    downstreamContractsOwnedByGovernedUi: Object.freeze([
      ...GOVERNED_UI_DOWNSTREAM_CONTRACTS,
    ]),
  }),
  ownershipDomains,
  prohibitedOverlap,
  aiAntiDriftRules: Object.freeze({
    may: aiMay,
    mayNot: aiMayNot,
  }),
  packageBoundary: Object.freeze({
    mayOwn: packageMayOwn,
    mayNotOwn: packageMayNotOwn,
  }),
  immutability: Object.freeze({
    rule: "Authority contract is immutable except by ADR",
    mutationPath: "accepted ADR -> version bump -> contract update -> tests",
  }),
  acceptanceCriteria: Object.freeze({
    given: "Foundation phase 03 is complete",
    outcomes: Object.freeze([
      "Every visual responsibility has exactly one owner",
      "No UI responsibility overlaps",
      "AI has no permission to invent visual architecture",
      "Governed UI can safely implement detailed UI contracts",
    ] as const),
    when: "future UI work begins",
  }),
} as const satisfies DesignSystemAuthorityContract);
