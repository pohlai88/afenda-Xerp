#!/usr/bin/env node
/**
 * preToolUse — automatic vibe-coding violation recording when editing before bundle Read.
 */
import {
  allow,
  ask,
  extractPath,
  extractToolName,
  log,
  parseStdinJson,
  resolveRepoRoot,
} from "./_hook-utils.mjs";
import {
  hardStopMessage,
  isGovernedEditPath,
  loadSession,
  recordEditBeforeBundleRead,
} from "./bundle-preflight-policy.mjs";

const TAG = "guard-bundle-preflight";

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; allowing");
  allow();
}

const repoRoot = resolveRepoRoot();
const relativePath = extractPath(input, repoRoot);
const toolName = extractToolName(input);

if (!relativePath || !isGovernedEditPath(relativePath)) {
  allow();
}

const session = loadSession(repoRoot);

if (session.bundleSkillRead) {
  allow();
}

const { ledgerTotal, sessionTotal } = recordEditBeforeBundleRead(
  repoRoot,
  relativePath,
  toolName
);

log(TAG, `V002 recorded: ${relativePath} (session=${sessionTotal}, ledger=${ledgerTotal})`);

const agentMessage = hardStopMessage({
  code: "V002",
  ledgerTotal,
  sessionTotal,
  relativePath,
});

ask(
  `Vibe-coding violation V002 recorded (${sessionTotal} this session, ${ledgerTotal} in ledger). Edit before coding-consistency-bundle Read: ${relativePath}. Approve only if intentional.`,
  agentMessage
);
