import { type ComponentProps, type ReactNode, useId } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
    <>
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
        </Alert>
      </div>
      {message.action == null ? null : (
        <div className="mt-3" data-slot={AUTH_SHELL_SLOTS.stateAction}>
          {message.action}
        </div>
      )}
    </>
  );
}

function AuthShellReadyContent({
  actions,
  children,
}: {
  readonly actions: ReactNode;
  readonly children: ReactNode;
}) {
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

function AuthShellContent({
  actions,
  children,
  state,
  stateMessages,
}: {
  readonly actions: ReactNode;
  readonly children: ReactNode;
  readonly state: AuthShellState;
  readonly stateMessages: AuthShellProps["stateMessages"];
}) {
  if (state !== "ready") {
    return (
      <AuthShellStateMessage state={state} stateMessages={stateMessages} />
    );
  }

  return (
    <AuthShellReadyContent actions={actions}>{children}</AuthShellReadyContent>
  );
}

function AuthShellFooter({
  footer,
  secondaryActions,
}: {
  readonly footer: AuthShellProps["footer"];
  readonly secondaryActions: AuthShellProps["secondaryActions"];
}) {
  if (footer == null && secondaryActions == null) {
    return null;
  }

  return (
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
  );
}

function AuthShellHeader({
  description,
  descriptionId,
  title,
  titleId,
}: {
  readonly description: AuthShellProps["description"];
  readonly descriptionId: string | undefined;
  readonly title: AuthShellProps["title"];
  readonly titleId: string;
}) {
  return (
    <CardHeader>
      <CardTitle as="h1" data-slot={AUTH_SHELL_SLOTS.title} id={titleId}>
        {title}
      </CardTitle>
      {description == null ? null : (
        <div data-slot={AUTH_SHELL_SLOTS.description} id={descriptionId}>
          <CardDescription>{description}</CardDescription>
        </div>
      )}
    </CardHeader>
  );
}

export function AuthShell({
  actions,
  children,
  className,
  description,
  footer,
  label,
  secondaryActions,
  state,
  stateMessages,
  title,
  ...props
}: AuthShellProps) {
  const resolvedState = state ?? "ready";
  const authShellId = useId();
  const titleId = `${authShellId}-title`;
  const descriptionId =
    description == null ? undefined : `${authShellId}-description`;
  const consumerAriaLabel = props["aria-label"];
  const consumerDescribedBy = props["aria-describedby"];
  const consumerLabelledBy = props["aria-labelledby"];
  const ariaLabelledBy =
    consumerLabelledBy ??
    (consumerAriaLabel == null && label == null ? titleId : undefined);

  return (
    <section
      {...props}
      aria-describedby={consumerDescribedBy ?? descriptionId}
      aria-label={
        consumerAriaLabel ?? (consumerLabelledBy == null ? label : undefined)
      }
      aria-labelledby={ariaLabelledBy}
      className={authShellClassName({ className })}
      data-slot={AUTH_SHELL_SLOTS.root}
      data-state={resolvedState}
    >
      <div className="w-full" data-slot={AUTH_SHELL_SLOTS.card}>
        <Card data-state={resolvedState}>
          <AuthShellHeader
            description={description}
            descriptionId={descriptionId}
            title={title}
            titleId={titleId}
          />
          <CardContent>
            <div data-slot={AUTH_SHELL_SLOTS.content}>
              <AuthShellContent
                actions={actions}
                state={resolvedState}
                stateMessages={stateMessages}
              >
                {children}
              </AuthShellContent>
            </div>
          </CardContent>
          <AuthShellFooter
            footer={footer}
            secondaryActions={secondaryActions}
          />
        </Card>
      </div>
    </section>
  );
}
