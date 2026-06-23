import type { StatusTone } from "@afenda/ui/governance";
import { StatusIndicator } from "../status-indicator";
import { StoryFrame, StoryRow, StoryStack } from "./story-frame";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

export const ERP_STATUS_SAMPLES: ReadonlyArray<{
  readonly label: string;
  readonly tone: StatusTone;
}> = [
  { tone: "success", label: "Synced" },
  { tone: "warning", label: "Pending review" },
  { tone: "danger", label: "Overdue" },
  { tone: "info", label: "In progress" },
  { tone: "neutral", label: "Draft" },
  { tone: "pending", label: "Awaiting approval" },
  { tone: "critical", label: "Critical alert" },
  { tone: "forbidden", label: "Access denied" },
  { tone: "invalid", label: "Validation failed" },
];

export const SYNC_JOBS = [
  {
    id: "JOB-1042",
    module: "Payroll",
    status: "Synced",
    tone: "success" as const,
  },
  {
    id: "JOB-1043",
    module: "Inventory",
    status: "Syncing",
    tone: "info" as const,
  },
  {
    id: "JOB-1044",
    module: "Procurement",
    status: "Failed",
    tone: "danger" as const,
  },
] as const;

export const INVOICE_AGING_ROWS = [
  {
    id: "INV-2048",
    customer: "Northwind Traders",
    amount: 12_450,
    tone: "success" as const,
    status: "Paid",
  },
  {
    id: "INV-2051",
    customer: "Acme Corp",
    amount: 3820,
    tone: "warning" as const,
    status: "Due in 3 days",
  },
  {
    id: "INV-2033",
    customer: "Globex LLC",
    amount: 9100,
    tone: "danger" as const,
    status: "Overdue 14 days",
  },
] as const;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SyncJobsTable() {
  return (
    <StoryFrame width="lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SYNC_JOBS.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                <span className="tabular-nums">{job.id}</span>
              </TableCell>
              <TableCell>{job.module}</TableCell>
              <TableCell>
                <StatusIndicator tone={job.tone}>{job.status}</StatusIndicator>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StoryFrame>
  );
}

export function InvoiceAgingTable() {
  return (
    <StoryFrame width="lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INVOICE_AGING_ROWS.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <span className="tabular-nums">{row.id}</span>
              </TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell>
                <span className="tabular-nums">
                  {formatCurrency(row.amount)}
                </span>
              </TableCell>
              <TableCell>
                <StatusIndicator tone={row.tone}>{row.status}</StatusIndicator>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StoryFrame>
  );
}

export function LiveRegionStatusPanel() {
  return (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StatusIndicator aria-live="polite" role="status" tone="info">
          Syncing 248 records…
        </StatusIndicator>
        <StoryRow gap="sm" wrap>
          <StatusIndicator tone="success">Complete</StatusIndicator>
          <StatusIndicator tone="warning">3 warnings</StatusIndicator>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  );
}
