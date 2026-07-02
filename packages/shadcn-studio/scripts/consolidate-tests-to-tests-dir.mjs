#!/usr/bin/env node
/**
 * One-shot: move @afenda/shadcn-studio tests into src/__tests__/ (repo convention).
 * Run from packages/shadcn-studio: node scripts/consolidate-tests-to-__tests__.mjs
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(fileURLToPath(import.meta.url), "..", "..");
const src = join(packageRoot, "src");
const testsRoot = join(src, "__tests__");

const testDirs = [
  "components-ui",
  "components-layouts",
  "lib",
  "hooks",
  "meta-contracts",
  "meta-gates",
  "meta-registry",
];

for (const dir of testDirs) {
  mkdirSync(join(testsRoot, dir), { recursive: true });
}

function moveFiles(fromDir, toDir, filter) {
  if (!existsSync(fromDir)) {
    return;
  }

  for (const name of readdirSync(fromDir)) {
    if (!filter(name)) {
      continue;
    }

    renameSync(join(fromDir, name), join(toDir, name));
  }
}

moveFiles(join(src, "gate"), testsRoot, (name) =>
  /\.(test|spec)\.(ts|tsx)$/.test(name)
);

moveFiles(
  join(src, "components-ui"),
  join(testsRoot, "components-ui"),
  (name) => /\.(contract|interaction)\.test\.(ts|tsx)$/.test(name)
);

for (const moduleDir of testDirs) {
  moveFiles(
    join(src, moduleDir, "__tests__"),
    join(testsRoot, moduleDir),
    () => true
  );

  const nested = join(src, moduleDir, "__tests__");
  if (existsSync(nested) && readdirSync(nested).length === 0) {
    rmSync(nested, { recursive: true, force: true });
  }
}

function fixComponentUiTest(filePath) {
  const name = basename(filePath);
  let content = readFileSync(filePath, "utf8");

  if (name === "components-ui.contract-registry.test.ts") {
    content = content.replace(
      'const uiDir = join(import.meta.dirname, "..");',
      'const uiDir = join(import.meta.dirname, "../../components-ui");'
    );
    const slugPlaceholder = ["$", "{slug}"].join("");
    const joinUiDirNeedle = [
      "join(uiDir, `",
      slugPlaceholder,
      ".contract.test.ts`)",
    ].join("");
    const joinImportMetaNeedle = [
      "join(import.meta.dirname, `",
      slugPlaceholder,
      ".contract.test.ts`)",
    ].join("");
    content = content.replaceAll(joinUiDirNeedle, joinImportMetaNeedle);
    content = content.replace(
      "T0 static primitives do not ship colocated contract.test.ts duplicates",
      "T0 static primitives do not ship per-file contract.test.ts duplicates"
    );
  } else {
    content = content.replace(/from\s+["'](\.\/[^"']+)["']/g, (match, rel) => {
      if (rel.startsWith("../")) {
        return match;
      }

      return `from "../../components-ui/${rel.slice(2)}"`;
    });
  }

  writeFileSync(filePath, content);
}

function fixModuleTest(filePath, moduleSegment) {
  let content = readFileSync(filePath, "utf8");

  content = content.replace(/from\s+["'](\.\/[^"']+)["']/g, (match, rel) => {
    if (rel.startsWith("../")) {
      return match;
    }

    return `from "../../${moduleSegment}/${rel.slice(2)}"`;
  });

  writeFileSync(filePath, content);
}

function fixLibTest(filePath) {
  let content = readFileSync(filePath, "utf8");

  content = content.replace(/from\s+["'](\.\/[^"']+)["']/g, (match, rel) => {
    if (rel.startsWith("../")) {
      return match;
    }

    return `from "../../lib/${rel.slice(2)}"`;
  });

  writeFileSync(filePath, content);
}

for (const name of readdirSync(join(testsRoot, "components-ui"))) {
  if (!/\.(test|spec)\.(ts|tsx)$/.test(name)) {
    continue;
  }

  fixComponentUiTest(join(testsRoot, "components-ui", name));
}

for (const name of readdirSync(join(testsRoot, "components-layouts"))) {
  fixModuleTest(
    join(testsRoot, "components-layouts", name),
    "components-layouts"
  );
}

for (const name of readdirSync(join(testsRoot, "lib"))) {
  fixLibTest(join(testsRoot, "lib", name));
}

for (const name of readdirSync(join(testsRoot, "hooks"))) {
  fixModuleTest(join(testsRoot, "hooks", name), "hooks");
}

console.log("consolidated tests under src/__tests__/");

function fixParentRelativeImports(testSubdir, moduleSegment) {
  const dir = join(testsRoot, testSubdir);

  for (const name of readdirSync(dir)) {
    const filePath = join(dir, name);
    let content = readFileSync(filePath, "utf8");

    content = content.replace(
      /from\s+["'](\.\.\/[^"']+)["']/g,
      (match, rel) => {
        if (
          rel.startsWith(`../${moduleSegment}/`) ||
          rel.startsWith("../../")
        ) {
          return match;
        }

        return `from "../../${moduleSegment}/${rel.slice(3)}"`;
      }
    );

    writeFileSync(filePath, content);
  }
}

for (const [subdir, module] of [
  ["components-ui", "components-ui"],
  ["components-layouts", "components-layouts"],
  ["lib", "lib"],
  ["hooks", "hooks"],
  ["meta-contracts", "meta-contracts"],
  ["meta-gates", "meta-gates"],
  ["meta-registry", "meta-registry"],
]) {
  fixParentRelativeImports(subdir, module);
}

console.log("fixed parent-relative imports");

const INVENTORY_DISK_DIR_FIXES = [
  ["lib/lib-inventory.registry.test.ts", "lib"],
  ["meta-registry/registry-inventory.registry.test.ts", "meta-registry"],
  ["meta-contracts/contract-envelope.registry.test.ts", "meta-contracts"],
  ["meta-gates/governance-envelope.registry.test.ts", "meta-gates"],
];

for (const [relativePath, moduleSegment] of INVENTORY_DISK_DIR_FIXES) {
  const filePath = join(testsRoot, relativePath);
  if (!existsSync(filePath)) {
    continue;
  }

  let content = readFileSync(filePath, "utf8");
  content = content.replace(
    `join(import.meta.dirname, "..")`,
    `join(import.meta.dirname, "../../${moduleSegment}")`
  );
  writeFileSync(filePath, content);
}

const uiMetaPath = join(
  testsRoot,
  "meta-gates/ui-primitive-metadata.registry.test.ts"
);
if (existsSync(uiMetaPath)) {
  let content = readFileSync(uiMetaPath, "utf8");
  content = content.replace(
    /const governanceDir = join\(import\.meta\.dirname, "\.\."\);/,
    'const governanceDir = join(import.meta.dirname, "../../meta-gates");'
  );
  writeFileSync(uiMetaPath, content);
}

console.log("fixed inventory disk scan paths");
