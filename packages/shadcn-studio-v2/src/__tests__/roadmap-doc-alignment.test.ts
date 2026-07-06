import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const DOCS_ROOT = path.join(PACKAGE_ROOT, "docs");
const SLICES_ROOT = path.join(DOCS_ROOT, "slices");

const ACTIVE_AUTHORITY_DOCS = [
  "DESIGN-SYSTEM-ARCHITECTURE.md",
  "DEVELOPMENT-ROADMAP.md",
  "TAXONOMY.md",
  "MIGRATION-MAP.md",
] as const;

const LANE_A_SLICE_DOCS = [
  "LANE-A-INTERNAL-STABILIZATION-INDEX.md",
  "LANE-A-01-KEBAB-STEM-NORMALIZATION.md",
  "LANE-A-02-WIDGET-MANIFEST-AND-EVIDENCE-ADAPTER.md",
  "LANE-A-03-AUTH-SHELL-PROOF-INTEGRATION.md",
  "LANE-A-04-PRIMITIVE-CONTRACT-FORM-CONTROLS.md",
  "LANE-A-05-PRIMITIVE-CONTRACT-OVERLAYS.md",
  "LANE-A-06-PRIMITIVE-CONTRACT-NAV-DATA.md",
  "LANE-A-07-QUARANTINE-PROMOTION-GOVERNANCE.md",
  "LANE-A-08-PROOF-ROUTE-STATE-MATRIX.md",
  "LANE-A-09-MANIFEST-WORKFLOW-KINDS.md",
  "LANE-A-10-SYNCHRONIZATION-GATE.md",
  "LANE-A-11-INTERNAL-SIGN-OFF-GATE.md",
] as const;

const ACTIVE_SLICE_DOCS = [
  "PRE-FLIGHT-0-DOCUMENTATION-BASELINE-LOCK.md",
  "PRE-FLIGHT-1-EXECUTABLE-GATE-ALIGNMENT.md",
  "PHASE-1-CLEAN-PACKAGE-SKELETON.md",
  "PHASE-2-TOKEN-AND-CSS-AUTHORITY.md",
  "PHASE-3-PRIMITIVE-LAYER.md",
  "PHASE-4-RUNTIME-BOUNDARY.md",
  "PHASE-5-LAYOUT-CHROME.md",
  "PHASE-7A-PAGE-AND-WIDGET-VIEWS.md",
  "PHASE-7B-WORKFLOW-VIEWS.md",
  "PHASE-7C-AUTH-PRESENTATION.md",
  "PHASE-7-PUBLIC-EXPORT-CONTRACT.md",
  "PHASE-8-VERIFICATION-APP-AND-PROOF-ROUTE.md",
  "PHASE-9-ENTERPRISE-ACCEPTANCE-GATE.md",
  "CLOSING-SYNCHRONIZATION-GATE.md",
] as const;

const REQUIRED_SLICE_SECTIONS = [
  "## Overview",
  "## Problem",
  "## Goals",
  "## Non-goals",
  "## Constraints",
  "## Proposed design",
  "## Interfaces / dependencies",
  "## Risks and mitigations",
  "## Rollout and rollback",
] as const;

const REQUIRED_PACKAGE_GATES = [
  "pnpm --filter @afenda/shadcn-studio-v2 test",
  "pnpm --filter @afenda/shadcn-studio-v2 typecheck",
  "pnpm --filter @afenda/shadcn-studio-v2 build",
  "pnpm --filter @afenda/shadcn-studio-v2 check:drift",
  "pnpm exec biome ci packages/shadcn-studio-v2",
] as const;

const RETIRED_DOC_PATHS = [
  "docs/ROADMAP.md",
  "docs/design-system-slices/",
  "docs/handoffs/",
  "docs/bridging-r/",
  "docs/component-pre-migration/",
] as const;

describe("active roadmap, slice, and taxonomy documentation alignment", () => {
  it("keeps the current authority documents present", () => {
    for (const fileName of ACTIVE_AUTHORITY_DOCS) {
      expect(existsSync(path.join(DOCS_ROOT, fileName)), fileName).toBe(true);
    }

    expect(existsSync(path.join(SLICES_ROOT, "README.md"))).toBe(true);
  });

  it("keeps the active slice index linked to every executable slice", () => {
    const sliceIndex = readFileSync(
      path.join(SLICES_ROOT, "README.md"),
      "utf8"
    );

    for (const fileName of ACTIVE_SLICE_DOCS) {
      expect(existsSync(path.join(SLICES_ROOT, fileName)), fileName).toBe(true);
      expect(sliceIndex).toContain(`](${fileName})`);
    }
  });

  it("keeps the Lane A slice index linked to every executable Lane A slice", () => {
    const sliceIndex = readFileSync(
      path.join(SLICES_ROOT, "README.md"),
      "utf8"
    );
    const laneAIndex = readFileSync(
      path.join(SLICES_ROOT, "LANE-A-INTERNAL-STABILIZATION-INDEX.md"),
      "utf8"
    );

    for (const fileName of LANE_A_SLICE_DOCS) {
      expect(existsSync(path.join(SLICES_ROOT, fileName)), fileName).toBe(true);
      expect(sliceIndex + laneAIndex).toContain(`](${fileName})`);
    }
  });

  it("keeps active slice documents on the shared technical-spec structure", () => {
    for (const fileName of [
      ...ACTIVE_SLICE_DOCS,
      ...LANE_A_SLICE_DOCS.filter(
        (name) => name !== "LANE-A-INTERNAL-STABILIZATION-INDEX.md"
      ),
    ]) {
      const sliceDocument = readFileSync(
        path.join(SLICES_ROOT, fileName),
        "utf8"
      );

      for (const section of REQUIRED_SLICE_SECTIONS) {
        expect(sliceDocument, `${fileName} missing ${section}`).toContain(
          section
        );
      }
    }
  });

  it("keeps the universal package gates synchronized between architecture and slice index", () => {
    const architecture = readFileSync(
      path.join(DOCS_ROOT, "DESIGN-SYSTEM-ARCHITECTURE.md"),
      "utf8"
    );
    const sliceIndex = readFileSync(
      path.join(SLICES_ROOT, "README.md"),
      "utf8"
    );

    for (const gate of REQUIRED_PACKAGE_GATES) {
      expect(architecture).toContain(gate);
      expect(sliceIndex).toContain(gate);
    }
  });

  it("keeps taxonomy examples aligned to actual implemented files", () => {
    const taxonomy = readFileSync(path.join(DOCS_ROOT, "TAXONOMY.md"), "utf8");

    for (const fileName of [
      "view-builders.ts",
      "view-metadata.ts",
      "view-metadata-gates.ts",
      "view-metadata-registry.ts",
      "auth-shell.tsx",
      "page-surface.tsx",
      "widget-metric.tsx",
      "consumer-pilot.tsx",
    ]) {
      expect(taxonomy).toContain(fileName);
    }

    expect(taxonomy).not.toContain("metadata-builder.ts");
    expect(taxonomy).not.toContain("AuthShellView.tsx");
    expect(taxonomy).not.toContain("EvidenceWidget.tsx");
  });

  it("does not make retired documentation trees active authority again", () => {
    const sliceIndex = readFileSync(
      path.join(SLICES_ROOT, "README.md"),
      "utf8"
    );
    const roadmap = readFileSync(
      path.join(DOCS_ROOT, "DEVELOPMENT-ROADMAP.md"),
      "utf8"
    );

    for (const retiredPath of RETIRED_DOC_PATHS) {
      expect(sliceIndex).not.toContain(retiredPath);
      expect(roadmap).not.toContain(retiredPath);
    }
  });
});
