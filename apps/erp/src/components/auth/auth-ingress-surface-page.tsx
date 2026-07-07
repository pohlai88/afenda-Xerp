import { resolveAuthShellBlockPresetOrSignIn } from "@afenda/shadcn-studio-v2";
import { AuthShell } from "@afenda/shadcn-studio-v2/clients";
import { MetadataBindingSlotHydrationPreview } from "@/components/metadata/metadata-binding-slot-hydration-preview.client";
import type { AuthSurfaceConfig } from "@/lib/auth/auth-surface-config.server";
import type { AuthIngressSurfacePageData } from "@/lib/auth/load-auth-ingress-surface-page.server";

import { AuthBlockFormPreview } from "./auth-block-form-preview.client";
import { AuthIngressChrome } from "./auth-ingress-chrome.client";
import { AuthPixelMotionShell } from "./auth-pixel-motion-shell";
import { AuthRuntimeBridge } from "./auth-runtime-bridge.client";

export interface AuthIngressSurfacePageProps {
  readonly data: AuthIngressSurfacePageData;
  readonly runtimeConfig: AuthSurfaceConfig;
}

/** Full-bleed public auth ingress — renders metadata-hydrated PAS-006 auth blocks. */
export function AuthIngressSurfacePage({
  data,
  runtimeConfig,
}: AuthIngressSurfacePageProps) {
  if (data.kind === "error") {
    return (
      <AuthIngressChrome
        message={data.message}
        state="error"
        title={data.title}
      />
    );
  }

  const { surface } = data;

  if (surface.slotHydration === undefined) {
    return (
      <AuthIngressChrome
        message={`${data.description} Presentation slot hydration is unavailable.`}
        state="missing-slot-hydration"
        title={data.title}
      />
    );
  }

  const shellPreset = resolveAuthShellBlockPresetOrSignIn(
    data.authShellBlockId
  );

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
        <AuthShell
          className="min-h-dvh"
          description={shellPreset.description ?? data.description}
          state="ready"
          title={shellPreset.title ?? data.title}
        >
          <AuthBlockFormPreview blockId={data.authShellBlockId} />
          <MetadataBindingSlotHydrationPreview
            blockIdOverride={data.authShellBlockId}
            slotHydration={surface.slotHydration}
          />
        </AuthShell>
      </div>
      <AuthRuntimeBridge config={runtimeConfig} path={data.path} />
    </main>
  );
}
