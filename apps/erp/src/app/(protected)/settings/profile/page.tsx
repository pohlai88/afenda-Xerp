import { MetadataOperatorSurfacePage } from "@/components/metadata/metadata-operator-surface-page";
import { loadMetadataOperatorSurfacePage } from "@/lib/metadata/load-metadata-operator-surface-page.server";
import { getMetadataOperatorSurfaceByTemplateId } from "@/lib/metadata/metadata-operator-surface.registry";

const SURFACE_TEMPLATE_ID = "surface-template.account-settings" as const;

export const metadata = {
  title: "Profile settings",
};

export default async function SettingsProfilePage() {
  const routeEntry =
    getMetadataOperatorSurfaceByTemplateId(SURFACE_TEMPLATE_ID);
  const data = await loadMetadataOperatorSurfacePage({
    surfaceTemplateId: SURFACE_TEMPLATE_ID,
    title: routeEntry?.title ?? "Profile settings",
    description:
      routeEntry?.description ??
      "Metadata-driven profile settings surface (PAS-006D).",
  });

  return <MetadataOperatorSurfacePage data={data} />;
}
