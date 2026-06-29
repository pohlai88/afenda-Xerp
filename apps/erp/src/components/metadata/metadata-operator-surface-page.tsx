import { MetadataBindingSlotHydrationPreview } from "@/components/metadata/metadata-binding-slot-hydration-preview.client";
import type { MetadataOperatorSurfacePageData } from "@/lib/metadata/load-metadata-operator-surface-page.server";

export interface MetadataOperatorSurfacePageProps {
  readonly data: MetadataOperatorSurfacePageData;
}

/** RSC shell for a single metadata-bound operator surface. */
export function MetadataOperatorSurfacePage({
  data,
}: MetadataOperatorSurfacePageProps) {
  if (data.kind === "error") {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
        <h1 className="font-semibold text-2xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">{data.message}</p>
      </main>
    );
  }

  const { surface } = data;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">{data.description}</p>
      </header>

      {surface.slotHydration === undefined ? (
        <p className="text-muted-foreground text-sm">
          Slot hydration is unavailable for this surface.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border bg-background p-4">
          <MetadataBindingSlotHydrationPreview
            slotHydration={surface.slotHydration}
          />
        </div>
      )}
    </main>
  );
}
