import { z } from "zod";

/** Slug-only workspace selection hints allowed from client server-action payloads. */
export const operatingContextSelectionHintsSchema = z
  .object({
    companySlug: z.string().trim().min(1).max(128).optional(),
    organizationSlug: z.string().trim().min(1).max(128).optional(),
  })
  .strict();

export type OperatingContextSelectionHints = z.infer<
  typeof operatingContextSelectionHintsSchema
>;
