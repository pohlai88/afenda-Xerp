export const exampleContract = {
  acceptanceRules: [
    "Every example must be marked imitation-only",
    "Every example must import only from @afenda/design-system",
    "Examples must demonstrate approved APIs without creating authority",
  ],
  aiGenerationRules: {
    forbidden: [
      "Invent APIs from examples",
      "Treat examples as design authority",
      "Copy example-local values into production contracts",
    ],
    allowed: [
      "Imitate approved example patterns",
      "Use examples to understand intended contract composition",
      "Generate new examples only from approved APIs",
    ],
  },
  allowedResponsibility: [
    "Define AI imitation patterns",
    "Demonstrate approved contract usage",
    "Warn about drift risks",
  ],
  contractId: "afenda.design-system.example",
  downstreamConsumers: [
    "AI IDE generation",
    "AppShell",
    "Metadata UI",
    "future component authors",
  ],
  ownedResponsibility: "AI imitation",
  owner: "Governed UI example contract",
  prohibitedResponsibility: [
    "Define public APIs",
    "Define tokens",
    "Define variants",
    "Define recipes",
    "Define component behavior",
    "Define business rules",
  ],
  purpose:
    "Own approved imitation-only examples for AI-assisted UI generation.",
  version: "0.1.0",
} as const;

export interface GovernedExample {
  readonly demonstrates: readonly string[];
  readonly driftWarnings: readonly string[];
  /** Must always be `true` — examples are imitation patterns, never authority. */
  readonly imitationOnly: true;
  readonly importsFrom: "@afenda/design-system";
  readonly name: string;
  readonly purpose: string;
  readonly source: string;
}
