import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const SRC_VIEWS_ROOT = path.join(PACKAGE_ROOT, "src", "views");
const DOCS_SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");

const ADR_0042_PATH = path.join(
  REPO_ROOT,
  "docs",
  "adr",
  "ADR-0042-workspaceboard-drag-resize-runtime.md"
);

const FORBIDDEN_DRAG_MARKERS = [
  "draggable",
  "onDragStart",
  "onDragEnd",
  "DndContext",
  "react-grid-layout",
  "@dnd-kit/",
] as const;

function listViewSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listViewSourceFiles(absolutePath));
      continue;
    }

    if (/\.tsx$/u.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

describe("Lane B-02 WorkspaceBoard drag boundary", () => {
  it("records Accepted ADR-0042 with react-grid-layout and ERP ownership", () => {
    const adr = readFileSync(ADR_0042_PATH, "utf8");

    expect(adr).toContain("| **Status** | Accepted |");
    expect(adr).toContain("react-grid-layout");
    expect(adr).toContain("apps/erp/src/components/workspace/");
    expect(adr).toContain("WorkspaceBoardWidgetFrame");
    expect(adr).toContain("@dnd-kit/*");
  });

  it("closes PHASE-7B drag ADR open question via ADR-0042", () => {
    const phase7b = readFileSync(
      path.join(DOCS_SLICES_ROOT, "PHASE-7B-WORKFLOW-VIEWS.md"),
      "utf8"
    );

    expect(phase7b).toContain("ADR-0042");
    expect(phase7b).toContain("Resolved (Lane B-02)");
    expect(phase7b).toContain("react-grid-layout");
  });

  it("authorizes B-09 against ADR-0042", () => {
    const b09 = readFileSync(
      path.join(DOCS_SLICES_ROOT, "LANE-B-09-WORKFLOW-BOARD-RUNTIME.md"),
      "utf8"
    );

    expect(b09).toContain("ADR-0042");
  });

  it("keeps v2 view adapters free of drag library imports and handlers", () => {
    const viewFiles = listViewSourceFiles(SRC_VIEWS_ROOT);

    expect(viewFiles.length).toBeGreaterThan(0);

    for (const file of viewFiles) {
      const source = readFileSync(file, "utf8");
      const relativePath = path
        .relative(PACKAGE_ROOT, file)
        .replace(/\\/gu, "/");

      for (const marker of FORBIDDEN_DRAG_MARKERS) {
        expect(
          source,
          `${relativePath} must not contain ${marker}`
        ).not.toContain(marker);
      }
    }
  });
});
