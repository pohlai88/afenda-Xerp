import { SettingsProfilePanel } from "@/components/settings/settings-profile-panel.client";
import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";
import { loadMetadataOperatorSurfacePage } from "@/lib/metadata/load-metadata-operator-surface-page.server";
import { getMetadataOperatorSurfaceByTemplateId } from "@/lib/metadata/metadata-operator-surface.registry";
import { resolveMetadataActorUserIdFromOperatingContext } from "@/lib/metadata/resolve-metadata-auth-actor.server";
import { getErpSurfaceLayoutByRoute } from "@/lib/presentation/erp-surface-layout.registry";

const SURFACE_TEMPLATE_ID = "surface-template.account-settings" as const;

export const metadata = {
  title: "Profile settings",
};

export default async function SettingsProfilePage() {
  const layout = getErpSurfaceLayoutByRoute("/settings/profile");
  const routeEntry =
    getMetadataOperatorSurfaceByTemplateId(SURFACE_TEMPLATE_ID);
  const data = await loadMetadataOperatorSurfacePage({
    surfaceTemplateId: SURFACE_TEMPLATE_ID,
    title: routeEntry?.title ?? "Profile settings",
    description:
      routeEntry?.description ??
      "Metadata-driven profile settings surface (PAS-006D).",
  });

  if (data.kind === "error") {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
        <h1 className="font-semibold text-2xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">{data.message}</p>
      </main>
    );
  }

  const { operatingResult } = await loadProtectedRequestOperatingContext();

  if (!operatingResult.ok) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
        <h1 className="font-semibold text-2xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">
          {operatingResult.error.userMessage}
        </p>
      </main>
    );
  }

  const operatingContext = operatingResult.value;
  const userId =
    resolveMetadataActorUserIdFromOperatingContext(operatingContext);
  const fixture = layout?.surfaceFixture ?? {
    defaultState: "ready" as const,
    description: "Operator profile preferences and identity settings.",
    title: "Profile",
  };

  return (
    <SettingsProfilePanel
      blockId={data.surface.slotHydration?.blockId ?? null}
      correlationId={operatingContext.correlationId}
      description={fixture.description ?? data.description}
      surfaceTemplateId={SURFACE_TEMPLATE_ID}
      tenantLabel={operatingContext.tenant.displayName}
      title={fixture.title}
      userId={userId}
    />
  );
}
