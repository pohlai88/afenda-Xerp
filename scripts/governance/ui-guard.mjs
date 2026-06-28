#!/usr/bin/env node

/**
 * ui:guard — Governed UI UI Governance bundle
 *
 * Runs all five enforcement layers in dependency order:
 *
 *   Gate A  @afenda/ui author layer        pnpm --filter @afenda/ui check:governance
 *   Gate B  appshell consumer layer        pnpm --filter @afenda/appshell check:governance
 *   Gate C  erp consumer layer             pnpm --filter @afenda/erp test:run (static subset)
 *   Gate D  in-process policy scan         governed-ui-consumption + consumer anti-slop
 *            on appshell, metadata-ui, erp, and packages/ui story files
 *   Gate E  CSS token authority            pnpm quality:css (manifest + raw value bans)
 *   Gate F  React ERP quality              react-erp-policy (recharts, forwardRef, hooks, a11y)
 *   Gate G  CSS bridge negative search     check-css-bridge-negative-search.mjs (NS1–NS5)
 *
 * Usage
 *   pnpm ui:guard                   # all gates (Gate F in warning mode)
 *   pnpm ui:guard --strict          # all gates with Gate F as hard failure
 *   pnpm ui:guard --gate A          # single gate by letter (A–G)
 *   pnpm ui:guard --gate G          # CSS bridge negative-search proof only
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
const reactErpPolicyUrl = pathToFileURL(
  join(repoRoot, "scripts/governance/react-erp-policy.mjs")
).href;
const cssBridgeNegativeSearchUrl = pathToFileURL(
  join(repoRoot, "scripts/governance/check-css-bridge-negative-search.mjs")
).href;

const { checkGovernedUiConsumption } = await import(policyUrl);
const { checkReactErpQuality } = await import(reactErpPolicyUrl);
const { runCssBridgeNegativeSearchGate } = await import(
  cssBridgeNegativeSearchUrl
);

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
    { root: join(repoRoot, "packages", "appshell", "src"), mode: "tsx" },
    { root: join(repoRoot, "packages", "metadata-ui", "src"), mode: "tsx" },
    { root: join(repoRoot, "apps", "erp", "src"), mode: "tsx" },
    { root: join(repoRoot, "packages", "ui", "src"), mode: "stories" },
  ];

  const files = searchRoots.flatMap(({ root, mode }) => {
    try {
      if (mode === "stories") {
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

    const violations = checkGovernedUiConsumption(content, rel);
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
  "visual slop": [
    "Move visual styling into semantic CSS classes in afenda-appshell.css / globals.css",
    "Replace gradients with solid var(--primary) or var(--muted) surfaces",
    "Replace arbitrary values with var(--afenda-radius-*) / var(--afenda-shadow-*) tokens",
    "Replace raw palette scales (bg-red-500) with semantic tokens (bg-destructive, text-muted-foreground)",
  ],
  variant: [
    "Use governed Button props: intent, emphasis, size, presentation",
    'Example: <Button intent="quiet" emphasis="ghost" size="sm" />',
  ],
  'size="icon': [
    'Use governed Button props: size="md" presentation="icon" (not stock size="icon*")',
  ],
  "Re-export barrel": [
    "Import directly: import { mapStockButtonVisualToGoverned } from '@afenda/ui/governance'",
    "Delete the local governance/index.ts re-export barrel",
  ],
  "stock-props": [
    "Import mapStockButtonProps from @afenda/ui/governance at call sites — no local stock-props wrappers",
  ],
  "@/components/ui": [
    "Import primitives from @afenda/ui and bridges from @afenda/ui/governance",
  ],
  recharts: [
    'Use next/dynamic with ssr:false: const AreaChart = dynamic(() => import("recharts").then(m => ({ default: m.AreaChart })), { ssr: false })',
    "Add loading state using aria-busy class: loading: () => <div className='afenda-chart-skeleton' aria-busy='true' />",
  ],
  forwardRef: [
    "React 19: remove forwardRef() — pass ref as a plain prop: function MyComp({ ref, ...props }: Props & { ref?: React.Ref<T> })",
  ],
  "useEffect with single set": [
    "Derive during render: const layout = resolvedInitialLayout; (no state needed if no local mutation)",
    "Or use key-prop reset: <Component key={presetId} layout={layoutProp} /> (parent resets state by changing key)",
  ],
  "aria-hidden": [
    'Wrap chart in <figure aria-label="…"> and add aria-hidden="true" to the chart element',
    'Add <figcaption className="sr-only"> describing the data story for screenreaders',
  ],
  "<img>": [
    'Replace <img> with <Image> from "next/image" — automatic size optimization + LCP improvement',
  ],
  "mutable let/var": [
    "Use React.cache() for per-request server functions; use const at module scope",
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
    label: "@afenda/ui — author governance (Foundation phase 04 primitives)",
    command: "pnpm --filter @afenda/ui check:governance",
    ref: ".cursor/skills/govern-primitive/SKILL.md — Author checklist",
  },
  {
    id: "B",
    label:
      "@afenda/appshell — consumer governance (Foundation phase 04 consumption)",
    command: "pnpm --filter @afenda/appshell check:governance",
    ref: ".cursor/rules/governed-ui-consumption.mdc",
  },
  {
    id: "C",
    label:
      "@afenda/erp — consumer governance (Foundation phase 04 consumption)",
    command:
      "pnpm --filter @afenda/erp test:run --reporter=verbose src/__tests__/governed-ui-consumption.test.ts",
    ref: ".cursor/rules/governed-ui-consumption.mdc",
  },
  {
    id: "E",
    label: "CSS token authority (manifest + raw visual value bans)",
    command: "pnpm quality:css",
    ref: ".cursor/skills/afenda-ui-quality/SKILL.md — Phase 3 token substitution",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log();
console.log(`${C.bold}${C.cyan}ui:guard${C.reset} — Governed UI UI Governance`);
divider();
console.log(
  `  ${C.dim}Policy:  scripts/governance/governed-ui-consumption.mjs${C.reset}`
);
console.log(
  `  ${C.dim}Skill:   .cursor/skills/afenda-ui-quality/SKILL.md${C.reset}`
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
  header("Gate D  In-process full-tree scan (className + anti-slop + imports)");
  info("scanning appshell, metadata-ui, erp .tsx + ui stories…");

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

// ── Gate F — React ERP quality in-process scan ───────────────────────────────
// Gate F runs in warning mode by default: new violations fail CI but
// pre-existing ones are surfaced without blocking pnpm ui:guard in dev.
// Pass --strict to make Gate F a hard failure (for CI enforcement).

const strictMode = argv.includes("--strict");

if (!scanOnly && (!gateFilter || gateFilter === "F")) {
  header(
    "Gate F  React ERP quality (recharts dynamic, forwardRef, hooks, a11y)"
  );
  info("scanning appshell, metadata-ui, erp .tsx/.ts files…");

  const reactErpRoots = [
    join(repoRoot, "packages", "appshell", "src"),
    join(repoRoot, "packages", "metadata-ui", "src"),
    join(repoRoot, "apps", "erp", "src"),
  ];

  const reactErpFiles = reactErpRoots.flatMap((root) => {
    try {
      return collectTsxFiles(root);
    } catch {
      return [];
    }
  });

  const reactErpViolations = [];

  for (const file of reactErpFiles) {
    const relPath = relative(repoRoot, file).replace(/\\/g, "/");
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }

    const violations = checkReactErpQuality(content, relPath);
    if (violations.length > 0) {
      reactErpViolations.push({ file: relPath, violations });
    }
  }

  if (reactErpViolations.length === 0) {
    pass(`${reactErpFiles.length} file(s) clean`);
  } else {
    const totalViolations = reactErpViolations.reduce(
      (n, v) => n + v.violations.length,
      0
    );

    // In non-strict mode: warn (yellow ⚠) but do not add to failures
    const gateColor = strictMode ? C.red : C.yellow;
    const gateSymbol = strictMode ? "✗" : "⚠";
    console.log(
      `  ${gateColor}${gateSymbol}${C.reset} ${totalViolations} violation(s) across ${reactErpViolations.length} file(s)${strictMode ? "" : " (warning — pass --strict to enforce)"}`
    );

    for (const { file, violations } of reactErpViolations) {
      console.log(`\n    ${C.bold}${file}${C.reset}`);
      for (const v of violations) {
        console.log(`      ${gateColor}• ${v}${C.reset}`);
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

    if (strictMode) {
      failures.push({
        id: "F",
        label: "React ERP quality",
        output: reactErpViolations
          .flatMap(({ file, violations }) =>
            violations.map((v) => `${file}: ${v}`)
          )
          .join("\n"),
      });
    }
  }
}

// ── Gate G — CSS bridge negative search ─────────────────────────────────────

if (!scanOnly && (!gateFilter || gateFilter === "G")) {
  header("Gate G  CSS bridge negative search (NS1–NS5 attestation)");
  info("scanning production packages for staging leaks and bridge drift…");

  const gateResult = runCssBridgeNegativeSearchGate();

  if (gateResult.ok) {
    pass("negative-search proof attestation printed");
  } else {
    failures.push({
      id: "G",
      label: "CSS bridge negative search",
      output: gateResult.result.violations.join("\n"),
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
    "    pnpm ui:guard --scan-only --fix-hint   # fast Governed UI scan + hints"
  );
  console.log(
    "    pnpm ui:guard --gate F --fix-hint      # React ERP quality + hints"
  );
  console.log(
    "    pnpm ui:guard --gate A                 # re-run single gate"
  );
  console.log(
    "    See .cursor/skills/react-erp-quality/SKILL.md + afenda-ui-quality/SKILL.md"
  );
  console.log();
  process.exit(1);
}
