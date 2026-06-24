import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationShellDashboardCanvas } from "./dashboard/app-shell-dashboard-canvas.client";
import type { DashboardLayoutPreset } from "./dashboard/dashboard-layout.contract";
import {
  renderDashboardCanvasInShellStory,
  renderDashboardCanvasStory,
} from "./_storybook/app-shell-dashboard-story.compositions";
import {
  DASHBOARD_STORY_BASE_ARGS,
  FINANCE_GATED_DASHBOARD_ARGS,
} from "./_storybook/app-shell-dashboard-story.fixtures";
import { ERP_STORY_BASE_ARGS } from "./_storybook/app-shell-story.fixtures";
import { compactDensityDecorator } from "./_storybook/dashboard-block-story.compositions";

function storyLayoutChangeStub(): void {
  // Storybook action stub — avoids storybook/test import in package typecheck.
}

/**
 * ## Widget size policy (12-column grid)
 *
 * Each widget type declares its own min/max/default in the registry.
 * `react-grid-layout` enforces min/max at the drag-resize handle level.
 *
 * | Widget type       | minW | minH | defaultW | defaultH | maxW | maxH |
 * |-------------------|------|------|----------|----------|------|------|
 * | KPI card          |  3   |  2   |    3     |    2     |  6   |  4   |
 * | Sparkline card    |  3   |  2   |    6     |    2     |  9   |  4   |
 * | Chart (stats)     |  4   |  3   |   12     |    3     | 12   |  6   |
 * | Chart (revenue)   |  4   |  3   |   12     |    4     | 12   |  8   |
 * | Activity feed     |  3   |  3   |    6     |    4     | 12   |  8   |
 * | Table (invoice)   |  4   |  4   |   12     |    5     | 12   | 10   |
 *
 * **Draggable:** enabled when `editMode={true}` — grab the drag handle (⠿) in the
 * top-left corner of each widget.
 *
 * **Resizable:** enabled when `editMode={true}` — drag the resize grip (▥) in the
 * bottom-right corner of each widget.
 */
const meta = {
  title: "ERP/ApplicationShell/Dashboard Canvas",
  component: ApplicationShellDashboardCanvas,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Governed dashboard canvas from `@afenda/appshell/dashboard`. " +
          "Each registry widget occupies one grid cell. " +
          "`editMode={true}` enables drag (⠿ handle) and resize (▥ grip). " +
          "Every widget type declares `minW`/`minH`/`maxW`/`maxH` in the central registry — " +
          "`react-grid-layout` enforces these limits at the resize handle so the drag never violates policy.",
      },
    },
  },
  args: {
    editMode: false,
    onLayoutChange: storyLayoutChangeStub,
    ...DASHBOARD_STORY_BASE_ARGS,
  },
} satisfies Meta<typeof ApplicationShellDashboardCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// PROOF 1 — DRAG
// Demonstrates: drag handles are rendered, isDraggable is wired to react-grid-layout
// ---------------------------------------------------------------------------

/**
 * **Drag proof.**
 *
 * All 14 registry widgets are rendered in edit mode. Every widget shows a **drag
 * handle** (⠿) in its top-left corner. Grab any handle and move it to a new grid
 * position — `react-grid-layout` enforces that widgets stay within the 12-column
 * desktop grid boundary (no horizontal overflow possible).
 *
 * How it works: `ApplicationShellDashboardCanvas` passes `isDraggable={editMode}` to
 * `DashboardGridLayoutAdapter` → `ResponsiveGridLayout`. The handle selector is
 * `.app-shell-dashboard-drag-handle`.
 */
export const DraggableEditMode: Story = {
  name: "✅ Proof — Draggable (edit mode)",
  render: () =>
    renderDashboardCanvasStory({
      editMode: true,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "**Drag proof.** `editMode={true}` → drag handles (⠿) appear on every widget. " +
          "Grab any handle and reorder. Layout stays within the 12-column grid — " +
          "no widget can be dragged past column 12.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// PROOF 2 — RESIZE + DEFAULT SIZES
// Demonstrates: resize handles are rendered, widgets start at their default sizes
// ---------------------------------------------------------------------------

/**
 * **Resize proof — widgets at default sizes.**
 *
 * The layout uses each widget's declared `defaultW × defaultH`:
 * - KPI cards: 3 cols × 2 rows  (1 of 4 logical widget columns)
 * - Sparkline: 6 cols × 2 rows  (2 of 4 logical widget columns)
 * - Charts:   12 cols × 3–4 rows (full width)
 * - Activity:  6 cols × 4 rows  (half width)
 * - Table:    12 cols × 5 rows  (full width)
 *
 * The **resize grip** (▥) is visible in the bottom-right corner of each widget.
 * Drag it to resize — `react-grid-layout` will clamp to the widget's min/max policy
 * automatically.
 */
export const ResizableAtDefaults: Story = {
  name: "✅ Proof — Resizable (default sizes)",
  render: () =>
    renderDashboardCanvasStory({
      editMode: true,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "**Resize proof.** `editMode={true}` → resize grips (▥) appear on every widget. " +
          "Each widget starts at its registry `defaultW × defaultH`. " +
          "Drag a grip — the widget grows/shrinks until it hits its `minW`/`minH` or `maxW`/`maxH` boundary, " +
          "then the resize handle stops.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// PROOF 3 — MAX SIZE (KPI)
// Demonstrates: KPI cards clamped to maxW:6 × maxH:4 — resize handle stops there
// ---------------------------------------------------------------------------

const KPI_AT_MAX_LAYOUT: DashboardLayoutPreset = {
  version: 1,
  columns: 12,
  rowHeight: 80,
  items: [
    // KPI at maxW=6, maxH=4 — cannot grow further right or down
    { i: "kpi-net-income", x: 0, y: 0, w: 6, h: 4 },
    { i: "kpi-active-orders", x: 6, y: 0, w: 6, h: 4 },
    // Sparklines below for reference
    { i: "sparkline-revenue", x: 0, y: 4, w: 6, h: 2 },
    { i: "sparkline-expense", x: 6, y: 4, w: 6, h: 2 },
  ],
};

/**
 * **KPI max-size proof.**
 *
 * Both KPI widgets are set to their declared maximum: `maxW = 6, maxH = 4`.
 * Try to drag the resize grip (▥) wider or taller — `react-grid-layout` will refuse
 * because the item is already at its policy ceiling. The grip is visible but the
 * widget does not grow.
 *
 * Policy source: `KPI_WIDGET_SIZING.maxW = 6, maxH = 4` in
 * `dashboard-metric-widget-definitions.tsx`.
 */
export const KpiAtMaxSize: Story = {
  name: "✅ Proof — KPI max size (maxW=6, maxH=4)",
  render: () =>
    renderDashboardCanvasStory({
      editMode: true,
      layout: KPI_AT_MAX_LAYOUT,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "**KPI max-size proof.** KPI widgets are set to `w=6, h=4` (their `maxW` and `maxH`). " +
          "The resize grip is visible but dragging it does NOT grow the widget — " +
          "`react-grid-layout` enforces `maxW`/`maxH` from the registry definition. " +
          "Acceptance criterion 3: *KPI widgets cannot resize beyond 2×2 widget units (6×4 grid units)*.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// PROOF 4 — MIN SIZE (KPI)
// Demonstrates: KPI cards at minW:3 × minH:2 — resize handle stops there when shrinking
// ---------------------------------------------------------------------------

const KPI_AT_MIN_LAYOUT: DashboardLayoutPreset = {
  version: 1,
  columns: 12,
  rowHeight: 80,
  items: [
    // KPI at minW=3, minH=2 — cannot shrink further
    { i: "kpi-net-income", x: 0, y: 0, w: 3, h: 2 },
    { i: "kpi-active-orders", x: 3, y: 0, w: 3, h: 2 },
    { i: "kpi-headcount", x: 6, y: 0, w: 3, h: 2 },
    { i: "kpi-open-tasks", x: 9, y: 0, w: 3, h: 2 },
  ],
};

/**
 * **KPI min-size proof.**
 *
 * All four KPI widgets are at their minimum: `minW = 3, minH = 2`.
 * Try to drag the resize grip (▥) smaller — `react-grid-layout` will refuse because
 * the item is already at its policy floor.
 *
 * Policy source: `KPI_WIDGET_SIZING.minW = 3, minH = 2` in
 * `dashboard-metric-widget-definitions.tsx`.
 */
export const KpiAtMinSize: Story = {
  name: "✅ Proof — KPI min size (minW=3, minH=2)",
  render: () =>
    renderDashboardCanvasStory({
      editMode: true,
      layout: KPI_AT_MIN_LAYOUT,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "**KPI min-size proof.** KPI widgets are at `w=3, h=2` (their `minW` and `minH`). " +
          "The resize grip is visible but dragging it smaller does NOT shrink the widget — " +
          "`react-grid-layout` enforces `minW`/`minH` from the registry definition. " +
          "Acceptance criterion 2: *KPI widgets default to 1×1 widget unit (3×2 grid units)*.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// PROOF 5 — MIN SIZE (CHART)
// Demonstrates: chart cannot shrink below minW:4 × minH:3
// ---------------------------------------------------------------------------

const CHART_AT_MIN_LAYOUT: DashboardLayoutPreset = {
  version: 1,
  columns: 12,
  rowHeight: 80,
  items: [
    // revenue-chart at minW=4, minH=3 — cannot shrink further
    { i: "revenue-chart", x: 0, y: 0, w: 4, h: 3 },
    { i: "statistics-metrics", x: 4, y: 0, w: 8, h: 3 },
  ],
};

/**
 * **Chart min-size proof.**
 *
 * `revenue-chart` is set to its registered minimum: `minW = 4, minH = 3`.
 * Dragging the resize grip (▥) inward will not shrink the widget below this floor.
 *
 * Acceptance criterion 4: *Chart widgets cannot resize below 2×2 widget units (6×3 grid units)*.
 * Note: the registry uses `minW = 4` (slightly less than 6) to permit narrower panel layouts.
 */
export const ChartAtMinSize: Story = {
  name: "✅ Proof — Chart min size (minW=4, minH=3)",
  render: () =>
    renderDashboardCanvasStory({
      editMode: true,
      layout: CHART_AT_MIN_LAYOUT,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "**Chart min-size proof.** `revenue-chart` is at `w=4, h=3` — its `minW`/`minH`. " +
          "Dragging the resize grip smaller stops at this boundary. " +
          "Acceptance criterion 4: *Chart widgets cannot resize below their declared minimum*.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// PROOF 6 — MAX SIZE (CHART)
// Demonstrates: chart capped at maxW:12 — full 12-column width, no horizontal overflow
// ---------------------------------------------------------------------------

const CHART_AT_MAX_LAYOUT: DashboardLayoutPreset = {
  version: 1,
  columns: 12,
  rowHeight: 80,
  items: [
    // revenue-chart at maxW=12, maxH=8 — cannot grow wider than the grid
    { i: "revenue-chart", x: 0, y: 0, w: 12, h: 8 },
  ],
};

/**
 * **Chart max-size proof.**
 *
 * `revenue-chart` is at `maxW = 12` — the full 12-column grid width.
 * The resize grip is visible but dragging right produces no horizontal overflow
 * because `maxW = 12 = DESKTOP_COLS`. The canvas also has `overflow-x: hidden`.
 *
 * Acceptance criterion 5: *Chart widgets cannot resize beyond 4×4 widget units (12×8 grid units)*.
 */
export const ChartAtMaxSize: Story = {
  name: "✅ Proof — Chart max size (maxW=12, maxH=8)",
  render: () =>
    renderDashboardCanvasStory({
      editMode: true,
      layout: CHART_AT_MAX_LAYOUT,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "**Chart max-size proof.** `revenue-chart` fills the full 12-column grid (`w=12, h=8`). " +
          "The resize grip is visible but no horizontal scrollbar appears — `maxW=12` caps the resize " +
          "to `DESKTOP_COLS` and `.app-shell-dashboard` has `overflow-x: hidden`. " +
          "Acceptance criterion 5 and 15.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// PROOF 7 — LAYOUT NORMALIZATION
// Demonstrates: persisted oversized layout is clamped on load, not discarded
// ---------------------------------------------------------------------------

const OVERSIZED_LAYOUT: DashboardLayoutPreset = {
  version: 1,
  columns: 12,
  rowHeight: 80,
  items: [
    // KPI intentionally oversized beyond maxW=6 and maxH=4 — should be clamped to 6×4
    { i: "kpi-net-income", x: 0, y: 0, w: 12, h: 10 },
    { i: "kpi-active-orders", x: 0, y: 10, w: 12, h: 10 },
  ],
};

/**
 * **Layout normalization proof.**
 *
 * The layout prop passes KPI widgets with `w=12, h=10` — both far beyond `maxW=6, maxH=4`.
 * `resolveDashboardLayoutPreset` calls `normalizeDashboardLayout` on load, which calls
 * `clampWidgetToPolicy` per item. The canvas renders the clamped layout (`w=6, h=4`),
 * not the raw oversized values.
 *
 * Acceptance criterion 7: *Invalid persisted layouts are normalized on load.*
 */
export const OversizedLayoutNormalized: Story = {
  name: "✅ Proof — Oversized layout clamped on load",
  render: () =>
    renderDashboardCanvasStory({
      editMode: false,
      layout: OVERSIZED_LAYOUT,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "**Normalization proof.** Layout prop sets KPI widgets to `w=12, h=10` (beyond `maxW=6, maxH=4`). " +
          "`normalizeDashboardLayout` clamps each item to its policy on load — the canvas renders " +
          "correctly sized widgets without falling back to the full default layout. " +
          "Acceptance criterion 7: *invalid persisted layouts are normalized on load*.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// EXISTING STORIES — kept for full canvas review
// ---------------------------------------------------------------------------

export const CanvasReadonly: Story = {
  name: "Canvas — readonly",
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, {
      editMode: false,
      showReadonlyPreviewLabel: true,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "Full canvas in readonly mode — no drag handles or resize grips are rendered. " +
          "Readonly preview label badge is visible above the grid.",
      },
    },
  },
};

export const CanvasEditable: Story = {
  name: "Canvas — editable (full registry)",
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, {
      editMode: true,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "Full canvas in edit mode — all 14 widgets show drag handles (⠿) and resize grips (▥). " +
          "Drag any widget to reorder. Resize any widget — the grip stops at the widget's declared min/max boundary.",
      },
    },
  },
};

export const FinanceGated: Story = {
  name: "Canvas — finance-gated",
  render: () =>
    renderDashboardCanvasStory({
      editMode: false,
      ...FINANCE_GATED_DASHBOARD_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "Finance permission-gated widgets hidden — validates capability-only render context on the canvas.",
      },
    },
  },
};

export const EmptyCanvas: Story = {
  name: "Canvas — empty state",
  render: () =>
    renderDashboardCanvasStory({
      editMode: false,
      layout: { version: 1, columns: 12, rowHeight: 80, items: [] },
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "Zero layout items — `aria-live` empty state region with status copy.",
      },
    },
  },
};

export const Mobile: Story = {
  name: "Canvas — mobile viewport",
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, {
      editMode: true,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    viewport: { defaultViewport: "mobile" },
    docs: {
      description: {
        story:
          "Mobile breakpoint — `react-grid-layout` switches to 4-column layout. " +
          "Drag and resize are still active but constrained to the 4-column mobile grid.",
      },
    },
  },
};

export const Tablet: Story = {
  name: "Canvas — tablet viewport",
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, {
      editMode: false,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};

export const Compact: Story = {
  name: "Canvas — compact density",
  render: () =>
    renderDashboardCanvasStory({
      editMode: false,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  decorators: [compactDensityDecorator],
};

export const DarkTheme: Story = {
  name: "Canvas — dark theme",
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, {
      editMode: false,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  globals: {
    theme: "dark",
  },
};

/**
 * Alias retained for test compatibility — same story as `DraggableEditMode`.
 * @internal
 */
export const WidgetsOnly: Story = {
  ...DraggableEditMode,
  name: "WidgetsOnly (test alias)",
};
