#!/usr/bin/env node

/**
 * ui:guard — TIP-004 UI Governance bundle
 *
 * Runs all four enforcement layers in dependency order:
 *
 *   Gate A  @afenda/ui author layer   pnpm --filter @afenda/ui check:governance
 *   Gate B  appshell consumer layer   pnpm --filter @afenda/appshell check:governance
 *   Gate C  erp consumer layer        pnpm --filter @afenda/erp test:run (static subset)
 *   Gate D  in-process policy scan    scripts/governance/governed-ui-consumption.mjs
 *            on appshell, erp, and packages/ui story files (*.stories.tsx)
 *
 * Usage
 *   pnpm ui:guard                   # all gates
 *   pnpm ui:guard --gate A          # single gate by letter
 *   pnpm ui:guard --scan-only       # Gate D only (fast, no subprocess)
 *   pnpm ui:guard --fix-hint        # show fix hints alongside violations
 *
 * Exit codes
 *   0  all gates passed
 *   1  one or more gates failed
 */

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// ─── Paths ────────────────────────────────────────────────────────────────────

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const policyUrl = pathToFileURL(
  join(repoRoot, "scripts/governance/governed-ui-consumption.mjs")
).href;

const { checkGovernedUiConsumption } = await import(policyUrl);

// ─── Args ─────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const gateFilter = (() => {
  const i = argv.indexOf("--gate");
  return i === -1 ? null : argv[i + 1]?.toUpperCase();
})();
const scanOnly = argv.includes("--scan-only");
const fixHint = argv.includes("--fix-hint");

// ─── ANSI helpers ─────────────────────────────────────────────────────────────

const isTTY = process.stdout.isTTY;
const C = {
  reset: isTTY ? "\x1b[0m" : "",
  bold: isTTY ? "\x1b[1m" : "",
  dim: isTTY ? "\x1b[2m" : "",
  red: isTTY ? "\x1b[31m" : "",
  green: isTTY ? "\x1b[32m" : "",
  yellow: isTTY ? "\x1b[33m" : "",
  cyan: isTTY ? "\x1b[36m" : "",
};

function pass(label) {
  console.log(`  ${C.green}✓${C.reset} ${label}`);
}

function fail(label) {
  console.log(`  ${C.red}✗${C.reset} ${label}`);
}

function info(msg) {
  console.log(`  ${C.dim}${msg}${C.reset}`);
}

function header(title) {
  console.log(`\n${C.bold}${C.cyan}${title}${C.reset}`);
}

function divider() {
  console.log(`${C.dim}${"─".repeat(60)}${C.reset}`);
}

// ─── Shell runner ─────────────────────────────────────────────────────────────

function runGate(label, command) {
  info(`running: ${command}`);
  const result = spawnSync(command, {
    shell: true,
    cwd: repoRoot,
    encoding: "utf8",
  });

  const out = [result.stdout ?? "", result.stderr ?? ""]
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n");

  if (result.status === 0 && !result.error) {
    pass(label);
    return { ok: true, label, command, output: out };
  }

  fail(label);
  return { ok: false, label, command, output: out };
}

// ─── In-process scanner (Gate D) ─────────────────────────────────────────────

function collectTsxFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    try {
      if (statSync(full).isDirectory()) {
        if (
          entry === "__tests__" ||
          entry === "node_modules" ||
          entry === ".next"
        ) {
          continue;
        }
        files.push(...collectTsxFiles(full));
      } else if (entry.endsWith(".tsx")) {
        files.push(full);
      }
    } catch {
      // skip unreadable entries
    }
  }
  return files;
}

function collectStoryFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    try {
      if (statSync(full).isDirectory()) {
        if (
          entry === "__tests__" ||
          entry === "node_modules" ||
          entry === ".next"
        ) {
          continue;
        }
        files.push(...collectStoryFiles(full));
      } else if (entry.endsWith(".stories.tsx")) {
        files.push(full);
      }
    } catch {
      // skip unreadable entries
    }
  }
  return files;
}

function runScan() {
  // Consumer-layer app wiring + Storybook story composition files
  const searchRoots = [
    join(repoRoot, "packages", "appshell", "src"),
    join(repoRoot, "apps", "erp", "src"),
    join(repoRoot, "packages", "ui", "src"),
  ];

  const files = searchRoots.flatMap((root) => {
    try {
      if (root.endsWith(`${join("packages", "ui", "src")}`)) {
        return collectStoryFiles(root);
      }
      return collectTsxFiles(root);
    } catch {
      return [];
    }
  });

  const allViolations = [];

  for (const file of files) {
    const rel = relative(repoRoot, file).replace(/\\/g, "/");
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }

    const violations = checkGovernedUiConsumption(content);
    if (violations.length > 0) {
      allViolations.push({ file: rel, violations });
    }
  }

  return { files: files.length, allViolations };
}

// ─── Fix hints ────────────────────────────────────────────────────────────────

const FIX_HINTS = {
  className: [
    'Move layout/chrome to a plain wrapper: <div className="…"><GovernedComponent /></div>',
    "Use governed props instead: intent, emphasis, tone, size, variant",
    'For shell dot/badge: wrap Button in <div className="relative"> not className on Button',
  ],
  "Re-export barrel": [
    "Import directly: import { mapStockButtonVisualToGoverned } from '@afenda/ui/governance'",
    "Delete the local governance/index.ts re-export barrel",
  ],
};

function printHints(violation) {
  for (const [key, hints] of Object.entries(FIX_HINTS)) {
    if (violation.includes(key)) {
      for (const hint of hints) {
        console.log(`      ${C.yellow}→${C.reset} ${hint}`);
      }
      return;
    }
  }
}

// ─── Gates definition ─────────────────────────────────────────────────────────

const SUBPROCESS_GATES = [
  {
    id: "A",
    label: "@afenda/ui — author governance (TIP-004 primitives)",
    command: "pnpm --filter @afenda/ui check:governance",
    ref: ".cursor/skills/govern-primitive/SKILL.md — Author checklist",
  },
  {
    id: "B",
    label: "@afenda/appshell — consumer governance (TIP-004 consumption)",
    command: "pnpm --filter @afenda/appshell check:governance",
    ref: ".cursor/rules/governed-ui-consumption.mdc",
  },
  {
    id: "C",
    label: "@afenda/erp — consumer governance (TIP-004 consumption)",
    command:
      "pnpm --filter @afenda/erp test:run --reporter=verbose src/__tests__/governed-ui-consumption.test.ts",
    ref: ".cursor/rules/governed-ui-consumption.mdc",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log();
console.log(`${C.bold}${C.cyan}ui:guard${C.reset} — TIP-004 UI Governance`);
divider();
console.log(
  `  ${C.dim}Policy:  scripts/governance/governed-ui-consumption.mjs${C.reset}`
);
console.log(
  `  ${C.dim}Skill:   .cursor/skills/govern-primitive/SKILL.md${C.reset}`
);
console.log(
  `  ${C.dim}Rule:    .cursor/rules/governed-ui-consumption.mdc${C.reset}`
);

const failures = [];
const startMs = Date.now();

// ── Subprocess gates A / B / C ────────────────────────────────────────────────

if (!scanOnly) {
  for (const gate of SUBPROCESS_GATES) {
    if (gateFilter && gateFilter !== gate.id) {
      continue;
    }

    header(`Gate ${gate.id}  ${gate.label}`);
    const result = runGate(gate.label, gate.command);

    if (!result.ok) {
      failures.push({ ...gate, output: result.output });

      // Print truncated output inline
      const lines = result.output.split("\n").filter(Boolean).slice(0, 20);
      for (const line of lines) {
        console.log(`    ${C.red}${line}${C.reset}`);
      }
      if (result.output.split("\n").length > 20) {
        console.log(
          `    ${C.dim}… (truncated — run command directly for full output)${C.reset}`
        );
      }
      console.log(`    ${C.dim}ref: ${gate.ref}${C.reset}`);
    }
  }
}

// ── Gate D — in-process full-tree scan ────────────────────────────────────────

if (!gateFilter || gateFilter === "D") {
  header("Gate D  In-process full-tree scan (multiline + barrel detection)");
  info("scanning consumer-layer .tsx files…");

  const { files, allViolations } = runScan();

  if (allViolations.length === 0) {
    pass(`${files} file(s) clean`);
  } else {
    const totalViolations = allViolations.reduce(
      (n, v) => n + v.violations.length,
      0
    );
    fail(
      `${totalViolations} violation(s) across ${allViolations.length} file(s)`
    );

    for (const { file, violations } of allViolations) {
      console.log(`\n    ${C.bold}${file}${C.reset}`);
      for (const v of violations) {
        console.log(`      ${C.red}• ${v}${C.reset}`);
        if (fixHint) {
          printHints(v);
        }
      }
    }

    if (!fixHint) {
      console.log(
        `\n  ${C.dim}Re-run with --fix-hint for remediation guidance${C.reset}`
      );
    }

    failures.push({
      id: "D",
      label: "in-process scan",
      output: allViolations
        .flatMap(({ file, violations }) =>
          violations.map((v) => `${file}: ${v}`)
        )
        .join("\n"),
    });
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────

const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);

divider();
if (failures.length === 0) {
  console.log(
    `\n${C.bold}${C.green}All gates passed${C.reset}  ${C.dim}(${elapsed}s)${C.reset}\n`
  );
  process.exit(0);
} else {
  const ids = failures.map((f) => f.id ?? "?").join(", ");
  console.log(
    `\n${C.bold}${C.red}${failures.length} gate(s) failed${C.reset} [${ids}]  ${C.dim}(${elapsed}s)${C.reset}`
  );
  console.log();
  console.log("  Quick fixes:");
  console.log(
    "    pnpm ui:guard --scan-only --fix-hint   # fast local scan + hints"
  );
  console.log(
    "    pnpm ui:guard --gate A                 # re-run single gate"
  );
  console.log(
    "    See .cursor/skills/govern-primitive/SKILL.md — Consumer checklist"
  );
  console.log();
  process.exit(1);
}
