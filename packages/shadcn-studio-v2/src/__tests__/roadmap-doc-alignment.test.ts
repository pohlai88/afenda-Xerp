import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const DOCS_ROOT = path.join(PACKAGE_ROOT, "docs");
const HANDOFFS_ROOT = path.join(DOCS_ROOT, "handoffs");
const COMPONENT_PRE_MIGRATION_ROOT = path.join(
  DOCS_ROOT,
  "component-pre-migration"
);
const SLICES_ROOT = path.join(DOCS_ROOT, "slices");
const DOCS_README_PATH = path.join(DOCS_ROOT, "README.md");
const COMPONENT_PRE_MIGRATION_PATH = path.join(
  DOCS_ROOT,
  "COMPONENT-PRE-MIGRATION.md"
);
const MIGRATION_MAP_PATH = path.join(DOCS_ROOT, "MIGRATION-MAP.md");
const LEGACY_RETIREMENT_PLAN_PATH = path.join(
  DOCS_ROOT,
  "LEGACY-RETIREMENT-PLAN.md"
);
const PHASE_R_GUIDE_PATH = path.join(
  DOCS_ROOT,
  "PHASE-R-CONSUMER-CUTOVER-GUIDE.md"
);
const BRIDGING_R_GUIDE_PATH = path.join(
  DOCS_ROOT,
  "BRIDGING-R-PHASE-R-READINESS.md"
);
const BRIDGING_R_ROOT = path.join(DOCS_ROOT, "bridging-r");
const PHASE_0_AUTHORITY_LOCK_PATH = path.join(
  COMPONENT_PRE_MIGRATION_ROOT,
  "PHASE-0-DOCUMENTATION-AUTHORITY-LOCK.md"
);
const EXPECTED_BRIDGING_R_DOCS = [
  "README.md",
  "BR-0-PREFLIGHT-CONSISTENCY.md",
  "BR-0-1-SYNCHRONIZATION-AND-GAP-ANALYSIS.md",
  "BR-1-AUTHORITY-RECONCILIATION.md",
  "BR-2-ENTERPRISE-ACCEPTANCE-EVIDENCE.md",
  "BR-3-LEDGER-COMPLETION-AND-FIRST-CUTOVER-SURFACE.md",
  "BR-4-CSS-AND-EXPORT-READINESS.md",
  "BR-5-REAL-CONSUMER-SELECTION.md",
  "BR-6-CUTOVER-VALIDATION-BACKLOG.md",
  "BR-7-RELEASE-OWNER-GOVERNANCE.md",
] as const;
const REQUIRED_BRIDGING_R_IMPLEMENTATION_HEADINGS = [
  "## 1) Slice identity",
  "## 2) Strategic objective",
  "## 3) Scope boundaries",
  "## 4) Dependencies and sequence gates",
  "## 5) Implementation plan",
  "## 6) Test and verification commands",
  "## 7) Evidence log",
  "## 8) Risk register",
  "## 9) Open questions / assumptions",
  "## 10) Exit checklist",
  "## 11) Handoff summary",
] as const;
const REQUIRED_BRIDGING_R_STATUS_MARKERS = [
  "### Current bridge status",
  "| Dimension | Status | Evidence |",
] as const;
const BRIDGING_R_WORKSHEET_MARKERS = {
  "BR-2-ENTERPRISE-ACCEPTANCE-EVIDENCE.md": "### Execution worksheet",
  "BR-3-LEDGER-COMPLETION-AND-FIRST-CUTOVER-SURFACE.md":
    "### Execution worksheet",
  "BR-4-CSS-AND-EXPORT-READINESS.md": "### Decision record template",
  "BR-5-REAL-CONSUMER-SELECTION.md": "### Selection record",
  "BR-6-CUTOVER-VALIDATION-BACKLOG.md": "### Validation record",
  "BR-7-RELEASE-OWNER-GOVERNANCE.md": "### Approval record",
} as const;

const EXPECTED_SLICES = [
  {
    handoff: "SLICE-0-FOUNDATION-CORRECTION-HANDOFF.md",
    implementation: "SLICE-0-FOUNDATION-CORRECTION-IMPLEMENTATION.md",
    label: "Slice 0",
  },
  {
    handoff: "SLICE-0-5-PUBLIC-EXPORT-SCAFFOLD-HANDOFF.md",
    implementation: "SLICE-0-5-PUBLIC-EXPORT-SCAFFOLD-IMPLEMENTATION.md",
    label: "Slice 0.5",
  },
  {
    handoff: "SLICE-1-CSS-AND-THEME-FOUNDATION-HANDOFF.md",
    implementation: "SLICE-1-CSS-AND-THEME-FOUNDATION-IMPLEMENTATION.md",
    label: "Slice 1",
  },
  {
    handoff: "SLICE-2-CONFIG-AND-RUNTIME-BOUNDARY-HANDOFF.md",
    implementation: "SLICE-2-CONFIG-AND-RUNTIME-BOUNDARY-IMPLEMENTATION.md",
    label: "Slice 2",
  },
  {
    handoff: "SLICE-3A-PRIMITIVE-BASELINE-HANDOFF.md",
    implementation: "SLICE-3A-PRIMITIVE-BASELINE-IMPLEMENTATION.md",
    label: "Slice 3A",
  },
  {
    handoff: "SLICE-3B-PRIMITIVE-EXTENSION-HANDOFF.md",
    implementation: "SLICE-3B-PRIMITIVE-EXTENSION-IMPLEMENTATION.md",
    label: "Slice 3B",
  },
  {
    handoff: "SLICE-4-LAYOUT-AND-SHARED-PARTS-HANDOFF.md",
    implementation: "SLICE-4-LAYOUT-AND-SHARED-PARTS-IMPLEMENTATION.md",
    label: "Slice 4",
  },
  {
    handoff: "SLICE-5-FIRST-COMPOSED-VIEWS-HANDOFF.md",
    implementation: "SLICE-5-FIRST-COMPOSED-VIEWS-IMPLEMENTATION.md",
    label: "Slice 5",
  },
  {
    handoff: "SLICE-6-METADATA-LANE-HANDOFF.md",
    implementation: "SLICE-6-METADATA-LANE-IMPLEMENTATION.md",
    label: "Slice 6",
  },
  {
    handoff: "SLICE-7-PUBLIC-API-HARDENING-HANDOFF.md",
    implementation: "SLICE-7-PUBLIC-API-HARDENING-IMPLEMENTATION.md",
    label: "Slice 7",
  },
  {
    handoff: "SLICE-8-CONSUMER-PILOT-HANDOFF.md",
    implementation: "SLICE-8-CONSUMER-PILOT-IMPLEMENTATION.md",
    label: "Slice 8",
  },
  {
    handoff: "SLICE-9-LEGACY-RETIREMENT-HANDOFF.md",
    implementation: "SLICE-9-LEGACY-RETIREMENT-IMPLEMENTATION.md",
    label: "Slice 9",
  },
] as const;

const TAXONOMY_REQUIRED_ACTUAL_FILES = [
  "view-builders.ts",
  "view-metadata.ts",
  "view-metadata-gates.ts",
  "view-metadata-registry.ts",
  "AuthShell.tsx",
  "PageSurface.tsx",
  "MetricWidget.tsx",
  "consumer-pilot.tsx",
] as const;

const EXPECTED_COMPONENT_PRE_MIGRATION_PHASES = [
  {
    fileName: "PHASE-0-DOCUMENTATION-AUTHORITY-LOCK.md",
    inputStatus: "none",
    outputStatus: "no component status change",
  },
  {
    fileName: "PHASE-1-COMPONENT-INVENTORY-CLASSIFICATION.md",
    inputStatus: "no classified candidate",
    outputStatus: "candidate identified/classified",
  },
  {
    fileName: "PHASE-2-LEDGER-REGISTRATION.md",
    inputStatus: "candidate identified/classified",
    outputStatus: "`pending`",
  },
  {
    fileName: "PHASE-3-READINESS-APPROVAL.md",
    inputStatus: "`pending`",
    outputStatus: "`approved-for-migration`",
  },
  {
    fileName: "PHASE-4-V2-IMPLEMENTATION-PACKAGE-PROOF.md",
    inputStatus: "`approved-for-migration`",
    outputStatus: "`migrated`",
  },
  {
    fileName: "PHASE-5-CONTROLLED-PILOT-INTEGRATION.md",
    inputStatus: "`migrated`",
    outputStatus: "`pilot-proven`",
  },
  {
    fileName: "PHASE-6-ENTERPRISE-ACCEPTANCE.md",
    inputStatus: "`pilot-proven`",
    outputStatus: "`enterprise-accepted`",
  },
  {
    fileName: "PHASE-7-RELEASE-CUTOVER-RETIREMENT-REVIEW.md",
    inputStatus: "`enterprise-accepted`",
    outputStatus: "`retirement-candidate`",
  },
] as const;

const REQUIRED_PHASE_HEADINGS = [
  "## Phase metadata",
  "## Purpose",
  "## Scope",
  "## Procedure",
  "## Required evidence",
  "## Exit gate",
  "## Failure modes",
] as const;

const REQUIRED_PHASE_METADATA_FIELDS = [
  "| Document mode |",
  "| Audience |",
  "| Source of truth |",
  "| Input status |",
  "| Output status |",
  "| Allowed authority |",
  "| Blocked-by conditions |",
] as const;

const CONTROLLED_MIGRATION_STATUSES = [
  "pending",
  "approved-for-migration",
  "migrated",
  "pilot-proven",
  "enterprise-accepted",
  "retirement-candidate",
] as const;

describe("roadmap, handoff, and taxonomy documentation alignment", () => {
  it("has implementation and handoff artifacts for every roadmap slice", () => {
    const roadmap = readFileSync(path.join(DOCS_ROOT, "ROADMAP.md"), "utf8");

    for (const slice of EXPECTED_SLICES) {
      expect(roadmap).toContain(`| ${slice.label} |`);
      expect(
        existsSync(path.join(SLICES_ROOT, slice.implementation)),
        slice.implementation
      ).toBe(true);
      expect(
        existsSync(path.join(HANDOFFS_ROOT, slice.handoff)),
        slice.handoff
      ).toBe(true);
    }
  });

  it("keeps the slice index pointing to the handoff directory", () => {
    const index = readFileSync(
      path.join(SLICES_ROOT, "SLICE-IMPLEMENTATION-INDEX.md"),
      "utf8"
    );

    for (const slice of EXPECTED_SLICES) {
      expect(index).toContain(`](${slice.implementation})`);
      expect(index).toContain(`](../handoffs/${slice.handoff})`);
      expect(index).not.toContain(`](${slice.handoff})`);
    }
  });

  it("keeps the root documentation index synchronized with V2 authority docs", () => {
    const docsIndex = readFileSync(DOCS_README_PATH, "utf8");
    const requiredLinks = [
      "ROADMAP.md",
      "TAXONOMY.md",
      "MIGRATION-MAP.md",
      "COMPONENT-PRE-MIGRATION.md",
      "BRIDGING-R-PHASE-R-READINESS.md",
      "bridging-r/README.md",
      "bridging-r/BR-0-PREFLIGHT-CONSISTENCY.md",
      "bridging-r/BR-0-1-SYNCHRONIZATION-AND-GAP-ANALYSIS.md",
      "PHASE-R-CONSUMER-CUTOVER-GUIDE.md",
      "component-pre-migration/README.md",
      "LEGACY-RETIREMENT-PLAN.md",
      "slices/SLICE-IMPLEMENTATION-INDEX.md",
      "SLICE-IMPLEMENTATION-DETAIL-TEMPLATE.md",
      "SLICE-FINISHING-EVALUATION-AUDIT-HANDOFF.md",
      "handoffs/SLICE-0-5-FINISHING-EVALUATION-AUDIT-HANDOFF.md",
      "handoffs/SLICE-9-LEGACY-RETIREMENT-HANDOFF.md",
    ];

    for (const link of requiredLinks) {
      expect(docsIndex).toContain(link);
    }
  });

  it("keeps component pre-migration phase docs aligned with the master guide", () => {
    const masterGuide = readFileSync(COMPONENT_PRE_MIGRATION_PATH, "utf8");
    const phaseIndex = readFileSync(
      path.join(COMPONENT_PRE_MIGRATION_ROOT, "README.md"),
      "utf8"
    );

    expect(masterGuide).toContain("component-pre-migration/");
    expect(masterGuide).toContain("## Master and phase authority");
    expect(phaseIndex).toContain("Quality bar: `Enterprise 9.5`");

    for (const status of CONTROLLED_MIGRATION_STATUSES) {
      expect(masterGuide).toContain(status);
      expect(phaseIndex).toContain(status);
    }

    for (const phase of EXPECTED_COMPONENT_PRE_MIGRATION_PHASES) {
      const phasePath = path.join(COMPONENT_PRE_MIGRATION_ROOT, phase.fileName);

      expect(existsSync(phasePath), phase.fileName).toBe(true);
      expect(phaseIndex).toContain(`](${phase.fileName})`);

      const phaseDoc = readFileSync(phasePath, "utf8");

      for (const heading of REQUIRED_PHASE_HEADINGS) {
        expect(phaseDoc).toContain(heading);
      }

      for (const field of REQUIRED_PHASE_METADATA_FIELDS) {
        expect(phaseDoc).toContain(field);
      }

      expect(phaseDoc).toContain(`| Input status | ${phase.inputStatus} |`);
      expect(phaseDoc).toContain(`| Output status | ${phase.outputStatus} |`);
      expect(phaseDoc).toContain("Previous phase:");
      expect(phaseDoc).toContain("Next phase:");
    }
  });

  it("records a concrete phase 0 documentation authority evaluation", () => {
    const phaseZeroDoc = readFileSync(PHASE_0_AUTHORITY_LOCK_PATH, "utf8");

    expect(phaseZeroDoc).toContain("## Current evaluation");
    expect(phaseZeroDoc).toContain("Reviewed on `2026-07-05`");
    expect(phaseZeroDoc).toContain(
      "- Roadmap checked: `docs/ROADMAP.md` confirms V2 remains shadow-first"
    );
    expect(phaseZeroDoc).toContain(
      "- Taxonomy checked: `docs/TAXONOMY.md` registers the current V2 destinations"
    );
    expect(phaseZeroDoc).toContain(
      "- Migration map checked: `docs/MIGRATION-MAP.md` contains the legacy lane translation table"
    );
    expect(phaseZeroDoc).toContain(
      "- Pre-migration guide checked: `docs/COMPONENT-PRE-MIGRATION.md` remains the master authority"
    );
    expect(phaseZeroDoc).toContain(
      "- Retirement plan checked: `docs/LEGACY-RETIREMENT-PLAN.md` keeps deletion as a separate release-owner decision"
    );
    expect(phaseZeroDoc).toContain(
      "- Reference-pack boundary checked: `_reference/CreateEditorialLayout/reference/00-reference-sequence.md`"
    );
    expect(phaseZeroDoc).toContain("- Conflicts found: `none - reviewed`");
    expect(phaseZeroDoc).toContain("- Conflicts resolved: `none - reviewed`");
    expect(phaseZeroDoc).toContain(
      "Phase 0 verdict: the migration authority chain is current, linked, and non-conflicting"
    );
  });

  it("keeps taxonomy examples aligned to actual implemented files", () => {
    const taxonomy = readFileSync(path.join(DOCS_ROOT, "TAXONOMY.md"), "utf8");

    for (const fileName of TAXONOMY_REQUIRED_ACTUAL_FILES) {
      expect(taxonomy).toContain(fileName);
    }

    expect(taxonomy).not.toContain("metadata-builder.ts");
    expect(taxonomy).not.toContain("AuthShellView.tsx");
    expect(taxonomy).not.toContain("EvidenceWidget.tsx");
  });

  it("keeps Bridging-R linked as the required gate before Phase R", () => {
    const docsIndex = readFileSync(DOCS_README_PATH, "utf8");
    const roadmap = readFileSync(path.join(DOCS_ROOT, "ROADMAP.md"), "utf8");
    const sliceIndex = readFileSync(
      path.join(SLICES_ROOT, "SLICE-IMPLEMENTATION-INDEX.md"),
      "utf8"
    );
    const phaseRGuide = readFileSync(PHASE_R_GUIDE_PATH, "utf8");
    const bridgingRGuide = readFileSync(BRIDGING_R_GUIDE_PATH, "utf8");

    expect(docsIndex).toContain("BRIDGING-R-PHASE-R-READINESS.md");
    expect(docsIndex).toContain("bridging-r/README.md");
    expect(roadmap).toContain("### Bridging-R — Phase R readiness");
    expect(roadmap).toContain("| Bridging-R | Phase R readiness | verified |");
    expect(sliceIndex).toContain("../BRIDGING-R-PHASE-R-READINESS.md");
    expect(sliceIndex).toContain("../bridging-r/README.md");
    expect(phaseRGuide).toContain(
      "Phase R must not be treated as directly executable from slice completion alone."
    );
    expect(bridgingRGuide).toContain(
      "`Phase R` may now start for one bounded real-consumer surface."
    );
  });

  it("keeps the Bridging-R child implementation docs indexed and present", () => {
    const bridgingIndex = readFileSync(
      path.join(BRIDGING_R_ROOT, "README.md"),
      "utf8"
    );
    const bridgingGuide = readFileSync(BRIDGING_R_GUIDE_PATH, "utf8");

    for (const fileName of EXPECTED_BRIDGING_R_DOCS) {
      expect(existsSync(path.join(BRIDGING_R_ROOT, fileName)), fileName).toBe(
        true
      );
    }

    expect(bridgingIndex).toContain("BR-1-AUTHORITY-RECONCILIATION.md");
    expect(bridgingIndex).toContain("BR-7-RELEASE-OWNER-GOVERNANCE.md");
    expect(bridgingIndex).toContain("BR-0-PREFLIGHT-CONSISTENCY.md");
    expect(bridgingIndex).toContain(
      "BR-0-1-SYNCHRONIZATION-AND-GAP-ANALYSIS.md"
    );
    expect(bridgingGuide).toContain("bridging-r/README.md");
    expect(bridgingGuide).toContain("bridging-r/BR-0-PREFLIGHT-CONSISTENCY.md");
    expect(bridgingGuide).toContain(
      "bridging-r/BR-0-1-SYNCHRONIZATION-AND-GAP-ANALYSIS.md"
    );
    expect(bridgingGuide).toContain(
      "bridging-r/BR-1-AUTHORITY-RECONCILIATION.md"
    );
    expect(bridgingGuide).toContain(
      "bridging-r/BR-7-RELEASE-OWNER-GOVERNANCE.md"
    );
  });

  it("keeps Bridging-R implementation docs on the shared slice-detail structure", () => {
    for (const fileName of EXPECTED_BRIDGING_R_DOCS) {
      if (fileName === "README.md") {
        continue;
      }

      const document = readFileSync(
        path.join(BRIDGING_R_ROOT, fileName),
        "utf8"
      );

      for (const heading of REQUIRED_BRIDGING_R_IMPLEMENTATION_HEADINGS) {
        expect(document).toContain(heading);
      }

      for (const marker of REQUIRED_BRIDGING_R_STATUS_MARKERS) {
        expect(document).toContain(marker);
      }

      const worksheetMarker =
        BRIDGING_R_WORKSHEET_MARKERS[
          fileName as keyof typeof BRIDGING_R_WORKSHEET_MARKERS
        ];

      if (worksheetMarker) {
        expect(document).toContain(worksheetMarker);
      }
    }
  });

  it("keeps retirement authority wording consistent across the migration docs", () => {
    const roadmap = readFileSync(path.join(DOCS_ROOT, "ROADMAP.md"), "utf8");
    const componentPreMigration = readFileSync(
      COMPONENT_PRE_MIGRATION_PATH,
      "utf8"
    );
    const migrationMap = readFileSync(MIGRATION_MAP_PATH, "utf8");
    const phaseRGuide = readFileSync(PHASE_R_GUIDE_PATH, "utf8");
    const legacyRetirementPlan = readFileSync(
      LEGACY_RETIREMENT_PLAN_PATH,
      "utf8"
    );

    expect(componentPreMigration).toContain("`enterprise-accepted`");
    expect(componentPreMigration).toContain("`retirement-candidate`");
    expect(migrationMap).toContain(
      "`retirement-candidate` may be recorded only after the relevant row or lane is"
    );
    expect(migrationMap).toContain("`enterprise-accepted`.");
    expect(roadmap).toContain(
      "`enterprise-accepted` first, retirement review second"
    );
    expect(phaseRGuide).toContain(
      "Phase R must not be treated as directly executable from slice completion alone."
    );
    expect(legacyRetirementPlan).toContain(
      "Do not treat `pilot-proven` as `retirement-candidate`."
    );
    expect(migrationMap).not.toContain(
      "| `components-ui` | `components/ui` | `retirement-candidate` |"
    );
  });
});
