#!/usr/bin/env tsx
/**
 * PAS-001-AUD-13 — ERP localization context ingress attestation gate.
 *
 * Verifies user and company settings persistence paths parse kernel
 * LocalizationContext at explicit trust boundaries (mirror BMD ingress).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpLocalizationRoot = join(repoRoot, "apps/erp/src/lib/localization");
const parserPath = join(
  erpLocalizationRoot,
  "parse-localization-context.server.ts"
);
const wiringPath = join(
  erpLocalizationRoot,
  "localization-context-ingress.contract.ts"
);

export interface ErpLocalizationContextIngressViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

export function checkErpLocalizationContextIngressAttestation(): ErpLocalizationContextIngressViolation[] {
  const violations: ErpLocalizationContextIngressViolation[] = [];

  if (!existsSync(parserPath)) {
    violations.push({
      rule: "required-module-missing",
      file: parserPath,
      message: "parse-localization-context.server.ts is required.",
    });
    return violations;
  }

  if (!existsSync(wiringPath)) {
    violations.push({
      rule: "required-module-missing",
      file: wiringPath,
      message: "localization-context-ingress.contract.ts is required.",
    });
    return violations;
  }

  const parserSource = readFileSync(parserPath, "utf8");
  const wiringSource = readFileSync(wiringPath, "utf8");

  if (!parserSource.includes("parseUnknownLocalizationContext")) {
    violations.push({
      rule: "kernel-delegate-missing",
      file: parserPath,
      message:
        "parse-localization-context.server.ts must delegate to kernel parseUnknownLocalizationContext.",
    });
  }

  const wiringMatch = wiringSource.match(
    /export const ERP_LOCALIZATION_INGRESS_WIRING\s*=\s*(\[[\s\S]*?\])\s*as const;/
  );

  if (wiringMatch === null) {
    violations.push({
      rule: "wiring-registry-missing",
      file: wiringPath,
      message: "ERP_LOCALIZATION_INGRESS_WIRING registry is missing.",
    });
    return violations;
  }

  const entries: {
    id: string;
    module: string;
    delegate: string;
    kernelDelegate: string;
    persistenceDelegate: string;
  }[] = [];

  const entryPattern =
    /\{\s*id:\s*"([^"]+)"[\s\S]*?module:\s*"([^"]+)"[\s\S]*?delegate:\s*"([^"]+)"[\s\S]*?kernelDelegate:\s*"([^"]+)"[\s\S]*?persistenceDelegate:\s*"([^"]+)"/g;

  for (const entry of wiringMatch[1].matchAll(entryPattern)) {
    entries.push({
      id: entry[1],
      module: entry[2],
      delegate: entry[3],
      kernelDelegate: entry[4],
      persistenceDelegate: entry[5],
    });
  }

  if (entries.length !== 2) {
    violations.push({
      rule: "wiring-count",
      file: wiringPath,
      message: `Expected 2 localization ingress wiring entries, found ${entries.length}.`,
    });
  }

  for (const entry of entries) {
    const relativeModule = entry.module.replace("@/lib/localization/", "");
    const moduleBase = join(
      repoRoot,
      "apps/erp/src/lib/localization",
      relativeModule
    );
    const modulePath = existsSync(`${moduleBase}.ts`)
      ? `${moduleBase}.ts`
      : moduleBase;

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "persistence-module-missing",
        file: modulePath,
        message: `Missing persistence module for ${entry.id}.`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");

    if (!parserSource.includes(`export function ${entry.delegate}`)) {
      violations.push({
        rule: "ingress-delegate-missing",
        file: parserPath,
        message: `Missing export function ${entry.delegate} for ${entry.id}.`,
      });
    }

    if (!moduleSource.includes(entry.persistenceDelegate)) {
      violations.push({
        rule: "persistence-delegate-missing",
        file: modulePath,
        message: `Missing persistence delegate ${entry.persistenceDelegate} for ${entry.id}.`,
      });
    }

    if (!moduleSource.includes(entry.delegate)) {
      violations.push({
        rule: "ingress-delegate-import-missing",
        file: modulePath,
        message: `${entry.persistenceDelegate} must call ${entry.delegate}.`,
      });
    }
  }

  for (const relativeTestPath of [
    "__tests__/parse-localization-context.server.test.ts",
    "__tests__/localization-context-persistence.server.test.ts",
  ] as const) {
    const testPath = join(erpLocalizationRoot, relativeTestPath);
    if (!existsSync(testPath)) {
      violations.push({
        rule: "test-missing",
        file: testPath,
        message: `${relativeTestPath} is required for localization ingress attestation.`,
      });
    }
  }

  return violations;
}

function main(): void {
  const violations = checkErpLocalizationContextIngressAttestation();

  if (violations.length > 0) {
    console.error("check:erp-localization-context-ingress-attestation: FAIL");
    for (const violation of violations) {
      console.error(
        `  [${violation.rule}] ${violation.file}: ${violation.message}`
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    "check:erp-localization-context-ingress-attestation: PASS (user + company settings)"
  );
}

if (
  process.argv[1]?.endsWith(
    "check-erp-localization-context-ingress-attestation.mts"
  )
) {
  main();
}
