import { StoryRow } from "./story-frame";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SectionLabel({ children }: { readonly children: string }) {
  return (
    <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
      {children}
    </span>
  );
}

export function KeyValueRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <StoryRow justify="between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm">{value}</span>
    </StoryRow>
  );
}

export const ACTIVITY_FEED = [
  {
    actor: "Jane Doe",
    action: "Approved PO-2026-1184",
    time: "2 min ago",
  },
  {
    actor: "Alex Brown",
    action: "Added line item — fasteners (×500)",
    time: "18 min ago",
  },
  {
    actor: "System",
    action: "Vendor quote attached",
    time: "Yesterday",
  },
] as const;
