#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const pkgRoot = join(repoRoot, "packages/shadcn-studio");
const srcRoot = join(pkgRoot, "src");
for (const dir of ["components","_storybook","stories","governance","contracts","registry","__tests__","assets"]) {
  try { rmSync(join(srcRoot, dir), { recursive: true, force: true }); console.log("removed", dir); } catch (e) { console.warn(dir, e.message); }
}
const PATHS = {
  "@/components/ui/*": ["./src/components-ui/*"],
  "@/components/shadcn-studio/*": ["./src/components-layouts/*"],
  "@/components-auth-shell/*": ["./src/components-auth-shell/*"],
  "@/components-app-shell/*": ["./src/components-app-shell/*"],
  "@/components-assets/*": ["./src/components-assets/*"],
  "@/lib/*": ["./src/lib/*"],
  "@/hooks/*": ["./src/hooks/*"],
  "@/utils/utils": ["./src/utils/utils.ts"],
  "@/lib/utils": ["./src/utils/utils.ts"],
};
const mainTs = JSON.parse(readFileSync(join(pkgRoot, "tsconfig.json"), "utf8"));
mainTs.compilerOptions.paths = { ...PATHS };
writeFileSync(join(pkgRoot, "tsconfig.json"), JSON.stringify(mainTs, null, 2) + "\n");
const storiesTs = JSON.parse(readFileSync(join(pkgRoot, "tsconfig.stories.json"), "utf8"));
storiesTs.compilerOptions.paths = {
  "@afenda/shadcn-studio/lab": ["./src/lab/index.ts"],
  "@afenda/shadcn-studio": ["./src/index.ts"],
  ...PATHS,
  "storybook/test": storiesTs.compilerOptions.paths["storybook/test"],
};
storiesTs.include = [
  "src/**/*.stories.ts","src/**/*.stories.tsx","src/storybook/**/*.ts","src/storybook/**/*.tsx",
  "src/lab/**/*.ts","src/lab/**/*.tsx","src/components-ui/**/*.tsx","src/components-layouts/**/*.tsx",
  "src/components-auth-shell/**/*.tsx","src/components-app-shell/**/*.tsx","src/theme/**/*.tsx",
  "src/theme/**/*.ts","src/hooks/**/*.ts","src/lib/**/*.ts",
];
writeFileSync(join(pkgRoot, "tsconfig.stories.json"), JSON.stringify(storiesTs, null, 2) + "\n");
const EXT = /\.(ts|tsx|mjs|json|md)$/;
function walk(d,f=[]){try{for(const n of readdirSync(d)){if(["node_modules","dist"].includes(n))continue;const p=join(d,n);if(statSync(p).isDirectory())walk(p,f);else if(EXT.test(n))f.push(p);}}catch{}return f;}
const REPS = [
  ["../../storybook/","../storybook/"],
  ["../../../storybook/","../../storybook/"],
  ["../components-layouts/login-page-04/login-page-04","../components-auth-shell/login-page-04/login-page-04"],
  ["packages/shadcn-studio/src/components/ui","packages/shadcn-studio/src/components-ui"],
  ["packages/shadcn-studio/src/components/shadcn-studio/blocks","packages/shadcn-studio/src/components-layouts"],
  ["packages/shadcn-studio/src/components/shadcn-studio","packages/shadcn-studio/src/components-layouts"],
  ["packages/shadcn-studio/src/governance/","packages/shadcn-studio/src/meta-gates/"],
  ["packages/shadcn-studio/src/contracts/","packages/shadcn-studio/src/meta-contracts/"],
  ["packages/shadcn-studio/src/registry/","packages/shadcn-studio/src/meta-registry/"],
  ["src/components/ui","src/components-ui"],
  ["src/governance/","src/meta-gates/"],
  ["src/__tests__/","src/gate/"],
];
let touched=0;
for(const file of walk(repoRoot)){
  if(!file.includes("packages/shadcn-studio")&&!file.includes("scripts/"))continue;
  let t=readFileSync(file,"utf8"); const o=t;
  for(const [a,b] of REPS)t=t.replaceAll(a,b);
  if(t!==o){writeFileSync(file,t);touched++;}
}
console.log("swept",touched,"files");
