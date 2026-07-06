import { useId } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { cn } from "../../lib/cn";
import type {
  MetricWidgetProps,
  MetricWidgetTone,
  NonReadyViewSurfaceState,
  ViewStateMessage,
  WorkspaceBoardWidgetLayout,
} from "../../types/views";
import { METRIC_WIDGET_SLOTS } from "../../types/views";

export type { MetricWidgetProps, MetricWidgetTone } from "../../types/views";

const METRIC_WIDGET_TONE_CLASSES = {
  default: "text-foreground",
  success: "text-primary",
  warning: "text-foreground",
} satisfies Record<MetricWidgetTone, string>;

const DEFAULT_METRIC_STATE_MESSAGES = {
  empty: {
    description: "No metric value is available.",
    title: "No metric",
  },
  error: {
    description: "The metric value could not be rendered.",
    title: "Metric unavailable",
  },
  loading: {
    description: "The metric value is being prepared.",
    title: "Loading metric",
  },
  unavailable: {
    description: "This metric is not available in the current context.",
    title: "Metric unavailable",
  },
} satisfies Record<NonReadyViewSurfaceState, ViewStateMessage>;

export function metricWidgetValueClassName({
  tone = "default",
}: {
  readonly tone?: MetricWidgetTone;
} = {}): string {
  return cn(
    "font-semibold text-2xl tracking-tight",
    METRIC_WIDGET_TONE_CLASSES[tone]
  );
}

export function workspaceBoardWidgetAdapterClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn("flex h-full min-h-0 min-w-0 flex-col", className);
}

function serializeWorkspaceBoardLayout(
  layout: WorkspaceBoardWidgetLayout | undefined
): string | undefined {
  if (layout == null) {
    return;
  }

  return `${layout.x},${layout.y},${layout.w},${layout.h}`;
}

function getMetricStateMessage({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: MetricWidgetProps["stateMessages"];
}): ViewStateMessage {
  return stateMessages?.[state] ?? DEFAULT_METRIC_STATE_MESSAGES[state];
}

function MetricWidgetState({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: MetricWidgetProps["stateMessages"];
}) {
  const message = getMetricStateMessage({ state, stateMessages });
  const isError = state === "error";

  return (
    <>
      <div
        aria-busy={state === "loading" ? true : undefined}
        aria-live={isError ? "assertive" : "polite"}
        className={cn(
          "rounded-md border border-border p-3 text-sm",
          isError ? "text-destructive" : "text-muted-foreground"
        )}
        data-slot={METRIC_WIDGET_SLOTS.state}
        data-state={state}
        role={isError ? "alert" : "status"}
      >
        <p className="font-medium text-foreground">{message.title}</p>
        {message.description == null ? null : (
          <p className="mt-1">{message.description}</p>
        )}
      </div>
      {message.action == null ? null : (
        <div className="mt-3" data-slot={METRIC_WIDGET_SLOTS.stateAction}>
          {message.action}
        </div>
      )}
    </>
  );
}

export function MetricWidget({
  className,
  dataSourceKind,
  description,
  label,
  layout,
  state,
  stateMessages,
  tone = "default",
  useCase,
  value,
  ...props
}: MetricWidgetProps) {
  const resolvedState = state ?? "ready";
  const metricWidgetId = useId();
  const titleId = `${metricWidgetId}-title`;
  const descriptionId =
    description == null ? undefined : `${metricWidgetId}-description`;

  return (
    <article
      {...props}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={workspaceBoardWidgetAdapterClassName({ className })}
      data-adapter-kind="metric"
      data-slot={METRIC_WIDGET_SLOTS.root}
      data-source-kind={dataSourceKind}
      data-state={resolvedState}
      data-tone={tone}
      data-workspace-board-adapter="true"
      data-workspace-board-layout={serializeWorkspaceBoardLayout(layout)}
      data-workspace-board-use-case={useCase}
    >
      <Card className="flex h-full min-h-0 flex-col" data-state={resolvedState}>
        <CardHeader>
          <div data-slot={METRIC_WIDGET_SLOTS.title} id={titleId}>
            <CardTitle className="text-sm">{label}</CardTitle>
          </div>
          {description == null ? null : (
            <div data-slot={METRIC_WIDGET_SLOTS.description} id={descriptionId}>
              <CardDescription>{description}</CardDescription>
            </div>
          )}
        </CardHeader>
        <CardContent className="min-h-0 flex-1">
          <div data-slot={METRIC_WIDGET_SLOTS.content}>
            {resolvedState === "ready" ? (
              <p
                className={metricWidgetValueClassName({ tone })}
                data-slot={METRIC_WIDGET_SLOTS.value}
              >
                {value}
              </p>
            ) : (
              <MetricWidgetState
                state={resolvedState}
                stateMessages={stateMessages}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
