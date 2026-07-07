import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  L4_VIEW_EXPORTS,
  type L4ViewExportSpec,
} from "./helpers/l4-view-inventory";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TEST_DIR, "..", "..", "..", "..");
const STORYBOOK_V2_VIEWS_ROOT = path.join(
  REPO_ROOT,
  "apps/storybook/stories/v2/views"
);

function exportNameToStoryStem(
  exportName: L4ViewExportSpec["exportName"]
): string {
  if (exportName === "AuthShell") {
    return "auth-shell";
  }

  if (exportName.endsWith("Widget")) {
    return exportName
      .replace(/Widget$/, "")
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase()
      .concat("-widget");
  }

  return exportName
    .replace(/Surface$/, "-surface")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

describe("Wave V2 L4 Storybook catalog alignment", () => {
  it("maps every public L4 export to a v2 view story file (8/8)", () => {
    const missing: string[] = [];

    for (const view of L4_VIEW_EXPORTS) {
      const storyStem = exportNameToStoryStem(view.exportName);
      const storyPath = path.join(
        STORYBOOK_V2_VIEWS_ROOT,
        `${storyStem}.stories.tsx`
      );

      if (!existsSync(storyPath)) {
        missing.push(`${view.exportName} -> ${storyStem}.stories.tsx`);
      }
    }

    expect(missing, missing.join("\n")).toEqual([]);
    expect(L4_VIEW_EXPORTS).toHaveLength(8);
  });
});
