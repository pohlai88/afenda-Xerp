import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const roots = [
  "packages/shadcn-studio/src/components-layouts",
  "packages/shadcn-studio/src/components-auth-shell",
  "packages/shadcn-studio/src/components-app-shell",
];
const reps = [
  ["../../../../../meta-contracts/", "../../../meta-contracts/"],
  ["../../../../meta-contracts/", "../../meta-contracts/"],
  ["../../../meta-contracts/", "../meta-contracts/"],
  ["../../../../components-ui/", "@/components/ui/"],
  ["../../../components-ui/", "@/components/ui/"],
  ["../../lib/utils", "@/utils/utils"],
  ["@/components/shadcn-studio/logo", "@/components-layouts/logo"],
];
function walk(d, f = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, f);
    else if (/\.(ts|tsx)$/.test(n)) f.push(p);
  }
  return f;
}
let c = 0;
for (const r of roots) {
  for (const file of walk(r)) {
    let t = readFileSync(file, "utf8");
    const b = t;
    for (const [a, b2] of reps) t = t.split(a).join(b2);
    if (t !== b) { writeFileSync(file, t); c++; }
  }
}
const misc = [
  "packages/shadcn-studio/src/lib/compose-class-name.ts",
  "packages/shadcn-studio/src/index.ts",
  "packages/shadcn-studio/src/meta-registry/studio-block-component.registry.tsx",
  "packages/shadcn-studio/src/storybook/account-settings-01.compositions.tsx",
  "packages/shadcn-studio/src/storybook/enterprise-token-dashboard.compositions.tsx",
  "packages/shadcn-studio/src/storybook/block-flat-story.compositions.tsx",
];
for (const file of misc) {
  let t = readFileSync(file, "utf8");
  const b = t;
  t = t.replaceAll("./components-layouts/login-page-04/", "./components-auth-shell/login-page-04/");
  t = t.replaceAll("../components-layouts/login-page-04/", "../components-auth-shell/login-page-04/");
  t = t.replaceAll("../lib/utils.js", "../utils/utils.js");
  t = t.replaceAll("../assets/svg/index.js", "../components-assets/index.js");
  t = t.replaceAll('from "./utils.js"', 'from "../utils/utils.js"');
  if (t !== b) { writeFileSync(file, t); c++; }
}
console.log("fixed", c);
