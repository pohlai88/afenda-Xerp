import { useId } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { cn } from "../../lib/cn";
import type {
  EvidenceWidgetProps,
  NonReadyViewSurfaceState,
  ViewStateMessage,
} from "../../types/views";
import { EVIDENCE_WIDGET_SLOTS } from "../../types/views";
import {
  serializeWorkspaceBoardLayout,
  workspaceBoardWidgetAdapterClassName,
} from "./widget-board-adapter";

export type { EvidenceWidgetProps } from "../../types/views";

const DEFAULT_EVIDENCE_STATE_MESSAGES = {
  empty: {
    description: "No evidence items are available.",
    title: "No evidence",
  },
  error: {
    description: "Evidence could not be rendered.",
    title: "Evidence unavailable",
  },
  loading: {
    description: "Evidence is being prepared.",
    title: "Loading evidence",
  },
  unavailable: {
    description: "Evidence is not available in the current context.",
    title: "Evidence unavailable",
  },
} satisfies Record<NonReadyViewSurfaceState, ViewStateMessage>;

const EVIDENCE_ITEM_STATUS_CLASSES = {
  complete: "text-primary",
  missing: "text-destructive",
  pending: "text-muted-foreground",
} as const;

export function evidenceWidgetSummaryClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn("font-semibold text-2xl text-foreground tracking-tight", className);
}

function getEvidenceStateMessage({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: EvidenceWidgetProps["stateMessages"];
}): ViewStateMessage {
  return stateMessages?.[state] ?? DEFAULT_EVIDENCE_STATE_MESSAGES[state];
}

function EvidenceWidgetState({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: EvidenceWidgetProps["stateMessages"];
}) {
  const message = getEvidenceStateMessage({ state, stateMessages });
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
        data-slot={EVIDENCE_WIDGET_SLOTS.state}
        data-state={state}
        role={isError ? "alert" : "status"}
      >
        <p className="font-medium text-foreground">{message.title}</p>
        {message.description == null ? null : (
          <p className="mt-1">{message.description}</p>
        )}
      </div>
      {message.action == null ? null : (
        <div className="mt-3" data-slot={EVIDENCE_WIDGET_SLOTS.stateAction}>
          {message.action}
        </div>
      )}
    </>
  );
}

export function EvidenceWidget({
  className,
  dataSourceKind,
  description,
  items,
  label,
  layout,
  state,
  stateMessages,
  summary,
  useCase,
  ...props
}: EvidenceWidgetProps) {
  const resolvedState = state ?? "ready";
  const evidenceWidgetId = useId();
  const titleId = `${evidenceWidgetId}-title`;
  const descriptionId =
    description == null ? undefined : `${evidenceWidgetId}-description`;
  const listId =
    items == null || items.length === 0
      ? undefined
      : `${evidenceWidgetId}-items`;

  return (
    <article
      {...props}
      aria-describedby={
        [descriptionId, listId].filter(Boolean).join(" ") || undefined
      }
      aria-labelledby={titleId}
      className={workspaceBoardWidgetAdapterClassName({ className })}
      data-adapter-kind="evidence"
      data-slot={EVIDENCE_WIDGET_SLOTS.root}
      data-source-kind={dataSourceKind}
      data-state={resolvedState}
      data-workspace-board-adapter="true"
      data-workspace-board-layout={serializeWorkspaceBoardLayout(layout)}
      data-workspace-board-use-case={useCase}
    >
      <Card className="flex h-full min-h-0 flex-col" data-state={resolvedState}>
        <CardHeader>
          <CardTitle
            className="text-sm"
            data-slot={EVIDENCE_WIDGET_SLOTS.title}
            id={titleId}
          >
            {label}
          </CardTitle>
          {description == null ? null : (
            <div
              data-slot={EVIDENCE_WIDGET_SLOTS.description}
              id={descriptionId}
            >
              <CardDescription>{description}</CardDescription>
            </div>
          )}
        </CardHeader>
        <CardContent className="min-h-0 flex-1">
          <div data-slot={EVIDENCE_WIDGET_SLOTS.content}>
            {resolvedState === "ready" ? (
              <>
                <p
                  className={evidenceWidgetSummaryClassName()}
                  data-slot={EVIDENCE_WIDGET_SLOTS.summary}
                >
                  {summary}
                </p>
                {items == null || items.length === 0 ? null : (
                  <ul
                    className="mt-3 space-y-1 text-sm"
                    data-slot={EVIDENCE_WIDGET_SLOTS.list}
                    id={listId}
                  >
                    {items.map((item) => (
                      <li
                        className={cn(
                          "flex items-center justify-between gap-2",
                          item.status == null
                            ? "text-foreground"
                            : EVIDENCE_ITEM_STATUS_CLASSES[item.status]
                        )}
                        data-slot={EVIDENCE_WIDGET_SLOTS.item}
                        data-status={item.status}
                        key={item.id}
                      >
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <EvidenceWidgetState
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
