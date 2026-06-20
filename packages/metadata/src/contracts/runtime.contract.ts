export const RUNTIME_DIAGNOSTIC_LEVELS = ["info", "warning", "error"] as const;

export type RuntimeDiagnosticLevel = (typeof RUNTIME_DIAGNOSTIC_LEVELS)[number];

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
  readonly mustNotOwn: readonly ["ERP workflows", "database access"];
  readonly owner: "Metadata";
  readonly owns: readonly [
    "render context",
    "execution context",
    "runtime state",
    "runtime diagnostics",
  ];
  readonly purpose: string;
  readonly version: string;
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
  purpose:
    "Own render context, execution context, runtime state, and diagnostics for metadata execution.",
  version: "0.1.0",
} as const satisfies RuntimeContract;
