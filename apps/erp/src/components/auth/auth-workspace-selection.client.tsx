"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@afenda/shadcn-studio-v2/clients";
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
import { switchOperatingContextAction } from "@/lib/context/context-switch.action";
import type { AuthMembershipSwitchTargetDto } from "@/server/api/contracts/auth/auth-memberships.api-contract";

type AuthWorkspaceSelectionState =
  | { readonly kind: "loading" }
  | {
      readonly kind: "ready";
      readonly targets: readonly AuthMembershipSwitchTargetDto[];
    }
  | { readonly kind: "error"; readonly message: string };

interface AuthWorkspaceSelectionProps {
  readonly kind: AuthWorkspaceSelectionKind;
}

export function AuthWorkspaceSelection({ kind }: AuthWorkspaceSelectionProps) {
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

  const title = resolveWorkspaceSelectionTitle(kind);
  const showReturnToSignIn = state.kind === "error" || selectionError !== null;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6 text-foreground">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <h1 className="font-semibold text-2xl leading-none tracking-tight">
            {title}
          </h1>
          <CardDescription>
            {resolveWorkspaceSelectionDescription(kind)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {state.kind === "loading" ? (
            <p
              aria-live="polite"
              className="text-muted-foreground text-sm"
              role="status"
            >
              Loading available memberships...
            </p>
          ) : null}

          {state.kind === "error" ? (
            <div
              className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-destructive text-sm"
              role="alert"
            >
              {state.message}
            </div>
          ) : null}

          {selectionError === null ? null : (
            <div
              className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-destructive text-sm"
              role="alert"
            >
              {selectionError}
            </div>
          )}

          {state.kind === "ready" && state.targets.length === 0 ? (
            <div
              className="rounded-md border bg-muted/40 p-3 text-muted-foreground text-sm"
              role="status"
            >
              No selectable memberships are available for this account.
            </div>
          ) : null}

          {state.kind === "ready"
            ? state.targets.map((target) => {
                const targetKey = formatMembershipTargetKey(target);
                const isTargetPending = pendingTargetKey === targetKey;

                return (
                  <Button
                    aria-busy={isTargetPending}
                    className="justify-between"
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
            : null}

          {showReturnToSignIn ? (
            <Button
              onClick={() => {
                router.replace(AUTH_PATHS.signIn);
              }}
              type="button"
              variant="outline"
            >
              Return to sign in
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
