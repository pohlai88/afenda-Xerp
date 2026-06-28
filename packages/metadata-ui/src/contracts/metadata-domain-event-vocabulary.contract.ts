/**
 * Metadata UI vocabulary for domain events that should trigger render refresh hints.
 *
 * Kernel owns {@link DomainEvent} envelope shape; metadata-ui owns which event names
 * affect governed metadata surfaces. ERP maps hints to runtime actions (revalidate, etc.).
 */

export const METADATA_UI_RENDER_REFRESH_EVENT_NAMES = [
  "workspace.dashboard.layout.updated",
] as const;

export type MetadataUiRenderRefreshEventName =
  (typeof METADATA_UI_RENDER_REFRESH_EVENT_NAMES)[number];

export const METADATA_UI_RENDER_REFRESH_SURFACES = [
  "workspace",
  "module",
  "page",
] as const;

export type MetadataUiRenderRefreshSurface =
  (typeof METADATA_UI_RENDER_REFRESH_SURFACES)[number];

export interface MetadataUiRenderRefreshHint {
  readonly eventName: MetadataUiRenderRefreshEventName;
  readonly surface: MetadataUiRenderRefreshSurface;
}

export function isMetadataUiRenderRefreshEventName(
  eventName: string
): eventName is MetadataUiRenderRefreshEventName {
  return (METADATA_UI_RENDER_REFRESH_EVENT_NAMES as readonly string[]).includes(
    eventName
  );
}

/** Resolve a metadata-ui render refresh hint from a kernel domain event name. */
export function resolveMetadataUiRenderRefreshHint(
  eventName: string
): MetadataUiRenderRefreshHint | null {
  if (eventName === "workspace.dashboard.layout.updated") {
    return {
      eventName,
      surface: "workspace",
    };
  }

  return null;
}
