#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const srcRoot = join(repoRoot, "packages/shadcn-studio/src");

function parseArgs() {
  const args = process.argv.slice(2);
  let kind;
  let name;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--kind" && args[i + 1]) kind = args[++i];
    if (args[i] === "--name" && args[i + 1]) name = args[++i];
  }
  if (!kind || !name) {
    console.error("Usage: promote-mcp-inbox.mjs --kind ui|block --name <slug>");
    process.exit(1);
  }
  return { kind, name };
}

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    const src = join(from, entry);
    const dest = join(to, entry);
    if (statSync(src).isDirectory()) copyTree(src, dest);
    else copyFileSync(src, dest);
  }
}

const { kind, name } = parseArgs();
const inbox = kind === "ui"
  ? join(srcRoot, "components-quarantine/ui")
  : join(srcRoot, "components-quarantine/blocks");

if (kind === "ui") {
  const inboxFile = join(inbox, `${name}.tsx`);
  const target = join(srcRoot, "components-ui", `${name}.tsx`);
  if (!existsSync(inboxFile)) {
    console.error("missing", inboxFile);
    process.exit(1);
  }
  copyFileSync(inboxFile, target);
  for (const suffix of [".contract.ts", ".contract.test.ts", ".interaction.test.tsx"]) {
    const extra = join(inbox, `${name}${suffix}`);
    if (existsSync(extra)) copyFileSync(extra, join(srcRoot, "components-ui", `${name}${suffix}`));
  }
  rmSync(inboxFile, { force: true });
  console.log("promoted ui", name);
} else {
  const inboxDir = join(inbox, name);
  const inboxFile = join(inbox, `${name}.tsx`);
  if (existsSync(inboxDir) && statSync(inboxDir).isDirectory()) {
    copyTree(inboxDir, join(srcRoot, "components-layouts", name));
    rmSync(inboxDir, { recursive: true, force: true });
    console.log("promoted block dir", name);
  } else if (existsSync(inboxFile)) {
    copyFileSync(inboxFile, join(srcRoot, "components-layouts", `${name}.tsx`));
    rmSync(inboxFile, { force: true });
    console.log("promoted block file", name);
  } else {
    console.error("missing block in quarantine:", name);
    process.exit(1);
  }
}
