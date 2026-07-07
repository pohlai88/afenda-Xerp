"use client";

import { AppShell01 } from "@afenda/shadcn-studio-v2/clients";
import {
  V2_PROOF_ROUTE_MARKER,
  v2ProofNavGroups,
  v2ProofOperatingContext,
} from "@/lib/v2-proof/fixtures";
import type { V2ProofSurfaceVisibility } from "@/lib/v2-proof/surface-visibility";
import { useV2ProofSurfaceVisibility } from "@/lib/v2-proof/use-v2-proof-surface-visibility.client";
import { V2ProofComposedSurfaces } from "./v2-proof-composed-surfaces.client";
import {
  AuthShellPreview,
  V2ProofThemeControlsSection,
  V2ProofTopbarControls,
  VerificationPanel,
} from "./v2-proof-theme-controls.client";

interface V2ProofRouteProps {
  readonly initialSurfaceVisibility?: Partial<V2ProofSurfaceVisibility>;
  readonly testSurfaceOverrides?: Partial<V2ProofSurfaceVisibility>;
}

export function V2ProofRoute({
  initialSurfaceVisibility,
  testSurfaceOverrides,
}: V2ProofRouteProps = {}) {
  const { setSurface, visibility } = useV2ProofSurfaceVisibility({
    fromUrl: initialSurfaceVisibility,
    testOverrides: testSurfaceOverrides,
  });

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-proof="v2-proof-root"
    >
      <AppShell01
        navGroups={v2ProofNavGroups}
        operatingContext={v2ProofOperatingContext}
        topbarControls={<V2ProofTopbarControls />}
        topbarDescription={V2_PROOF_ROUTE_MARKER}
        topbarHeading="V2 design system consumer proof"
      >
        <div className="flex flex-col gap-10">
          <VerificationPanel
            authShellEnabled={visibility.authShell}
            onAuthShellChange={(enabled) => {
              setSurface("authShell", enabled);
            }}
          />

          {visibility.authShell ? <AuthShellPreview /> : null}

          <V2ProofComposedSurfaces />
          <V2ProofThemeControlsSection />
        </div>
      </AppShell01>
    </div>
  );
}
