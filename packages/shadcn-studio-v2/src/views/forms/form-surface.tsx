import { useId } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel,
  FieldMessage,
} from "../../components/ui/field";
import { cn } from "../../lib/cn";
import type {
  FormSurfaceField,
  FormSurfaceProps,
  NonReadyViewSurfaceState,
  ViewStateMessage,
} from "../../types/views";
import { FORM_SURFACE_SLOTS } from "../../types/views";

export type { FormSurfaceProps } from "../../types/views";

const DEFAULT_FORM_STATE_MESSAGES = {
  empty: {
    description: "No form fields are available for this surface.",
    title: "No fields",
  },
  error: {
    description: "The form surface could not be rendered.",
    title: "Form unavailable",
  },
  loading: {
    description: "The form fields are being prepared.",
    title: "Loading form",
  },
  unavailable: {
    description: "This form is not available in the current context.",
    title: "Form unavailable",
  },
} satisfies Record<NonReadyViewSurfaceState, ViewStateMessage>;

export function formSurfaceClassName({
  className,
}: Pick<FormSurfaceProps, "className"> = {}): string {
  return cn("grid gap-4", className);
}

function getFormStateMessage({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: FormSurfaceProps["stateMessages"];
}): ViewStateMessage {
  return stateMessages?.[state] ?? DEFAULT_FORM_STATE_MESSAGES[state];
}

function FormSurfaceState({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: FormSurfaceProps["stateMessages"];
}) {
  const message = getFormStateMessage({ state, stateMessages });
  const isError = state === "error";

  return (
    <>
      <div data-slot={FORM_SURFACE_SLOTS.state}>
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
        <div className="mt-3" data-slot={FORM_SURFACE_SLOTS.stateAction}>
          {message.action}
        </div>
      )}
    </>
  );
}

function FormSurfaceFieldRow({ field }: { readonly field: FormSurfaceField }) {
  const descriptionId =
    field.description == null ? undefined : `${field.id}-description`;
  const messageId = field.message == null ? undefined : `${field.id}-message`;
  const describedBy = [descriptionId, messageId].filter(Boolean).join(" ");
  const fieldState = field.state ?? "default";

  return (
    <div data-slot={FORM_SURFACE_SLOTS.field}>
      <Field orientation="vertical" state={fieldState}>
        <div data-slot={FORM_SURFACE_SLOTS.fieldTitle}>
          <FieldLabel htmlFor={field.id} required={field.required ?? false}>
            {field.label}
          </FieldLabel>
        </div>
        <div data-slot={FORM_SURFACE_SLOTS.fieldControl}>
          <FieldControl aria-describedby={describedBy || undefined}>
            {field.control}
          </FieldControl>
        </div>
        {field.description == null ? null : (
          <div
            data-slot={FORM_SURFACE_SLOTS.fieldDescription}
            id={descriptionId}
          >
            <FieldDescription>{field.description}</FieldDescription>
          </div>
        )}
        {field.message == null ? null : (
          <div data-slot={FORM_SURFACE_SLOTS.fieldMessage} id={messageId}>
            <FieldMessage
              role={fieldState === "invalid" ? "alert" : undefined}
              state={fieldState}
            >
              {field.message}
            </FieldMessage>
          </div>
        )}
      </Field>
    </div>
  );
}

export function FormSurface({
  actions,
  className,
  description,
  fields = [],
  label,
  state,
  stateMessages,
  title,
  ...props
}: FormSurfaceProps) {
  const surfaceId = useId();
  const titleId = `${surfaceId}-title`;
  const descriptionId =
    description == null ? undefined : `${surfaceId}-description`;
  const resolvedState = state ?? (fields.length === 0 ? "empty" : "ready");
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
      aria-label={consumerAriaLabel ?? label}
      aria-labelledby={ariaLabelledBy}
      className={formSurfaceClassName({ className })}
      data-slot={FORM_SURFACE_SLOTS.root}
      data-state={resolvedState}
    >
      <Card>
        <CardHeader>
          <CardTitle data-slot={FORM_SURFACE_SLOTS.title} id={titleId}>
            {title}
          </CardTitle>
          {description == null ? null : (
            <div data-slot={FORM_SURFACE_SLOTS.description} id={descriptionId}>
              <CardDescription>{description}</CardDescription>
            </div>
          )}
        </CardHeader>
        <div data-slot={FORM_SURFACE_SLOTS.content}>
          <CardContent>
            {resolvedState === "ready" ? (
              <div className="grid gap-4">
                {fields.map((field) => (
                  <FormSurfaceFieldRow field={field} key={field.id} />
                ))}
              </div>
            ) : (
              <FormSurfaceState
                state={resolvedState}
                stateMessages={stateMessages}
              />
            )}
          </CardContent>
        </div>
        {actions == null || resolvedState !== "ready" ? null : (
          <div data-slot={FORM_SURFACE_SLOTS.actions}>
            <CardFooter>{actions}</CardFooter>
          </div>
        )}
      </Card>
    </section>
  );
}
