#!/usr/bin/env tsx
/**
 * PAS-001 §9 — kernel contract rules governance gate.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { KERNEL_CONTRACT_RULE_IDS } from "../../packages/kernel/src/governance/kernel-contract-rules.policy.ts";
import { RETIRED_KERNEL_PLATFORM_ID_PATHS } from "../../packages/kernel/src/identity/governance/identity-module-layout.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const kernelSrcRoot = join(repoRoot, "packages/kernel/src");

const FORBIDDEN_KERNEL_SELF_IMPORT = /from\s+["']@afenda\/kernel(?:\/|["'])/;

const MODULE_SCOPE_SIDE_EFFECT_PATTERNS = [
  /^(?:export\s+)?(?:const|let|var)\s+\w+\s*=\s*[^;\n]*\breadFileSync\s*\(/m,
  /^(?:export\s+)?(?:const|let|var)\s+\w+\s*=\s*[^;\n]*\bwriteFileSync\s*\(/m,
  /^(?:export\s+)?(?:const|let|var)\s+\w+\s*=\s*[^;\n]*\bfetch\s*\(/m,
  /^(?:export\s+)?(?:const|let|var)\s+\w+\s*=\s*[^;\n]*\bspawnSync\s*\(/m,
  /^(?:export\s+)?(?:const|let|var)\s+\w+\s*=\s*[^;\n]*\bexecSync\s*\(/m,
  /^(?:export\s+)?(?:const|let|var)\s+\w+\s*=\s*new Date\(\)/m,
  /^fetch\s*\(/m,
  /^readFileSync\s*\(/m,
  /^writeFileSync\s*\(/m,
  /^spawnSync\s*\(/m,
  /^execSync\s*\(/m,
  /^new Date\(\)/m,
] as const;

const SIDE_EFFECT_SCAN_ROOTS = [kernelSrcRoot] as const;

export interface KernelContractRulesViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function listTypeScriptFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }
      if (entry.name === "__tests__") {
        continue;
      }
      files.push(...listTypeScriptFiles(fullPath));
      continue;
    }

    if (
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".d.ts") &&
      !/\.(test|spec)\./.test(entry.name)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((line) => line.replace(/\/\/.*$/, ""))
    .join("\n");
}

function findReadonlyViolations(
  source: string,
  filePath: string
): KernelContractRulesViolation[] {
  const violations: KernelContractRulesViolation[] = [];
  const lines = stripComments(source).split("\n");

  let scanMode: "interface" | "type" | null = null;
  let bodyDepth = 0;
  let inEnum = false;

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim();

    if (/^export\s+enum\s+/.test(trimmed)) {
      inEnum = true;
    }

    if (inEnum) {
      bodyDepth += (line.match(/\{/g) ?? []).length;
      bodyDepth -= (line.match(/\}/g) ?? []).length;
      if (bodyDepth <= 0) {
        inEnum = false;
        bodyDepth = 0;
      }
      continue;
    }

    if (scanMode === null) {
      if (/^export\s+interface\s+/.test(trimmed)) {
        scanMode = "interface";
        if (trimmed.includes("{")) {
          bodyDepth += (line.match(/\{/g) ?? []).length;
          bodyDepth -= (line.match(/\}/g) ?? []).length;
        }
        continue;
      }

      if (/^export\s+type\s+/.test(trimmed)) {
        const primitiveAlias = /^export\s+type\s+\w+\s*=\s*[^{|]+;?\s*$/.test(
          trimmed
        );
        if (primitiveAlias) {
          continue;
        }

        scanMode = "type";
        if (trimmed.includes("{")) {
          bodyDepth += (line.match(/\{/g) ?? []).length;
          bodyDepth -= (line.match(/\}/g) ?? []).length;
        }
        continue;
      }

      continue;
    }

    if (
      bodyDepth === 0 &&
      (trimmed.startsWith("{") || /^\|\s*\{/.test(trimmed))
    ) {
      bodyDepth += (line.match(/\{/g) ?? []).length;
      bodyDepth -= (line.match(/\}/g) ?? []).length;
      if (bodyDepth <= 0) {
        scanMode = null;
      }
      continue;
    }

    if (bodyDepth > 0) {
      if (/^\s*\w+\s*\(/.test(line)) {
        bodyDepth += (line.match(/\{/g) ?? []).length;
        bodyDepth -= (line.match(/\}/g) ?? []).length;
        if (bodyDepth <= 0) {
          scanMode = null;
          bodyDepth = 0;
        }
        continue;
      }

      if (/^\s*\[/.test(line)) {
        bodyDepth += (line.match(/\{/g) ?? []).length;
        bodyDepth -= (line.match(/\}/g) ?? []).length;
        if (bodyDepth <= 0) {
          scanMode = null;
          bodyDepth = 0;
        }
        continue;
      }

      const propertyMatch = /^\s+(readonly\s+)?(\w+)(\??)\s*:/.exec(line);
      if (propertyMatch !== null && propertyMatch[1] === undefined) {
        violations.push({
          rule: "contract-readonly-property",
          file: filePath,
          message: `Property "${propertyMatch[2]}" must be readonly (PAS §9 rule 5)`,
        });
      }
    }

    bodyDepth += (line.match(/\{/g) ?? []).length;
    bodyDepth -= (line.match(/\}/g) ?? []).length;

    if (bodyDepth <= 0) {
      scanMode = null;
      bodyDepth = 0;
    }
  }

  return violations;
}

function findModuleScopeSideEffects(
  source: string,
  filePath: string
): KernelContractRulesViolation[] {
  const violations: KernelContractRulesViolation[] = [];

  for (const pattern of MODULE_SCOPE_SIDE_EFFECT_PATTERNS) {
    if (pattern.test(source)) {
      violations.push({
        rule: "import-side-effect",
        file: filePath,
        message: `Module-scope side effect pattern ${String(pattern)} is forbidden during import (PAS §9 rule 10)`,
      });
    }
  }

  return violations;
}

export function checkKernelContractRules(): KernelContractRulesViolation[] {
  const violations: KernelContractRulesViolation[] = [];

  if (KERNEL_CONTRACT_RULE_IDS.length !== 14) {
    violations.push({
      rule: "policy-rule-count",
      file: join(kernelSrcRoot, "governance/kernel-contract-rules.policy.ts"),
      message: `Expected 14 PAS §9 rule ids, found ${KERNEL_CONTRACT_RULE_IDS.length}`,
    });
  }

  for (const relativePath of RETIRED_KERNEL_PLATFORM_ID_PATHS) {
    const absolutePath = join(repoRoot, relativePath);
    if (existsSync(absolutePath)) {
      violations.push({
        rule: "retired-platform-id-contract",
        file: absolutePath,
        message: `${relativePath} is retired — identity authority lives in packages/kernel/src/identity/ (PAS §9 rule 11)`,
      });
    }
  }

  for (const filePath of listTypeScriptFiles(kernelSrcRoot)) {
    const source = readFileSync(filePath, "utf8");
    const relativePath = relative(repoRoot, filePath).replace(/\\/g, "/");

    for (const line of source.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) {
        continue;
      }
      if (FORBIDDEN_KERNEL_SELF_IMPORT.test(line)) {
        violations.push({
          rule: "kernel-self-import",
          file: filePath,
          message: `${relativePath} must not import @afenda/kernel from inside kernel (PAS §9 rule 2)`,
        });
        break;
      }
    }

    if (!relativePath.endsWith(".contract.ts")) {
      continue;
    }

    violations.push(...findReadonlyViolations(source, filePath));
  }

  for (const scanRoot of SIDE_EFFECT_SCAN_ROOTS) {
    if (!existsSync(scanRoot)) {
      continue;
    }

    for (const filePath of listTypeScriptFiles(scanRoot)) {
      if (!statSync(filePath).isFile()) {
        continue;
      }
      const source = readFileSync(filePath, "utf8");
      violations.push(...findModuleScopeSideEffects(source, filePath));
    }
  }

  return violations;
}

export function formatKernelContractRulesViolations(
  violations: readonly KernelContractRulesViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map(
      (violation) =>
        `[${violation.rule}] ${violation.file}\n  ${violation.message}`
    )
    .join("\n\n");
}

const violations = checkKernelContractRules();

if (violations.length > 0) {
  console.error("Kernel contract rules gate failed:\n");
  console.error(formatKernelContractRulesViolations(violations));
  process.exit(1);
}

console.log("Kernel contract rules gate passed (PAS-001 §9).");
