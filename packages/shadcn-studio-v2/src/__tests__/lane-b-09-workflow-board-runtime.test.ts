import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const ERP_ROOT = path.join(REPO_ROOT, "apps", "erp");

const ADR_0042_PATH = path.join(
  REPO_ROOT,
  "docs",
  "adr",
  "ADR-0042-workspaceboard-drag-resize-runtime.md"
);

const B09_SLICE_PATH = path.join(
  PACKAGE_ROOT,
  "docs",
  "slices",
  "LANE-B-09-WORKFLOW-BOARD-RUNTIME.md"
);

const ERP_BOARD_FILES = [
  "src/components/workspace/workspace-board-canvas.client.tsx",
  "src/components/workspace/workspace-board-widget-frame.client.tsx",
] as const;

describe("Lane B-09 workflow board runtime", () => {
  it("records Complete B-09 slice with ADR-0042 authority", () => {
    const slice = readFileSync(B09_SLICE_PATH, "utf8");

    expect(slice).toContain("ADR-0042");
    expect(slice).toContain("Status: **Complete**");
    expect(slice).toContain("react-grid-layout");
  });

  it("ships ERP board runtime files under apps/erp only", () => {
    for (const relativePath of ERP_BOARD_FILES) {
      expect(existsSync(path.join(ERP_ROOT, relativePath))).toBe(true);
    }

    const erpPackage = readFileSync(
      path.join(ERP_ROOT, "package.json"),
      "utf8"
    );

    expect(erpPackage).toContain("react-grid-layout");
  });

  it("authorizes drag handles and reduced-motion obligations in ADR-0042", () => {
    const adr = readFileSync(ADR_0042_PATH, "utf8");

    expect(adr).toContain("WorkspaceBoardWidgetFrame");
    expect(adr).toContain("prefers-reduced-motion");
    expect(adr).toContain("apps/erp/src/components/workspace/");
  });

  it("wires metadata workspace board preview in ERP route", () => {
    const metadataWorkspacePage = readFileSync(
      path.join(
        ERP_ROOT,
        "src/app/(protected)/metadata-workspace/page.tsx"
      ),
      "utf8"
    );
    const metadataBoardPreview = readFileSync(
      path.join(
        ERP_ROOT,
        "src/app/(protected)/metadata-workspace/_components/metadata-workspace-board-preview.client.tsx"
      ),
      "utf8"
    );

    expect(metadataWorkspacePage).toContain("MetadataWorkspaceBoardPreview");
    expect(metadataBoardPreview).toContain("Workflow board runtime preview");
    expect(metadataBoardPreview).toContain("WorkspaceBoardCanvasClient");
  });

  it("keeps v2 view adapters free of drag library imports and handlers", () => {
    const viewsRoot = path.join(PACKAGE_ROOT, "src", "views");
    const forbidden = [
      "draggable",
      "onDragStart",
      "onDragEnd",
      "DndContext",
      "react-grid-layout",
      "@dnd-kit/",
    ] as const;

    function listViewFiles(directory: string): string[] {
      if (!existsSync(directory)) {
        return [];
      }

      const entries = readdirSync(directory, { withFileTypes: true });
      const files: string[] = [];

      for (const entry of entries) {
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          files.push(...listViewFiles(absolutePath));
          continue;
        }

        if (/\.tsx$/u.test(entry.name)) {
          files.push(absolutePath);
        }
      }

      return files;
    }

    const viewFiles = listViewFiles(viewsRoot);
    expect(viewFiles.length).toBeGreaterThan(0);

    for (const file of viewFiles) {
      const source = readFileSync(file, "utf8");
      const relativePath = path
        .relative(PACKAGE_ROOT, file)
        .replace(/\\/gu, "/");

      for (const marker of forbidden) {
        expect(
          source,
          `${relativePath} must not contain ${marker}`
        ).not.toContain(marker);
      }
    }
  });
});
