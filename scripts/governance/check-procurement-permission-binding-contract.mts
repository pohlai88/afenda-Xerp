#!/usr/bin/env tsx
/**
 * ERP-PROC-OP-004 — procurement permission binding declaration drift gate.
 * Asserts features-package contract matches kernel vocabulary and foundation bundle;
 * no PERMISSION_REGISTRY wiring on disk until authorized enforcement slice.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PROCUREMENT_FOUNDATION_BUNDLE } from "../../packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts";
import {
  PROCUREMENT_KERNEL_PERMISSION_KEYS,
  PROCUREMENT_PERMISSION_BINDING_CONTRACT,
} from "../../packages/features/erp-modules/src/procurement/procurement.permission-binding.contract.ts";
import { PROCUREMENT_PERMISSION_KEY_VOCABULARY } from "../../packages/kernel/src/erp-domain/procurement/procurement-permission-vocabulary.contract.ts";
import {
  type ErpModuleFoundationViolation,
  getRepoRoot,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:procurement-permission-binding-contract";
const PERMISSION_CONTRACT_PATH =
  "packages/permissions/src/grants/permission.contract.ts";
const EXPECTED_KEY_COUNT = 18;

function sortedKeys(keys: readonly string[]): string[] {
  return [...keys].sort((left, right) => left.localeCompare(right));
}

export function checkProcurementPermissionBindingContract(): ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const contract = PROCUREMENT_PERMISSION_BINDING_CONTRACT;
  const bundleBinding = PROCUREMENT_FOUNDATION_BUNDLE.permissionBinding;
  const kernelKeys = sortedKeys(PROCUREMENT_PERMISSION_KEY_VOCABULARY);
  const contractKeys = sortedKeys(contract.kernelPermissionKeys);
  const declaredKeys = sortedKeys(PROCUREMENT_KERNEL_PERMISSION_KEYS);

  if (contractKeys.length !== EXPECTED_KEY_COUNT) {
    violations.push({
      rule: "kernel-key-count",
      file: GATE,
      message: `expected ${EXPECTED_KEY_COUNT} kernel permission keys — got ${contractKeys.length}`,
    });
  }

  if (kernelKeys.join("|") !== contractKeys.join("|")) {
    violations.push({
      rule: "kernel-vocabulary-parity",
      file: GATE,
      message:
        "PROCUREMENT_PERMISSION_BINDING_CONTRACT.kernelPermissionKeys !== PROCUREMENT_PERMISSION_KEY_VOCABULARY",
    });
  }

  if (declaredKeys.join("|") !== contractKeys.join("|")) {
    violations.push({
      rule: "export-key-parity",
      file: GATE,
      message:
        "PROCUREMENT_KERNEL_PERMISSION_KEYS export !== PROCUREMENT_PERMISSION_BINDING_CONTRACT.kernelPermissionKeys",
    });
  }

  if (contract.permissionParity !== "deferred") {
    violations.push({
      rule: "permission-parity-deferred",
      file: GATE,
      message: `permissionParity must be "deferred" — got "${contract.permissionParity}"`,
    });
  }

  if (contract.registryWiringStatus !== "deferred") {
    violations.push({
      rule: "registry-wiring-deferred",
      file: GATE,
      message: `registryWiringStatus must be "deferred" — got "${contract.registryWiringStatus}"`,
    });
  }

  const bundleFields: Array<
    keyof Pick<
      typeof contract,
      "module" | "kvId" | "permissionNamespace" | "permissionParity"
    >
  > = ["module", "kvId", "permissionNamespace", "permissionParity"];

  for (const field of bundleFields) {
    if (contract[field] !== bundleBinding[field]) {
      violations.push({
        rule: "bundle-binding-drift",
        file: GATE,
        message: `${field}: contract "${String(contract[field])}" !== bundle "${String(bundleBinding[field])}"`,
      });
    }
  }

  const bundleKeys = sortedKeys(bundleBinding.kernelPermissionKeys);
  if (bundleKeys.join("|") !== contractKeys.join("|")) {
    violations.push({
      rule: "bundle-key-drift",
      file: GATE,
      message:
        "PROCUREMENT_FOUNDATION_BUNDLE.permissionBinding.kernelPermissionKeys !== features contract",
    });
  }

  const repoRoot = getRepoRoot();
  const permissionContractContent = readFileSync(
    join(repoRoot, PERMISSION_CONTRACT_PATH),
    "utf8"
  );

  if (
    /definePermissionKey\s*\(\s*["']procurement["']/.test(
      permissionContractContent
    )
  ) {
    violations.push({
      rule: "no-permission-registry-wiring",
      file: GATE,
      message:
        "procurement PERMISSION_REGISTRY entries must not exist until authorized enforcement slice",
    });
  }

  if (/^\s*procurement\s*:/m.test(permissionContractContent)) {
    violations.push({
      rule: "no-permission-registry-namespace",
      file: GATE,
      message:
        "procurement namespace in PERMISSION_REGISTRY prohibited until authorized enforcement slice",
    });
  }

  if (violations.length === 0) {
    console.log(
      `  permission binding contract OK: ${EXPECTED_KEY_COUNT} kernel keys · parity deferred · no PERMISSION_REGISTRY procurement wiring`
    );
  }

  return violations;
}

function run(): readonly ErpModuleFoundationViolation[] {
  return checkProcurementPermissionBindingContract();
}

reportViolations(GATE, run());
