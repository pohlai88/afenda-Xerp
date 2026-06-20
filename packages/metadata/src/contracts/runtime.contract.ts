export const RUNTIME_DIAGNOSTIC_LEVELS = ["info", "warning", "error"] as const;

export type RuntimeDiagnosticLevel =
  (typeof RUNTIME_DIAGNOSTIC_LEVELS)[number];

export interface RuntimeDiagnostic {
  readonly code: string;
  readonly level: RuntimeDiagnosticLevel;
  readonly message: string;
}

export interface MetadataRuntimeContext {
  readonly diagnostics: readonly RuntimeDiagnostic[];
  readonly executionId: string;
  readonly metadataId: string;
  readonly tenantId: string;
}

export interface RuntimeContract {
  readonly contractId: "runtime";
  readonly owner: "Metadata";
  readonly owns: readonly [
    "render context",
    "execution context",
    "runtime state",
    "runtime diagnostics",
  ];
  readonly mustNotOwn: readonly ["ERP workflows", "database access"];
}

export const runtimeContract = {
  contractId: "runtime",
  mustNotOwn: ["ERP workflows", "database access"],
  owner: "Metadata",
  owns: [
    "render context",
    "execution context",
    "runtime state",
    "runtime diagnostics",
  ],
} as const satisfies RuntimeContract;
