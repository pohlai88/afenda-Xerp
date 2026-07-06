import type { Metadata } from "next";
import { readAppearanceReviewNoteQuery } from "@/app/(lab)/settings/appearance/_queries/read-appearance-review-note.server";
import type {
  AppearanceSettingsPageData,
  LabPromotionNote,
  LabRouteLoader,
} from "./contracts";
import { createCachedLabLoader } from "./create-cached-lab-loader.server";
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
  reviewNote: null,
  guidelines: [
    {
      title: "Governed query read seam",
      summary:
        "Review notes load through a route-local _queries read helper — lab proof only, paired with the P2 Server Action.",
    },
    {
      title: "Governed Server Action seam",
      summary:
        "Review notes save through a route-local Server Action and httpOnly cookie — lab proof only, not ERP preference persistence.",
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

const loadSettingsAppearancePageUncached: LabRouteLoader<
  AppearanceSettingsPageData
> = async () => {
  const reviewNote = await readAppearanceReviewNoteQuery();

  return {
    ...demoAppearanceSettingsPageData,
    reviewNote,
  } satisfies AppearanceSettingsPageData;
};

export const loadSettingsAppearancePage = createCachedLabLoader(
  loadSettingsAppearancePageUncached
);

export function createAppearanceSettingsMetadata(): Metadata {
  return createRouteLabMetadata({
    canonicalHref: demoAppearanceSettingsPageData.canonicalHref,
    description:
      "Theme and appearance route in the Afenda route lab, validating settings composition before any ERP persistence exists.",
    previewImage: demoAppearanceSettingsPageData.previewImage,
    title: "Appearance settings review",
  });
}
