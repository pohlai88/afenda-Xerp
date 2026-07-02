#!/usr/bin/env node
/**
 * Gate C — Storybook evidence quality (play assertions, slots, interaction).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadPrimitiveEvidenceRegistry,
  resolveEnforceMode,
  shouldEnforceTier,
} from "./lib/load-primitive-evidence-registry.mjs";
import {
  formatEvidenceReportRow,
  printEvidenceGateSummary,
} from "./lib/primitive-evidence-gate-report.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const uiRoot = join(repoRoot, "packages/shadcn-studio/src/components-ui");

function hasRoleFirstQuery(source) {
  return (
    /getByRole\s*\(/.test(source) ||
    /getByLabelText\s*\(/.test(source) ||
    /findByRole\s*\(/.test(source) ||
    /findByLabelText\s*\(/.test(source)
  );
}

function hasDataSlotAssertion(source, slot) {
  return (
    new RegExp(
      `data-slot["'],\\s*["']${slot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`
    ).test(source) ||
    new RegExp(
      `toHaveAttribute\\(\\s*["']data-slot["'],\\s*["']${slot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`
    ).test(source)
  );
}

function hasUserEventInteraction(source) {
  return /userEvent\.(click|keyboard|type|hover|unhover)/.test(source);
}

function hasVisibilityAssertion(source) {
  return (
    /toBeVisible\s*\(/.test(source) ||
    /toBeInTheDocument\s*\(/.test(source) ||
    /findByText\s*\(/.test(source)
  );
}

function hasEvidenceAssertion(source) {
  return (
    hasUserEventInteraction(source) ||
    hasVisibilityAssertion(source) ||
    /\.toHaveAttribute\s*\(/.test(source)
  );
}

function hasContentFirstQuery(source) {
  return (
    hasRoleFirstQuery(source) ||
    /getByText\s*\(/.test(source) ||
    /getByPlaceholderText\s*\(/.test(source)
  );
}

function hasErpRealisticContent(source) {
  const textMatches = source.match(/["'`][^"'`]{12,}["'`]/g) ?? [];
  const meaningful = textMatches.filter(
    (t) =>
      !(
        t.includes("AUTO-GENERATED") ||
        t.includes("@storybook") ||
        t.includes("storybook/test")
      )
  );
  return meaningful.length >= 2 || /render:\s*\(\)/.test(source);
}

function main() {
  const enforceMode = resolveEnforceMode();
  const { registry } = loadPrimitiveEvidenceRegistry();
  /** @type {string[]} */
  const reportRows = [];

  for (const spec of registry) {
    if (!spec.requiresPlay && spec.expectedSlots.length === 0) {
      continue;
    }

    const storyPath = join(uiRoot, `${spec.slug}.stories.tsx`);
    const storyFile = `${spec.slug}.stories.tsx`;
    const enforce = shouldEnforceTier(enforceMode, spec);

    if (!existsSync(storyPath)) {
      continue;
    }

    const storySource = readFileSync(storyPath, "utf8");

    if (spec.requiresPlay) {
      const needsRoleFirst =
        spec.expectedRoles.length > 0 || spec.interaction !== "none";
      const needsUserInteraction = spec.interaction !== "none";

      if (needsRoleFirst && !hasRoleFirstQuery(storySource)) {
        reportRows.push(
          formatEvidenceReportRow({
            primitive: spec.slug,
            tier: spec.tier,
            story: storyFile,
            file: storyPath,
            severity: enforce ? "BLOCKER" : "WARN",
            mismatch: "Weak interaction — no role-first query",
            expected: "play uses getByRole or getByLabelText",
            actual: "no role-first query in play",
            requiredFix: "Add getByRole({ name: /.../ }) in play",
            autofixPossible: true,
            gateResult: enforce ? "FAIL" : "WARN",
          })
        );
      }

      if (!(needsRoleFirst || hasContentFirstQuery(storySource))) {
        reportRows.push(
          formatEvidenceReportRow({
            primitive: spec.slug,
            tier: spec.tier,
            story: storyFile,
            file: storyPath,
            severity: enforce ? "BLOCKER" : "WARN",
            mismatch: "Weak interaction — no content-first query",
            expected: "play uses getByText or getByPlaceholderText",
            actual: "no content-first query in play",
            requiredFix: "Query rendered ERP copy before asserting slots",
            autofixPossible: true,
            gateResult: enforce ? "FAIL" : "WARN",
          })
        );
      }

      if (needsUserInteraction && !hasUserEventInteraction(storySource)) {
        reportRows.push(
          formatEvidenceReportRow({
            primitive: spec.slug,
            tier: spec.tier,
            story: storyFile,
            file: storyPath,
            severity: enforce ? "BLOCKER" : "WARN",
            mismatch: "Weak interaction — missing userEvent",
            expected: "userEvent click/keyboard/type for interactive primitive",
            actual: "play lacks userEvent interaction",
            requiredFix: "Add userEvent.click or userEvent.type in play",
            autofixPossible: true,
            gateResult: enforce ? "FAIL" : "WARN",
          })
        );
      }

      if (!hasEvidenceAssertion(storySource)) {
        reportRows.push(
          formatEvidenceReportRow({
            primitive: spec.slug,
            tier: spec.tier,
            story: storyFile,
            file: storyPath,
            severity: enforce ? "BLOCKER" : "WARN",
            mismatch: "Weak interaction — no evidence assertion",
            expected: "toBeVisible, toHaveAttribute, or userEvent result",
            actual: "play lacks evidence assertion",
            requiredFix: "Assert slot, visibility, or state after interaction",
            autofixPossible: true,
            gateResult: enforce ? "FAIL" : "WARN",
          })
        );
      }
    }

    if (spec.expectedSlots.length > 0 && spec.requiresPlay) {
      const primarySlot =
        spec.expectedSlots.find((s) =>
          /trigger|root|checkbox|button|input|switch/.test(s)
        ) ?? spec.expectedSlots[0];

      if (!hasDataSlotAssertion(storySource, primarySlot)) {
        reportRows.push(
          formatEvidenceReportRow({
            primitive: spec.slug,
            tier: spec.tier,
            story: storyFile,
            file: storyPath,
            severity: enforce ? "BLOCKER" : "WARN",
            mismatch: "Missing governed data-slot assertion",
            expected: `play asserts data-slot="${primarySlot}"`,
            actual: "no data-slot assertion in play",
            requiredFix: `expect(...).toHaveAttribute("data-slot", "${primarySlot}")`,
            autofixPossible: true,
            gateResult: enforce ? "FAIL" : "WARN",
          })
        );
      }
    }

    if (
      (spec.tier === "gold" || spec.requiresRender) &&
      !hasErpRealisticContent(storySource)
    ) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: spec.tier === "gold" && enforce ? "BLOCKER" : "WARN",
          mismatch: "Empty or placeholder story body",
          expected: "ERP-realistic copy in render or args",
          actual: "minimal scaffold content",
          requiredFix: "Add domain-realistic labels and body text",
          autofixPossible: true,
          gateResult: spec.tier === "gold" && enforce ? "FAIL" : "WARN",
        })
      );
    }
  }

  const exitCode = printEvidenceGateSummary(
    reportRows,
    `storybook evidence (enforce=${enforceMode})`
  );

  if (exitCode === 0) {
    console.log(`storybook evidence: OK (enforce=${enforceMode})`);
  }

  process.exit(exitCode);
}

main();
