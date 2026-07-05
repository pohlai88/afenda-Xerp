// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { cn } from "../../lib/cn";
import type { ViewStateMessage } from "../../types/views";

export type AuthShellState =
  | "disabled"
  | "error"
  | "loading"
  | "ready"
  | "unavailable";

export type NonReadyAuthShellState = Exclude<AuthShellState, "ready">;

export type AuthShellSlotName =
  | "actions"
  | "card"
  | "content"
  | "description"
  | "footer"
  | "root"
  | "secondaryActions"
  | "state"
  | "stateAction"
  | "title";

export type AuthShellSlotValue = "auth-shell" | `auth-shell-${string}`;

export const AUTH_SHELL_SLOTS = {
  actions: "auth-shell-actions",
  card: "auth-shell-card",
  content: "auth-shell-content",
  description: "auth-shell-description",
  footer: "auth-shell-footer",
  root: "auth-shell",
  secondaryActions: "auth-shell-secondary-actions",
  state: "auth-shell-state",
  stateAction: "auth-shell-state-action",
  title: "auth-shell-title",
} as const satisfies Record<AuthShellSlotName, AuthShellSlotValue>;

export type AuthShellSlot =
  (typeof AUTH_SHELL_SLOTS)[keyof typeof AUTH_SHELL_SLOTS];

export type AuthShellStateMessages = Readonly<
  Partial<Record<NonReadyAuthShellState, ViewStateMessage>>
>;

export interface AuthShellProps
  extends Omit<ComponentProps<"section">, "title"> {
  /** Primary actions render only in the ready state. */
  readonly actions?: ReactNode;
  readonly description?: ReactNode;
  /** Footer remains visible in non-ready states for support or recovery links. */
  readonly footer?: ReactNode;
  readonly label?: string;
  /** Secondary actions remain visible in non-ready states. */
  readonly secondaryActions?: ReactNode;
  readonly state?: AuthShellState;
  readonly stateMessages?: AuthShellStateMessages;
  readonly title: ReactNode;
}

const AUTH_SHELL_BASE_CLASS =
  "mx-auto flex min-h-svh w-full max-w-md items-center justify-center bg-background px-6 py-12 text-foreground";
const DEFAULT_AUTH_SHELL_LABEL = "Authentication";

const DEFAULT_AUTH_STATE_MESSAGES = {
  disabled: {
    description: "This authentication option is currently disabled.",
    title: "Authentication disabled",
  },
  error: {
    description: "The authentication surface could not be rendered.",
    title: "Authentication unavailable",
  },
  loading: {
    description: "The authentication surface is being prepared.",
    title: "Loading authentication",
  },
  unavailable: {
    description: "Authentication is not available in the current context.",
    title: "Authentication unavailable",
  },
} satisfies Record<NonReadyAuthShellState, ViewStateMessage>;

export function authShellClassName({
  className,
}: Pick<AuthShellProps, "className"> = {}): string {
  return cn(AUTH_SHELL_BASE_CLASS, className);
}

function getAuthStateMessage({
  state,
  stateMessages,
}: {
  readonly state: NonReadyAuthShellState;
  readonly stateMessages: AuthShellProps["stateMessages"];
}): ViewStateMessage {
  return stateMessages?.[state] ?? DEFAULT_AUTH_STATE_MESSAGES[state];
}

function AuthShellStateMessage({
  state,
  stateMessages,
}: {
  readonly state: NonReadyAuthShellState;
  readonly stateMessages: AuthShellProps["stateMessages"];
}) {
  const message = getAuthStateMessage({ state, stateMessages });
  const isError = state === "error";

  return (
    <div
      data-disabled={state === "disabled" ? "" : undefined}
      data-slot={AUTH_SHELL_SLOTS.state}
      data-state={state}
    >
      <Alert
        aria-busy={state === "loading" ? true : undefined}
        aria-live={isError ? "assertive" : "polite"}
        data-state={state}
        role={isError ? "alert" : "status"}
        variant={isError ? "destructive" : "default"}
      >
        <AlertTitle>{message.title}</AlertTitle>
        {message.description == null ? null : (
          <AlertDescription>{message.description}</AlertDescription>
        )}
        {message.action == null ? null : (
          <div className="mt-3" data-slot={AUTH_SHELL_SLOTS.stateAction}>
            {message.action}
          </div>
        )}
      </Alert>
    </div>
  );
}

function renderAuthShellContent({
  actions,
  children,
  state,
  stateMessages,
}: {
  readonly actions: ReactNode;
  readonly children: ReactNode;
  readonly state: AuthShellState;
  readonly stateMessages: AuthShellProps["stateMessages"];
}): ReactNode {
  if (state !== "ready") {
    return (
      <AuthShellStateMessage state={state} stateMessages={stateMessages} />
    );
  }

  return (
    <>
      {children}
      {actions == null ? null : (
        <div
          className="mt-4 flex flex-col gap-2"
          data-slot={AUTH_SHELL_SLOTS.actions}
        >
          {actions}
        </div>
      )}
    </>
  );
}

export function AuthShell({
  actions,
  children,
  className,
  description,
  footer,
  label = DEFAULT_AUTH_SHELL_LABEL,
  secondaryActions,
  state,
  stateMessages,
  title,
  ...props
}: AuthShellProps) {
  const resolvedState = state ?? "ready";
  const sectionAriaLabel =
    props["aria-label"] ??
    (props["aria-labelledby"] == null ? label : undefined);
  const hasFooter = footer != null || secondaryActions != null;

  return (
    <section
      {...props}
      aria-label={sectionAriaLabel}
      className={authShellClassName({ className })}
      data-slot={AUTH_SHELL_SLOTS.root}
      data-state={resolvedState}
    >
      <div className="w-full" data-slot={AUTH_SHELL_SLOTS.card}>
        <Card data-state={resolvedState}>
          <CardHeader>
            <CardTitle>
              <h1 data-slot={AUTH_SHELL_SLOTS.title}>{title}</h1>
            </CardTitle>
            {description == null ? null : (
              <div data-slot={AUTH_SHELL_SLOTS.description}>
                <CardDescription>{description}</CardDescription>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div data-slot={AUTH_SHELL_SLOTS.content}>
              {renderAuthShellContent({
                actions,
                children,
                state: resolvedState,
                stateMessages,
              })}
            </div>
          </CardContent>
          {hasFooter ? (
            <CardFooter>
              <div className="flex w-full flex-col gap-3">
                {secondaryActions == null ? null : (
                  <div data-slot={AUTH_SHELL_SLOTS.secondaryActions}>
                    {secondaryActions}
                  </div>
                )}
                {footer == null ? null : (
                  <div data-slot={AUTH_SHELL_SLOTS.footer}>{footer}</div>
                )}
              </div>
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </section>
  );
}
