import { MetadataOperatorSurfacePage } from "@/components/metadata/metadata-operator-surface-page";
import { loadMetadataOperatorSurfacePage } from "@/lib/metadata/load-metadata-operator-surface-page.server";
import { getMetadataOperatorSurfaceByTemplateId } from "@/lib/metadata/metadata-operator-surface.registry";

const SURFACE_TEMPLATE_ID = "surface-template.auth-sign-in" as const;

export const metadata = {
  title: "Sign-in surface",
};

export default async function OperatorAuthSignInPage() {
  const routeEntry =
    getMetadataOperatorSurfaceByTemplateId(SURFACE_TEMPLATE_ID);
  const data = await loadMetadataOperatorSurfacePage({
    surfaceTemplateId: SURFACE_TEMPLATE_ID,
    title: routeEntry?.title ?? "Sign-in surface",
    description:
      routeEntry?.description ??
      "Protected operator preview of the auth sign-in block.",
  });

  return <MetadataOperatorSurfacePage data={data} />;
}
