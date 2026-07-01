import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

let t = readFileSync("vitest.shared.ts", "utf8");
t = t.replace(
  'replacement: resolve(shadcnStudioSrcRoot, "components/ui")',
  'replacement: resolve(shadcnStudioSrcRoot, "components-ui")'
);
t = t.replace(
  'replacement: resolve(shadcnStudioSrcRoot, "lib/utils.ts")',
  'replacement: resolve(shadcnStudioSrcRoot, "utils/utils.ts")'
);
if (!t.includes("components-layouts")) {
  t = t.replace(
    '{ find: "@/components/ui",',
    '{ find: "@/components/shadcn-studio", replacement: resolve(shadcnStudioSrcRoot, "components-layouts") },\n        { find: "@/components/ui",'
  );
}
writeFileSync("vitest.shared.ts", t);

const reps = [
  ["src/components/ui", "src/components-ui"],
  ["src/components/shadcn-studio/blocks", "src/components-layouts"],
  ["src/lib/utils.ts", "src/utils/utils.ts"],
  ["../components/shadcn-studio/blocks", "../components-layouts"],
  ["components/shadcn-studio/blocks", "components-layouts"],
];
function walk(d, f = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, f);
    else if (/\.(ts|tsx)$/.test(n)) f.push(p);
  }
  return f;
}
let n = 0;
for (const dir of ["packages/shadcn-studio/src/gate", "packages/shadcn-studio/src/meta-registry"]) {
  for (const f of walk(dir)) {
    let s = readFileSync(f, "utf8");
    const o = s;
    for (const [a, b] of reps) s = s.replaceAll(a, b);
    if (s !== o) {
      writeFileSync(f, s);
      n++;
    }
  }
}
console.log("fixed", n, "files");
