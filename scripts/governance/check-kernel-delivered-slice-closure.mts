#!/usr/bin/env tsx
/**
 * PAS-001-AUD-22 — delivered slice closure gate.
 *
 * Verifies claimed Delivered kernel slices have on-disk handoffs and runtime evidence paths.
 * Complements check:kernel-slice-catalog-consistency (catalog ↔ index alignment).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { listKernelImplementationSequenceSteps } from "../../packages/kernel/src/governance/kernel-implementation-sequence.contract.ts";
import { checkKernelSliceCatalogConsistency } from "./check-kernel-slice-catalog-consistency.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const sliceDir = join(repoRoot, "docs/PAS/KERNEL/SLICE");

export interface KernelDeliveredSliceClosureViolation {
  readonly message: string;
  readonly rule: string;
}

const B49_B70_HANDOFFS = [
  "b49-kernel-tenant-wire-triad.md",
  "b50-kernel-company-org-wire-triad.md",
  "b51-kernel-parent-org-wire.md",
  "b52-kernel-full-hierarchy-wire-closure.md",
  "b53-kernel-propagation-frame-wire.md",
  "b54-kernel-project-wire-triad.md",
  "b55-kernel-policy-wire-triad.md",
  "b57-kernel-permission-wire-triad.md",
  "b67-pas001-doc-attestation-closure.md",
  "b68-hierarchy-id-boundary-wire-triad.md",
  "b69-kernel-context-wire-triad-gate.md",
  "b70-kernel-test-import-hygiene.md",
] as const;

const B107_B111_HANDOFFS = [
  "b107-tenant-saas-lifecycle-wire.md",
  "b108-tenant-extension-boundary-wire.md",
  "b109-effective-dating-consumer-attestation.md",
  "b110-auth-actor-protected-path-attestation.md",
  "b111-tenant-lifecycle-extension-consumer-attestation.md",
] as const;

/** B2–B48 historical core — proxy evidence (PAS-001 §11 implementation sequence + layout). */
const HISTORICAL_CORE_EVIDENCE = [
  "packages/kernel/src/identity/canonical/canonical-id.contract.ts",
  "packages/kernel/src/identity/registry/enterprise-id-prefix.registry.ts",
  "packages/kernel/src/context/operating-context.contract.ts",
  "packages/kernel/src/permission/permission-vocabulary.contract.ts",
  "packages/kernel/src/contracts/app-error.contract.ts",
  "packages/kernel/src/contracts/problem-detail.contract.ts",
  "packages/kernel/src/governance/kernel-prohibited-ownership.contract.ts",
  "packages/kernel/src/contracts/kernel-package-layout.contract.ts",
] as const;

const CLOSURE_TRACK_EVIDENCE: readonly {
  readonly label: string;
  readonly paths: readonly string[];
}[] = [
  {
    label: "B49–B70 wire triad registry",
    paths: ["packages/kernel/src/context/context-registry.ts"],
  },
  {
    label: "B68 hierarchy id boundary",
    paths: [
      "packages/kernel/src/context/hierarchy-id-boundary.contract.ts",
    ],
  },
  {
    label: "B107 tenant SaaS lifecycle wire",
    paths: [
      "packages/kernel/src/context/tenant-saas-lifecycle.contract.ts",
      "packages/kernel/src/context/tenant-saas-lifecycle.parser.ts",
    ],
  },
  {
    label: "B108 tenant extension boundary wire",
    paths: [
      "packages/kernel/src/context/tenant-extension-boundary.contract.ts",
      "packages/kernel/src/context/tenant-extension-boundary.parser.ts",
    ],
  },
  {
    label: "B109 effective dating vocabulary",
    paths: [
      "packages/kernel/src/context/effective-dating-vocabulary.contract.ts",
    ],
  },
  {
    label: "B110 auth actor consumer attestation",
    paths: [
      "scripts/governance/check-erp-auth-actor-protected-path-attestation.mts",
    ],
  },
  {
    label: "B111 tenant lifecycle consumer attestation",
    paths: [
      "scripts/governance/check-erp-tenant-lifecycle-extension-consumer-attestation.mts",
    ],
  },
];

const REGISTERED_CLOSURE_GATES = [
  "check:kernel-context-wire-triad",
  "check:kernel-package-structure",
  "check:kernel-implementation-sequence",
  "check:kernel-slice-catalog-consistency",
  "check:kernel-effective-dating-consumer-attestation",
  "check:erp-auth-actor-protected-path-attestation",
  "check:erp-tenant-lifecycle-extension-consumer-attestation",
] as const;

function assertDeliveredHandoff(
  violations: KernelDeliveredSliceClosureViolation[],
  fileName: string
): void {
  const absolutePath = join(sliceDir, fileName);
  if (!existsSync(absolutePath)) {
    violations.push({
      rule: "delivered-handoff-missing",
      message: `Delivered slice handoff missing: ${fileName}`,
    });
    return;
  }

  const source = readFileSync(absolutePath, "utf8");
  if (!/Status:\*\*\s*Delivered|\*\*Delivered\*\*/.test(source)) {
    violations.push({
      rule: "delivered-handoff-status",
      message: `${fileName} must declare Delivered status for AUD-22 closure`,
    });
  }
}

export function checkKernelDeliveredSliceClosure(): KernelDeliveredSliceClosureViolation[] {
  const violations: KernelDeliveredSliceClosureViolation[] = [];

  for (const violation of checkKernelSliceCatalogConsistency()) {
    violations.push({
      rule: `catalog-${violation.rule}`,
      message: violation.message,
    });
  }

  for (const handoff of B49_B70_HANDOFFS) {
    assertDeliveredHandoff(violations, handoff);
  }

  for (const handoff of B107_B111_HANDOFFS) {
    assertDeliveredHandoff(violations, handoff);
  }

  for (const path of HISTORICAL_CORE_EVIDENCE) {
    const absolutePath = join(repoRoot, path);
    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "historical-core-evidence-missing",
        message: `B2–B48 proxy evidence missing: ${path}`,
      });
    }
  }

  for (const step of listKernelImplementationSequenceSteps()) {
    for (const evidencePath of step.evidencePaths) {
      const absolutePath = join(repoRoot, evidencePath);
      if (!existsSync(absolutePath)) {
        violations.push({
          rule: "implementation-sequence-evidence-missing",
          message: `PAS-001 §11 step ${step.id} evidence missing: ${evidencePath}`,
        });
      }
    }
  }

  for (const track of CLOSURE_TRACK_EVIDENCE) {
    for (const path of track.paths) {
      const absolutePath = join(repoRoot, path);
      if (!existsSync(absolutePath)) {
        violations.push({
          rule: "closure-track-evidence-missing",
          message: `${track.label} evidence missing: ${path}`,
        });
      }
    }
  }

  const packageJsonPath = join(repoRoot, "package.json");
  const packageJson = readFileSync(packageJsonPath, "utf8");
  for (const gate of REGISTERED_CLOSURE_GATES) {
    if (!packageJson.includes(`"${gate}"`)) {
      violations.push({
        rule: "closure-gate-unregistered",
        message: `AUD-22 closure gate not registered in package.json: ${gate}`,
      });
    }
  }

  const pas001Path = join(
    repoRoot,
    "docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md"
  );
  const pas001aPath = join(
    repoRoot,
    "docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md"
  );
  const pas001bPath = join(
    repoRoot,
    "docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md"
  );

  for (const [label, path] of [
    ["PAS-001", pas001Path],
    ["PAS-001A", pas001aPath],
    ["PAS-001B", pas001bPath],
  ] as const) {
    if (!existsSync(path)) {
      violations.push({
        rule: "extension-pas-missing",
        message: `${label} composed PAS missing — future work redirect target absent`,
      });
      continue;
    }
    const source = readFileSync(path, "utf8");
    if (!/\|\s*\*\*Remaining slices\*\*\s*\|\s*none/i.test(source)) {
      violations.push({
        rule: "extension-pas-open-slices",
        message: `${label} must declare Remaining slices: none or redirect future work explicitly`,
      });
    }
  }

  return violations;
}

function main(): void {
  const violations = checkKernelDeliveredSliceClosure();

  if (violations.length > 0) {
    for (const violation of violations) {
      process.stderr.write(`[${violation.rule}] ${violation.message}\n`);
    }
    process.exit(1);
  }

  process.stdout.write(
    "Kernel delivered slice closure gate passed (PAS-001-AUD-22).\n"
  );
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-kernel-delivered-slice-closure.mts")
    );
  } catch {
    return entry.endsWith("check-kernel-delivered-slice-closure.mts");
  }
})();

if (isDirectRun) {
  main();
}
