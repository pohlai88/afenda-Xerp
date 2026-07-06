"use client";

import { Button } from "@afenda/shadcn-studio-v2/clients";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { fetchAuthMembershipResolution } from "@/lib/auth/auth-membership-resolution.client";
import { persistAuthMembershipTarget } from "@/lib/auth/auth-membership-switch.helpers";
import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import { shouldRedirectToPostLoginEntryPath } from "@/lib/auth/auth-post-login-entry-path.helpers";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

type AuthCompleteState =
  | { readonly kind: "resolving" }
  | { readonly kind: "error"; readonly message: string };

export function AuthCompleteResolver() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

        const destination = resolveSafeInternalPath(
          searchParams.get("next"),
          "/workspace"
        );
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
  }, [router, searchParams]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6 text-foreground">
      <div className="flex w-full max-w-md flex-col gap-4">
        <h1 className="font-semibold text-2xl">Completing sign-in</h1>
        {state.kind === "resolving" ? (
          <p
            aria-live="polite"
            className="text-muted-foreground text-sm"
            role="status"
          >
            Resolving your workspace access...
          </p>
        ) : (
          <div
            className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-destructive text-sm"
            role="alert"
          >
            {state.message}
          </div>
        )}
        <Button
          onClick={() => {
            router.replace(AUTH_PATHS.signIn);
          }}
          type="button"
          variant="outline"
        >
          Return to sign in
        </Button>
      </div>
    </main>
  );
}
