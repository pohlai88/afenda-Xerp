import { readFileSync, writeFileSync, unlinkSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const j = JSON.parse(readFileSync("packages/shadcn-studio/components.json", "utf8"));
j.aliases = {
  components: "@/components-quarantine/blocks",
  utils: "@/utils/utils",
  ui: "@/components-quarantine/ui",
  lib: "@/lib",
  hooks: "@/hooks",
};
writeFileSync("packages/shadcn-studio/components.json", JSON.stringify(j, null, 2) + "\n");
const t = JSON.parse(readFileSync("packages/shadcn-studio/tsconfig.json", "utf8"));
t.compilerOptions.paths = {
  "@/*": ["./src/*"],
  "@/components/ui/*": ["./src/components-ui/*"],
  "@/components/shadcn-studio/*": ["./src/components-layouts/*"],
  "@/components-auth-shell/*": ["./src/components-auth-shell/*"],
  "@/lib/utils": ["./src/utils/utils.ts"],
  "@/utils/utils": ["./src/utils/utils.ts"],
};
writeFileSync("packages/shadcn-studio/tsconfig.json", JSON.stringify(t, null, 2) + "\n");
function walk(d, f = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) {
      if (n === "node_modules" || n === "dist") continue;
      walk(p, f);
    } else if (/\.(ts|tsx)$/.test(n)) f.push(p);
  }
  return f;
}
let c = 0;
for (const file of walk("packages/shadcn-studio/src")) {
  let text = readFileSync(file, "utf8");
  const before = text;
  text = text.replaceAll('@/lib/utils', '@/utils/utils');
  if (text !== before) {
    writeFileSync(file, text);
    c++;
  }
}
try { unlinkSync("packages/shadcn-studio/src/lib/utils.ts"); } catch {}
console.log("utils imports", c);
