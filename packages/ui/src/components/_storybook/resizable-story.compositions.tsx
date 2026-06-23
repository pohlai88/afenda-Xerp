import type { ReactNode } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  LayoutGridIcon,
  PackageIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useResizablePanelRef,
} from "../resizable";
import { Button } from "../button";
import { StoryFrame, StoryRow, StoryStack } from "./story-frame";

export const INVOICE_ROWS = [
  { id: "INV-001", customer: "Acme Corp", amount: 4850, status: "Paid" },
  { id: "INV-002", customer: "Globex Ltd", amount: 1200, status: "Pending" },
  { id: "INV-003", customer: "Initech", amount: 8750, status: "Overdue" },
  { id: "INV-004", customer: "Umbrella Co", amount: 3200, status: "Draft" },
] as const;

export const PO_LINE_ITEMS = [
  {
    line: 1,
    sku: "SKU-4412",
    desc: "Industrial fasteners",
    qty: 500,
    unit: 0.42,
  },
  {
    line: 2,
    sku: "SKU-8820",
    desc: "Stainless bolts M8",
    qty: 200,
    unit: 1.15,
  },
  {
    line: 3,
    sku: "SKU-1190",
    desc: "Safety gloves — bulk",
    qty: 50,
    unit: 8.9,
  },
] as const;

export const MODULE_LINKS = [
  { id: "finance", label: "Finance", icon: CreditCardIcon },
  { id: "procurement", label: "Procurement", icon: PackageIcon },
  { id: "inventory", label: "Inventory", icon: LayoutGridIcon },
  { id: "hr", label: "Human resources", icon: UserIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
] as const;

export const AUDIT_EVENTS = [
  { actor: "Jane Doe", action: "Submitted for approval", time: "09:14" },
  { actor: "Michael Chen", action: "Approved — Dept Head", time: "11:42" },
  { actor: "Finance Bot", action: "Pending VP review", time: "Awaiting" },
] as const;

export const APPROVAL_QUEUE = [
  {
    id: "PO-1042",
    title: "FastCo Industrial",
    amount: 12_450,
    priority: "High",
  },
  { id: "INV-2048", title: "Globex renewal", amount: 8750, priority: "Medium" },
  {
    id: "EXP-331",
    title: "Travel reimbursement",
    amount: 890,
    priority: "Low",
  },
] as const;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ResizableFrame({
  children,
  height = "h-96",
  width = "lg",
}: {
  readonly children: ReactNode;
  readonly height?: "h-80" | "h-96";
  readonly width?: "md" | "lg" | "xl";
}) {
  return (
    <StoryFrame width={width}>
      <StoryStack
        className={`${height} overflow-hidden rounded-lg border border-border`}
      >
        {children}
      </StoryStack>
    </StoryFrame>
  );
}

export function PanelShell({
  title,
  children,
  centered = false,
}: {
  readonly title?: string;
  readonly children?: ReactNode;
  readonly centered?: boolean;
}) {
  if (centered) {
    return (
      <StoryStack
        className="h-full items-center justify-center"
        gap="xs"
        padding="md"
      >
        <span className="font-semibold text-sm">{title}</span>
      </StoryStack>
    );
  }

  return (
    <StoryStack className="h-full overflow-auto" gap="sm" padding="md">
      {title ? <span className="font-semibold text-sm">{title}</span> : null}
      {children}
    </StoryStack>
  );
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

export function CollapsibleNavDemo() {
  const navRef = useResizablePanelRef();

  return (
    <ResizableFrame>
      <StoryStack className="h-full" gap="xs">
        <StoryRow gap="sm" padding="sm">
          <Button
            aria-label="Collapse navigation panel"
            emphasis="outline"
            intent="secondary"
            onClick={() => navRef.current?.collapse()}
            presentation="icon"
            size="sm"
          >
            <ChevronLeftIcon aria-hidden="true" />
          </Button>
          <Button
            aria-label="Expand navigation panel"
            emphasis="outline"
            intent="secondary"
            onClick={() => navRef.current?.expand()}
            presentation="icon"
            size="sm"
          >
            <ChevronRightIcon aria-hidden="true" />
          </Button>
          <span className="text-muted-foreground text-xs">
            Collapse or expand navigation panel
          </span>
        </StoryRow>
        <ResizablePanelGroup
          className="min-h-0 flex-1"
          orientation="horizontal"
        >
          <ResizablePanel
            collapsible
            defaultSize={22}
            maxSize={30}
            minSize={12}
            panelRef={navRef}
          >
            <PanelShell title="Navigation">
              <StoryStack gap="xs">
                {MODULE_LINKS.map(({ id, label, icon: Icon }) => (
                  <StoryRow gap="sm" key={id}>
                    <Icon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                    <span className="text-sm">{label}</span>
                  </StoryRow>
                ))}
              </StoryStack>
            </PanelShell>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={78}>
            <PanelShell title="Main content">
              <span className="text-muted-foreground text-sm">
                Resize the handle or use the collapse buttons above.
              </span>
            </PanelShell>
          </ResizablePanel>
        </ResizablePanelGroup>
      </StoryStack>
    </ResizableFrame>
  );
}
