/** PAS-006D operator routes — one surface template per protected ERP route. */

export interface MetadataOperatorSurfaceRouteEntry {
  readonly description: string;
  readonly id: string;
  readonly module: string;
  readonly routePattern: string;
  readonly surfaceTemplateId: string;
  readonly title: string;
}

export const METADATA_OPERATOR_SURFACE_REGISTRY = [
  {
    id: "operator-settings-profile",
    routePattern: "/settings/profile",
    surfaceTemplateId: "surface-template.account-settings",
    module: "app/(protected)/settings/profile/page.tsx",
    title: "Profile settings",
    description:
      "Account settings block with metadata binding hydration (PAS-006D).",
  },
] as const satisfies readonly MetadataOperatorSurfaceRouteEntry[];

export type MetadataOperatorSurfaceRouteId =
  (typeof METADATA_OPERATOR_SURFACE_REGISTRY)[number]["id"];

export function getMetadataOperatorSurfaceByTemplateId(
  surfaceTemplateId: string
): MetadataOperatorSurfaceRouteEntry | undefined {
  return METADATA_OPERATOR_SURFACE_REGISTRY.find(
    (entry) => entry.surfaceTemplateId === surfaceTemplateId
  );
}
