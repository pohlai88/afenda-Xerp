import { MetadataBindingSlotHydrationPreview } from "@/components/metadata/metadata-binding-slot-hydration-preview.client";
import type { AuthIngressSurfacePageData } from "@/lib/auth/load-auth-ingress-surface-page.server";

export interface AuthIngressSurfacePageProps {
  readonly data: AuthIngressSurfacePageData;
}

/** Full-bleed public auth ingress — renders metadata-hydrated PAS-006 auth blocks. */
export function AuthIngressSurfacePage({ data }: AuthIngressSurfacePageProps) {
  if (data.kind === "error") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
        <h1 className="font-semibold text-foreground text-xl">{data.title}</h1>
        <p className="max-w-md text-center text-muted-foreground text-sm">
          {data.message}
        </p>
      </main>
    );
  }

  const { surface } = data;

  if (surface.slotHydration === undefined) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
        <h1 className="font-semibold text-foreground text-xl">{data.title}</h1>
        <p className="text-muted-foreground text-sm">
          Sign-in presentation is unavailable.
        </p>
      </main>
    );
  }

  return (
    <div data-auth-ingress-surface={surface.surfaceTemplate.surfaceTemplateId}>
      <MetadataBindingSlotHydrationPreview
        slotHydration={surface.slotHydration}
      />
    </div>
  );
}
