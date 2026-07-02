#!/usr/bin/env node
/**
 * preToolUse — deny agent Write/StrReplace to local artifact paths (SSOT registry).
 * Allows only `.cursor/audit/checkpoints/**` and `.cursor/.gate-stamps/**`.
 */
import {
  allow,
  deny,
  extractPath,
  extractToolName,
  log,
  parseStdinJson,
  resolveRepoRoot,
} from "./_hook-utils.mjs";
import { isForbiddenTrackedArtifactPath } from "../../scripts/governance/local-artifact-registry.mjs";

const TAG = "guard-local-artifact-write";

const ALLOWED_WRITE_PREFIXES = [
  ".cursor/audit/checkpoints/",
  ".cursor/.gate-stamps/",
];

/**
 * @param {string} relativePath
 * @returns {boolean}
 */
export function isAllowedLocalArtifactWritePath(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  return ALLOWED_WRITE_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

/**
 * @param {string} relativePath
 * @returns {boolean}
 */
export function isBlockedLocalArtifactWritePath(relativePath) {
  if (!relativePath) {
    return false;
  }

  const normalized = relativePath.replace(/\\/g, "/");

  if (isAllowedLocalArtifactWritePath(normalized)) {
    return false;
  }

  return isForbiddenTrackedArtifactPath(normalized);
}

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; allowing");
  allow();
}

const repoRoot = resolveRepoRoot();
const relativePath = extractPath(input, repoRoot);
const toolName = extractToolName(input);

if (!relativePath || !isBlockedLocalArtifactWritePath(relativePath)) {
  allow();
}

log(TAG, `blocked ${toolName} on forbidden artifact path: ${relativePath}`);

deny(
  "Writing to a local agent/IDE artifact path is blocked. Run gates and read shell stdout instead.",
  `Blocked ${toolName} on local artifact path (${relativePath}). Do not Write/StrReplace to paths in scripts/governance/local-artifact-registry.mjs — except .cursor/audit/checkpoints/**. Run e.g. pnpm ci:biome and read terminal output.`
);
