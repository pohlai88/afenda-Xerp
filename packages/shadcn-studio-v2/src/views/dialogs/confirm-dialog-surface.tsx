import { useId } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { cn } from "../../lib/cn";
import type {
  ConfirmDialogSurfaceIntent,
  ConfirmDialogSurfaceProps,
  NonReadyViewSurfaceState,
  ViewStateMessage,
} from "../../types/views";
import { CONFIRM_DIALOG_SURFACE_SLOTS } from "../../types/views";

export type {
  ConfirmDialogSurfaceIntent,
  ConfirmDialogSurfaceProps,
} from "../../types/views";

const DEFAULT_CONFIRM_DIALOG_STATE_MESSAGES = {
  empty: {
    description: "No confirmation content is available.",
    title: "No confirmation",
  },
  error: {
    description: "The confirmation dialog could not be rendered.",
    title: "Confirmation unavailable",
  },
  loading: {
    description: "The confirmation dialog is being prepared.",
    title: "Loading confirmation",
  },
  unavailable: {
    description: "This confirmation is not available in the current context.",
    title: "Confirmation unavailable",
  },
} satisfies Record<NonReadyViewSurfaceState, ViewStateMessage>;

export function confirmDialogSurfaceClassName({
  className,
}: Pick<ConfirmDialogSurfaceProps, "className"> = {}): string {
  return cn("grid max-w-lg gap-4", className);
}

function getConfirmDialogStateMessage({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: ConfirmDialogSurfaceProps["stateMessages"];
}): ViewStateMessage {
  return stateMessages?.[state] ?? DEFAULT_CONFIRM_DIALOG_STATE_MESSAGES[state];
}

function ConfirmDialogSurfaceState({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: ConfirmDialogSurfaceProps["stateMessages"];
}) {
  const message = getConfirmDialogStateMessage({ state, stateMessages });
  const isError = state === "error";

  return (
    <>
      <div data-slot={CONFIRM_DIALOG_SURFACE_SLOTS.state}>
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
        <div
          className="mt-3"
          data-slot={CONFIRM_DIALOG_SURFACE_SLOTS.stateAction}
        >
          {message.action}
        </div>
      )}
    </>
  );
}

function ConfirmDialogSurfaceDefaultActions({
  cancelLabel,
  confirmLabel,
  intent,
}: {
  readonly cancelLabel: ConfirmDialogSurfaceProps["cancelLabel"];
  readonly confirmLabel: ConfirmDialogSurfaceProps["confirmLabel"];
  readonly intent: ConfirmDialogSurfaceIntent;
}) {
  return (
    <>
      <span data-slot={CONFIRM_DIALOG_SURFACE_SLOTS.cancelAction}>
        <Button variant="outline">{cancelLabel}</Button>
      </span>
      <span data-slot={CONFIRM_DIALOG_SURFACE_SLOTS.confirmAction}>
        <Button variant={intent === "destructive" ? "destructive" : "default"}>
          {confirmLabel}
        </Button>
      </span>
    </>
  );
}

export function ConfirmDialogSurface({
  actions,
  cancelLabel = "Cancel",
  className,
  confirmLabel = "Confirm",
  description,
  intent = "default",
  label,
  state,
  stateMessages,
  title,
  ...props
}: ConfirmDialogSurfaceProps) {
  const surfaceId = useId();
  const titleId = `${surfaceId}-title`;
  const descriptionId =
    description == null ? undefined : `${surfaceId}-description`;
  const resolvedState = state ?? "ready";
  const consumerAriaLabel = props["aria-label"];
  const consumerDescribedBy = props["aria-describedby"];
  const consumerLabelledBy = props["aria-labelledby"];
  const consumerModal = props["aria-modal"];
  const ariaLabelledBy =
    consumerLabelledBy ??
    (consumerAriaLabel == null && label == null ? titleId : undefined);

  return (
    <section
      {...props}
      aria-describedby={consumerDescribedBy ?? descriptionId}
      aria-label={consumerAriaLabel ?? label}
      aria-labelledby={ariaLabelledBy}
      aria-modal={consumerModal ?? true}
      className={confirmDialogSurfaceClassName({ className })}
      data-intent={intent}
      data-slot={CONFIRM_DIALOG_SURFACE_SLOTS.root}
      data-state={resolvedState}
      role="dialog"
    >
      <Card>
        <CardHeader>
          <CardTitle
            as="h2"
            data-slot={CONFIRM_DIALOG_SURFACE_SLOTS.title}
            id={titleId}
          >
            {title}
          </CardTitle>
          {description == null ? null : (
            <div
              data-slot={CONFIRM_DIALOG_SURFACE_SLOTS.description}
              id={descriptionId}
            >
              <CardDescription>{description}</CardDescription>
            </div>
          )}
        </CardHeader>
        <div data-slot={CONFIRM_DIALOG_SURFACE_SLOTS.content}>
          <CardContent>
            {resolvedState === "ready" ? null : (
              <ConfirmDialogSurfaceState
                state={resolvedState}
                stateMessages={stateMessages}
              />
            )}
          </CardContent>
        </div>
        {resolvedState === "ready" ? (
          <div data-slot={CONFIRM_DIALOG_SURFACE_SLOTS.actions}>
            <CardFooter className="justify-end gap-2">
              {actions ?? (
                <ConfirmDialogSurfaceDefaultActions
                  cancelLabel={cancelLabel}
                  confirmLabel={confirmLabel}
                  intent={intent}
                />
              )}
            </CardFooter>
          </div>
        ) : null}
      </Card>
    </section>
  );
}
