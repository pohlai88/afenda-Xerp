import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { STORYBOOK_TIER_A_V1_LAYOUT_PRESET } from "../storybook/erp-workspace-dashboard.compositions.js";

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testDir, "../../../..");

const ERP_DASHBOARD_PRESET_PATH = join(
  repoRoot,
  "apps/erp/src/lib/workspace/dashboard-default-layout.preset.ts"
);

const ITEM_FOR_WIDGET_RE =
  /itemForWidget\("([^"]+)",\s*\{\s*x:\s*(\d+),\s*y:\s*(\d+),\s*w:\s*(\d+),\s*h:\s*(\d+)\s*\}\)/g;

function parseErpLayoutItems(source: string) {
  const items: Array<{
    h: number;
    i: string;
    w: number;
    x: number;
    y: number;
  }> = [];

  for (const match of source.matchAll(ITEM_FOR_WIDGET_RE)) {
    const widgetId = match[1];
    const x = match[2];
    const y = match[3];
    const w = match[4];
    const h = match[5];

    if (
      widgetId === undefined ||
      x === undefined ||
      y === undefined ||
      w === undefined ||
      h === undefined
    ) {
      continue;
    }

    items.push({
      i: widgetId,
      x: Number(x),
      y: Number(y),
      w: Number(w),
      h: Number(h),
    });
  }

  return items;
}

describe("erp workspace dashboard layout sync", () => {
  it("Storybook Tier A v1 preset matches ERP dashboard-default-layout.preset.ts", () => {
    const erpSource = readFileSync(ERP_DASHBOARD_PRESET_PATH, "utf8");
    const erpItems = parseErpLayoutItems(erpSource);

    expect(erpItems).toHaveLength(
      STORYBOOK_TIER_A_V1_LAYOUT_PRESET.items.length
    );

    expect(STORYBOOK_TIER_A_V1_LAYOUT_PRESET).toMatchObject({
      columns: 12,
      rowHeight: 80,
      version: 1,
    });

    expect([...STORYBOOK_TIER_A_V1_LAYOUT_PRESET.items]).toEqual(erpItems);
  });
});
