export const exportContract = {
  acceptanceRules: [
    "All public design-system access must go through @afenda/design-system",
    "Deep imports from contract, policy, token, recipe, or variant internals remain prohibited",
    "Every public contract must be included in the stable export surface",
  ],
  aiGenerationRules: {
    forbidden: [
      "Deep import design-system internals",
      "Create alternate export surfaces in apps or metadata-ui",
      "Consume unpublished contract files directly",
    ],
    allowed: [
      "Import approved symbols from @afenda/design-system",
      "Use stable exports listed by the public export contract",
      "Request export governance changes through the design-system package",
    ],
  },
  allowedResponsibility: [
    "Define public access",
    "Define stable root exports",
    "Define deep import restrictions",
  ],
  contractId: "afenda.design-system.export",
  downstreamConsumers: [
    "all workspace packages",
    "AI IDE generation",
    "AppShell",
    "Metadata UI",
  ],
  ownedResponsibility: "public access",
  owner: "Governed UI export contract",
  prohibitedResponsibility: [
    "Define tokens",
    "Define variants",
    "Define recipes",
    "Define component behavior",
    "Define business logic",
  ],
  purpose:
    "Own the public access rules for consuming approved design-system contracts.",
  version: "0.1.0",
} as const;

export interface PublicExportContract {
  readonly deepImportsAllowed: false;
  readonly internalFolders: readonly string[];
  readonly packageName: "@afenda/ui/design-authority";
  readonly publicEntrypoints: readonly string[];
  readonly stableExports: readonly string[];
}
