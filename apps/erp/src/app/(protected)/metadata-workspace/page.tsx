import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";

import { MetadataBindingSlotHydrationPreview } from "@/components/metadata/metadata-binding-slot-hydration-preview.client";
import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";
import { resolveMetadataActorUserIdFromOperatingContext } from "@/lib/metadata/resolve-metadata-auth-actor.server";
import { resolveMetadataUiRenderContextFromTenantContext } from "@/lib/metadata/resolve-metadata-ui-render-context.server";
import { resolveMetadataWorkspaceSurfaces } from "@/lib/metadata/resolve-metadata-workspace-surfaces.server";
import { OPERATOR_NAV_LABELS } from "@/lib/navigation/operator-nav-label.registry";

export const metadata = {
  title: OPERATOR_NAV_LABELS.metadataWorkspace.label,
};

export default async function MetadataWorkspacePage() {
  const pageTitle = OPERATOR_NAV_LABELS.metadataWorkspace.label;
  const { operatingResult } = await loadProtectedRequestOperatingContext();

  if (!operatingResult.ok) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
        <h1 className="font-semibold text-2xl">{pageTitle}</h1>
        <p className="text-muted-foreground text-sm">
          {operatingResult.error.userMessage}
        </p>
      </main>
    );
  }

  const actorId = resolveMetadataActorUserIdFromOperatingContext(
    operatingResult.value
  );

  const runtime = resolveMetadataUiRenderContextFromTenantContext({
    tenant: operatingResult.value.tenant,
    actorId,
    correlationId: operatingResult.value.correlationId,
  });

  const surfaces = resolveMetadataWorkspaceSurfaces({ runtime });

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">{pageTitle}</h1>
        <p className="text-muted-foreground text-sm">
          Surface templates bound to studio metadata contracts (PAS-006D).
        </p>
      </header>

      <section className="grid gap-4">
        {surfaces.map((surface) => (
          <Card key={surface.surfaceTemplate.surfaceTemplateId}>
            <CardHeader>
              <CardTitle>{surface.surfaceTemplate.surfaceTemplateId}</CardTitle>
              <CardDescription>
                {surface.surfaceTemplate.templateClass} ·{" "}
                {surface.surfaceTemplate.metadataBindingId}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {surface.slotHydration === undefined ? null : (
                <div className="space-y-2">
                  <p className="font-medium">Live block preview (PAS-006)</p>
                  <div className="overflow-x-auto rounded-md border bg-background p-4">
                    <MetadataBindingSlotHydrationPreview
                      slotHydration={surface.slotHydration}
                    />
                  </div>
                </div>
              )}
              <details className="rounded-md border bg-muted/30 p-3">
                <summary className="cursor-pointer font-medium">
                  Diagnostics wire (serializable)
                </summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="font-medium">Block bindings</p>
                    <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      {JSON.stringify(
                        surface.surfaceTemplate.blockBindings,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                  {surface.bindingProjection === undefined ? null : (
                    <div>
                      <p className="font-medium">Binding projection</p>
                      <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                        {JSON.stringify(surface.bindingProjection, null, 2)}
                      </pre>
                    </div>
                  )}
                  {surface.slotHydration === undefined ? null : (
                    <div>
                      <p className="font-medium">Slot hydration wire</p>
                      <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                        {JSON.stringify(surface.slotHydration, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </section>
    </section>
  );
}
