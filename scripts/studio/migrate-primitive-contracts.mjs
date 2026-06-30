#!/usr/bin/env node
/**
 * One-shot / maintenance — split Base UI primitives into {name}.contract.ts + adapter.
 * Gate target: @base-ui/react/<widget> imports (excludes merge-props / use-render only).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const uiDir = join(repoRoot, "packages/shadcn-studio/src/components/ui");

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

const LUCIDE_IMPORT_RE = /import\s+\{([^}]+)\}\s+from\s+["']lucide-react["'];?/;
const CONST_EXPORT_RE = /^const /;
const ICON_ALIAS_RE = /\s+as\s+\w+/;
const BASE_UI_IMPORT_RE = /from\s+["']@base-ui\/react(?:\/([^"']+))?["']/g;
const DATA_SLOT_RE = /data-slot="([^"]+)"/g;
const SLOT_SUFFIX_RE = /-([a-z])/g;
const CVA_BLOCK_RE = /const\s+(\w+)\s*=\s*cva\([\s\S]*?\n\);/g;

function isWidgetPrimitive(content, name) {
  if (MERGE_ONLY.has(name)) {
    return false;
  }

  if (!content.includes("@base-ui/react")) {
    return false;
  }

  const imports = [...content.matchAll(BASE_UI_IMPORT_RE)];

  if (imports.length === 0) {
    return false;
  }

  const onlyHelpers = imports.every((match) => {
    const sub = match[1] ?? "";
    return sub === "merge-props" || sub === "use-render";
  });

  return !onlyHelpers;
}

function slotKeyFromValue(slotValue, prefix) {
  if (slotValue === prefix) {
    return "root";
  }

  if (slotValue.startsWith(`${prefix}-`)) {
    const suffix = slotValue.slice(prefix.length + 1);
    return suffix.replace(SLOT_SUFFIX_RE, (_, c) => c.toUpperCase());
  }

  return slotValue.replace(SLOT_SUFFIX_RE, (_, c) => c.toUpperCase());
}

function extractSlots(content, prefix) {
  const slots = {};
  for (const match of content.matchAll(DATA_SLOT_RE)) {
    const value = match[1];
    const key = slotKeyFromValue(value, prefix);
    slots[key] = value;
  }
  return slots;
}

function extractCvaBlocks(content) {
  const blocks = [];
  for (const match of content.matchAll(CVA_BLOCK_RE)) {
    blocks.push({ name: match[1], code: match[0] });
  }
  return blocks;
}

function extractIconImports(content) {
  const match = content.match(LUCIDE_IMPORT_RE);
  if (!match) {
    return { importLine: null, icons: [] };
  }
  const icons = match[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { importLine: match[0], icons };
}

function buildContract(name, content) {
  const prefix = name;
  const slots = extractSlots(content, prefix);
  const slotsConst = `${name
    .split("-")
    .map((s, i) =>
      i === 0 ? s.toUpperCase() : s.charAt(0).toUpperCase() + s.slice(1)
    )
    .join("_")}_SLOTS`;

  const cvaBlocks = extractCvaBlocks(content);
  const { importLine: iconImport, icons } = extractIconImports(content);

  const lines = [
    `export const PRIMITIVE_CONTRACT_VERSION = "1.0.0" as const;`,
    "",
    `export const ${slotsConst} = ${JSON.stringify(slots, null, 2).replace(/"([^"]+)":/g, "$1:")} as const;`,
  ];

  if (cvaBlocks.length > 0) {
    lines.push("", `import { cva } from "class-variance-authority";`, "");
    for (const block of cvaBlocks) {
      lines.push(block.code.replace(CONST_EXPORT_RE, "export const "));
    }
  }

  if (iconImport) {
    lines.unshift(iconImport);
    if (lines[1] !== "") {
      lines.splice(1, 0, "");
    }
    for (const icon of icons) {
      const base = icon.replace(ICON_ALIAS_RE, "");
      lines.push("", `export { ${base} };`);
    }
  }

  return {
    contract: `${lines.join("\n")}\n`,
    slotsConst,
    cvaBlocks,
    icons,
    iconImport,
  };
}

function buildContractTest(name, slotsConst) {
  return `import { describe, expect, it } from "vitest";

import {
  PRIMITIVE_CONTRACT_VERSION,
  ${slotsConst},
} from "./${name}.contract.js";

describe("${name} primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.0.0");
  });

  it("exports slot map with string values", () => {
    for (const value of Object.values(${slotsConst})) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it("is JSON-serializable", () => {
    const payload = {
      version: PRIMITIVE_CONTRACT_VERSION,
      slots: ${slotsConst},
    };
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });
});
`;
}

function injectContractImport(
  content,
  name,
  slotsConst,
  cvaBlocks,
  iconImport
) {
  let updated = content;

  const contractImport = `import {\n  ${slotsConst}${cvaBlocks.length > 0 ? `,\n  ${cvaBlocks.map((b) => b.name).join(",\n  ")}` : ""}${
    iconImport
      ? `,\n  ${extractIconImports(content)
          .icons.map((i) => i.replace(ICON_ALIAS_RE, ""))
          .join(",\n  ")}`
      : ""
  }\n} from "./${name}.contract";`;

  if (updated.includes(`from "./${name}.contract"`)) {
    return updated;
  }

  const firstImportEnd = updated.indexOf("\n\n");
  if (firstImportEnd === -1) {
    updated = `${contractImport}\n${updated}`;
  } else {
    let insertAt = 0;
    const useClient = updated.startsWith('"use client";');
    if (useClient) {
      insertAt = updated.indexOf("\n", 0) + 1;
    }
    const rest = updated.slice(insertAt);
    const lastImportIdx = rest.lastIndexOf("\nimport ");
    if (lastImportIdx === -1) {
      updated = `${updated.slice(0, insertAt)}${contractImport}\n${rest}`;
    } else {
      const lineEnd = rest.indexOf("\n", lastImportIdx + 1);
      const before = updated.slice(0, insertAt + lineEnd + 1);
      const after = updated.slice(insertAt + lineEnd + 1);
      updated = `${before}${contractImport}\n${after}`;
    }
  }

  for (const block of cvaBlocks) {
    updated = updated.replace(`${block.code}\n`, "");
    updated = updated.replace(block.code, "");
  }

  if (iconImport) {
    updated = updated.replace(`${iconImport}\n`, "");
    updated = updated.replace(iconImport, "");
  }

  for (const match of updated.matchAll(DATA_SLOT_RE)) {
    const value = match[1];
    const key = slotKeyFromValue(value, name);
    const slotsConstName = `${name
      .split("-")
      .map((s, i) =>
        i === 0 ? s.toUpperCase() : s.charAt(0).toUpperCase() + s.slice(1)
      )
      .join("_")}_SLOTS`;
    updated = updated.replace(
      `data-slot="${value}"`,
      `data-slot={${slotsConstName}.${key}}`
    );
  }

  return updated;
}

function migrateFile(name) {
  const tsxPath = join(uiDir, `${name}.tsx`);
  const contractPath = join(uiDir, `${name}.contract.ts`);
  const testPath = join(uiDir, `${name}.contract.test.ts`);

  if (!existsSync(tsxPath)) {
    return { name, status: "missing" };
  }

  if (existsSync(contractPath)) {
    return { name, status: "exists" };
  }

  const content = readFileSync(tsxPath, "utf8");

  if (!isWidgetPrimitive(content, name)) {
    return { name, status: "skipped" };
  }

  const { contract, slotsConst, cvaBlocks, iconImport } = buildContract(
    name,
    content
  );
  writeFileSync(contractPath, contract, "utf8");

  const updatedTsx = injectContractImport(
    content,
    name,
    slotsConst,
    cvaBlocks,
    iconImport
  );
  writeFileSync(tsxPath, updatedTsx, "utf8");
  writeFileSync(testPath, buildContractTest(name, slotsConst), "utf8");

  return { name, status: "migrated" };
}

const results = readdirSync(uiDir)
  .filter(
    (f) =>
      f.endsWith(".tsx") && !f.includes(".test.") && !f.includes(".stories.")
  )
  .map((f) => migrateFile(basename(f, ".tsx")));

const migrated = results.filter((r) => r.status === "migrated");
const skipped = results.filter((r) => r.status === "skipped");
const exists = results.filter((r) => r.status === "exists");

process.stdout.write(
  `migrate-primitive-contracts: migrated=${migrated.length} skipped=${skipped.length} exists=${exists.length}\n`
);
for (const r of migrated) {
  process.stdout.write(`  + ${r.name}\n`);
}
