#!/usr/bin/env tsx
/**
 * PAS-001 §10 rule 2 — no-forbidden-runtime-access governance gate.
 *
 * PAS-001-AUD-20: proves kernel production source does not read env, open I/O,
 * import UI/runtime frameworks, or pull forbidden workspace packages.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const kernelSrcRoot = join(repoRoot, "packages/kernel/src");

/** Sole approved node built-in runtime import outside tests (PAS §10 ALS primitive). */
const APPROVED_NODE_ASYNC_HOOKS = new Set([
  "packages/kernel/src/propagation/kernel-context.ts",
]);

const FORBIDDEN_IMPORT_PATTERNS = [
  {
    rule: "forbidden-workspace-import",
    pattern:
      /from\s+["'](@afenda\/(?:database|auth|permissions|execution|observability|appshell|erp)|apps\/erp)/,
    message:
      "Kernel must not import runtime workspace packages (PAS §10 rule 2).",
  },
  {
    rule: "forbidden-ui-runtime-import",
    pattern: /from\s+["'](?:react(?:\/|$)|next(?:\/|$)|@afenda\/ui)/,
    message: "Kernel must not import UI/runtime frameworks (PAS §10 rule 2).",
  },
  {
    rule: "forbidden-persistence-import",
    pattern: /from\s+["'](?:drizzle-orm|postgres|@neondatabase\/)/,
    message: "Kernel must not import database clients (PAS §10 rule 2).",
  },
  {
    rule: "forbidden-node-fs-import",
    pattern: /from\s+["']node:fs["']/,
    message:
      "Kernel production source must not import node:fs (PAS §10 rule 2).",
  },
  {
    rule: "forbidden-node-http-import",
    pattern: /from\s+["']node:(?:http|https|net|tls)["']/,
    message: "Kernel must not import HTTP/network modules (PAS §10 rule 2).",
  },
] as const;

const FORBIDDEN_SOURCE_PATTERNS = [
  {
    rule: "forbidden-process-env",
    pattern: /\bprocess\.env\b/,
    message: "Kernel must not read process.env (PAS §10 rule 2).",
  },
  {
    rule: "forbidden-global-fetch",
    pattern: /\bfetch\s*\(/,
    message: "Kernel must not call fetch (PAS §10 rule 2).",
  },
] as const;

export interface KernelForbiddenRuntimeAccessViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function listProductionTypeScriptFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === "dist" ||
        entry.name === "__tests__"
      ) {
        continue;
      }
      files.push(...listProductionTypeScriptFiles(fullPath));
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

export function checkKernelForbiddenRuntimeAccess(): KernelForbiddenRuntimeAccessViolation[] {
  const violations: KernelForbiddenRuntimeAccessViolation[] = [];

  for (const filePath of listProductionTypeScriptFiles(kernelSrcRoot)) {
    const relativePath = relative(repoRoot, filePath).replace(/\\/g, "/");
    const source = stripComments(readFileSync(filePath, "utf8"));

    if (
      /from\s+["']node:async_hooks["']/.test(source) &&
      !APPROVED_NODE_ASYNC_HOOKS.has(relativePath)
    ) {
      violations.push({
        rule: "forbidden-node-async-hooks-import",
        file: filePath,
        message:
          "node:async_hooks is approved only in propagation/kernel-context.ts (PAS §10).",
      });
    }

    for (const { rule, pattern, message } of FORBIDDEN_IMPORT_PATTERNS) {
      if (pattern.test(source)) {
        violations.push({ rule, file: filePath, message });
      }
    }

    for (const { rule, pattern, message } of FORBIDDEN_SOURCE_PATTERNS) {
      if (pattern.test(source)) {
        violations.push({ rule, file: filePath, message });
      }
    }
  }

  return violations;
}

export function formatKernelForbiddenRuntimeAccessViolations(
  violations: readonly KernelForbiddenRuntimeAccessViolation[]
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

const violations = checkKernelForbiddenRuntimeAccess();

if (violations.length > 0) {
  console.error("Kernel forbidden-runtime-access gate failed:\n");
  console.error(formatKernelForbiddenRuntimeAccessViolations(violations));
  process.exit(1);
}

console.log(
  "Kernel forbidden-runtime-access gate passed (PAS-001 §10 rule 2 / AUD-20)."
);
