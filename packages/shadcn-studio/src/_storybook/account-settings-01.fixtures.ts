/** Lab fixture data for account-settings-01 curated stories (PAS-006 presentation lab). */

import type { MetadataSlotHydrationLabWire } from "./metadata-slot-hydration-lab.helpers.js";

export const ACCOUNT_SETTINGS_01_BLOCK_ID = "account-settings-01" as const;

export const ACCOUNT_SETTINGS_01_LAB_OPERATOR = {
  displayName: "Ada Operator",
  email: "ada.operator@afenda.lab",
  tenantId: "ten_demo_afenda_lab",
  actorId: "usr_demo_afenda_lab",
} as const;

export const ACCOUNT_SETTINGS_01_SETTINGS_NAV = [
  { id: "general", label: "General", active: true },
  { id: "notifications", label: "Notifications", active: false },
  { id: "security", label: "Security", active: false },
  { id: "billing", label: "Billing", active: false },
] as const;

export const ACCOUNT_SETTINGS_01_SLOT_HYDRATION_LAB = {
  blockId: ACCOUNT_SETTINGS_01_BLOCK_ID,
  slotTargets: [
    {
      slotId: "profile.displayName",
      value: ACCOUNT_SETTINGS_01_LAB_OPERATOR.displayName,
    },
    {
      slotId: "profile.displayName.help",
      value:
        "Display name shown to other members in this workspace (lab fixture).",
    },
    {
      slotId: "profile.email",
      value: ACCOUNT_SETTINGS_01_LAB_OPERATOR.email,
    },
    {
      slotId: "profile.email.help",
      value: "Used for sign-in and account notifications (lab fixture).",
    },
  ],
} satisfies MetadataSlotHydrationLabWire;
