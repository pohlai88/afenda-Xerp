import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ACCOUNTING_READINESS_GATE_CHECK_SCRIPT,
  ACCOUNTING_READINESS_GATE_PACKAGE_SCRIPT,
  ACCOUNTING_READINESS_GATE_REQUIREMENTS,
  type AccountingReadinessGateRequirement,
  PHASE_9_ROADMAP_DOC,
} from "../accounting-readiness-gate-registry.mts";

interface AccountingReadinessGateViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

export type AccountingReadinessDelegatedGateRunKind =
  | "pass"
  | "fail"
  | "skipped";

export type AccountingReadinessRequirementLiveKind = "pass" | "fail";

export type AccountingReadinessGateLiveRunMode = "structure-only" | "full";

export interface AccountingReadinessDelegatedGateRunResult {
  readonly gate: string;
  readonly kind: AccountingReadinessDelegatedGateRunKind;
  readonly message: string | null;
}

export interface AccountingReadinessRequirementLiveStatus {
  readonly delegatedResults: readonly AccountingReadinessDelegatedGateRunResult[];
  readonly evidencePassed: boolean;
  readonly id: AccountingReadinessGateRequirement["id"];
  readonly kind: AccountingReadinessRequirementLiveKind;
  readonly messages: readonly string[];
  readonly number: number;
  readonly requirement: string;
}

export interface AccountingReadinessGateLiveSnapshot {
  readonly checkedAt: string;
  readonly overallKind: AccountingReadinessRequirementLiveKind;
  readonly requirements: readonly AccountingReadinessRequirementLiveStatus[];
  readonly runMode: AccountingReadinessGateLiveRunMode;
}

function collectUniqueDelegatedGates(): string[] {
  const gates = new Set<string>();

  for (const requirement of ACCOUNTING_READINESS_GATE_REQUIREMENTS) {
    for (const gate of requirement.delegatedGates ?? []) {
      if (gate === ACCOUNTING_READINESS_GATE_PACKAGE_SCRIPT) {
        continue;
      }
      gates.add(gate);
    }
  }

  return [...gates].toSorted();
}

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

function evaluateRequirementEvidence(
  repoRoot: string,
  requirement: AccountingReadinessGateRequirement
): { readonly messages: readonly string[]; readonly passed: boolean } {
  const messages: string[] = [];

  for (const testFile of requirement.testFiles ?? []) {
    const absolutePath = join(repoRoot, testFile);
    if (!existsSync(absolutePath)) {
      messages.push(`Missing evidence test file: ${testFile}`);
    }
  }

  const roadmapContent = readText(join(repoRoot, PHASE_9_ROADMAP_DOC));
  if (roadmapContent === null) {
    messages.push(`Missing roadmap doc: ${PHASE_9_ROADMAP_DOC}`);
  } else if (!roadmapContent.includes(requirement.roadmapMarker)) {
    messages.push(
      `Missing Phase 9 roadmap marker: ${requirement.roadmapMarker}`
    );
  }

  return {
    passed: messages.length === 0,
    messages,
  };
}

function parseRequirementNumberFromViolation(
  violation: AccountingReadinessGateViolation
): number | null {
  const requirementMatch = violation.message.match(/Requirement (\d+)/);
  if (requirementMatch?.[1]) {
    return Number.parseInt(requirementMatch[1], 10);
  }

  if (violation.rule === "erp-copy-parity") {
    return 9;
  }

  if (
    violation.rule === "check-script-missing" ||
    violation.rule === "delegated-gate-script-missing" ||
    violation.rule === "delivery-doc-missing" ||
    violation.rule === "delivery-surface-rule-missing"
  ) {
    return 9;
  }

  if (
    violation.rule === "roadmap-doc-missing" ||
    violation.rule === "registry-missing" ||
    violation.rule === "gate-missing"
  ) {
    return 10;
  }

  return null;
}

function mapStructureViolationsByRequirement(
  violations: readonly AccountingReadinessGateViolation[]
): Map<number, string[]> {
  const byRequirement = new Map<number, string[]>();

  for (const violation of violations) {
    const requirementNumber = parseRequirementNumberFromViolation(violation);
    if (requirementNumber === null) {
      continue;
    }

    const existing = byRequirement.get(requirementNumber) ?? [];
    existing.push(violation.message);
    byRequirement.set(requirementNumber, existing);
  }

  return byRequirement;
}

function runDelegatedGate(
  repoRoot: string,
  gate: string
): AccountingReadinessDelegatedGateRunResult {
  const command = `pnpm ${gate}`;
  const result = spawnSync(command, {
    shell: true,
    cwd: repoRoot,
    encoding: "utf8",
    timeout: 120_000,
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.status === 0 && !result.error) {
    return { gate, kind: "pass", message: null };
  }

  const output = [result.stdout ?? "", result.stderr ?? ""]
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .join("\n");

  return {
    gate,
    kind: "fail",
    message: result.error?.message ?? (output || `${command} failed`),
  };
}

function resolveDelegatedResults(
  requirement: AccountingReadinessGateRequirement,
  delegatedGateResults: ReadonlyMap<
    string,
    AccountingReadinessDelegatedGateRunResult
  >,
  runDelegatedGates: boolean
): readonly AccountingReadinessDelegatedGateRunResult[] {
  const gates = requirement.delegatedGates ?? [];

  return gates
    .filter((gate) => gate !== ACCOUNTING_READINESS_GATE_PACKAGE_SCRIPT)
    .map((gate) => {
      if (!runDelegatedGates) {
        return { gate, kind: "skipped" as const, message: null };
      }

      return (
        delegatedGateResults.get(gate) ?? {
          gate,
          kind: "fail" as const,
          message: "Delegated gate was not executed",
        }
      );
    });
}

function resolveRequirementKind(input: {
  readonly delegatedResults: readonly AccountingReadinessDelegatedGateRunResult[];
  readonly evidencePassed: boolean;
  readonly structureMessages: readonly string[];
}): AccountingReadinessRequirementLiveKind {
  if (input.structureMessages.length > 0 || !input.evidencePassed) {
    return "fail";
  }

  const hasDelegatedFailure = input.delegatedResults.some(
    (result) => result.kind === "fail"
  );

  return hasDelegatedFailure ? "fail" : "pass";
}

export function evaluateAccountingReadinessGateLiveStatus(input: {
  readonly repoRoot: string;
  readonly runDelegatedGates: boolean;
  readonly structureViolations: readonly AccountingReadinessGateViolation[];
}): AccountingReadinessGateLiveSnapshot {
  const structureMessagesByRequirement = mapStructureViolationsByRequirement(
    input.structureViolations
  );

  const delegatedGateResults = new Map<
    string,
    AccountingReadinessDelegatedGateRunResult
  >();

  if (input.runDelegatedGates && input.structureViolations.length === 0) {
    for (const gate of collectUniqueDelegatedGates()) {
      delegatedGateResults.set(gate, runDelegatedGate(input.repoRoot, gate));
    }
  }

  const requirements = ACCOUNTING_READINESS_GATE_REQUIREMENTS.map(
    (requirement) => {
      const evidence = evaluateRequirementEvidence(input.repoRoot, requirement);
      const structureMessages =
        structureMessagesByRequirement.get(requirement.number) ?? [];
      const delegatedResults = resolveDelegatedResults(
        requirement,
        delegatedGateResults,
        input.runDelegatedGates
      );
      const messages = [...structureMessages, ...evidence.messages];
      const evidencePassed = evidence.passed && structureMessages.length === 0;
      const kind = resolveRequirementKind({
        evidencePassed,
        structureMessages,
        delegatedResults,
      });

      return {
        id: requirement.id,
        number: requirement.number,
        requirement: requirement.requirement,
        evidencePassed,
        delegatedResults,
        messages,
        kind,
      } satisfies AccountingReadinessRequirementLiveStatus;
    }
  );

  const overallKind = requirements.every(
    (requirement) => requirement.kind === "pass"
  )
    ? "pass"
    : "fail";

  return {
    checkedAt: new Date().toISOString(),
    runMode: input.runDelegatedGates ? "full" : "structure-only",
    overallKind,
    requirements,
  };
}

export function parseAccountingReadinessGateLiveSnapshot(
  value: unknown
): AccountingReadinessGateLiveSnapshot | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const candidate = value as Partial<AccountingReadinessGateLiveSnapshot>;
  if (
    typeof candidate.checkedAt !== "string" ||
    (candidate.runMode !== "structure-only" && candidate.runMode !== "full") ||
    (candidate.overallKind !== "pass" && candidate.overallKind !== "fail") ||
    !Array.isArray(candidate.requirements)
  ) {
    return null;
  }

  return candidate as AccountingReadinessGateLiveSnapshot;
}

export const ACCOUNTING_READINESS_GATE_LIVE_STATUS_SCRIPT =
  ACCOUNTING_READINESS_GATE_CHECK_SCRIPT;
