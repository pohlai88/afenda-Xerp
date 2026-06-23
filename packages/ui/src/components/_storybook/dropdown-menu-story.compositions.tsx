import {
  CopyIcon,
  EditIcon,
  EyeIcon,
  HistoryIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "../button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";

export const INVOICE_ROWS = [
  { id: "INV-001", status: "Active", tone: "success", amount: "$4,850" },
  { id: "INV-002", status: "Pending", tone: "warning", amount: "$1,200" },
  { id: "INV-003", status: "Overdue", tone: "danger", amount: "$8,750" },
] as const;

export const EXPORT_COLUMNS = [
  { id: "col-id", label: "Employee ID", checked: true },
  { id: "col-name", label: "Full name", checked: true },
  { id: "col-dept", label: "Department", checked: true },
  { id: "col-email", label: "Email", checked: false },
  { id: "col-phone", label: "Phone", checked: false },
  { id: "col-status", label: "Status", checked: true },
] as const;

export function RowActionsTrigger({
  label = "Row actions",
}: {
  readonly label?: string;
}) {
  return (
    <DropdownMenuTrigger asChild>
      <Button
        aria-label={label}
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
  );
}

export function StandardRecordActions({
  recordId,
}: {
  readonly recordId: string;
}) {
  return (
    <>
      <DropdownMenuLabel>{recordId}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <EyeIcon aria-hidden="true" />
        View
      </DropdownMenuItem>
      <DropdownMenuItem>
        <EditIcon aria-hidden="true" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CopyIcon aria-hidden="true" />
        Duplicate
      </DropdownMenuItem>
      <DropdownMenuItem>
        <HistoryIcon aria-hidden="true" />
        Audit log
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <Trash2Icon aria-hidden="true" />
        Delete
      </DropdownMenuItem>
    </>
  );
}

export function RecordActionsMenu({
  recordId,
  label,
}: {
  readonly recordId: string;
  readonly label: string;
}) {
  return (
    <>
      <RowActionsTrigger label={label} />
      <DropdownMenuContent align="end">
        <StandardRecordActions recordId={recordId} />
      </DropdownMenuContent>
    </>
  );
}
