import {
  tenantAppearanceSettingsSchema,
  tenantIntegrationsSettingsSchema,
  tenantNotificationsSettingsSchema,
} from "@afenda/database";
import { z } from "zod";

export const UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT = "save-settings" as const;
export const UPDATE_NOTIFICATIONS_SETTINGS_INTENT =
  "save-notifications-settings" as const;
export const UPDATE_WORKSPACE_SETTINGS_INTENT =
  "save-workspace-settings" as const;
export const UPDATE_BILLING_SETTINGS_INTENT = "save-billing-settings" as const;
export const UPDATE_INTEGRATIONS_SETTINGS_INTENT =
  "save-integrations-settings" as const;
export const UPDATE_APPEARANCE_SETTINGS_INTENT =
  "save-appearance-settings" as const;

export const updateSystemAdminSettingsInputSchema = z.object({
  intent: z.literal(UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT),
  companyName: z.string().min(1).max(255).optional(),
});

export const updateNotificationsSettingsInputSchema = z.object({
  intent: z.literal(UPDATE_NOTIFICATIONS_SETTINGS_INTENT),
  payload: tenantNotificationsSettingsSchema,
});

export const updateWorkspaceSettingsInputSchema = z.object({
  intent: z.literal(UPDATE_WORKSPACE_SETTINGS_INTENT),
  payload: z.object({
    description: z.string().max(1024),
    slug: z.string().max(128),
    timezone: z.string().min(1).max(128),
    urlSuffix: z.string().max(255),
    workspaceName: z.string().min(1).max(255),
  }),
});

export const updateBillingSettingsInputSchema = z.object({
  intent: z.literal(UPDATE_BILLING_SETTINGS_INTENT),
  payload: z.object({
    addOns: z.array(
      z.object({
        badgeLabel: z.string().max(64).optional(),
        description: z.string().max(512),
        enabled: z.boolean(),
        id: z.string().min(1).max(64),
        name: z.string().min(1).max(255),
        priceLabel: z.string().max(64),
      })
    ),
    autoPayEnabled: z.boolean(),
    customAmount: z.string().max(32),
    notificationEmail: z.string().max(320),
    selectedPreset: z.string().max(32).optional(),
    setAmount: z.string().max(32),
    spendEnabled: z.boolean(),
  }),
});

export const updateIntegrationsSettingsInputSchema = z.object({
  intent: z.literal(UPDATE_INTEGRATIONS_SETTINGS_INTENT),
  payload: tenantIntegrationsSettingsSchema,
});

const tenantBrandLogoUploadMetaSchema = z.object({
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z
    .number()
    .int()
    .positive()
    .max(512 * 1024),
});

export const updateAppearanceSettingsInputSchema = z.object({
  intent: z.literal(UPDATE_APPEARANCE_SETTINGS_INTENT),
  payload: tenantAppearanceSettingsSchema.extend({
    logoUploadMeta: tenantBrandLogoUploadMetaSchema.optional(),
  }),
});

export type UpdateSystemAdminSettingsInput = z.infer<
  typeof updateSystemAdminSettingsInputSchema
>;
export type UpdateNotificationsSettingsInput = z.infer<
  typeof updateNotificationsSettingsInputSchema
>;
export type UpdateWorkspaceSettingsInput = z.infer<
  typeof updateWorkspaceSettingsInputSchema
>;
export type UpdateBillingSettingsInput = z.infer<
  typeof updateBillingSettingsInputSchema
>;
export type UpdateIntegrationsSettingsInput = z.infer<
  typeof updateIntegrationsSettingsInputSchema
>;
export type UpdateAppearanceSettingsInput = z.infer<
  typeof updateAppearanceSettingsInputSchema
>;
