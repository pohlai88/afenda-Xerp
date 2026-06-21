#!/usr/bin/env node
/**
 * stop hook — scoped quality gates for afenda-Xerp.
 *
 * Optimizations over the naive version:
 *  1. Debounce: each gate records a pass-stamp. On subsequent stops the gate
 *     only re-runs if a file in its scope has an mtime newer than the stamp.
 *  2. On retry loops (loop_count > 0) only previously-failed gates re-run.
 *  3. Typecheck-only gates are fast; test:run gates are debounce-protected.
 */
import {
  emit,
  log,
  markGatePassed,
  parseStdinJson,
  resolveRepoRoot,
  runShell,
  scopeChangedSinceLastPass,
  truncate,
} from "./_hook-utils.mjs";

const TAG = "stop-quality-gates";

const GATES = [
  {
    key: "env-sync",
    scopes: [
      ".env.config",
      ".env.secret",
      "scripts/env-utils.mjs",
      "scripts/env-doctor.mjs",
      "scripts/sync-env.mjs",
    ],
    command: "pnpm env:sync && pnpm env:doctor",
    label: "env sync + doctor",
  },
  {
    key: "erp-typecheck",
    scope: "apps/erp",
    command: "pnpm --filter @afenda/erp typecheck",
    label: "@afenda/erp typecheck",
  },
  {
    key: "erp-test",
    scope: "apps/erp",
    command: "pnpm --filter @afenda/erp test",
    label: "@afenda/erp tests",
  },
  {
    key: "docs-typecheck",
    scope: "apps/docs",
    command: "pnpm --filter @afenda/docs typecheck",
    label: "@afenda/docs typecheck",
  },
  {
    key: "ds-typecheck",
    scope: "packages/design-system",
    command: "pnpm --filter @afenda/design-system typecheck",
    label: "@afenda/design-system typecheck",
  },
  {
    key: "ui-governance",
    scope: "packages/ui/src/components",
    command: "pnpm --filter @afenda/ui check:governance",
    label: "@afenda/ui governance check",
  },
  {
    key: "appshell-test",
    scope: "packages/appshell",
    command: "pnpm --filter @afenda/appshell test:run",
    label: "@afenda/appshell tests (incl. TIP-004 consumption)",
  },
];

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; skipping");
  emit({});
  process.exit(0);
}

const status = input.status ?? "completed";
const loopCount = typeof input.loop_count === "number" ? input.loop_count : 0;

if (status !== "completed") {
  log(TAG, `status=${status}; skipping`);
  emit({});
  process.exit(0);
}

const repoRoot = resolveRepoRoot();
const failures = [];

function gateScopeChanged(repoRoot, gate) {
  const key = gate.key;
  if (Array.isArray(gate.scopes)) {
    return gate.scopes.some((scope) =>
      scopeChangedSinceLastPass(repoRoot, scope, key)
    );
  }
  return scopeChangedSinceLastPass(repoRoot, gate.scope, key);
}

for (const gate of GATES) {
  if (!gateScopeChanged(repoRoot, gate)) {
    continue;
  }

  const scopeLabel = gate.scope ?? gate.scopes?.join(", ") ?? "unknown";
  log(TAG, `${scopeLabel} changed since last pass; running ${gate.label} (loop ${loopCount})`);

  const result = runShell(gate.command, repoRoot);
  const combined = truncate(
    [result.stdout ?? "", result.stderr ?? ""]
      .filter(Boolean)
      .join("\n")
      .trim() || `${gate.label} exited with code ${result.status ?? "unknown"}`
  );

  if (result.status === 0 && !result.error) {
    log(TAG, `${gate.label} passed — stamped`);
    markGatePassed(repoRoot, gate.key);
    continue;
  }

  const exitCode = result.status ?? 1;
  const errorNote = result.error
    ? `\nSpawn error: ${result.error.message}`
    : "";

  failures.push({
    label: gate.label,
    command: gate.command,
    exitCode,
    output: combined + errorNote,
  });
}

if (failures.length === 0) {
  emit({});
  process.exit(0);
}

log(TAG, `${failures.length} gate(s) failed`);

const sections = failures.flatMap((failure, index) => [
  index === 0
    ? "Quality gate(s) failed after your last turn. Fix the issues below, then stop — hooks will re-run automatically."
    : "",
  "",
  `## ${failure.label}`,
  `Command: ${failure.command}`,
  `Exit code: ${failure.exitCode}`,
  "",
  failure.output,
]);

emit({
  followup_message: sections.join("\n").trim(),
});

process.exit(0);
