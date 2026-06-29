import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";
import { headers } from "next/headers";

import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";
import { resolveMetadataUiRenderContextFromTenantContext } from "@/lib/metadata/resolve-metadata-ui-render-context.server";
import { resolveMetadataWorkspaceSurfaces } from "@/lib/metadata/resolve-metadata-workspace-surfaces.server";

export const metadata = {
  title: "Metadata Workspace",
};

export default async function MetadataWorkspacePage() {
  const requestHeaders = await headers();
  const operatingResult = await resolveOperatingContextFromHeaders({
    requestHeaders,
  });

  if (!operatingResult.ok) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
        <h1 className="font-semibold text-2xl">Metadata Workspace</h1>
        <p className="text-muted-foreground text-sm">
          {operatingResult.error.userMessage}
        </p>
      </main>
    );
  }

  const runtime = resolveMetadataUiRenderContextFromTenantContext({
    tenant: operatingResult.value.tenant,
    actorId: operatingResult.value.actor.userId,
    correlationId: operatingResult.value.correlationId,
  });

  const surfaces = resolveMetadataWorkspaceSurfaces({ runtime });

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">Metadata Workspace</h1>
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
            <CardContent className="space-y-3 text-sm">
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
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
