import { MetadataBindingSlotHydrationPreview } from "@/components/metadata/metadata-binding-slot-hydration-preview.client";
import type { AuthSurfaceConfig } from "@/lib/auth/auth-surface-config.server";
import type { AuthIngressSurfacePageData } from "@/lib/auth/load-auth-ingress-surface-page.server";

import { AuthPixelMotionShell } from "./auth-pixel-motion-shell";
import { AuthRuntimeBridge } from "./auth-runtime-bridge.client";

export interface AuthIngressSurfacePageProps {
  readonly data: AuthIngressSurfacePageData;
  readonly runtimeConfig: AuthSurfaceConfig;
}

type AuthIngressSurfaceState = "error" | "missing-slot-hydration" | "ready";

interface AuthIngressFallbackProps {
  readonly message: string;
  readonly state: Exclude<AuthIngressSurfaceState, "ready">;
  readonly title: string;
}

function AuthIngressFallback({
  message,
  state,
  title,
}: AuthIngressFallbackProps) {
  return (
    <main
      aria-live="polite"
      className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6 text-foreground"
      data-auth-ingress-state={state}
    >
      <h1 className="font-semibold text-xl">{title}</h1>
      <p className="max-w-md text-center text-muted-foreground text-sm">
        {message}
      </p>
    </main>
  );
}

/** Full-bleed public auth ingress — renders metadata-hydrated PAS-006 auth blocks. */
export function AuthIngressSurfacePage({
  data,
  runtimeConfig,
}: AuthIngressSurfacePageProps) {
  if (data.kind === "error") {
    return (
      <AuthIngressFallback
        message={data.message}
        state="error"
        title={data.title}
      />
    );
  }

  const { surface } = data;

  if (surface.slotHydration === undefined) {
    return (
      <AuthIngressFallback
        message={`${data.description} Presentation slot hydration is unavailable.`}
        state="missing-slot-hydration"
        title={data.title}
      />
    );
  }

  return (
    <main
      aria-label={data.title}
      className="relative min-h-dvh overflow-hidden bg-background text-foreground"
      data-auth-ingress-lane={data.lane}
      data-auth-ingress-path={data.path}
      data-auth-ingress-state="ready"
      data-auth-ingress-surface={surface.surfaceTemplate.surfaceTemplateId}
      data-auth-shell-block={data.authShellBlockId}
    >
      <AuthPixelMotionShell
        lane={data.lane}
        path={data.path}
        title={data.title}
      />
      <div className="relative z-10">
        <MetadataBindingSlotHydrationPreview
          blockIdOverride={data.authShellBlockId}
          slotHydration={surface.slotHydration}
        />
      </div>
      <AuthRuntimeBridge config={runtimeConfig} path={data.path} />
    </main>
  );
}
