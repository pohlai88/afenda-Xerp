// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
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
} from "../../types/views";
import { METRIC_WIDGET_SLOTS } from "../../types/views";

export type { MetricWidgetProps, MetricWidgetTone } from "../../types/views";

const METRIC_WIDGET_TONE_CLASSES = {
  default: "text-foreground",
  success: "text-primary",
  warning: "text-destructive",
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
  className,
  tone = "default",
}: {
  readonly className?: string | undefined;
  readonly tone?: MetricWidgetTone;
} = {}): string {
  return cn(
    "font-semibold text-2xl tracking-tight",
    METRIC_WIDGET_TONE_CLASSES[tone],
    className
  );
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
      {message.action == null ? null : (
        <div className="mt-3" data-slot="metric-widget-state-action">
          {message.action}
        </div>
      )}
    </div>
  );
}

export function MetricWidget({
  className,
  description,
  label,
  state,
  stateMessages,
  tone = "default",
  value,
  valueClassName,
  ...props
}: MetricWidgetProps) {
  const resolvedState = state ?? "ready";

  return (
    <article
      {...props}
      className={className}
      data-slot={METRIC_WIDGET_SLOTS.root}
    >
      <Card>
        <CardHeader>
          <div data-slot={METRIC_WIDGET_SLOTS.title}>
            <CardTitle className="text-sm">{label}</CardTitle>
          </div>
          {description ? (
            <div data-slot={METRIC_WIDGET_SLOTS.description}>
              <CardDescription>{description}</CardDescription>
            </div>
          ) : null}
        </CardHeader>
        <CardContent>
          {resolvedState === "ready" ? (
            <p
              className={metricWidgetValueClassName({
                className: valueClassName,
                tone,
              })}
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
        </CardContent>
      </Card>
    </article>
  );
}
