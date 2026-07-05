import type { Metadata } from "next";
import type {
  AppearanceSettingsPageData,
  LabPromotionNote,
  LabRouteLoader,
} from "./contracts";
import { createRouteLabMetadata } from "./create-route-lab-metadata";

export const settingsAppearancePromotionNote = {
  futureErpPath:
    "apps/erp/src/lib/user-settings/load-appearance-settings-page.server.ts",
  futureDataSource: "server-action",
  notes:
    "Promotion keeps the theme panel structure and later wires persistence through ERP user settings actions.",
} satisfies LabPromotionNote;

const demoAppearanceSettingsPageData = {
  canonicalHref: "/settings/appearance",
  title: "Appearance settings review",
  description:
    "Settings surface focused on theme controls, shell density, and route-level UX validation before any user-preference persistence exists.",
  previewImage: {
    alt: "Appearance route blueprint showing theme controls, guidance panels, and ERP promotion seams in the Afenda route lab.",
    height: 720,
    src: "/appearance-settings-blueprint.svg",
    width: 1280,
  },
  promotionSummary:
    "Appearance keeps the same route/panel composition while ERP later owns preference persistence and user-specific settings authority.",
  promotion: settingsAppearancePromotionNote,
  guidelines: [
    {
      title: "No local persistence contract",
      summary:
        "This screen validates layout and control grouping only. Durable preference writes belong to ERP runtime later.",
    },
    {
      title: "Promotion-safe composition",
      summary:
        "Theme control surface can move under ERP settings without reworking page boundaries or panel names.",
    },
    {
      title: "Client leaf isolation",
      summary:
        "Interactive customization stays inside the studio theme panel rather than leaking into the route loader.",
    },
  ],
} satisfies AppearanceSettingsPageData;

export const loadSettingsAppearancePage: LabRouteLoader<
  AppearanceSettingsPageData
> = async () => demoAppearanceSettingsPageData;

export function createAppearanceSettingsMetadata(): Metadata {
  return createRouteLabMetadata({
    canonicalHref: demoAppearanceSettingsPageData.canonicalHref,
    description:
      "Theme and appearance route in the Afenda route lab, validating settings composition before any ERP persistence exists.",
    previewImage: demoAppearanceSettingsPageData.previewImage,
    title: "Appearance settings review",
  });
}
