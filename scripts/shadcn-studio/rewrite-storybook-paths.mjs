import { readFileSync, readdirSync, statSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
const repoRoot = process.cwd();
const reps = [
  ["../_storybook/", "../storybook/"],
  ["../../_storybook/", "../../storybook/"],
  ["../../../_storybook/", "../../../storybook/"],
  ["./_storybook/", "./storybook/"],
  ["packages/shadcn-studio/src/_storybook/", "packages/shadcn-studio/src/storybook/"],
  ["packages/shadcn-studio/src/stories/", "packages/shadcn-studio/src/storybook/"],
  ["src/_storybook/", "src/storybook/"],
  ["src/stories/", "src/storybook/"],
  ['from "../stories/', 'from "../storybook/'],
  ['from "../../stories/', 'from "../../storybook/'],
  ["_storybook/", "storybook/"],
];
const roots = [join(repoRoot,"packages/shadcn-studio"), join(repoRoot,"scripts/storybook"), join(repoRoot,"scripts/governance"), join(repoRoot,"apps/storybook")];
const EXT = /\.(ts|tsx|mjs|md|json)$/;
function walk(d,f=[]){try{for(const n of readdirSync(d)){if(["node_modules","dist"].includes(n))continue;const p=join(d,n);const st=statSync(p);if(st.isDirectory()){if(n==="_storybook"||n==="stories")continue;walk(p,f);}else if(EXT.test(n))f.push(p);}}catch{}return f;}
let c=0;for(const r of roots)for(const file of walk(r)){let t=readFileSync(file,"utf8");const b=t;for(const [a,b2] of reps)t=t.split(a).join(b2);if(t!==b){writeFileSync(file,t);c++;}}
// lab barrel
const lab = join(repoRoot,"packages/shadcn-studio/src/lab/index.ts");
let lt=readFileSync(lab,"utf8").replaceAll("../_storybook/","../storybook/");
writeFileSync(lab,lt);
// storybook internal stories imports from ../lab -> ./
for(const file of walk(join(repoRoot,"packages/shadcn-studio/src/storybook"))){
  let t=readFileSync(file,"utf8");const b=t;
  t=t.replaceAll('from "../lab/index.js"','from "../lab/index.js"');
  t=t.replaceAll('from "../_storybook/','from "./');
  t=t.replaceAll('from "../../_storybook/','from "../storybook/');
  if(t!==b)writeFileSync(file,t);
}
for(const old of ["_storybook","stories"]){try{rmSync(join(repoRoot,"packages/shadcn-studio/src",old),{recursive:true,force:true});console.log("removed",old);}catch(e){console.log("rm",old,e.message);}}
console.log("storybook migration",c);
