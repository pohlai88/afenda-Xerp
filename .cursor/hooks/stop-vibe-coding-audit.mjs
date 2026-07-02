#!/usr/bin/env node
/**
 * stop — automatic vibe-coding audit: announcements + Completion Report on coding turns.
 */
import { emit, log, parseStdinJson, resolveRepoRoot, scopeChanged } from "./_hook-utils.mjs";
import {
  auditAssistantMessage,
  countLedgerLines,
  loadSession,
} from "./bundle-preflight-policy.mjs";

const TAG = "stop-vibe-coding-audit";

const CODING_SCOPES = [
  "apps/erp/src",
  "apps/storybook",
  "packages",
  "docs/PAS",
  ".cursor/skills",
  ".cursor/rules",
  ".cursor/agents",
  ".cursor/hooks",
];

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; skipping");
  emit({});
  process.exit(0);
}

const status = input.status ?? "completed";
const loopCount = typeof input.loop_count === "number" ? input.loop_count : 0;

if (status !== "completed" || loopCount > 0) {
  emit({});
  process.exit(0);
}

const repoRoot = resolveRepoRoot();
const codeEdited = CODING_SCOPES.some((scope) => scopeChanged(repoRoot, scope));

if (!codeEdited) {
  emit({});
  process.exit(0);
}

const assistantMessage =
  input.message ?? input.response ?? input.last_message ?? "";

const sessionBefore = loadSession(repoRoot);
const ledgerBefore = countLedgerLines(repoRoot);

if (assistantMessage.length > 0) {
  auditAssistantMessage(repoRoot, assistantMessage);
}

const sessionAfter = loadSession(repoRoot);
const ledgerAfter = countLedgerLines(repoRoot);
const newViolations = ledgerAfter - ledgerBefore;

if (newViolations === 0 && sessionAfter.bundleSkillRead) {
  emit({});
  process.exit(0);
}

log(TAG, `recorded ${newViolations} violation(s); session total ${sessionAfter.violationsThisSession}`);

const lines = [
  "## Vibe coding violation scorecard (automatic hook)",
  "",
  `Ledger: .cursor/audit/vibe-coding-violations.jsonl (local/gitignored — do not commit)`,
  `New violations this turn: **${newViolations}**`,
  `Session total: **${sessionAfter.violationsThisSession}**`,
  `Ledger all-time: **${ledgerAfter}**`,
  "",
];

if (!sessionAfter.bundleSkillRead) {
  lines.push(
    "- **V002** — No Read of `.cursor/skills/coding-consistency-bundle/SKILL.md` this session before edits.",
    ""
  );
}

lines.push(
  "Required first line on every coding turn:",
  "THE AGENT IS USING CODING CONSISTENY BUNDLE..",
  "",
  "Read `.cursor/skills/coding-consistency-bundle/SKILL.md` → Preflight Receipt → Phase 0 → then edit.",
  "",
  "Subagent deep audit (optional): vibe-coding-violation-auditor",
);

emit({
  followup_message: lines.join("\n"),
});

process.exit(0);
