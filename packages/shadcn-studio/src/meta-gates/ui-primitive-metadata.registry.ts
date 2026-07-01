/**
 * @afenda.governance-envelope ui-primitive-metadata
 * Role: Runtime aggregator — UI_PRIMITIVE_METADATA_REGISTRY from L2 contracts
 * Family: ui-primitive-metadata
 * Relies on: _governance.registry, components-ui/*.contract
 * Relied on by: governance/index, check:studio-ui-primitive-metadata
 * Refactored: 2026-07-01 · series flat-governance
 * Gate: check:studio-governance-envelope
 */

import {
  toUiPrimitiveId,
  UI_PRIMITIVE_CONTRACT_SLUGS,
  type UiPrimitiveContractSlug,
} from "./_governance.registry.js";

import { accordionPrimitiveMetadata } from "../components-ui/accordion.contract.js";
import { alertPrimitiveMetadata } from "../components-ui/alert.contract.js";
import { alertDialogPrimitiveMetadata } from "../components-ui/alert-dialog.contract.js";
import { aspectRatioPrimitiveMetadata } from "../components-ui/aspect-ratio.contract.js";
import { attachmentPrimitiveMetadata } from "../components-ui/attachment.contract.js";
import { avatarPrimitiveMetadata } from "../components-ui/avatar.contract.js";
import { backgroundRipplePrimitiveMetadata } from "../components-ui/background-ripple.contract.js";
import { badgePrimitiveMetadata } from "../components-ui/badge.contract.js";
import { bgDotGridPrimitiveMetadata } from "../components-ui/bg-dot-grid.contract.js";
import { bgSilkPrimitiveMetadata } from "../components-ui/bg-silk.contract.js";
import { borderBeamPrimitiveMetadata } from "../components-ui/border-beam.contract.js";
import { breadcrumbPrimitiveMetadata } from "../components-ui/breadcrumb.contract.js";
import { bubblePrimitiveMetadata } from "../components-ui/bubble.contract.js";
import { buttonPrimitiveMetadata } from "../components-ui/button.contract.js";
import { buttonGroupPrimitiveMetadata } from "../components-ui/button-group.contract.js";
import { calendarPrimitiveMetadata } from "../components-ui/calendar.contract.js";
import { cardPrimitiveMetadata } from "../components-ui/card.contract.js";
import { carouselPrimitiveMetadata } from "../components-ui/carousel.contract.js";
import { categoryBarPrimitiveMetadata } from "../components-ui/category-bar.contract.js";
import { chartPrimitiveMetadata } from "../components-ui/chart.contract.js";
import { checkboxPrimitiveMetadata } from "../components-ui/checkbox.contract.js";
import { circularProgressPrimitiveMetadata } from "../components-ui/circular-progress.contract.js";
import { collapsiblePrimitiveMetadata } from "../components-ui/collapsible.contract.js";
import { comboboxPrimitiveMetadata } from "../components-ui/combobox.contract.js";
import { commandPrimitiveMetadata } from "../components-ui/command.contract.js";
import { contextMenuPrimitiveMetadata } from "../components-ui/context-menu.contract.js";
import { dialogPrimitiveMetadata } from "../components-ui/dialog.contract.js";
import { directionPrimitiveMetadata } from "../components-ui/direction.contract.js";
import { drawerPrimitiveMetadata } from "../components-ui/drawer.contract.js";
import { dropdownMenuPrimitiveMetadata } from "../components-ui/dropdown-menu.contract.js";
import { emptyPrimitiveMetadata } from "../components-ui/empty.contract.js";
import { fieldPrimitiveMetadata } from "../components-ui/field.contract.js";
import { hoverCardPrimitiveMetadata } from "../components-ui/hover-card.contract.js";
import { inputPrimitiveMetadata } from "../components-ui/input.contract.js";
import { inputGroupPrimitiveMetadata } from "../components-ui/input-group.contract.js";
import { inputOtpPrimitiveMetadata } from "../components-ui/input-otp.contract.js";
import { itemPrimitiveMetadata } from "../components-ui/item.contract.js";
import { kbdPrimitiveMetadata } from "../components-ui/kbd.contract.js";
import { kanbanPrimitiveMetadata } from "../components-ui/kanban.contract.js";
import { labelPrimitiveMetadata } from "../components-ui/label.contract.js";
import { markerPrimitiveMetadata } from "../components-ui/marker.contract.js";
import { menubarPrimitiveMetadata } from "../components-ui/menubar.contract.js";
import { messagePrimitiveMetadata } from "../components-ui/message.contract.js";
import { messageScrollerPrimitiveMetadata } from "../components-ui/message-scroller.contract.js";
import { nativeSelectPrimitiveMetadata } from "../components-ui/native-select.contract.js";
import { navigationMenuPrimitiveMetadata } from "../components-ui/navigation-menu.contract.js";
import { numberTickerPrimitiveMetadata } from "../components-ui/number-ticker.contract.js";
import { paginationPrimitiveMetadata } from "../components-ui/pagination.contract.js";
import { popoverPrimitiveMetadata } from "../components-ui/popover.contract.js";
import { progressPrimitiveMetadata } from "../components-ui/progress.contract.js";
import { radioGroupPrimitiveMetadata } from "../components-ui/radio-group.contract.js";
import { ratingPrimitiveMetadata } from "../components-ui/rating.contract.js";
import { resizablePrimitiveMetadata } from "../components-ui/resizable.contract.js";
import { scrollAreaPrimitiveMetadata } from "../components-ui/scroll-area.contract.js";
import { selectPrimitiveMetadata } from "../components-ui/select.contract.js";
import { separatorPrimitiveMetadata } from "../components-ui/separator.contract.js";
import { sheetPrimitiveMetadata } from "../components-ui/sheet.contract.js";
import { sidebarPrimitiveMetadata } from "../components-ui/sidebar.contract.js";
import { skeletonPrimitiveMetadata } from "../components-ui/skeleton.contract.js";
import { sliderPrimitiveMetadata } from "../components-ui/slider.contract.js";
import { sonnerPrimitiveMetadata } from "../components-ui/sonner.contract.js";
import { spinnerPrimitiveMetadata } from "../components-ui/spinner.contract.js";
import { switchPrimitiveMetadata } from "../components-ui/switch.contract.js";
import { tablePrimitiveMetadata } from "../components-ui/table.contract.js";
import { tabsPrimitiveMetadata } from "../components-ui/tabs.contract.js";
import { textareaPrimitiveMetadata } from "../components-ui/textarea.contract.js";
import { timelinePrimitiveMetadata } from "../components-ui/timeline.contract.js";
import { togglePrimitiveMetadata } from "../components-ui/toggle.contract.js";
import { toggleGroupPrimitiveMetadata } from "../components-ui/toggle-group.contract.js";
import { tooltipPrimitiveMetadata } from "../components-ui/tooltip.contract.js";

const METADATA_FACTORIES = [
  accordionPrimitiveMetadata,
  alertDialogPrimitiveMetadata,
  alertPrimitiveMetadata,
  aspectRatioPrimitiveMetadata,
  attachmentPrimitiveMetadata,
  avatarPrimitiveMetadata,
  backgroundRipplePrimitiveMetadata,
  badgePrimitiveMetadata,
  bgDotGridPrimitiveMetadata,
  bgSilkPrimitiveMetadata,
  borderBeamPrimitiveMetadata,
  breadcrumbPrimitiveMetadata,
  bubblePrimitiveMetadata,
  buttonGroupPrimitiveMetadata,
  buttonPrimitiveMetadata,
  calendarPrimitiveMetadata,
  cardPrimitiveMetadata,
  carouselPrimitiveMetadata,
  categoryBarPrimitiveMetadata,
  chartPrimitiveMetadata,
  checkboxPrimitiveMetadata,
  circularProgressPrimitiveMetadata,
  collapsiblePrimitiveMetadata,
  comboboxPrimitiveMetadata,
  commandPrimitiveMetadata,
  contextMenuPrimitiveMetadata,
  dialogPrimitiveMetadata,
  directionPrimitiveMetadata,
  drawerPrimitiveMetadata,
  dropdownMenuPrimitiveMetadata,
  emptyPrimitiveMetadata,
  fieldPrimitiveMetadata,
  hoverCardPrimitiveMetadata,
  inputGroupPrimitiveMetadata,
  inputOtpPrimitiveMetadata,
  inputPrimitiveMetadata,
  itemPrimitiveMetadata,
  kbdPrimitiveMetadata,
  kanbanPrimitiveMetadata,
  labelPrimitiveMetadata,
  markerPrimitiveMetadata,
  menubarPrimitiveMetadata,
  messageScrollerPrimitiveMetadata,
  messagePrimitiveMetadata,
  nativeSelectPrimitiveMetadata,
  navigationMenuPrimitiveMetadata,
  numberTickerPrimitiveMetadata,
  paginationPrimitiveMetadata,
  popoverPrimitiveMetadata,
  progressPrimitiveMetadata,
  radioGroupPrimitiveMetadata,
  ratingPrimitiveMetadata,
  resizablePrimitiveMetadata,
  scrollAreaPrimitiveMetadata,
  selectPrimitiveMetadata,
  separatorPrimitiveMetadata,
  sheetPrimitiveMetadata,
  sidebarPrimitiveMetadata,
  skeletonPrimitiveMetadata,
  sliderPrimitiveMetadata,
  sonnerPrimitiveMetadata,
  spinnerPrimitiveMetadata,
  switchPrimitiveMetadata,
  tablePrimitiveMetadata,
  tabsPrimitiveMetadata,
  textareaPrimitiveMetadata,
  timelinePrimitiveMetadata,
  toggleGroupPrimitiveMetadata,
  togglePrimitiveMetadata,
  tooltipPrimitiveMetadata,
] as const;

export type UiPrimitiveMetadataPayload = ReturnType<
  (typeof METADATA_FACTORIES)[number]
>;

export const UI_PRIMITIVE_METADATA_REGISTRY: readonly UiPrimitiveMetadataPayload[] =
  METADATA_FACTORIES.map((metadataFactory) => metadataFactory());

export const UI_PRIMITIVE_METADATA_BY_ID = Object.fromEntries(
  UI_PRIMITIVE_METADATA_REGISTRY.map((entry) => [entry.id, entry])
) as Record<UiPrimitiveMetadataPayload["id"], UiPrimitiveMetadataPayload>;

export function listUiPrimitiveMetadata(): readonly UiPrimitiveMetadataPayload[] {
  return UI_PRIMITIVE_METADATA_REGISTRY;
}

export function getUiPrimitiveMetadata(
  id: UiPrimitiveMetadataPayload["id"]
): UiPrimitiveMetadataPayload | undefined {
  return UI_PRIMITIVE_METADATA_BY_ID[id];
}

/** Slugs materialized from aggregated metadata — for inventory parity tests. */
export function getUiPrimitiveMetadataSlugs(): readonly UiPrimitiveContractSlug[] {
  return UI_PRIMITIVE_METADATA_REGISTRY.map(
    (entry) => entry.id.replace("shadcn-studio.ui.", "") as UiPrimitiveContractSlug
  );
}

/** Factory count must match inventory SSOT (also enforced by vitest + gate). */
export const UI_PRIMITIVE_METADATA_FACTORY_COUNT = METADATA_FACTORIES.length;

for (const slug of UI_PRIMITIVE_CONTRACT_SLUGS) {
  const expectedId = toUiPrimitiveId(slug);
  if (!UI_PRIMITIVE_METADATA_BY_ID[expectedId]) {
    throw new Error(
      `ui-primitive-metadata.registry: missing metadata for ${slug} (${expectedId})`
    );
  }
}
