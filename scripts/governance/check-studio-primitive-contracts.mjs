#!/usr/bin/env node
/**
 * PAS-006 — primitive 2-file contract gate.
 * Every Base UI widget primitive requires {name}.contract.ts + relative adapter import.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
const uiDir = join(repoRoot, "packages/shadcn-studio/src/components-ui");
const testsUiDir = join(
  repoRoot,
  "packages/shadcn-studio/src/__tests__/components-ui"
);

const MERGE_ONLY = new Set([
  "badge",
  "button-group",
  "bubble",
  "item",
  "marker",
  "attachment",
  "breadcrumb",
  "sidebar",
]);

/** T0 static primitives — covered by aggregate registry test instead of per-file contract tests. */
const T0_AGGREGATE_COVERED = new Set([
  "aspect-ratio",
  "kbd",
  "separator",
  "skeleton",
  "spinner",
]);

const AGGREGATE_REGISTRY_TEST = join(
  testsUiDir,
  "components-ui.contract-registry.test.ts"
);

function isWidgetPrimitive(content, name) {
  if (MERGE_ONLY.has(name)) {
    return false;
  }

  if (!content.includes("@base-ui/react")) {
    return false;
  }

  const imports = [
    ...content.matchAll(/from\s+["']@base-ui\/react(?:\/([^"']+))?["']/g),
  ];

  if (imports.length === 0) {
    return false;
  }

  return !imports.every((match) => {
    const sub = match[1] ?? "";
    return sub === "merge-props" || sub === "use-render";
  });
}

function listWidgetPrimitives() {
  const names = [];

  for (const entry of readdirSync(uiDir)) {
    if (!entry.endsWith(".tsx")) {
      continue;
    }
    if (entry.includes(".test.") || entry.includes(".stories.")) {
      continue;
    }

    const name = basename(entry, ".tsx");
    const content = readFileSync(join(uiDir, entry), "utf8");

    if (isWidgetPrimitive(content, name)) {
      names.push(name);
    }
  }

  return names.sort();
}

export function checkStudioPrimitiveContracts() {
  const violations = [];

  for (const name of listWidgetPrimitives()) {
    const contractPath = join(uiDir, `${name}.contract.ts`);
    const adapterPath = join(uiDir, `${name}.tsx`);
    const testPath = join(testsUiDir, `${name}.contract.test.ts`);

    if (!existsSync(contractPath)) {
      violations.push(`${name}: missing ${name}.contract.ts`);
      continue;
    }

    const contractContent = readFileSync(contractPath, "utf8");
    if (!/PRIMITIVE_CONTRACT_VERSION/.test(contractContent)) {
      violations.push(`${name}: contract missing PRIMITIVE_CONTRACT_VERSION`);
    }

    const adapterContent = readFileSync(adapterPath, "utf8");
    const importPattern = new RegExp(
      `from\\s+["']\\.\\/${name}\\.contract(?:\\.js)?["']`
    );
    if (!importPattern.test(adapterContent)) {
      violations.push(
        `${name}: adapter must import from ./${name}.contract (relative)`
      );
    }

    if (!existsSync(testPath)) {
      if (T0_AGGREGATE_COVERED.has(name)) {
        if (!existsSync(AGGREGATE_REGISTRY_TEST)) {
          violations.push(
            `${name}: missing ${AGGREGATE_REGISTRY_TEST} for T0 aggregate coverage`
          );
        }
        continue;
      }

      violations.push(`${name}: missing ${name}.contract.test.ts`);
    }
  }

  return violations;
}

const violations = checkStudioPrimitiveContracts();

if (violations.length > 0) {
  process.stderr.write("studio primitive contracts: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  `studio primitive contracts: OK (${listWidgetPrimitives().length} widgets)\n`
);
