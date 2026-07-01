import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

const srcRoot = join(process.cwd(), "packages/shadcn-studio/src");
const blocksRoot = join(srcRoot, "components/shadcn-studio/blocks");

function isAuthBlock(id) {
  return /^(login-page-|auth-|signup-)/.test(id);
}

function targetBlockDir(blockId) {
  return join(srcRoot, isAuthBlock(blockId) ? "components-auth-shell" : "components-layouts");
}

function copyPrimitives() {
  cpSync(join(srcRoot, "components/ui"), join(srcRoot, "components-ui"), { recursive: true });
}

function flattenBlock(blockId, absPath, destDir) {
  const st = statSync(absPath);
  if (st.isFile() && absPath.endsWith(".tsx")) {
    const name = basename(absPath);
    const out = name === `${blockId}.tsx` ? join(destDir, `${blockId}.tsx`) : join(destDir, `${blockId}-${name}`);
    cpSync(absPath, out);
    return;
  }
  if (!st.isDirectory()) return;
  for (const child of readdirSync(absPath)) {
    const childPath = join(absPath, child);
    const childSt = statSync(childPath);
    if (childSt.isDirectory()) {
      for (const nested of readdirSync(childPath)) {
        const nestedPath = join(childPath, nested);
        if (statSync(nestedPath).isFile()) {
          const outName = `${blockId}-${child}-${nested}`;
          cpSync(nestedPath, join(destDir, outName));
        }
      }
    } else if (child.endsWith(".tsx")) {
      const outName = child === `${blockId}.tsx` ? `${blockId}.tsx` : `${blockId}-${child}`;
      cpSync(childPath, join(destDir, outName));
    }
  }
}

function copyBlocks() {
  for (const entry of readdirSync(blocksRoot)) {
    const blockId = entry.replace(/\.tsx$/, "");
    const abs = join(blocksRoot, entry);
    const dest = targetBlockDir(blockId);
    mkdirSync(dest, { recursive: true });
    flattenBlock(blockId, abs, dest);
  }
}

function copyShellAndAssets() {
  cpSync(join(srcRoot, "components/app-shell"), join(srcRoot, "components-app-shell"), { recursive: true });
  mkdirSync(join(srcRoot, "components-assets"), { recursive: true });
  const svgDir = join(srcRoot, "assets/svg");
  if (existsSync(svgDir)) {
    for (const f of readdirSync(svgDir)) {
      if (f.endsWith(".tsx") || f.endsWith(".ts")) cpSync(join(svgDir, f), join(srcRoot, "components-assets", f));
    }
  }
  const assetsIndex = join(srcRoot, "assets/index.ts");
  if (existsSync(assetsIndex)) cpSync(assetsIndex, join(srcRoot, "components-assets/index.ts"));
}

function copyQuarantine() {
  const q = join(srcRoot, "components-quarantine");
  mkdirSync(join(q, "ui"), { recursive: true });
  mkdirSync(join(q, "blocks"), { recursive: true });
  writeFileSync(join(q, "README.md"), "# MCP quarantine\n\nRaw shadcn/studio CLI installs land here. Overwrite OK. Promote via `pnpm studio:promote-inbox`.\n");
}

copyPrimitives();
copyBlocks();
copyShellAndAssets();
copyQuarantine();
console.log("components copied");
