import type { GovernedState } from "@afenda/ui/governance";
import type { ReactNode } from "react";
import {
  Building2Icon,
  CreditCardIcon,
  FileTextIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react";
import { ScrollArea } from "../scroll-area";
import { StoryFrame } from "./story-frame";

export const RELEASE_TAGS = Array.from(
  { length: 50 },
  (_, index) => `v1.2.0-beta.${50 - index}`
);

export const MODULE_LINKS = [
  { id: "finance", label: "Finance", icon: CreditCardIcon, count: 12 },
  { id: "procurement", label: "Procurement", icon: PackageIcon, count: 5 },
  { id: "inventory", label: "Inventory", icon: Building2Icon, count: 8 },
  { id: "hr", label: "Human resources", icon: UserIcon, count: 3 },
  { id: "reports", label: "Reports", icon: FileTextIcon, count: 21 },
] as const;

export const AUDIT_EVENTS = [
  {
    id: "evt-1",
    actor: "Jane Doe",
    action: "Submitted PO-1042 for approval",
    timestamp: "Jun 21, 2026 · 09:14",
  },
  {
    id: "evt-2",
    actor: "Michael Chen",
    action: "Approved — Department Head",
    timestamp: "Jun 21, 2026 · 11:42",
  },
  {
    id: "evt-3",
    actor: "Finance Bot",
    action: "Routed to VP Finance review",
    timestamp: "Jun 21, 2026 · 11:43",
  },
  {
    id: "evt-4",
    actor: "Alex Brown",
    action: "Attached vendor quote PDF",
    timestamp: "Jun 20, 2026 · 16:08",
  },
  {
    id: "evt-5",
    actor: "System",
    action: "Updated freight terms on PO-1042",
    timestamp: "Jun 20, 2026 · 14:22",
  },
  {
    id: "evt-6",
    actor: "Jane Doe",
    action: "Created PO-1042 draft",
    timestamp: "Jun 19, 2026 · 10:05",
  },
] as const;

export const NOTIFICATIONS = [
  {
    id: "n-1",
    title: "Invoice INV-2048 approved",
    body: "Finance controller signed off.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n-2",
    title: "PO-1042 awaiting your review",
    body: "FastCo Industrial · $12,450",
    time: "18m ago",
    unread: true,
  },
  {
    id: "n-3",
    title: "Stock alert — SKU-4412",
    body: "Below reorder point in Zone A.",
    time: "1h ago",
    unread: false,
  },
  {
    id: "n-4",
    title: "Payroll batch posted",
    body: "June 2026 cycle completed.",
    time: "3h ago",
    unread: false,
  },
  {
    id: "n-5",
    title: "New vendor registration",
    body: "Globex Ltd pending verification.",
    time: "Yesterday",
    unread: false,
  },
] as const;

export const INVOICE_RECORDS = [
  { id: "INV-001", customer: "Acme Corp", amount: 4850, status: "Paid" },
  { id: "INV-002", customer: "Globex Ltd", amount: 1200, status: "Pending" },
  { id: "INV-003", customer: "Initech", amount: 8750, status: "Overdue" },
  { id: "INV-004", customer: "Umbrella Co", amount: 3200, status: "Draft" },
  {
    id: "INV-005",
    customer: "Stark Industries",
    amount: 15_600,
    status: "Paid",
  },
  {
    id: "INV-006",
    customer: "Wayne Enterprises",
    amount: 9200,
    status: "Pending",
  },
] as const;

export const FILTER_CHIPS = [
  "All",
  "Active",
  "Pending",
  "Overdue",
  "Draft",
  "Finance",
  "Operations",
  "Q2 2026",
  "My records",
  "High value",
] as const;

export const PO_LINE_ITEMS = [
  { line: 1, sku: "SKU-4412", desc: "Industrial fasteners", qty: 500 },
  { line: 2, sku: "SKU-8820", desc: "Stainless bolts M8", qty: 200 },
  { line: 3, sku: "SKU-1190", desc: "Safety gloves — bulk", qty: 50 },
  { line: 4, sku: "SKU-3301", desc: "Packing tape rolls", qty: 120 },
  { line: 5, sku: "SKU-7744", desc: "Steel shelving unit", qty: 4 },
  { line: 6, sku: "SKU-9920", desc: "Forklift battery", qty: 1 },
] as const;

export const WAREHOUSE_BINS = [
  { id: "bin-a12", sku: "SKU-4412", qty: 480, location: "Zone A · Rack 12" },
  { id: "bin-b03", sku: "SKU-8820", qty: 175, location: "Zone B · Rack 03" },
  { id: "bin-c07", sku: "SKU-1190", qty: 42, location: "Zone C · Rack 07" },
  { id: "bin-d11", sku: "SKU-3301", qty: 890, location: "Zone D · Rack 11" },
  { id: "bin-e02", sku: "SKU-7744", qty: 12, location: "Zone E · Rack 02" },
] as const;

export const TEAM_MEMBERS = [
  {
    id: "emp-142",
    name: "Jane Doe",
    role: "Finance controller",
    dept: "Finance",
  },
  {
    id: "emp-208",
    name: "Michael Chen",
    role: "Ops manager",
    dept: "Operations",
  },
  {
    id: "emp-311",
    name: "Alex Brown",
    role: "Procurement lead",
    dept: "Procurement",
  },
  { id: "emp-415", name: "Sam Rivera", role: "HR specialist", dept: "HR" },
  {
    id: "emp-502",
    name: "Taylor Kim",
    role: "Inventory clerk",
    dept: "Inventory",
  },
] as const;

export const TRANSACTIONS = [
  { id: "txn-901", desc: "Payment — Acme Corp", amount: -4850, date: "Jun 21" },
  { id: "txn-902", desc: "Receipt — Globex Ltd", amount: 1200, date: "Jun 20" },
  {
    id: "txn-903",
    desc: "Journal — Accrued freight",
    amount: -320,
    date: "Jun 20",
  },
  { id: "txn-904", desc: "Payment — Initech", amount: -8750, date: "Jun 19" },
  {
    id: "txn-905",
    desc: "Deposit — Stark Industries",
    amount: 15_600,
    date: "Jun 18",
  },
] as const;

export const ATTACHMENTS = [
  { id: "att-1", name: "vendor-quote.pdf", size: "248 KB" },
  { id: "att-2", name: "packing-list.xlsx", size: "42 KB" },
  { id: "att-3", name: "inspection-photo.jpg", size: "1.2 MB" },
  { id: "att-4", name: "signed-po.pdf", size: "186 KB" },
] as const;

export const KPI_METRICS = [
  { label: "Open receivables", value: "$128,400", delta: "+4.2%" },
  { label: "Outstanding payables", value: "$84,200", delta: "-1.8%" },
  { label: "Cash on hand", value: "$256,000", delta: "+0.6%" },
  { label: "POs awaiting approval", value: "14", delta: "+3" },
  { label: "Overdue invoices", value: "6", delta: "-2" },
  { label: "Stock alerts", value: "9", delta: "+1" },
] as const;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

export function ScrollAreaShell({
  children,
  height = "h-72",
  width = "w-full",
  state,
  frameWidth = "sm",
}: {
  readonly children: ReactNode;
  readonly height?: "h-48" | "h-64" | "h-72" | "h-80" | "h-96";
  readonly width?: "w-full" | "w-48" | "max-w-md";
  readonly state?: GovernedState;
  readonly frameWidth?: "sm" | "md" | "lg";
}) {
  return (
    <StoryFrame width={frameWidth}>
      <ScrollArea
        className={`${height} ${width} rounded-md border border-border`}
        {...(state ? { state } : {})}
      >
        {children}
      </ScrollArea>
    </StoryFrame>
  );
}

export function SectionTitle({ children }: { readonly children: string }) {
  return <span className="font-medium text-sm leading-none">{children}</span>;
}

export function MutedCaption({ children }: { readonly children: string }) {
  return <span className="text-muted-foreground text-xs">{children}</span>;
}
