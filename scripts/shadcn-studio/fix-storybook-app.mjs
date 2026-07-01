import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const reps = [
  ["src/_storybook/", "src/storybook/"],
  ["components/ui", "components-ui"],
  ["components/shadcn-studio", "components-layouts"],
  ["lib/utils.ts", "utils/utils.ts"],
];
function walk(d, f = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, f);
    else if (/\.(ts|tsx|css|json)$/.test(n)) f.push(p);
  }
  return f;
}
let n = 0;
for (const f of walk("apps/storybook")) {
  let t = readFileSync(f, "utf8");
  const o = t;
  for (const [a, b] of reps) t = t.replaceAll(a, b);
  if (t !== o) {
    writeFileSync(f, t);
    n++;
  }
}
console.log("updated", n, "storybook app files");
