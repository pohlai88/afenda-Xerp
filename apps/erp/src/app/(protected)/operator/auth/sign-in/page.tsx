import { MetadataOperatorSurfacePage } from "@/components/metadata/metadata-operator-surface-page";
import { loadMetadataOperatorSurfacePage } from "@/lib/metadata/load-metadata-operator-surface-page.server";

const SURFACE_TEMPLATE_ID = "surface-template.auth-sign-in" as const;

export const metadata = {
  title: "Auth sign-in preview",
};

/** Protected operator preview — canonical ingress remains `/sign-in` (PAS-006D / R1b). */
export default async function OperatorAuthSignInPreviewPage() {
  const data = await loadMetadataOperatorSurfacePage({
    surfaceTemplateId: SURFACE_TEMPLATE_ID,
    title: "Auth sign-in preview",
    description:
      "Protected operator preview of auth sign-in surface template (PAS-006D).",
  });

  return <MetadataOperatorSurfacePage data={data} />;
}
