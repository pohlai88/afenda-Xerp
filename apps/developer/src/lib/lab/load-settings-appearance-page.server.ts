import type {
  AppearanceSettingsPageData,
  LabPromotionNote,
  LabRouteLoader,
} from "./contracts";

export const settingsAppearancePromotionNote = {
  futureErpPath:
    "apps/erp/src/lib/user-settings/load-appearance-settings-page.server.ts",
  futureDataSource: "server-action",
  notes:
    "Promotion keeps the theme panel structure and later wires persistence through ERP user settings actions.",
} satisfies LabPromotionNote;

const demoAppearanceSettingsPageData = {
  title: "Appearance settings review",
  description:
    "Settings surface focused on theme controls, shell density, and route-level UX validation before any user-preference persistence exists.",
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
