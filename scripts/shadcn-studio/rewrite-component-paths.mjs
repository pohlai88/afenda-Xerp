import { readFileSync, readdirSync, statSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
const repoRoot = process.cwd();
const reps = [
  ["./components-ui/", "./components-ui/"],
  ["./components-app-shell/", "./components-app-shell/"],
  ["components-layouts/", "components-layouts/"],
  ["@/components-layouts/login-page-04/", "@/components-auth-shell/login-page-04/"],
  ["@/components-layouts/", "@/components-layouts/"],
  ["@/components-ui/", "@/components-ui/"],
  ["packages/shadcn-studio/src/components-ui/", "packages/shadcn-studio/src/components-ui/"],
  ["packages/shadcn-studio/src/components-app-shell/", "packages/shadcn-studio/src/components-app-shell/"],
  ["packages/shadcn-studio/src/components-layouts/", "packages/shadcn-studio/src/components-layouts/"],
  ["packages/shadcn-studio/src/components-assets/", "packages/shadcn-studio/src/components-assets/"],
  ['from "../components-ui/', 'from "../components-ui/'],
  ['from "../../components-ui/', 'from "../../components-ui/'],
  ['from "../../../components-ui/', 'from "../../../components-ui/'],
  ['from "../../../../components-ui/', 'from "../../../../components-ui/'],
  ['from "../components-app-shell/', 'from "../components-app-shell/'],
  ['from "./components-app-shell/', 'from "./components-app-shell/'],
  ['from "./components-ui/', 'from "./components-ui/'],
  ["../../../components-ui/", "../../../components-ui/"],
  ["../../../../components-ui/", "../../../../components-ui/"],
];
const roots = [join(repoRoot,"packages/shadcn-studio"), join(repoRoot,"scripts"), join(repoRoot,"apps")];
const EXT = /\.(ts|tsx|mjs|md|json)$/;
const SKIP = ["/src/components/", "\\src\\components\\"];
function walk(d,f=[]){try{for(const n of readdirSync(d)){if(["node_modules","dist"].includes(n))continue;const p=join(d,n);if(statSync(p).isDirectory()){if(SKIP.some(s=>p.endsWith(s.replace(/\\/g,'/').slice(0,-1))||p.includes('\\components\\shadcn-studio')||p.includes('/components/shadcn-studio')||p.includes('\\components\\ui')||p.includes('/components/ui')||p.includes('\\components\\app-shell')))continue;walk(p,f);}else if(EXT.test(n))f.push(p);}}catch{}return f;}
let c=0;for(const r of roots)for(const file of walk(r)){let t=readFileSync(file,"utf8");const b=t;for(const [a,b2] of reps)t=t.split(a).join(b2);if(t!==b){writeFileSync(file,t);c++;}}
// fix auth shell paths wrongly mapped
for(const file of walk(join(repoRoot,"packages/shadcn-studio/src/components-auth-shell"))){
  let t=readFileSync(file,"utf8").replaceAll("@/components-layouts/login-page-","@/components-auth-shell/login-page-");
  writeFileSync(file,t);
}
for(const file of walk(join(repoRoot,"packages/shadcn-studio"))){
  let t=readFileSync(file,"utf8");
  const b=t;
  t=t.replaceAll("@/components-layouts/login-page-","@/components-auth-shell/login-page-");
  if(t!==b)writeFileSync(file,t);
}
try{rmSync(join(repoRoot,"packages/shadcn-studio/src/components"),{recursive:true,force:true});console.log('removed components');}catch(e){console.log(e.message);}
try{rmSync(join(repoRoot,"packages/shadcn-studio/src/assets"),{recursive:true,force:true});console.log('removed assets');}catch(e){console.log(e.message);}
console.log('component rewrite',c);
