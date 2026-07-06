import { useId } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { cn } from "../../lib/cn";
import type {
  DataTableSurfaceColumn,
  DataTableSurfaceColumnAlign,
  DataTableSurfaceProps,
  DataTableSurfaceRow,
  NonReadyViewSurfaceState,
  ViewStateMessage,
} from "../../types/views";
import { DATA_TABLE_SURFACE_SLOTS } from "../../types/views";

export type { DataTableSurfaceProps } from "../../types/views";

const DEFAULT_DATA_TABLE_STATE_MESSAGES = {
  empty: {
    description: "No rows are available for this table.",
    title: "No rows",
  },
  error: {
    description: "The table could not be rendered.",
    title: "Table unavailable",
  },
  loading: {
    description: "The table rows are being prepared.",
    title: "Loading table",
  },
  unavailable: {
    description: "This table is not available in the current context.",
    title: "Table unavailable",
  },
} satisfies Record<NonReadyViewSurfaceState, ViewStateMessage>;

const DATA_TABLE_ALIGN_CLASSES = {
  center: "text-center",
  end: "text-right",
  start: "text-left",
} satisfies Record<DataTableSurfaceColumnAlign, string>;

export function dataTableSurfaceClassName({
  className,
}: Pick<DataTableSurfaceProps, "className"> = {}): string {
  return cn("grid gap-4", className);
}

function getDataTableStateMessage({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: DataTableSurfaceProps["stateMessages"];
}): ViewStateMessage {
  return stateMessages?.[state] ?? DEFAULT_DATA_TABLE_STATE_MESSAGES[state];
}

function DataTableSurfaceState({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: DataTableSurfaceProps["stateMessages"];
}) {
  const message = getDataTableStateMessage({ state, stateMessages });
  const isError = state === "error";

  return (
    <>
      <div data-slot={DATA_TABLE_SURFACE_SLOTS.state}>
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
        <div className="mt-3" data-slot={DATA_TABLE_SURFACE_SLOTS.stateAction}>
          {message.action}
        </div>
      )}
    </>
  );
}

function DataTableSurfaceHeader({
  description,
  descriptionId,
  title,
  titleId,
}: {
  readonly description: DataTableSurfaceProps["description"];
  readonly descriptionId: string | undefined;
  readonly title: DataTableSurfaceProps["title"];
  readonly titleId: string;
}) {
  return (
    <div className="grid gap-1">
      <h2 data-slot={DATA_TABLE_SURFACE_SLOTS.title} id={titleId}>
        {title}
      </h2>
      {description == null ? null : (
        <p
          className="text-muted-foreground text-sm"
          data-slot={DATA_TABLE_SURFACE_SLOTS.description}
          id={descriptionId}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function DataTableSurfaceColumnHeader({
  column,
}: {
  readonly column: DataTableSurfaceColumn;
}) {
  return (
    <TableHead
      className={DATA_TABLE_ALIGN_CLASSES[column.align ?? "start"]}
      key={column.id}
    >
      {column.header}
    </TableHead>
  );
}

function DataTableSurfaceCell({
  column,
  row,
}: {
  readonly column: DataTableSurfaceColumn;
  readonly row: DataTableSurfaceRow;
}) {
  return (
    <TableCell
      className={DATA_TABLE_ALIGN_CLASSES[column.align ?? "start"]}
      key={`${row.id}-${column.id}`}
    >
      <span data-slot={DATA_TABLE_SURFACE_SLOTS.cell}>
        {row.cells[column.id] ?? null}
      </span>
    </TableCell>
  );
}

function DataTableSurfaceReadyTable({
  caption,
  columns,
  rows,
  titleId,
}: {
  readonly caption: DataTableSurfaceProps["caption"];
  readonly columns: readonly DataTableSurfaceColumn[];
  readonly rows: readonly DataTableSurfaceRow[];
  readonly titleId: string;
}) {
  return (
    <TableContainer>
      <div data-slot={DATA_TABLE_SURFACE_SLOTS.table}>
        <Table aria-labelledby={titleId}>
          {caption == null ? null : (
            <TableCaption>
              <span data-slot={DATA_TABLE_SURFACE_SLOTS.caption}>
                {caption}
              </span>
            </TableCaption>
          )}
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <DataTableSurfaceColumnHeader column={column} key={column.id} />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <DataTableSurfaceCell
                    column={column}
                    key={`${row.id}-${column.id}`}
                    row={row}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TableContainer>
  );
}

export function DataTableSurface({
  caption,
  className,
  columns,
  description,
  label,
  rows = [],
  state,
  stateMessages,
  title,
  ...props
}: DataTableSurfaceProps) {
  const surfaceId = useId();
  const titleId = `${surfaceId}-title`;
  const descriptionId =
    description == null ? undefined : `${surfaceId}-description`;
  const resolvedState = state ?? (rows.length === 0 ? "empty" : "ready");
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
      className={dataTableSurfaceClassName({ className })}
      data-slot={DATA_TABLE_SURFACE_SLOTS.root}
      data-state={resolvedState}
    >
      <DataTableSurfaceHeader
        description={description}
        descriptionId={descriptionId}
        title={title}
        titleId={titleId}
      />
      <div data-slot={DATA_TABLE_SURFACE_SLOTS.content}>
        {resolvedState === "ready" ? (
          <DataTableSurfaceReadyTable
            caption={caption}
            columns={columns}
            rows={rows}
            titleId={titleId}
          />
        ) : (
          <DataTableSurfaceState
            state={resolvedState}
            stateMessages={stateMessages}
          />
        )}
      </div>
    </section>
  );
}
