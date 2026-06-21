import type { MetadataRenderableAction } from "../contracts/action.contract.js";
import type { MetadataLayoutProps } from "../contracts/layout.contract.js";
import type { MetadataSurfaceProps } from "../contracts/surface.contract.js";
import { sampleDashboardLayoutRenderProps } from "../fixtures/sample-dashboard-layout.fixture.js";
import {
  sampleReadonlyRenderContext,
  sampleRenderContext,
} from "../fixtures/sample-runtime-context.fixture.js";

export const metadataLayoutShellArgs = {
  context: sampleRenderContext,
  identity: {
    id: "layout.warehouse.shift",
    label: "Warehouse shift overview",
  },
  presentation: { contained: true, padded: true },
  type: "dashboard",
} satisfies Pick<
  MetadataLayoutProps,
  "context" | "identity" | "presentation" | "type"
>;

export const metadataPageSurfaceStructuralActions = [
  {
    key: "export-selection",
    label: "Export selection",
    kind: "button",
    presentation: { group: "secondary", order: 10 },
  },
  {
    key: "release-wave",
    label: "Release pick wave",
    kind: "button",
    presentation: { group: "primary", order: 20 },
  },
  {
    key: "fulfillment-guide",
    label: "Fulfillment guide",
    kind: "link",
    href: "/help/fulfillment",
    presentation: { group: "help", order: 30 },
  },
] as const satisfies readonly MetadataRenderableAction[];

export const metadataPageSurfaceStructuralArgs = {
  actions: metadataPageSurfaceStructuralActions,
  context: sampleRenderContext,
  identity: {
    id: "page.fulfillment.queue",
    title: "Order fulfillment queue",
  },
} satisfies Pick<MetadataSurfaceProps, "actions" | "context" | "identity">;

export const metadataReadonlyPageSurfaceArgs = {
  ...metadataPageSurfaceStructuralArgs,
  context: sampleReadonlyRenderContext,
  state: {
    visibility: "readonly",
    reason: "Period close is active for this company.",
  },
} satisfies Pick<
  MetadataSurfaceProps,
  "actions" | "context" | "identity" | "state"
>;

export const metadataDashboardStructuralArgs = sampleDashboardLayoutRenderProps;
