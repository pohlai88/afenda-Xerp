import type { FoundationDispositionEntry } from "../contracts/foundation-disposition.contract.js";
import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import { foundationDispositionRegistry } from "../data/foundation-disposition.registry.js";
import { packageContract } from "../data/package-registry.data.js";

const FOUNDATION_DISPOSITION_GATE = "foundation-disposition" as const;

function violation(
  entryId: string,
  message: string,
  packageName?: string
): ArchitectureViolation {
  return packageName
    ? {
        gate: FOUNDATION_DISPOSITION_GATE,
        message: `${entryId}: ${message}`,
        packageName,
      }
    : {
        gate: FOUNDATION_DISPOSITION_GATE,
        message: `${entryId}: ${message}`,
      };
}

function validateRedLaneGates(
  entry: FoundationDispositionEntry
): ArchitectureViolation[] {
  if (entry.lane !== "red-lane") {
    return [];
  }

  if (entry.gates.length === 0) {
    return [
      violation(entry.id, "red-lane entry must define at least one gate"),
    ];
  }

  return [];
}

function validateRedLaneEvidence(
  entry: FoundationDispositionEntry
): ArchitectureViolation[] {
  if (entry.lane !== "red-lane") {
    return [];
  }

  if (entry.evidence.length === 0) {
    return [
      violation(
        entry.id,
        "red-lane entry must define at least one evidence path"
      ),
    ];
  }

  return [];
}

function validatePackageIdAlignment(
  entry: FoundationDispositionEntry
): ArchitectureViolation[] {
  if (entry.lane === "archive-lane") {
    return [];
  }

  const packageExists = packageContract.packages.some(
    (pkg) => pkg.registryId === entry.packageId
  );

  if (!packageExists) {
    return [
      violation(
        entry.id,
        `packageId ${entry.packageId} is not registered in package-registry.data.ts`,
        entry.packageName
      ),
    ];
  }

  return [];
}

function validateLegacyTipNotSoleAuthority(
  entry: FoundationDispositionEntry
): ArchitectureViolation[] {
  if (entry.lane === "archive-lane") {
    return [];
  }

  if (entry.evidence.length === 0 && entry.legacyTipEvidence.length > 0) {
    return [
      violation(
        entry.id,
        "legacyTipEvidence cannot be sole authority — add runtime evidence paths",
        entry.packageName
      ),
    ];
  }

  return [];
}

function validateBlueLaneAccountingRequirement(
  entry: FoundationDispositionEntry
): ArchitectureViolation[] {
  if (entry.lane === "blue-lane" && entry.requiredBeforeAccounting) {
    return [
      violation(
        entry.id,
        "blue-lane entry must not set requiredBeforeAccounting: true",
        entry.packageName
      ),
    ];
  }

  return [];
}

function validateProhibitedRules(
  entry: FoundationDispositionEntry
): ArchitectureViolation[] {
  if (entry.prohibited.length === 0) {
    return [
      violation(entry.id, "entry must define at least one prohibited rule"),
    ];
  }

  return [];
}

function validateRedLaneAllowedAgents(
  entry: FoundationDispositionEntry
): ArchitectureViolation[] {
  if (entry.lane !== "red-lane") {
    return [];
  }

  if (entry.allowedAgents.length === 0) {
    return [
      violation(
        entry.id,
        "red-lane entry must define at least one allowedAgents value"
      ),
    ];
  }

  return [];
}

export function validateFoundationDispositionAgentAssignment(
  agentId: string,
  entryId: string
): ArchitectureViolation[] {
  const entry = foundationDispositionRegistry.entries.find(
    (candidate) => candidate.id === entryId
  );

  if (!entry) {
    return [
      violation(
        entryId,
        `unknown foundation disposition entry for agent ${agentId}`
      ),
    ];
  }

  if (!(entry.allowedAgents as readonly string[]).includes(agentId)) {
    return [
      violation(
        entry.id,
        `agent ${agentId} is not listed in allowedAgents`,
        entry.packageName
      ),
    ];
  }

  return [];
}

export function validateFoundationDisposition(
  options: { agentId?: string; entryId?: string } = {}
) {
  const violations = foundationDispositionRegistry.entries.flatMap((entry) => [
    ...validateRedLaneGates(entry),
    ...validateRedLaneEvidence(entry),
    ...validatePackageIdAlignment(entry),
    ...validateLegacyTipNotSoleAuthority(entry),
    ...validateBlueLaneAccountingRequirement(entry),
    ...validateProhibitedRules(entry),
    ...validateRedLaneAllowedAgents(entry),
  ]);

  if (options.agentId && options.entryId) {
    violations.push(
      ...validateFoundationDispositionAgentAssignment(
        options.agentId,
        options.entryId
      )
    );
  }

  return createValidationResult(violations);
}
