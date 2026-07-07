"use client";

import {
  AuthShell,
  Button,
  type NonReadyAuthShellState,
} from "@afenda/shadcn-studio-v2/clients";

export type AuthIngressChromeState =
  | "error"
  | "missing-slot-hydration"
  | "unavailable";

interface AuthIngressChromeProps {
  readonly message: string;
  readonly onRetry?: () => void;
  readonly state?: AuthIngressChromeState;
  readonly title: string;
}

function resolveShellState(
  state: AuthIngressChromeState
): NonReadyAuthShellState {
  if (state === "missing-slot-hydration") {
    return "unavailable";
  }

  return "error";
}

/** v2 AuthShell chrome for auth ingress error and unavailable states. */
export function AuthIngressChrome({
  message,
  onRetry,
  state = "error",
  title,
}: AuthIngressChromeProps) {
  const shellState = resolveShellState(state);

  return (
    <AuthShell
      className="min-h-dvh"
      data-auth-ingress-state={state}
      description={message}
      secondaryActions={
        onRetry === undefined ? null : (
          <Button onClick={onRetry} type="button" variant="outline">
            Try again
          </Button>
        )
      }
      state={shellState}
      stateMessages={{
        [shellState]: {
          description: message,
          title,
        },
      }}
      title={title}
    />
  );
}
