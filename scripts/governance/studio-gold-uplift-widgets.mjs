#!/usr/bin/env node
/**
 * One-shot: bump widget primitive contracts + T1 tests from 1.1.0 → 1.2.0 (Gold).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
const uiDir = join(repoRoot, "packages/shadcn-studio/src/components-ui");

const GOLD_ALREADY = new Set([
  "accordion",
  "alert-dialog",
  "avatar",
  "button",
  "checkbox",
]);

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
    if (!entry.endsWith(".tsx") || entry.includes(".test.")) {
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

function bumpFile(path) {
  if (!existsSync(path)) {
    return false;
  }
  const before = readFileSync(path, "utf8");
  if (!before.includes('"1.1.0"')) {
    return false;
  }
  const after = before
    .replace(
      /\/\*\* Enterprise overlay primitive/g,
      "/** Gold overlay primitive"
    )
    .replace(
      /export const PRIMITIVE_CONTRACT_VERSION = "1\.1\.0"/g,
      'export const PRIMITIVE_CONTRACT_VERSION = "1.2.0"'
    )
    .replace(
      /expect\(PRIMITIVE_CONTRACT_VERSION\)\.toBe\("1\.1\.0"\)/g,
      'expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0")'
    );
  if (after === before) {
    return false;
  }
  writeFileSync(path, after);
  return true;
}

const widgets = listWidgetPrimitives().filter((n) => !GOLD_ALREADY.has(n));
let bumped = 0;

for (const name of widgets) {
  if (bumpFile(join(uiDir, `${name}.contract.ts`))) {
    bumped += 1;
  }
  bumpFile(join(uiDir, `${name}.contract.test.ts`));
}

process.stdout.write(
  `gold uplift: bumped ${bumped} widget contracts (${widgets.length} targets)\n`
);
