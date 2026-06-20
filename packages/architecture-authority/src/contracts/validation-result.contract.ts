export type ValidationGate =
  | "registry"
  | "ownership"
  | "layers"
  | "dependencies"
  | "forbidden-dependencies"
  | "cycles"
  | "exceptions";

export interface ArchitectureViolation {
  readonly gate: ValidationGate;
  readonly message: string;
  readonly packageName?: string;
}

export interface ValidationResult {
  readonly ok: boolean;
  readonly violations: readonly ArchitectureViolation[];
}

export function createValidationResult(
  violations: readonly ArchitectureViolation[]
): ValidationResult {
  return {
    ok: violations.length === 0,
    violations,
  };
}

export function mergeValidationResults(
  results: readonly ValidationResult[]
): ValidationResult {
  const violations = results.flatMap((result) => result.violations);
  return createValidationResult(violations);
}
