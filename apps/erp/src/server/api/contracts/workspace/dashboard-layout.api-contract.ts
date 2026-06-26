import { z } from "zod";

const dashboardWidgetIdSchema = z
  .enum([
    "invoice-table",
    "kpi-active-orders",
    "kpi-headcount",
    "kpi-net-income",
    "kpi-open-tasks",
    "module-earnings",
    "payment-history",
    "recent-transactions",
    "regional-sales",
    "revenue-chart",
    "sparkline-expense",
    "sparkline-revenue",
    "statistics-line-trends",
    "statistics-metrics",
  ])
  .meta({
    description: "Canonical dashboard widget identifier.",
    example: "kpi-net-income",
  });

const legacyDashboardWidgetIdSchema = z
  .enum(["kpi-stats", "sparkline-stats"])
  .meta({
    description:
      "Legacy widget identifiers retained for stored layout migration.",
    example: "kpi-stats",
  });

const dashboardLayoutWidgetKeySchema = z
  .union([dashboardWidgetIdSchema, legacyDashboardWidgetIdSchema])
  .meta({
    description: "Widget key — canonical or legacy identifier.",
    example: "kpi-net-income",
  });

const dashboardWidgetLayoutItemSchema = z
  .object({
    h: z.number().int().positive().meta({
      description: "Grid row span (height in grid units).",
      example: 2,
    }),
    i: dashboardLayoutWidgetKeySchema.meta({
      description: "Unique widget key within the layout grid.",
    }),
    minH: z.number().int().positive().optional().meta({
      description: "Minimum row span enforced by the layout engine.",
      example: 1,
    }),
    minW: z.number().int().positive().optional().meta({
      description: "Minimum column span enforced by the layout engine.",
      example: 2,
    }),
    w: z.number().int().positive().meta({
      description: "Grid column span (width in grid units).",
      example: 4,
    }),
    x: z.number().int().nonnegative().meta({
      description: "Zero-based column position in the 12-column grid.",
      example: 0,
    }),
    y: z.number().int().nonnegative().meta({
      description: "Zero-based row position in the layout grid.",
      example: 0,
    }),
  })
  .meta({
    id: "DashboardWidgetLayoutItem",
    description: "Single widget placement within the dashboard grid.",
  });

export const dashboardLayoutPresetSchema = z
  .object({
    columns: z.literal(12).meta({
      description: "Fixed column count for the dashboard grid.",
      example: 12,
    }),
    items: z.array(dashboardWidgetLayoutItemSchema).readonly().meta({
      description: "Ordered widget layout items for the dashboard.",
    }),
    rowHeight: z.number().int().positive().meta({
      description: "Base row height in pixels for grid row calculations.",
      example: 80,
    }),
    version: z.literal(1).meta({
      description: "Layout schema version for forward-compatible migrations.",
      example: 1,
    }),
  })
  .meta({
    id: "DashboardLayoutPreset",
    description: "Versioned dashboard widget grid preset.",
  });

export type DashboardLayoutPresetDto = z.infer<
  typeof dashboardLayoutPresetSchema
>;

export const dashboardLayoutResponseSchema = z
  .object({
    layout: dashboardLayoutPresetSchema.meta({
      description: "Resolved dashboard layout preset for the workspace.",
    }),
    source: z.enum(["default", "stored"]).meta({
      description:
        "Whether the layout was loaded from tenant defaults or persisted storage.",
      example: "stored",
    }),
    updatedAt: z.string().datetime().nullable().meta({
      description:
        "ISO-8601 timestamp when the stored layout was last updated, or null for defaults.",
      example: "2026-06-26T10:30:00.000Z",
    }),
  })
  .meta({
    id: "DashboardLayoutResponse",
    description: "Workspace dashboard layout with provenance metadata.",
  });

export type DashboardLayoutResponseDto = z.infer<
  typeof dashboardLayoutResponseSchema
>;

export const dashboardLayoutPutRequestSchema = dashboardLayoutPresetSchema;

export type DashboardLayoutPutRequestDto = z.infer<
  typeof dashboardLayoutPutRequestSchema
>;

export const dashboardLayoutDeleteResponseSchema = z
  .object({
    reset: z.literal(true).meta({
      description:
        "Confirms the workspace layout was reset to the tenant default.",
      example: true,
    }),
  })
  .meta({
    id: "DashboardLayoutDeleteResponse",
    description: "Acknowledgement that the stored dashboard layout was reset.",
  });

export type DashboardLayoutDeleteResponseDto = z.infer<
  typeof dashboardLayoutDeleteResponseSchema
>;
