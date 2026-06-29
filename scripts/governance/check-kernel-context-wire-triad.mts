#!/usr/bin/env tsx
/**
 * PAS-001 §9 rule 14 — operating-context wire triad completeness gate.
 *
 * Verifies contract/assert/parser siblings exist for every registered wire ingress
 * module plus hierarchy-id-boundary support triad.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES } from "../../packages/kernel/src/context/context-registry.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const contextRoot = join(repoRoot, "packages/kernel/src/context");

const ADDITIONAL_WIRE_TRIADS = [
  {
    slug: "hierarchy-id-boundary",
    contract: "hierarchy-id-boundary.contract.ts",
    assert: "hierarchy-id-boundary.assert.ts",
    parser: "hierarchy-id-boundary.parser.ts",
  },
  {
    slug: "tenant-saas-lifecycle",
    contract: "tenant-saas-lifecycle.contract.ts",
    assert: "tenant-saas-lifecycle.assert.ts",
    parser: "tenant-saas-lifecycle.parser.ts",
  },
  {
    slug: "tenant-extension-boundary",
    contract: "tenant-extension-boundary.contract.ts",
    assert: "tenant-extension-boundary.assert.ts",
    parser: "tenant-extension-boundary.parser.ts",
  },
] as const;

export interface KernelContextWireTriadViolation {
  readonly file: string;
  readonly message: string;
}

export function checkKernelContextWireTriads(): KernelContextWireTriadViolation[] {
  const violations: KernelContextWireTriadViolation[] = [];

  const triads = [
    ...KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES,
    ...ADDITIONAL_WIRE_TRIADS,
  ];

  for (const triad of triads) {
    for (const fileName of [triad.contract, triad.assert, triad.parser]) {
      const absolutePath = join(contextRoot, fileName);
      if (!existsSync(absolutePath)) {
        violations.push({
          file: absolutePath,
          message: `Missing wire triad module for slug "${triad.slug}": ${fileName}`,
        });
      }
    }
  }

  return violations;
}

const violations = checkKernelContextWireTriads();

if (violations.length > 0) {
  for (const violation of violations) {
    process.stderr.write(`${violation.file}: ${violation.message}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  "Kernel context wire triad gate passed (PAS-001 §4.4 / §9 rule 14).\n"
);
