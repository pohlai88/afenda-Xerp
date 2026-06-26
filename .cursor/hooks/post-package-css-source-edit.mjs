#!/usr/bin/env node
/**
 * postToolUse — remind agent to sync package CSS dist after editing src CSS.
 */
import {
  emit,
  extractPath,
  log,
  parseStdinJson,
  resolveRepoRoot,
} from "./_hook-utils.mjs";
import { packageCssDistReminder } from "./package-css-dist-policy.mjs";

const TAG = "post-package-css-source-edit";

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; skipping");
  emit({});
  process.exit(0);
}

const repoRoot = resolveRepoRoot();
const relativePath = extractPath(input, repoRoot);
const reminder = packageCssDistReminder(relativePath);

if (reminder) {
  log(TAG, `package CSS source edited: ${relativePath}`);
  emit({ additional_context: reminder });
  process.exit(0);
}

emit({});
process.exit(0);
