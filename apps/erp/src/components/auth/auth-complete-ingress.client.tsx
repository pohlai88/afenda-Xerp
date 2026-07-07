"use client";

import { AuthShell, Button } from "@afenda/shadcn-studio-v2/clients";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { fetchAuthMembershipResolution } from "@/lib/auth/auth-membership-resolution.client";
import { persistAuthMembershipTarget } from "@/lib/auth/auth-membership-switch.helpers";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import { shouldRedirectToPostLoginEntryPath } from "@/lib/auth/auth-post-login-entry-path.helpers";
import type { AuthIngressSurfacePageData } from "@/lib/auth/load-auth-ingress-surface-page.server";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

import { AuthIngressSurfaceFallback } from "./auth-ingress-surface-fallback.client";
import { AuthPixelMotionShell } from "./auth-pixel-motion-shell";

type AuthCompleteState =
  | { readonly kind: "resolving" }
  | { readonly kind: "error"; readonly message: string };

interface AuthCompleteIngressSurfaceProps {
  readonly data: AuthIngressSurfacePageData;
}

function resolveCompleteShellState(
  state: AuthCompleteState
): "error" | "loading" | "ready" {
  if (state.kind === "resolving") {
    return "loading";
  }

  return "error";
}

export function AuthCompleteIngressSurface({
  data,
}: AuthCompleteIngressSurfaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const [state, setState] = useState<AuthCompleteState>({
    kind: "resolving",
  });
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function resolvePostAuth() {
      try {
        const resolution = await fetchAuthMembershipResolution();
        if (cancelled) {
          return;
        }

        if (shouldRedirectToPostLoginEntryPath(resolution)) {
          router.replace(resolution.entryPath);
          return;
        }

        const [singleTarget] = resolution.targets;
        if (singleTarget !== undefined) {
          await persistAuthMembershipTarget(singleTarget);
        }

        const destination = resolveSafeInternalPath(nextPath, "/workspace");
        startTransition(() => {
          router.replace(destination);
          router.refresh();
        });
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        setState({
          kind: "error",
          message:
            error instanceof Error
              ? error.message
              : "Post-login membership resolution failed.",
        });
      }
    }

    void resolvePostAuth();

    return () => {
      cancelled = true;
    };
  }, [nextPath, router]);

  if (data.kind === "error") {
    return (
      <AuthIngressSurfaceFallback message={data.message} title={data.title} />
    );
  }

  if (data.surface.slotHydration === undefined) {
    return (
      <AuthIngressSurfaceFallback
        message={`${data.description} Presentation slot hydration is unavailable.`}
        state="missing-slot-hydration"
        title={data.title}
      />
    );
  }

  const title = data.title;
  const description = data.description;
  const shellState = resolveCompleteShellState(state);

  return (
    <main
      aria-label={data.title}
      className="relative min-h-dvh overflow-hidden bg-background text-foreground"
      data-auth-ingress-lane={data.lane}
      data-auth-ingress-path={data.path}
      data-auth-ingress-state="ready"
      data-auth-ingress-surface={data.surface.surfaceTemplate.surfaceTemplateId}
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
          data-afenda-slot="auth-complete.status"
          description={description}
          secondaryActions={
            <Button
              onClick={() => {
                router.replace(AUTH_PATHS.signIn);
              }}
              type="button"
              variant="outline"
            >
              Return to sign in
            </Button>
          }
          state={shellState}
          stateMessages={{
            error: {
              description: state.kind === "error" ? state.message : description,
              title,
            },
            loading: {
              description: "Resolving your workspace access...",
              title,
            },
          }}
          title={title}
        />
      </div>
    </main>
  );
}
