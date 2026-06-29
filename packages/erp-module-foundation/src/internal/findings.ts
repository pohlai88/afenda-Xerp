import type { ReadinessDimension } from "../erp-module-foundation.types.js";

export interface ModuleReadinessFinding {
  readonly code: string;
  readonly dimension: ReadinessDimension;
  readonly message: string;
  readonly severity: "error" | "warning";
}

export function findingToMessage(
  findings: readonly ModuleReadinessFinding[]
): readonly string[] {
  return findings.map((finding) => finding.message);
}

export function errorFinding(
  dimension: ReadinessDimension,
  code: string,
  message: string
): ModuleReadinessFinding {
  return { dimension, severity: "error", code, message } as const;
}

export function warningFinding(
  dimension: ReadinessDimension,
  code: string,
  message: string
): ModuleReadinessFinding {
  return { dimension, severity: "warning", code, message } as const;
}
