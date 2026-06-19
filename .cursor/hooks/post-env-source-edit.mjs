#!/usr/bin/env node
/**
 * postToolUse — remind agent to sync env after editing human-managed sources.
 */
import {
  emit,
  extractPath,
  log,
  parseStdinJson,
  resolveRepoRoot,
} from "./_hook-utils.mjs";
import { envSyncReminder } from "./env-policy.mjs";

const TAG = "post-env-source-edit";

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; skipping");
  emit({});
  process.exit(0);
}

const repoRoot = resolveRepoRoot();
const relativePath = extractPath(input, repoRoot);
const reminder = envSyncReminder(relativePath);

if (reminder) {
  log(TAG, `env source edited: ${relativePath}`);
  emit({ additional_context: reminder });
  process.exit(0);
}

emit({});
process.exit(0);
