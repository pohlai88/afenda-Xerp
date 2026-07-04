"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { fetchAuthMembershipResolution } from "@/lib/auth/auth-membership-resolution.client";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import { switchOperatingContextAction } from "@/lib/context/context-switch.action";
import type { AuthMembershipSwitchTargetDto } from "@/server/api/contracts/auth/auth-memberships.api-contract";

type AuthWorkspaceSelectionKind = "organization" | "workspace";

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

function filterTargets(
  targets: readonly AuthMembershipSwitchTargetDto[],
  kind: AuthWorkspaceSelectionKind
): readonly AuthMembershipSwitchTargetDto[] {
  if (kind === "organization") {
    return targets.filter((target) => target.organizationSlug !== undefined);
  }

  return targets;
}

function resolveTitle(kind: AuthWorkspaceSelectionKind): string {
  return kind === "organization" ? "Select organization" : "Select workspace";
}

function resolveDescription(kind: AuthWorkspaceSelectionKind): string {
  return kind === "organization"
    ? "Choose the organization scope for this sign-in session."
    : "Choose the workspace scope for this sign-in session.";
}

export function AuthWorkspaceSelection({ kind }: AuthWorkspaceSelectionProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthWorkspaceSelectionState>({
    kind: "loading",
  });
  const [pendingTargetKey, setPendingTargetKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
          targets: filterTargets(resolution.targets, kind),
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
    const targetKey = `${target.companySlug}:${target.organizationSlug ?? ""}`;
    setPendingTargetKey(targetKey);

    const result = await switchOperatingContextAction({
      companySlug: target.companySlug,
      ...(target.organizationSlug === undefined
        ? {}
        : { organizationSlug: target.organizationSlug }),
    });

    if (!result.ok) {
      setState({ kind: "error", message: result.userMessage });
      setPendingTargetKey(null);
      return;
    }

    startTransition(() => {
      router.replace(AUTH_PATHS.postAuthComplete);
      router.refresh();
    });
  }

  const title = resolveTitle(kind);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6 text-foreground">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{resolveDescription(kind)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {state.kind === "loading" ? (
            <p className="text-muted-foreground text-sm">
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
                const targetKey = `${target.companySlug}:${
                  target.organizationSlug ?? ""
                }`;
                const isTargetPending =
                  pendingTargetKey === targetKey && isPending;

                return (
                  <Button
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
        </CardContent>
      </Card>
    </main>
  );
}
