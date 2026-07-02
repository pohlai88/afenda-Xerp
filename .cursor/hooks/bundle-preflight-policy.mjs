/**
 * Session state + ledger append for coding-consistency-bundle preflight.
 * Used by automatic hooks — not invoked manually.
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const LEDGER_PATH = ".cursor/audit/vibe-coding-violations.jsonl";
export const SESSION_PATH = ".cursor/audit/.bundle-preflight-session.json";

export const BUNDLE_ANNOUNCEMENT =
  "THE AGENT IS USING CODING CONSISTENY BUNDLE..";

export const SESSION_ANNOUNCEMENT =
  "I'm using afenda-coding-session — stating the execution contract before edits.";

const SKILL_READ_MARKERS = [
  {
    key: "bundleSkillRead",
    match: /(?:^|[/\\])\.cursor[/\\]skills[/\\]coding-consistency-bundle[/\\]SKILL\.md$/i,
  },
  {
    key: "codingSessionRead",
    match: /(?:^|[/\\])\.cursor[/\\]skills[/\\]afenda-coding-session[/\\]SKILL\.md$/i,
  },
  {
    key: "kernelAuthorityRead",
    match: /(?:^|[/\\])\.cursor[/\\]skills[/\\]kernel-authority[/\\]SKILL\.md$/i,
  },
  {
    key: "enterpriseKnowledgeRead",
    match: /(?:^|[/\\])\.cursor[/\\]skills[/\\]enterprise-knowledge[/\\]SKILL\.md$/i,
  },
];

/** Paths that trigger bundle preflight when edited without reads/announcements. */
const GOVERNED_EDIT_RE =
  /^(?:apps[/\\](?:erp|storybook|docs)|packages[/\\]|docs[/\\]PAS[/\\]|\.cursor[/\\](?:skills|rules|agents|hooks)[/\\])/i;

const HOOK_EXEMPT_RE =
  /^(?:\.cursor[/\\]audit[/\\]checkpoints[/\\]|\.cursor[/\\]\.gate-stamps[/\\])/i;

function sessionFile(repoRoot) {
  return join(repoRoot, SESSION_PATH);
}

function ledgerFile(repoRoot) {
  return join(repoRoot, LEDGER_PATH);
}

export function defaultSession() {
  return {
    startedAt: new Date().toISOString(),
    bundleSkillRead: false,
    codingSessionRead: false,
    kernelAuthorityRead: false,
    enterpriseKnowledgeRead: false,
    reads: [],
    violationsThisSession: 0,
  };
}

export function loadSession(repoRoot) {
  try {
    const raw = readFileSync(sessionFile(repoRoot), "utf8");
    const parsed = JSON.parse(raw);
    return { ...defaultSession(), ...parsed };
  } catch {
    return defaultSession();
  }
}

export function saveSession(repoRoot, session) {
  mkdirSync(join(repoRoot, ".cursor/audit"), { recursive: true });
  writeFileSync(sessionFile(repoRoot), `${JSON.stringify(session, null, 2)}\n`, "utf8");
}

export function isGovernedEditPath(relativePath) {
  if (!relativePath) {
    return false;
  }
  const normalized = relativePath.replace(/\\/g, "/");
  if (HOOK_EXEMPT_RE.test(normalized)) {
    return false;
  }
  return GOVERNED_EDIT_RE.test(normalized);
}

export function recordSkillRead(repoRoot, relativePath) {
  if (!relativePath) {
    return loadSession(repoRoot);
  }

  const normalized = relativePath.replace(/\\/g, "/");
  const session = loadSession(repoRoot);

  if (!session.reads.includes(normalized)) {
    session.reads.push(normalized);
  }

  for (const marker of SKILL_READ_MARKERS) {
    if (marker.match.test(normalized)) {
      session[marker.key] = true;
    }
  }

  saveSession(repoRoot, session);
  return session;
}

export function countLedgerLines(repoRoot) {
  try {
    const raw = readFileSync(ledgerFile(repoRoot), "utf8");
    return raw
      .split("\n")
      .filter((line) => line.trim().startsWith("{"))
      .length;
  } catch {
    return 0;
  }
}

export function appendViolation(repoRoot, violation) {
  mkdirSync(join(repoRoot, ".cursor/audit"), { recursive: true });

  const entry = {
    auditedAt: new Date().toISOString(),
    source: "hook",
    transcriptId: "cursor-session",
    ...violation,
  };

  appendFileSync(ledgerFile(repoRoot), `${JSON.stringify(entry)}\n`, "utf8");

  const session = loadSession(repoRoot);
  session.violationsThisSession += 1;
  saveSession(repoRoot, session);

  return {
    entry,
    sessionTotal: session.violationsThisSession,
    ledgerTotal: countLedgerLines(repoRoot),
  };
}

export function recordEditBeforeBundleRead(repoRoot, relativePath, toolName) {
  return appendViolation(repoRoot, {
    turn: 0,
    code: "V002",
    summary: "edit-before-preflight",
    evidence: `${toolName} on ${relativePath} before coding-consistency-bundle Read`,
    path: relativePath,
  });
}

export function auditAssistantMessage(repoRoot, assistantMessage) {
  const violations = [];
  const msg = typeof assistantMessage === "string" ? assistantMessage : "";

  if (!msg.includes(BUNDLE_ANNOUNCEMENT)) {
    violations.push({
      code: "V001",
      summary: "missing-bundle-announcement",
      evidence: `Response missing exact line: ${BUNDLE_ANNOUNCEMENT}`,
    });
  }

  if (!msg.includes(SESSION_ANNOUNCEMENT)) {
    violations.push({
      code: "V007",
      summary: "missing-session-announcement",
      evidence: `Response missing: ${SESSION_ANNOUNCEMENT}`,
    });
  }

  if (!msg.includes("## Completion Report")) {
    violations.push({
      code: "V010",
      summary: "completion-without-evidence",
      evidence: "Coding turn missing ## Completion Report (§11)",
    });
  }

  const recorded = [];
  for (const v of violations) {
    recorded.push(
      appendViolation(repoRoot, {
        turn: 0,
        ...v,
      })
    );
  }

  return recorded;
}

export function hardStopMessage({ code, ledgerTotal, sessionTotal, relativePath }) {
  return [
    "HARD STOP — coding-consistency-bundle preflight violated (automatic hook).",
    "",
    `Violation ${code} recorded → ${LEDGER_PATH}`,
    `Session violations: ${sessionTotal} | Ledger total: ${ledgerTotal}`,
    "",
    "IF IT IS NOT PREFLIGHT, THEN HARD STOP AND SHOWING THE SCRIPT... USE THE SKILL!!!",
    "",
    `Required first line: ${BUNDLE_ANNOUNCEMENT}`,
    "Then: Read .cursor/skills/coding-consistency-bundle/SKILL.md → Preflight Receipt → Phase 0.",
    "",
    relativePath ? `Blocked edit target: ${relativePath}` : "",
    "Reference: .cursor/skills/coding-consistency-bundle/reference/hard-stop.md",
  ]
    .filter(Boolean)
    .join("\n");
}
