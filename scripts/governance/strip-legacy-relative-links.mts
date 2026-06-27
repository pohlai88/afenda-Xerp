#!/usr/bin/env tsx
/**
 * Strip broken ../delivery/ and ../ARCH/ markdown links from docs/architecture.
 * Leaves link text; does not rewrite semantic prose.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);
const architectureRoot = join(repoRoot, "docs/architecture");

function walkMarkdownFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const name of entries) {
    const absolute = join(dir, name);
    if (statSync(absolute).isDirectory()) {
      files.push(...walkMarkdownFiles(absolute));
      continue;
    }

    if (name.endsWith(".md")) {
      files.push(absolute);
    }
  }

  return files;
}

function stripLegacyLinks(content: string): string {
  let next = content;
  next = next.replace(
    /\[(`[^`]+`)\]\((?:\.\.\/)+(?:delivery|ARCH)[^)]*\)/g,
    "$1"
  );
  next = next.replace(
    /\[([^\]]+)\]\((?:\.\.\/)+(?:delivery|ARCH)[^)]*\)/g,
    "$1"
  );
  return next;
}

function main(): void {
  let changed = 0;

  for (const file of walkMarkdownFiles(architectureRoot)) {
    const original = readFileSync(file, "utf8");
    const updated = stripLegacyLinks(original);

    if (updated !== original) {
      writeFileSync(file, updated);
      changed += 1;
      console.log(`strip-legacy-relative-links: ${file.replace(/\\/g, "/")}`);
    }
  }

  console.log(`strip-legacy-relative-links: ${changed} file(s) updated`);
}

main();
