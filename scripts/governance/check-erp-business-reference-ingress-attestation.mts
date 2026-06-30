#!/usr/bin/env tsx
/**
 * PAS-001-AUD-05 P3 — ERP business reference ingress attestation gate.
 *
 * Verifies all seven BMD families expose kernel-backed parseRoute* helpers.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpApiRoot = join(repoRoot, "apps/erp/src/lib/api");
const parseRoutePath = join(erpApiRoot, "parse-route-id.ts");
const wiringPath = join(erpApiRoot, "business-reference-ingress.contract.ts");

export interface ErpBusinessReferenceIngressViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

export function checkErpBusinessReferenceIngressAttestation(): ErpBusinessReferenceIngressViolation[] {
  const violations: ErpBusinessReferenceIngressViolation[] = [];

  if (!existsSync(parseRoutePath)) {
    violations.push({
      rule: "required-module-missing",
      file: parseRoutePath,
      message: "parse-route-id.ts is required for BMD ingress attestation.",
    });
    return violations;
  }

  if (!existsSync(wiringPath)) {
    violations.push({
      rule: "required-module-missing",
      file: wiringPath,
      message: "business-reference-ingress.contract.ts is required.",
    });
    return violations;
  }

  const parseRouteSource = readFileSync(parseRoutePath, "utf8");
  const wiringSource = readFileSync(wiringPath, "utf8");

  const wiringMatch = wiringSource.match(
    /export const ERP_BMD_INGRESS_WIRING\s*=\s*(\[[\s\S]*?\])\s*as const;/
  );

  if (wiringMatch === null) {
    violations.push({
      rule: "wiring-registry-missing",
      file: wiringPath,
      message: "ERP_BMD_INGRESS_WIRING registry is missing.",
    });
    return violations;
  }

  const entries: {
    id: string;
    delegate: string;
    kernelParser: string;
  }[] = [];

  const entryPattern =
    /\{\s*id:\s*"([^"]+)"[\s\S]*?delegate:\s*"([^"]+)"[\s\S]*?kernelParser:\s*"([^"]+)"/g;

  for (const entry of wiringMatch[1].matchAll(entryPattern)) {
    entries.push({
      id: entry[1],
      delegate: entry[2],
      kernelParser: entry[3],
    });
  }

  if (entries.length !== 7) {
    violations.push({
      rule: "wiring-count",
      file: wiringPath,
      message: `Expected 7 BMD ingress wiring entries, found ${entries.length}.`,
    });
  }

  for (const entry of entries) {
    if (!parseRouteSource.includes(`export function ${entry.delegate}`)) {
      violations.push({
        rule: "delegate-export-missing",
        file: parseRoutePath,
        message: `Missing export function ${entry.delegate} for ${entry.id}.`,
      });
    }

    if (!parseRouteSource.includes(entry.kernelParser)) {
      violations.push({
        rule: "kernel-parser-import-missing",
        file: parseRoutePath,
        message: `${entry.delegate} must import/use kernel ${entry.kernelParser}.`,
      });
    }
  }

  for (const relativeTestPath of [
    "__tests__/parse-route-id.test.ts",
    "__tests__/warehouse-kernel-wire-attestation.test.ts",
  ] as const) {
    const testPath = join(erpApiRoot, relativeTestPath);
    if (!existsSync(testPath)) {
      violations.push({
        rule: "test-missing",
        file: testPath,
        message: `${relativeTestPath} is required for BMD ingress attestation.`,
      });
    }
  }

  const warehouseAttestationPath = join(
    erpApiRoot,
    "__tests__/warehouse-kernel-wire-attestation.test.ts"
  );
  if (existsSync(warehouseAttestationPath)) {
    const warehouseAttestationSource = readFileSync(
      warehouseAttestationPath,
      "utf8"
    );
    if (!warehouseAttestationSource.includes("WarehouseWireReference")) {
      violations.push({
        rule: "warehouse-wire-attestation-marker-missing",
        file: warehouseAttestationPath,
        message:
          "warehouse-kernel-wire-attestation.test.ts must reference WarehouseWireReference (PAS-001-AUD-05 P4).",
      });
    }
    if (!warehouseAttestationSource.includes("WarehouseAuthorityRecord")) {
      violations.push({
        rule: "warehouse-authority-attestation-marker-missing",
        file: warehouseAttestationPath,
        message:
          "warehouse-kernel-wire-attestation.test.ts must reference WarehouseAuthorityRecord (PAS-001-AUD-05 P4).",
      });
    }
  }

  return violations;
}

function main(): void {
  const violations = checkErpBusinessReferenceIngressAttestation();

  if (violations.length > 0) {
    console.error("check:erp-business-reference-ingress-attestation: FAIL");
    for (const violation of violations) {
      console.error(
        `  [${violation.rule}] ${violation.file}: ${violation.message}`
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    "check:erp-business-reference-ingress-attestation: PASS (7 BMD families)"
  );
}

if (
  process.argv[1]?.endsWith(
    "check-erp-business-reference-ingress-attestation.mts"
  )
) {
  main();
}
