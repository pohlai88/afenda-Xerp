export interface SystemAdminAuditEventBlockRow {
  readonly action: string;
  readonly correlationId: string;
  readonly createdAt: string;
  readonly id: string;
  readonly result: string;
  readonly targetId: string | null;
  readonly targetType: string;
}

export interface SystemAdminAuditEventsTableBlockProps {
  readonly events: readonly SystemAdminAuditEventBlockRow[];
}

export function SystemAdminAuditEventsTableBlock({
  events,
}: SystemAdminAuditEventsTableBlockProps) {
  if (events.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No audit events recorded for this tenant yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">When</th>
            <th className="px-4 py-3 font-medium">Action</th>
            <th className="px-4 py-3 font-medium">Target</th>
            <th className="px-4 py-3 font-medium">Result</th>
            <th className="px-4 py-3 font-medium">Correlation</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr className="border-b last:border-b-0" key={event.id}>
              <td className="whitespace-nowrap px-4 py-3">{event.createdAt}</td>
              <td className="px-4 py-3">{event.action}</td>
              <td className="px-4 py-3">
                {event.targetType}
                {event.targetId === null ? "" : ` · ${event.targetId}`}
              </td>
              <td className="px-4 py-3 capitalize">{event.result}</td>
              <td className="px-4 py-3 font-mono text-xs">
                {event.correlationId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
