import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "../src/components");
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))
  .sort();

for (const file of files) {
  const c = readFileSync(join(dir, file), "utf8");
  const base = file.replace(".tsx", "");
  const gov = (c.match(/resolvePrimitiveGovernance\s*\(/g) ?? []).length;
  const recipe = (c.match(/recipeName:/g) ?? []).length;
  const fwd = (c.match(/forwardRef/g) ?? []).length;
  const dn = (c.match(/displayName/g) ?? []).length;
  const rawCls = (c.match(/className="[^"]+"/g) ?? []).length;
  const stateStr = /state\?: string/.test(c);
  const cva = /\bcva\s*\(/.test(c);
  const govBeforeProps = /\{\.\.\.governed\.dataAttributes\}\s*\n?\s*(?:className=\{[^}]+\}\s*\n?\s*)?\{\.\.\.props\}/u.test(c);
  const propsBeforeGov = /\{\.\.\.props\}[\s\S]{0,200}\{\.\.\.governed\.dataAttributes\}/.test(c);
  console.log(
    [
      base,
      `gov=${gov}`,
      `recipe=${recipe}/${gov}`,
      `fwd=${fwd}`,
      `dn=${dn}`,
      `rawCls=${rawCls}`,
      stateStr ? "stateStr" : "",
      cva ? "cva" : "",
      govBeforeProps ? "GOV_BEFORE_PROPS" : "",
      propsBeforeGov ? "propsOk" : "",
    ]
      .filter(Boolean)
      .join(" | ")
  );
}
