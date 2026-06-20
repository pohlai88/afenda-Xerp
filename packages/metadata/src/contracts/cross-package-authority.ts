/**
 * Cross-package authority rules for the Afenda metadata architecture.
 *
 * Encodes the separation of concerns between @afenda/metadata,
 * @afenda/design-system, @afenda/metadata-ui, @afenda/appshell, and
 * ERP domain packages.  No package may claim ownership of a responsibility
 * that another package already owns.
 *
 * This file is governance-only.  It does not import from any implementation
 * package and carries no runtime side effects.
 */

export const CROSS_PACKAGE_NAMES = [
  "@afenda/design-system",
  "@afenda/metadata",
  "@afenda/metadata-ui",
  "@afenda/appshell",
  "erp-domains",
] as const;

export type CrossPackageName = (typeof CROSS_PACKAGE_NAMES)[number];

export interface CrossPackageAuthorityEntry {
  readonly mayNotOwn: readonly string[];
  readonly owns: readonly string[];
  readonly package: CrossPackageName;
  readonly role: string;
}

export interface CrossPackageAuthority {
  readonly noOverlapRule: string;
  readonly packages: readonly CrossPackageAuthorityEntry[];
  readonly tip005IntegrationRule: string;
}

export const crossPackageAuthority = {
  noOverlapRule:
    "No package may own a responsibility that another package in this table owns.",
  tip005IntegrationRule:
    "@afenda/metadata-ui must depend on @afenda/metadata and consume its authority contracts. Merging the two packages is prohibited.",
  packages: [
    {
      package: "@afenda/design-system",
      role: "Design authority — visual primitives",
      owns: [
        "tokens",
        "recipes",
        "variants",
        "components",
        "slots",
        "states",
        "motion",
        "accessibility",
      ],
      mayNotOwn: [
        "metadata architecture",
        "renderer governance",
        "surface definitions",
        "layout arrangements",
        "section definitions",
        "ERP business rules",
        "permission logic",
      ],
    },
    {
      package: "@afenda/metadata",
      role: "Metadata authority — architecture governance",
      owns: ["metadata architecture"],
      mayNotOwn: [
        "UI implementation",
        "React components",
        "design tokens",
        "design recipes",
        "design variants",
        "ERP business rules",
        "AppShell implementation",
        "database schemas",
        "permission rules",
      ],
    },
    {
      package: "@afenda/metadata-ui",
      role: "Metadata UI — renderer implementation",
      owns: ["renderer implementation"],
      mayNotOwn: [
        "metadata architecture",
        "design tokens",
        "ERP business rules",
        "AppShell implementation",
        "permission authority",
      ],
    },
    {
      package: "@afenda/appshell",
      role: "AppShell — shell implementation",
      owns: ["shell implementation"],
      mayNotOwn: [
        "metadata architecture",
        "design primitives",
        "ERP business rules",
        "renderer governance",
      ],
    },
    {
      package: "erp-domains",
      role: "ERP Domains — business data",
      owns: ["business data"],
      mayNotOwn: [
        "metadata architecture",
        "renderer governance",
        "design primitives",
        "shell implementation",
      ],
    },
  ],
} as const satisfies CrossPackageAuthority;
