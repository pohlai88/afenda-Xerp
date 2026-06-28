/**
 * Cross-package authority rules for the Afenda metadata architecture.
 *
 * Purpose:
 * - Defines package ownership boundaries.
 * - Prevents governance overlap between Design System, Metadata, Metadata UI,
 *   AppShell, UI primitives, Permissions, and ERP domain packages.
 * - Provides a machine-readable contract for CI boundary validation.
 *
 * Governance-only:
 * - No runtime imports from implementation packages.
 * - No React, UI, database, or business logic.
 * - Safe to consume from architecture checks and package boundary tests.
 */

export const CROSS_PACKAGE_NAMES = [
  "@afenda/css-authority",
  "@afenda/design-system",
  "@afenda/ui-composition",
  "@afenda/metadata-ui",
  "@afenda/appshell",
  "@afenda/ui",
  "@afenda/permissions",
  "erp-domains",
] as const;

export type CrossPackageName = (typeof CROSS_PACKAGE_NAMES)[number];

/** PAS-004B B34 — metadata may import accepted meaning from enterprise-knowledge only. */
export type CrossPackageImportSource =
  | CrossPackageName
  | "@afenda/enterprise-knowledge";

export const CROSS_PACKAGE_RESPONSIBILITIES = [
  "accessibility",
  "app-shell-implementation",
  "business-data",
  "design-primitives",
  "design-tokens",
  "erp-business-rules",
  "governed-metadata-arrays",
  "governed-ui-primitives",
  "layout-arrangements",
  "metadata-architecture",
  "metadata-contracts",
  "motion",
  "permission-logic",
  "policy-execution",
  "recipes",
  "renderer-governance",
  "renderer-implementation",
  "section-definitions",
  "shell-implementation",
  "slots",
  "states",
  "surface-definitions",
  "ui-implementation",
  "variants",
] as const;

export type CrossPackageResponsibility =
  (typeof CROSS_PACKAGE_RESPONSIBILITIES)[number];

export interface CrossPackageImportPolicy {
  /**
   * Packages that this package may import from.
   */
  readonly mayImportFrom: readonly CrossPackageImportSource[];

  /**
   * Packages that this package must never import from.
   */
  readonly mayNotImportFrom: readonly CrossPackageName[];
}

export interface CrossPackageAuthorityEntry {
  /**
   * Dependency-direction policy for architecture validation.
   */
  readonly importPolicy: CrossPackageImportPolicy;

  /**
   * Responsibilities this package is explicitly forbidden from owning.
   *
   * This is intentionally redundant with ownership rules so CI can emit
   * precise, human-readable governance errors.
   */
  readonly mayNotOwn: readonly CrossPackageResponsibility[];

  /**
   * Canonical responsibilities owned by this package.
   *
   * A responsibility must appear as owned by one package only.
   */
  readonly owns: readonly CrossPackageResponsibility[];
  readonly package: CrossPackageName;
  readonly role: string;
}

export interface CrossPackageAuthority {
  readonly authority: "Foundation phase 05";
  readonly lifecycle: "active";
  readonly metadataUiIntegrationRule: string;
  readonly noOverlapRule: string;
  readonly packages: readonly CrossPackageAuthorityEntry[];
  readonly version: "1.0.0";
}

export const metadataUiIntegrationRule = [
  "@afenda/metadata-ui must depend on @afenda/ui-composition and consume its contracts.",
  "@afenda/ui-composition and @afenda/metadata-ui must never be merged.",
  "@afenda/ui-composition must never import @afenda/metadata-ui.",
  "@afenda/metadata-ui must not redefine governed metadata arrays.",
  "@afenda/metadata-ui may implement renderers, but renderer governance belongs to @afenda/ui-composition.",
].join(" ");

export const crossPackageAuthority = {
  version: "1.0.0",
  lifecycle: "active",
  authority: "Foundation phase 05",

  metadataUiIntegrationRule,

  noOverlapRule:
    "No package may own a responsibility that another governed package owns. Ownership must be singular, explicit, and validated by CI.",

  packages: [
    {
      package: "@afenda/css-authority",
      role: "CSS Authority — token registry and runtime CSS bundle (PAS-005)",

      owns: ["design-tokens"],

      mayNotOwn: [
        "accessibility",
        "app-shell-implementation",
        "business-data",
        "design-primitives",
        "erp-business-rules",
        "governed-metadata-arrays",
        "governed-ui-primitives",
        "layout-arrangements",
        "metadata-architecture",
        "metadata-contracts",
        "motion",
        "permission-logic",
        "policy-execution",
        "recipes",
        "renderer-governance",
        "renderer-implementation",
        "section-definitions",
        "shell-implementation",
        "slots",
        "states",
        "surface-definitions",
        "ui-implementation",
        "variants",
      ],

      importPolicy: {
        mayImportFrom: [],
        mayNotImportFrom: [
          "@afenda/design-system",
          "@afenda/ui-composition",
          "@afenda/metadata-ui",
          "@afenda/appshell",
          "@afenda/ui",
          "@afenda/permissions",
          "erp-domains",
        ],
      },
    },

    {
      package: "@afenda/design-system",
      role: "Design authority — visual primitives (Foundation phase 04 TS governance)",

      owns: [
        "accessibility",
        "design-primitives",
        "motion",
        "recipes",
        "slots",
        "states",
        "variants",
      ],

      mayNotOwn: [
        "app-shell-implementation",
        "business-data",
        "design-tokens",
        "erp-business-rules",
        "governed-metadata-arrays",
        "layout-arrangements",
        "metadata-architecture",
        "metadata-contracts",
        "permission-logic",
        "policy-execution",
        "renderer-governance",
        "renderer-implementation",
        "section-definitions",
        "surface-definitions",
        "ui-implementation",
      ],

      importPolicy: {
        mayImportFrom: [],
        mayNotImportFrom: [
          "@afenda/ui-composition",
          "@afenda/metadata-ui",
          "@afenda/appshell",
          "@afenda/ui",
          "@afenda/permissions",
          "erp-domains",
        ],
      },
    },

    {
      package: "@afenda/ui-composition",
      role: "Metadata authority — architecture governance",

      owns: [
        "governed-metadata-arrays",
        "layout-arrangements",
        "metadata-architecture",
        "metadata-contracts",
        "renderer-governance",
        "section-definitions",
        "surface-definitions",
      ],

      mayNotOwn: [
        "accessibility",
        "app-shell-implementation",
        "business-data",
        "design-primitives",
        "design-tokens",
        "erp-business-rules",
        "governed-ui-primitives",
        "motion",
        "permission-logic",
        "policy-execution",
        "recipes",
        "renderer-implementation",
        "shell-implementation",
        "slots",
        "states",
        "ui-implementation",
        "variants",
      ],

      importPolicy: {
        mayImportFrom: ["@afenda/enterprise-knowledge"],
        mayNotImportFrom: [
          "@afenda/design-system",
          "@afenda/metadata-ui",
          "@afenda/appshell",
          "@afenda/ui",
          "@afenda/permissions",
          "erp-domains",
        ],
      },
    },

    {
      package: "@afenda/metadata-ui",
      role: "Metadata UI — renderer implementation",

      owns: ["renderer-implementation", "ui-implementation"],

      mayNotOwn: [
        "business-data",
        "design-primitives",
        "design-tokens",
        "erp-business-rules",
        "governed-metadata-arrays",
        "layout-arrangements",
        "metadata-architecture",
        "metadata-contracts",
        "permission-logic",
        "policy-execution",
        "renderer-governance",
        "section-definitions",
        "shell-implementation",
        "surface-definitions",
      ],

      importPolicy: {
        mayImportFrom: [
          "@afenda/ui/design-authority",
          "@afenda/css-authority",
          "@afenda/ui-composition",
          "@afenda/ui",
        ],
        mayNotImportFrom: [
          "@afenda/appshell",
          "@afenda/permissions",
          "erp-domains",
        ],
      },
    },

    {
      package: "@afenda/appshell",
      role: "AppShell — shell implementation",

      owns: ["app-shell-implementation", "shell-implementation"],

      mayNotOwn: [
        "business-data",
        "design-primitives",
        "design-tokens",
        "erp-business-rules",
        "governed-metadata-arrays",
        "metadata-architecture",
        "metadata-contracts",
        "permission-logic",
        "policy-execution",
        "renderer-governance",
        "renderer-implementation",
      ],

      importPolicy: {
        mayImportFrom: [
          "@afenda/ui/design-authority",
          "@afenda/css-authority",
          "@afenda/ui-composition",
          "@afenda/metadata-ui",
          "@afenda/ui",
        ],
        mayNotImportFrom: ["@afenda/permissions", "erp-domains"],
      },
    },

    {
      package: "@afenda/ui",
      role: "UI primitives — governed component library",

      owns: ["governed-ui-primitives"],

      mayNotOwn: [
        "app-shell-implementation",
        "business-data",
        "erp-business-rules",
        "governed-metadata-arrays",
        "layout-arrangements",
        "metadata-architecture",
        "metadata-contracts",
        "permission-logic",
        "policy-execution",
        "renderer-governance",
        "renderer-implementation",
        "section-definitions",
        "shell-implementation",
        "surface-definitions",
      ],

      importPolicy: {
        mayImportFrom: ["@afenda/css-authority"],
        mayNotImportFrom: [
          "@afenda/ui-composition",
          "@afenda/metadata-ui",
          "@afenda/appshell",
          "@afenda/permissions",
          "erp-domains",
        ],
      },
    },

    {
      package: "@afenda/permissions",
      role: "Permissions — authorization authority",

      owns: ["permission-logic", "policy-execution"],

      mayNotOwn: [
        "app-shell-implementation",
        "business-data",
        "design-primitives",
        "design-tokens",
        "governed-metadata-arrays",
        "layout-arrangements",
        "metadata-architecture",
        "metadata-contracts",
        "renderer-governance",
        "renderer-implementation",
        "section-definitions",
        "shell-implementation",
        "surface-definitions",
        "ui-implementation",
      ],

      importPolicy: {
        mayImportFrom: [],
        mayNotImportFrom: [
          "@afenda/design-system",
          "@afenda/ui-composition",
          "@afenda/metadata-ui",
          "@afenda/appshell",
          "@afenda/ui",
          "erp-domains",
        ],
      },
    },

    {
      package: "erp-domains",
      role: "ERP Domains — business data and business rules",

      owns: ["business-data", "erp-business-rules"],

      mayNotOwn: [
        "app-shell-implementation",
        "design-primitives",
        "design-tokens",
        "governed-metadata-arrays",
        "governed-ui-primitives",
        "layout-arrangements",
        "metadata-architecture",
        "metadata-contracts",
        "permission-logic",
        "policy-execution",
        "renderer-governance",
        "renderer-implementation",
        "section-definitions",
        "shell-implementation",
        "surface-definitions",
      ],

      importPolicy: {
        mayImportFrom: ["@afenda/ui-composition", "@afenda/permissions"],
        mayNotImportFrom: [
          "@afenda/design-system",
          "@afenda/metadata-ui",
          "@afenda/appshell",
          "@afenda/ui",
        ],
      },
    },
  ],
} as const satisfies CrossPackageAuthority;
