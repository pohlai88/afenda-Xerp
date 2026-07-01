import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const reps = [
  ["../../storybook/", "../storybook/"],
  ["../assets/svg/index.js", "../components-assets/index.js"],
];
function walk(d, f = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, f);
    else if (/\.(tsx|mjs)$/.test(n)) f.push(p);
  }
  return f;
}
let n = 0;
for (const f of [
  ...walk("packages/shadcn-studio/src/components-ui"),
  ...walk("packages/shadcn-studio/src/storybook"),
]) {
  let t = readFileSync(f, "utf8");
  const o = t;
  for (const [a, b] of reps) t = t.replaceAll(a, b);
  if (t !== o) {
    writeFileSync(f, t);
    n++;
  }
}
for (const script of [
  "scripts/storybook/generate-primitive-stories.mjs",
  "scripts/storybook/generate-svg-gallery.mjs",
]) {
  let t = readFileSync(script, "utf8");
  const o = t;
  for (const [a, b] of reps) t = t.replaceAll(a, b);
  if (t !== o) writeFileSync(script, t);
}
// protect logo from discard
let discard = readFileSync("scripts/storybook/discard-blocks-without-consumer.mjs", "utf8");
if (!discard.includes("SHARED_BLOCK_FILES")) {
  discard = discard.replace(
    "const blocksRoot = join(",
    "const SHARED_BLOCK_FILES = new Set([\"logo.tsx\"]);\n\nconst blocksRoot = join("
  );
  discard = discard.replace(
    "    rmSync(target, { recursive: true, force: true });",
    `    if (target.endsWith("logo.tsx")) {
      console.log("discard-blocks-without-consumer — keep shared: logo.tsx");
      continue;
    }
    rmSync(target, { recursive: true, force: true });`
  );
  writeFileSync("scripts/storybook/discard-blocks-without-consumer.mjs", discard);
}
console.log("fixed", n, "source files + codegen scripts");
