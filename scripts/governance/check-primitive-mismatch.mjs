#!/usr/bin/env node
/**
 * Gate B — Primitive mismatch detector (adapter + contract).
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

function hasRecipeLeakageInContract(contractSource) {
  if (/rounded-2xl/.test(contractSource)) {
    return "rounded-2xl (card/recipe surface in primitive contract)";
  }

  const hasMutedSurface = /bg-muted\/50/.test(contractSource);
  const hasBorder = /\bborder\b/.test(contractSource);
  const hasLargePadding = /\bp-6\b/.test(contractSource);

  if (hasMutedSurface && hasBorder && hasLargePadding) {
    return "border + bg-muted/50 + p-6 (recipe card surface in contract)";
  }

  return null;
}

/**
 * @param {string} slug
 * @param {string} rule
 * @param {string} adapterSource
 * @param {string} contractSource
 * @returns {{ mismatch: string; expected: string; actual: string; requiredFix: string; autofixPossible: boolean } | null}
 */
function checkMismatchRule(slug, rule, adapterSource, contractSource) {
  switch (rule) {
    case "M1": {
      const twoIcons =
        (
          adapterSource.match(
            /ChevronDownIcon|ChevronUpIcon|chevron-down|chevron-up/gi
          ) ?? []
        ).length >= 2;
      const hasRotate =
        /rotate/.test(contractSource) || /rotate/.test(adapterSource);
      if (twoIcons && hasRotate) {
        return {
          mismatch: "M1 Duplicate visual signal",
          expected: "one icon strategy (hide/show OR rotate, not both)",
          actual: "two chevrons + rotate class",
          requiredFix: "Use data-panel-open hide/show only — remove rotate",
          autofixPossible: false,
        };
      }
      return null;
    }
    case "M2": {
      const ariaExpanded = /aria-expanded/.test(adapterSource);
      const panelOpen =
        /data-\[panel-open\]/.test(adapterSource) ||
        /data-panel-open/.test(adapterSource);
      if (ariaExpanded && panelOpen) {
        return {
          mismatch: "M2 Mixed state source",
          expected:
            "single state authority (data-panel-open for Base UI accordion)",
          actual: "aria-expanded + data-panel-open both present",
          requiredFix: "Use Base UI documented data attribute only",
          autofixPossible: false,
        };
      }
      return null;
    }
    case "M3": {
      const afterFocus = /focus-visible:after:/.test(contractSource);
      const afterContent = /after:content/.test(contractSource);
      if (afterFocus && !afterContent) {
        return {
          mismatch: "M3 Dead pseudo-element class",
          expected: "after: pseudo contract when using focus-visible:after:",
          actual: "focus-visible:after: without after:content",
          requiredFix: "Remove dead after: class or add full pseudo contract",
          autofixPossible: false,
        };
      }
      return null;
    }
    case "M4": {
      const recipeLeak = hasRecipeLeakageInContract(contractSource);
      if (recipeLeak) {
        return {
          mismatch: "M4 Recipe leakage in contract",
          expected: "neutral primitive contract classes only",
          actual: recipeLeak,
          requiredFix: "Move decorative surface to recipe/block layer",
          autofixPossible: false,
        };
      }
      return null;
    }
    case "M6": {
      const slotImport = /_SLOTS/.test(adapterSource);
      const hardcodedSlots = [
        ...adapterSource.matchAll(/data-slot=["']([^"']+)["']/g),
      ].map((m) => m[1]);
      if (hardcodedSlots.length > 0 && !slotImport) {
        return {
          mismatch: "M6 Slot drift",
          expected: "data-slot from {NAME}_SLOTS contract import",
          actual: "hardcoded data-slot without SLOTS import",
          requiredFix: "Import ACCORDION_SLOTS (etc.) and use slot constants",
          autofixPossible: true,
        };
      }
      return null;
    }
    default:
      return null;
  }
}

function main() {
  const enforceMode = resolveEnforceMode();
  const { registry } = loadPrimitiveEvidenceRegistry();
  /** @type {string[]} */
  const reportRows = [];

  for (const spec of registry) {
    if (spec.mismatchRules.length === 0) {
      continue;
    }

    const adapterPath = join(uiRoot, `${spec.slug}.tsx`);
    const contractPath = join(uiRoot, `${spec.slug}.contract.ts`);
    const enforce = shouldEnforceTier(enforceMode, spec);

    if (!(existsSync(adapterPath) && existsSync(contractPath))) {
      continue;
    }

    const adapterSource = readFileSync(adapterPath, "utf8");
    const contractSource = readFileSync(contractPath, "utf8");

    for (const rule of spec.mismatchRules) {
      const finding = checkMismatchRule(
        spec.slug,
        rule,
        adapterSource,
        contractSource
      );
      if (!finding) {
        continue;
      }

      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: `${spec.slug}.tsx / ${spec.slug}.contract.ts`,
          file: adapterPath,
          severity: enforce ? "BLOCKER" : "WARN",
          mismatch: finding.mismatch,
          expected: finding.expected,
          actual: finding.actual,
          requiredFix: finding.requiredFix,
          autofixPossible: finding.autofixPossible,
          gateResult: enforce ? "FAIL" : "WARN",
        })
      );
    }
  }

  const exitCode = printEvidenceGateSummary(
    reportRows,
    `primitive mismatch (enforce=${enforceMode})`
  );

  if (exitCode === 0) {
    console.log(
      `primitive mismatch: OK (${registry.length} registry entries scanned, enforce=${enforceMode})`
    );
  }

  process.exit(exitCode);
}

main();
