import type { MetadataRendererContract } from "../contracts/metadata-renderer.contract";

export const defaultMetadataRenderers = [
  {
    id: "metadata.page-header.default",
    priority: 100,
    recipe: "card",
    sectionTypes: ["page-header", "surface-chrome"],
    stable: true,
  },
  {
    id: "metadata.action-bar.default",
    priority: 100,
    recipe: "button",
    sectionTypes: ["action-bar"],
    stable: true,
  },
  {
    id: "metadata.list.default",
    priority: 100,
    recipe: "table",
    sectionTypes: ["list"],
    stable: true,
  },
  {
    id: "metadata.form.default",
    priority: 100,
    recipe: "form",
    sectionTypes: ["form"],
    stable: true,
  },
  {
    id: "metadata.status.default",
    priority: 100,
    recipe: "status-state",
    sectionTypes: ["empty-state"],
    stable: true,
  },
  {
    id: "metadata.analytics.default",
    priority: 90,
    recipe: "card",
    sectionTypes: ["stat", "chart", "kanban"],
    stable: true,
  },
  {
    id: "metadata.detail.default",
    priority: 90,
    recipe: "card",
    sectionTypes: ["detail-tabs", "audit-panel"],
    stable: true,
  },
] as const satisfies readonly MetadataRendererContract[];
