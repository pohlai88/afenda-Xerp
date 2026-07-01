import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const root = join(process.cwd(), "packages/shadcn-studio/src");
function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx|json)$/.test(n)) {
      let t = readFileSync(p, "utf8");
      const b = t;
      t = t.replaceAll("@/components-ui/", "@/components/ui/");
      t = t.replaceAll("@/components-layouts/logo", "@/components/shadcn-studio/logo");
      if (t !== b) writeFileSync(p, t);
    }
  }
}
walk(root);
const assetsDir = join(root, "components-assets");
const indexPath = join(assetsDir, "index.ts");
if (!existsSync(indexPath)) {
  const files = readdirSync(assetsDir).filter((f) => f.endsWith(".tsx"));
  writeFileSync(
    indexPath,
    files.map((f) => `export { default as ${f.replace(".tsx", "")} } from "./${f.replace(".tsx", "")}.js";`).join("\n") + "\n"
  );
}
console.log("ok");
