import type {
  LabPromotionNote,
  LabRouteLoader,
  ModuleDocumentPageData,
  ModuleDocumentRouteLoadResult,
  ModuleDocumentRouteParams,
  ModuleDocumentRouteState,
} from "./contracts";
import { createCachedLabLoader } from "./create-cached-lab-loader.server";

export const moduleDocumentPromotionNote = {
  futureErpPath:
    "apps/erp/src/app/(protected)/modules/[moduleId]/documents/[documentId]/page.tsx",
  futureDataSource: "domain-loader",
  notes:
    "Replace route-lab fixtures with ERP module document authority while preserving the dynamic route composition and route-local panel shape.",
} satisfies LabPromotionNote;

const slugSplitPattern = /[-_]/;
const kebabRouteSegmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const moduleDocumentIdPattern = /^[A-Z]{3}-[A-Z0-9]{4,}$/;

const toTitleCase = (value: string) =>
  value
    .split(slugSplitPattern)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");

const resolveModuleDocumentRouteState = (
  documentId: string
): Exclude<ModuleDocumentRouteState, "not-found"> => {
  if (documentId.endsWith("EMPTY")) {
    return "empty";
  }

  if (documentId.endsWith("RESTRICTED")) {
    return "restricted";
  }

  return "ready";
};

const isValidModuleDocumentRouteParams = ({
  documentId,
  moduleSlug,
  surface,
}: ModuleDocumentRouteParams) =>
  kebabRouteSegmentPattern.test(moduleSlug) &&
  kebabRouteSegmentPattern.test(surface) &&
  moduleDocumentIdPattern.test(documentId);

const getModuleDocumentStateSummary = (
  state: Exclude<ModuleDocumentRouteState, "not-found">
) => {
  switch (state) {
    case "empty":
      return "The route composition is valid, but the document preview intentionally demonstrates an empty-state operator surface before ERP authority is attached.";
    case "restricted":
      return "The route composition is valid, but the document preview intentionally demonstrates a restricted-state operator surface without claiming real permission authority.";
    default:
      return "The route composition is valid and demonstrates a fully shaped document surface with route-local panels and promotion-ready metadata.";
  }
};

const buildModuleDocumentPageData = ({
  documentId,
  moduleSlug,
  surface,
}: ModuleDocumentRouteParams): ModuleDocumentPageData => {
  const state = resolveModuleDocumentRouteState(documentId);

  return {
    canonicalHref: `/modules/${moduleSlug}/${surface}/${documentId}`,
    description:
      "This dynamic route proves that document-oriented module surfaces can keep thin page boundaries, typed loaders, route-owned states, and local composition before ERP runtime authority exists.",
    documentFacts: [
      {
        label: "Canonical example path",
        value: `/modules/${moduleSlug}/${surface}/${documentId}`,
      },
      {
        label: "Future route family",
        value: "/modules/[moduleSlug]/[surface]/[documentId]",
      },
      {
        label: "Preview state",
        value: state,
      },
      {
        label: "Promotion target",
        value: moduleDocumentPromotionNote.futureErpPath,
      },
    ],
    documentLabel: documentId,
    moduleLabel: toTitleCase(moduleSlug),
    previewImage: {
      alt: "Blueprint card showing the Afenda module-document route composition with document summary, route state, and promotion seams.",
      height: 720,
      src: "/module-document-blueprint.svg",
      width: 1280,
    },
    promotion: moduleDocumentPromotionNote,
    promotionSummary:
      "Promotion keeps the dynamic route composition and replaces only the data authority with ERP document loaders or protected module runtime inputs.",
    routeSummary:
      "The page resolves route params, awaits one typed loader result, and renders route-local panels without introducing auth, tenant state, or fake backend infrastructure.",
    state,
    stateSummary: getModuleDocumentStateSummary(state),
    surfaceLabel: toTitleCase(surface),
    title: `${toTitleCase(surface)} document route`,
    verificationChecklist: [
      {
        title: "Dynamic route params stay at the boundary",
        summary:
          "The page resolves `moduleSlug`, `surface`, and `documentId` once and passes shaped data to route-local panels only.",
      },
      {
        title: "Loader remains promotion-ready",
        summary:
          "The route models future ERP document inputs without creating fake service layers, mock APIs, or unauthorized runtime seams.",
      },
      {
        title: "Route-family states remain presentation-only",
        summary:
          "Ready, empty, and restricted previews are expressed as typed frontend states, not as real ERP document authority.",
      },
    ],
  } satisfies ModuleDocumentPageData;
};

export const resolveModuleDocumentRoute = (
  params: ModuleDocumentRouteParams
): ModuleDocumentRouteLoadResult => {
  if (!isValidModuleDocumentRouteParams(params)) {
    return {
      status: "not-found",
    } satisfies ModuleDocumentRouteLoadResult;
  }

  const pageData = buildModuleDocumentPageData(params);

  return {
    pageData,
    status: pageData.state,
  } satisfies ModuleDocumentRouteLoadResult;
};

const loadModuleDocumentPageUncached: LabRouteLoader<
  ModuleDocumentRouteLoadResult,
  ModuleDocumentRouteParams
> = async (params) => resolveModuleDocumentRoute(params);

export const loadModuleDocumentPage = createCachedLabLoader(
  loadModuleDocumentPageUncached
);
