#!/usr/bin/env node
/**
 * postToolUse (Read) — track skill Read evidence for bundle preflight session.
 */
import { allow, extractPath, log, parseStdinJson, resolveRepoRoot } from "./_hook-utils.mjs";
import { recordSkillRead } from "./bundle-preflight-policy.mjs";

const TAG = "post-skill-read-track";

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; allowing");
  allow();
}

const repoRoot = resolveRepoRoot();
const relativePath = extractPath(input, repoRoot);

if (relativePath) {
  const session = recordSkillRead(repoRoot, relativePath);
  if (session.reads.length <= 5 || relativePath.includes(".cursor/skills/")) {
    log(TAG, `read tracked: ${relativePath}`);
  }
}

allow();
