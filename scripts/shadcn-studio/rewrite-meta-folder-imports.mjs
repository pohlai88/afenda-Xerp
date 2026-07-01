import { readFileSync, readdirSync, statSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const SCAN_ROOTS = [join(repoRoot, "packages/shadcn-studio"), join(repoRoot, "scripts/governance"), join(repoRoot, "scripts/storybook"), join(repoRoot, "apps/storybook"), join(repoRoot, "apps/erp")];
const EXT = /\.(ts|tsx|mjs|mts|md|json)$/;

const REPLACEMENTS = [
  ["./contracts/", "./meta-contracts/"],
  ["./registry/", "./meta-registry/"],
  ["./governance/", "./meta-gates/"],
  ["packages/shadcn-studio/src/contracts/", "packages/shadcn-studio/src/meta-contracts/"],
  ["packages/shadcn-studio/src/registry/", "packages/shadcn-studio/src/meta-registry/"],
  ["packages/shadcn-studio/src/governance/", "packages/shadcn-studio/src/meta-gates/"],
  ['from "../contracts/', 'from "../meta-contracts/'],
  ['from "../../contracts/', 'from "../../meta-contracts/'],
  ['from "../../../contracts/', 'from "../../../meta-contracts/'],
  ['from "../../../../contracts/', 'from "../../../../meta-contracts/'],
  ['from "../../../../../contracts/', 'from "../../../../../meta-contracts/'],
  ['from "../registry/', 'from "../meta-registry/'],
  ['from "../../registry/', 'from "../../meta-registry/'],
  ['from "../../../registry/', 'from "../../../meta-registry/'],
  ['from "../../../../registry/', 'from "../../../../meta-registry/'],
  ['from "../governance/', 'from "../meta-gates/'],
  ['from "../../governance/', 'from "../../meta-gates/'],
  ['from "../../../governance/', 'from "../../../meta-gates/'],
  ['from "../../../../governance/', 'from "../../../../meta-gates/'],
  ['zones: ["meta-contracts", "registry"', 'zones: ["meta-contracts", "meta-registry"'],
  ['flat `contracts/`', 'flat `meta-contracts/`'],
  ['under `contracts/`', 'under `meta-contracts/`'],
  ['contracts/${forbidden}', 'meta-contracts/${forbidden}'],
  ['flat governance/', 'flat meta-gates/'],
  ['"dist/governance/', '"dist/meta-gates/'],
];

function walk(dir, files = []) {
  try { if (!statSync(dir).isDirectory()) return files; } catch { return files; }
  for (const name of readdirSync(dir)) {
    if (["node_modules", "dist", ".git"].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (EXT.test(name)) files.push(p);
  }
  return files;
}

let changed = 0;
for (const root of SCAN_ROOTS) {
  for (const file of walk(root)) {
    let text = readFileSync(file, "utf8");
    const before = text;
    for (const [from, to] of REPLACEMENTS) text = text.split(from).join(to);
    if (text !== before) { writeFileSync(file, text); changed++; }
  }
}
console.log("updated", changed, "files");

for (const old of ["contracts", "registry", "governance"]) {
  const p = join(repoRoot, "packages/shadcn-studio/src", old);
  try { rmSync(p, { recursive: true, force: true }); console.log("removed", old); } catch (e) { console.log("remove failed", old, e.message); }
}
