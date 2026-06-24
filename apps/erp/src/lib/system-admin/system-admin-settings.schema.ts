import { z } from "zod";

export const UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT = "save-settings" as const;

export const updateSystemAdminSettingsInputSchema = z.object({
  intent: z.literal(UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT),
});

export type UpdateSystemAdminSettingsInput = z.infer<
  typeof updateSystemAdminSettingsInputSchema
>;
