import { z } from "zod";

const dashboardWidgetIdSchema = z.enum([
  "invoice-table",
  "kpi-stats",
  "module-earnings",
  "payment-history",
  "recent-transactions",
  "regional-sales",
  "revenue-chart",
  "sparkline-stats",
  "statistics-line-trends",
  "statistics-metrics",
]);

const dashboardWidgetLayoutItemSchema = z.object({
  h: z.number().int().positive(),
  i: dashboardWidgetIdSchema,
  minH: z.number().int().positive().optional(),
  minW: z.number().int().positive().optional(),
  w: z.number().int().positive(),
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
});

export const dashboardLayoutPresetSchema = z.object({
  columns: z.literal(12),
  items: z.array(dashboardWidgetLayoutItemSchema).readonly(),
  rowHeight: z.number().int().positive(),
  version: z.literal(1),
});

export type DashboardLayoutPresetDto = z.infer<typeof dashboardLayoutPresetSchema>;

export const dashboardLayoutResponseSchema = z.object({
  layout: dashboardLayoutPresetSchema,
  source: z.enum(["default", "stored"]),
  updatedAt: z.string().datetime().nullable(),
});

export type DashboardLayoutResponseDto = z.infer<
  typeof dashboardLayoutResponseSchema
>;

export const dashboardLayoutPutRequestSchema = dashboardLayoutPresetSchema;

export type DashboardLayoutPutRequestDto = z.infer<
  typeof dashboardLayoutPutRequestSchema
>;

export const dashboardLayoutDeleteResponseSchema = z.object({
  reset: z.literal(true),
});

export type DashboardLayoutDeleteResponseDto = z.infer<
  typeof dashboardLayoutDeleteResponseSchema
>;
