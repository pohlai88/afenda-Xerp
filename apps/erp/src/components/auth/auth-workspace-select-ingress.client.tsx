"use client";

import { AuthShell, Button } from "@afenda/shadcn-studio-v2/clients";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { fetchAuthMembershipResolution } from "@/lib/auth/auth-membership-resolution.client";
import {
  buildSwitchInputFromMembershipTarget,
  formatMembershipTargetKey,
} from "@/lib/auth/auth-membership-switch.helpers";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import {
  type AuthWorkspaceSelectionKind,
  filterMembershipTargetsByKind,
  resolveWorkspaceSelectionDescription,
  resolveWorkspaceSelectionTitle,
} from "@/lib/auth/auth-workspace-selection.helpers";
import type { AuthIngressSurfacePageData } from "@/lib/auth/load-auth-ingress-surface-page.server";
import { switchOperatingContextAction } from "@/lib/context/context-switch.action";
import type { AuthMembershipSwitchTargetDto } from "@/server/api/contracts/auth/auth-memberships.api-contract";

import { AuthIngressSurfaceFallback } from "./auth-ingress-surface-fallback.client";
import { AuthPixelMotionShell } from "./auth-pixel-motion-shell";

type AuthWorkspaceSelectionState =
  | { readonly kind: "loading" }
  | {
      readonly kind: "ready";
      readonly targets: readonly AuthMembershipSwitchTargetDto[];
    }
  | { readonly kind: "error"; readonly message: string };

interface AuthWorkspaceSelectIngressSurfaceProps {
  readonly data: AuthIngressSurfacePageData;
  readonly kind: AuthWorkspaceSelectionKind;
}

function AuthWorkspaceSelectIngressFallback({
  message,
  title,
}: {
  readonly message: string;
  readonly title: string;
}) {
  return <AuthIngressSurfaceFallback message={message} title={title} />;
}

function resolveIngressShellState(
  state: AuthWorkspaceSelectionState
): "error" | "loading" | "ready" {
  if (state.kind === "loading") {
    return "loading";
  }

  if (state.kind === "error") {
    return "error";
  }

  return "ready";
}

export function AuthWorkspaceSelectIngressSurface({
  data,
  kind,
}: AuthWorkspaceSelectIngressSurfaceProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthWorkspaceSelectionState>({
    kind: "loading",
  });
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [pendingTargetKey, setPendingTargetKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function loadTargets() {
      try {
        const resolution = await fetchAuthMembershipResolution();
        if (cancelled) {
          return;
        }

        setState({
          kind: "ready",
          targets: filterMembershipTargetsByKind(resolution.targets, kind),
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
              : "Workspace memberships are unavailable.",
        });
      }
    }

    void loadTargets();

    return () => {
      cancelled = true;
    };
  }, [kind]);

  async function selectTarget(target: AuthMembershipSwitchTargetDto) {
    const targetKey = formatMembershipTargetKey(target);
    setPendingTargetKey(targetKey);
    setSelectionError(null);

    try {
      const result = await switchOperatingContextAction(
        buildSwitchInputFromMembershipTarget(target)
      );

      if (!result.ok) {
        setSelectionError(result.userMessage);
        return;
      }

      startTransition(() => {
        router.replace(AUTH_PATHS.postAuthComplete);
        router.refresh();
      });
    } catch (error: unknown) {
      setSelectionError(
        error instanceof Error
          ? error.message
          : "Membership selection failed. Try again."
      );
    } finally {
      setPendingTargetKey(null);
    }
  }

  if (data.kind === "error") {
    return (
      <AuthWorkspaceSelectIngressFallback
        message={data.message}
        title={data.title}
      />
    );
  }

  if (data.surface.slotHydration === undefined) {
    return (
      <AuthWorkspaceSelectIngressFallback
        message={`${data.description} Presentation slot hydration is unavailable.`}
        title={data.title}
      />
    );
  }

  const title = resolveWorkspaceSelectionTitle(kind);
  const description = resolveWorkspaceSelectionDescription(kind);
  const shellState = resolveIngressShellState(state);
  const showReturnToSignIn = state.kind === "error" || selectionError !== null;

  const membershipActions =
    state.kind === "ready" ? (
      <>
        {state.targets.length === 0 ? (
          <p className="text-muted-foreground text-sm" role="status">
            No selectable memberships are available for this account.
          </p>
        ) : (
          state.targets.map((target) => {
            const targetKey = formatMembershipTargetKey(target);
            const isTargetPending = pendingTargetKey === targetKey;

            return (
              <Button
                aria-busy={isTargetPending}
                className="justify-between"
                data-afenda-slot="workspace-select.action"
                disabled={pendingTargetKey !== null}
                key={targetKey}
                onClick={() => {
                  void selectTarget(target);
                }}
                type="button"
                variant={target.isSelected ? "default" : "outline"}
              >
                <span>{target.label}</span>
                <span className="text-xs">
                  {isTargetPending ? "Selecting" : "Continue"}
                </span>
              </Button>
            );
          })
        )}
        {selectionError === null ? null : (
          <div
            className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-destructive text-sm"
            role="alert"
          >
            {selectionError}
          </div>
        )}
      </>
    ) : null;

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
          actions={membershipActions}
          className="min-h-dvh"
          description={description}
          secondaryActions={
            showReturnToSignIn ? (
              <Button
                onClick={() => {
                  router.replace(AUTH_PATHS.signIn);
                }}
                type="button"
                variant="outline"
              >
                Return to sign in
              </Button>
            ) : null
          }
          state={shellState}
          stateMessages={{
            error: {
              description: state.kind === "error" ? state.message : description,
              title,
            },
            loading: {
              description: "Loading available memberships...",
              title,
            },
          }}
          title={title}
        />
      </div>
    </main>
  );
}
