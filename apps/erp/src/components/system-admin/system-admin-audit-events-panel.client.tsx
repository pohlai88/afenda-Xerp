"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@afenda/shadcn-studio-v2/clients";
import type { SystemAdminAuditEventRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

export interface SystemAdminAuditEventsPanelProps {
  readonly events: readonly SystemAdminAuditEventRowDto[];
}

export function SystemAdminAuditEventsPanel({
  events,
}: SystemAdminAuditEventsPanelProps) {
  if (events.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No audit events recorded for this tenant yet.
      </p>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Correlation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="whitespace-nowrap">
                {event.createdAt}
              </TableCell>
              <TableCell>{event.action}</TableCell>
              <TableCell>
                {event.targetType}
                {event.targetId === null ? "" : ` · ${event.targetId}`}
              </TableCell>
              <TableCell className="capitalize">{event.result}</TableCell>
              <TableCell className="font-mono text-xs">
                {event.correlationId}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
