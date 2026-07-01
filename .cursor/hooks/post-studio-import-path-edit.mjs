#!/usr/bin/env node
/**
 * postToolUse — remind agent to keep studio import path aliases canonical.
 */
import {
  emit,
  extractPath,
  log,
  parseStdinJson,
  resolveRepoRoot,
} from "./_hook-utils.mjs";
import { studioImportPathReminder } from "./studio-import-path-policy.mjs";

const TAG = "post-studio-import-path-edit";

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; skipping");
  emit({});
  process.exit(0);
}

const repoRoot = resolveRepoRoot();
const relativePath = extractPath(input, repoRoot);
const reminder = studioImportPathReminder(relativePath);

if (reminder) {
  log(TAG, `studio path source edited: ${relativePath}`);
  emit({ additional_context: reminder });
  process.exit(0);
}

emit({});
process.exit(0);
