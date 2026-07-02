#!/usr/bin/env node
/**
 * Gate A — Storybook primitive coverage (tier rules from primitive-evidence.registry.ts).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { compositionExportName } from "../storybook/lib/discover-primitive-stories.mjs";
import {
  loadPrimitiveEvidenceRegistry,
  resolveEnforceMode,
  shouldEnforceTier,
} from "./lib/load-primitive-evidence-registry.mjs";
import { requiresArgTypes } from "./lib/primitive-args-first-controls.mjs";
import {
  formatEvidenceReportRow,
  printEvidenceGateSummary,
} from "./lib/primitive-evidence-gate-report.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const uiRoot = join(repoRoot, "packages/shadcn-studio/src/components-ui");
const compositionsPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/primitive-story.compositions.tsx"
);
const manifestPath = join(
  repoRoot,
  "packages/shadcn-studio/src/storybook/primitive-story-manifest.generated.json"
);

function readCompositionSlugs(source) {
  const match = source.match(
    /PRIMITIVE_COMPOSITION_SLUGS\s*=\s*\[([\s\S]*?)\]\s*as const/
  );
  if (!match) {
    return [];
  }
  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

function hasRenderBlock(source) {
  return /\brender\s*:\s*(?:\(|function|<)/.test(source);
}

function hasPlayBlock(source) {
  return /\bplay\s*:\s*async/.test(source);
}

function hasLabSmokeTag(source) {
  return /lab-smoke/.test(source);
}

function hasA11ySmokeTag(source) {
  return /a11y-smoke/.test(source);
}

function hasChromaticSmokeEnabled(source) {
  return (
    /shadcnStudioChromaticSmokeParameters/.test(source) ||
    /disableSnapshot:\s*false/.test(source)
  );
}

function hasPrimitiveFigmaDesignFromEnv(source, slug) {
  const slugPattern = slug.replace(/-/g, "[_-]");
  return new RegExp(
    `shadcnStudioPrimitiveFigmaDesignFromEnv\\(\\s*["']${slugPattern}["']\\s*\\)`
  ).test(source);
}

function hasArgTypesBlock(source) {
  return /\bargTypes\s*:/.test(source);
}

function hasFnAction(source) {
  return /\bfn\s*\(\)/.test(source);
}

function hasAutodocsTag(source) {
  return /autodocs/.test(source);
}

function isArgsOnlyEmptyDefault(source) {
  return /export const Default:\s*Story\s*=\s*\{\s*args:\s*\{\s*\}\s*,?\s*\}/.test(
    source
  );
}

function main() {
  const enforceMode = resolveEnforceMode();
  const { registry } = loadPrimitiveEvidenceRegistry();
  const compositionsSource = readFileSync(compositionsPath, "utf8");
  const compositionSlugs = new Set(readCompositionSlugs(compositionsSource));

  /** @type {string[]} */
  const reportRows = [];

  for (const spec of registry) {
    const componentPath = join(uiRoot, `${spec.slug}.tsx`);
    const storyPath = join(uiRoot, `${spec.slug}.stories.tsx`);
    const storyFile = `${spec.slug}.stories.tsx`;
    const enforce = shouldEnforceTier(enforceMode, spec);

    if (!existsSync(componentPath)) {
      continue;
    }

    if (!existsSync(storyPath)) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: enforce ? "BLOCKER" : "WARN",
          mismatch: "Missing colocated story",
          expected: `${storyFile} exists`,
          actual: "file missing",
          requiredFix: "pnpm storybook generate or add hand-curated story",
          autofixPossible: true,
          gateResult: enforce ? "FAIL" : "WARN",
        })
      );
      continue;
    }

    const storySource = readFileSync(storyPath, "utf8");

    if (!hasAutodocsTag(storySource)) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: enforce ? "BLOCKER" : "WARN",
          mismatch: "Missing autodocs tag",
          expected: 'tags include "autodocs"',
          actual: "autodocs not found",
          requiredFix: "Add autodocs to meta.tags",
          autofixPossible: true,
          gateResult: enforce ? "FAIL" : "WARN",
        })
      );
    }

    if (spec.requiresRender && !hasRenderBlock(storySource)) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: enforce ? "BLOCKER" : "WARN",
          mismatch: "Compound primitive missing render()",
          expected: "render() with child structure",
          actual: isArgsOnlyEmptyDefault(storySource)
            ? "args: {} only"
            : "no render block",
          requiredFix: "Add render() fixture — do not use args-only Default",
          autofixPossible: true,
          gateResult: enforce ? "FAIL" : "WARN",
        })
      );
    }

    if (spec.requiresPlay && !hasPlayBlock(storySource)) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: enforce ? "BLOCKER" : "WARN",
          mismatch: "Gold interactive missing play",
          expected: "play async with role-first interaction",
          actual: "no play block",
          requiredFix: "Add play with getByRole and interaction assertion",
          autofixPossible: true,
          gateResult: enforce ? "FAIL" : "WARN",
        })
      );
    }

    if (spec.tier === "gold" && !hasLabSmokeTag(storySource)) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: enforce ? "BLOCKER" : "WARN",
          mismatch: "Gold tier missing lab-smoke tag",
          expected: 'tags include "lab-smoke"',
          actual: "lab-smoke not found",
          requiredFix: "Add lab-smoke for Vitest CI subset",
          autofixPossible: true,
          gateResult: enforce ? "FAIL" : "WARN",
        })
      );
    }

    if (spec.tier === "gold" && !hasA11ySmokeTag(storySource)) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: enforce ? "BLOCKER" : "WARN",
          mismatch: "Gold tier missing a11y-smoke tag",
          expected: 'tags include "a11y-smoke"',
          actual: "a11y-smoke not found",
          requiredFix:
            "Add a11y-smoke (shadcnStudioLabA11ySmokeStoryTags) for Vitest a11y CI",
          autofixPossible: true,
          gateResult: enforce ? "FAIL" : "WARN",
        })
      );
    }

    if (spec.tier === "gold" && !hasChromaticSmokeEnabled(storySource)) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: enforce ? "BLOCKER" : "WARN",
          mismatch: "Gold tier missing Chromatic smoke opt-in",
          expected:
            "Primary story spreads shadcnStudioChromaticSmokeParameters",
          actual: "chromatic disableSnapshot:false not found",
          requiredFix:
            "Add ...shadcnStudioChromaticSmokeParameters on Primary story",
          autofixPossible: true,
          gateResult: enforce ? "FAIL" : "WARN",
        })
      );
    }

    if (
      spec.tier === "gold" &&
      !hasPrimitiveFigmaDesignFromEnv(storySource, spec.slug)
    ) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: enforce ? "BLOCKER" : "WARN",
          mismatch: "Gold tier missing Figma design env hook",
          expected: `meta.parameters spreads shadcnStudioPrimitiveFigmaDesignFromEnv("${spec.slug}")`,
          actual: "primitive Figma env helper not found on meta",
          requiredFix:
            "Add ...shadcnStudioPrimitiveFigmaDesignFromEnv on meta.parameters",
          autofixPossible: true,
          gateResult: enforce ? "FAIL" : "WARN",
        })
      );
    }

    if (
      requiresArgTypes(spec) &&
      enforce &&
      !(hasArgTypesBlock(storySource) && hasFnAction(storySource))
    ) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: "BLOCKER",
          mismatch: "Args-first story missing Controls actions",
          expected: "meta.argTypes + fn() callback in Primary/default args",
          actual: hasArgTypesBlock(storySource)
            ? "no fn() in story file"
            : "no argTypes block",
          requiredFix:
            "Add argTypes from colocated-argtypes.ts and fn() on onClick/onChange/onCheckedChange",
          autofixPossible: true,
          gateResult: "FAIL",
        })
      );
    }

    if (
      spec.compound &&
      isArgsOnlyEmptyDefault(storySource) &&
      !hasRenderBlock(storySource)
    ) {
      reportRows.push(
        formatEvidenceReportRow({
          primitive: spec.slug,
          tier: spec.tier,
          story: storyFile,
          file: storyPath,
          severity: spec.tier === "gold" ? "BLOCKER" : "WARN",
          mismatch: "Empty compound story scaffold",
          expected: "meaningful render fixture",
          actual: "export const Default: Story = { args: {} }",
          requiredFix: "Replace with render() + ERP-realistic copy",
          autofixPossible: true,
          gateResult: spec.tier === "gold" && enforce ? "FAIL" : "WARN",
        })
      );
    }

    if (compositionSlugs.has(spec.slug)) {
      const exportName = compositionExportName(spec.slug);
      if (!compositionsSource.includes(`export function ${exportName}`)) {
        reportRows.push(
          formatEvidenceReportRow({
            primitive: spec.slug,
            tier: spec.tier,
            story: storyFile,
            file: compositionsPath,
            severity: "BLOCKER",
            mismatch: "Missing composition export",
            expected: `export function ${exportName}`,
            actual: "composition missing",
            requiredFix: "Add fixture to primitive-story.compositions.tsx",
            autofixPossible: false,
            gateResult: "FAIL",
          })
        );
      }
    }
  }

  let manifestManual = [];
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifestManual = manifest.manualCompositionRequired ?? [];
  }

  for (const slug of manifestManual) {
    reportRows.push(
      formatEvidenceReportRow({
        primitive: slug,
        tier: "—",
        story: "—",
        file: manifestPath,
        severity: "BLOCKER",
        mismatch: "manualCompositionRequired",
        expected: "composition-backed story",
        actual: slug,
        requiredFix: "pnpm storybook generate after adding composition",
        autofixPossible: false,
        gateResult: "FAIL",
      })
    );
  }

  const exitCode = printEvidenceGateSummary(
    reportRows,
    `storybook primitive coverage (enforce=${enforceMode})`
  );

  if (exitCode === 0) {
    console.log(
      `storybook primitive coverage: OK (${registry.length} registry entries, enforce=${enforceMode})`
    );
  }

  process.exit(exitCode);
}

main();
