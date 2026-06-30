#!/usr/bin/env node
/**
 * Fail when Biome CLI, editor LSP, VS Code formatters, and Husky lint-staged drift.
 *
 * Usage:
 *   node scripts/governance/check-biome-editor-sync.mjs
 *   pnpm check:biome-editor-sync
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkBiomeEditorSync } from "./biome-editor-policy.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const result = checkBiomeEditorSync(repoRoot);

if (result.ok) {
  process.stdout.write("biome editor sync: OK\n");
  process.exit(0);
}

process.stderr.write("biome editor sync: FAIL\n");
for (const violation of result.violations) {
  process.stderr.write(`- ${violation}\n`);
}
process.stderr.write(
  "\nFix: align biome.jsonc, biome.lsp.jsonc, biome.project.jsonc, .vscode/settings.json, _reference/.vscode/settings.json, scripts/governance/biome-editor-policy.mjs, .husky/pre-commit, scripts.precommit, and lint-staged with scripts/governance/biome-editor-policy.mjs\n"
);
process.exit(1);
