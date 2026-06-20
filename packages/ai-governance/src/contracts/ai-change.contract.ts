export const AI_INVARIANT_IDS = [
  "AI-001",
  "AI-002",
  "AI-003",
  "AI-004",
  "AI-004-SCOPE",
  "AI-005",
  "AI-006",
  "AI-007",
  "AI-008",
  "AI-009",
  "AI-010",
] as const;

export type AiInvariantId = (typeof AI_INVARIANT_IDS)[number];

export type AiGovernanceMode = "baseline" | "scope";

export type AiGovernanceGate =
  | "registry"
  | "dependencies"
  | "boundaries"
  | "scope"
  | "scope-drift"
  | "prompt"
  | "change"
  | "drift";

export interface DeletionJustification {
  readonly path: string;
  readonly reason: string;
}

export interface TestExemption {
  readonly path: string;
  readonly rationale: string;
}

export interface AiChangeScopeManifest {
  readonly tip: string;
  readonly adr: string;
  readonly allowedPaths: readonly string[];
  readonly forbiddenPaths: readonly string[];
  readonly reason: string;
  readonly nonGoals: readonly string[];
  readonly testPlan: readonly string[];
  readonly deletionJustifications: readonly DeletionJustification[];
  readonly testExemptions: readonly TestExemption[];
  readonly scopeExpansionAdr?: string;
}

export interface ChangedLine {
  readonly path: string;
  readonly lineNumber: number;
  readonly content: string;
}

export interface PackageExportMap {
  readonly packageName: string;
  readonly exportKeys: readonly string[];
}

export interface AiViolation {
  readonly invariant: AiInvariantId;
  readonly gate: AiGovernanceGate;
  readonly message: string;
  readonly path?: string;
  readonly lineNumber?: number;
}

export interface AiValidationResult {
  readonly ok: boolean;
  readonly mode: AiGovernanceMode;
  readonly violations: readonly AiViolation[];
}

export function createAiValidationResult(
  mode: AiGovernanceMode,
  violations: readonly AiViolation[]
): AiValidationResult {
  return {
    ok: violations.length === 0,
    mode,
    violations,
  };
}

export function mergeAiValidationResults(
  mode: AiGovernanceMode,
  results: readonly AiValidationResult[]
): AiValidationResult {
  const violations = results.flatMap((result) => result.violations);
  return createAiValidationResult(mode, violations);
}
