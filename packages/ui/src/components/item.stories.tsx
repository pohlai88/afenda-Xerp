import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BellIcon,
  Building2Icon,
  CheckCircle2Icon,
  ChevronRightIcon,
  FileTextIcon,
  PackageIcon,
  PlusIcon,
  TruckIcon,
  UserIcon,
  WebhookIcon,
} from "lucide-react";
import React, { type ComponentType, Fragment, type ReactNode } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  type ItemSize,
  ItemTitle,
  type ItemVariant,
} from "./item";

// ─── Sample data ───────────────────────────────────────────────────────────

const TEAM = [
  {
    id: "emp-1042",
    name: "Jane Doe",
    email: "jane.doe@company.com",
    initials: "JD",
    department: "Finance",
  },
  {
    id: "emp-1038",
    name: "Alex Brown",
    email: "alex.brown@company.com",
    initials: "AB",
    department: "Operations",
  },
  {
    id: "emp-1029",
    name: "Sam Chen",
    email: "sam.chen@company.com",
    initials: "SC",
    department: "HR",
  },
] as const;

const INVOICES = [
  {
    id: "INV-2026-0042",
    vendor: "Acme Software Ltd.",
    amount: "$4,850.00",
    status: "pending" as const,
    dueDate: "Jul 15, 2026",
  },
  {
    id: "INV-2026-0038",
    vendor: "FastCo Industrial",
    amount: "$12,450.00",
    status: "approved" as const,
    dueDate: "Jul 1, 2026",
  },
  {
    id: "INV-2026-0031",
    vendor: "Northwind Supplies",
    amount: "$2,180.00",
    status: "overdue" as const,
    dueDate: "Jun 10, 2026",
  },
] as const;

const APPROVALS = [
  {
    id: "PO-2026-1184",
    type: "Purchase Order",
    requester: "Jane Doe",
    amount: "$12,450.00",
    priority: "high" as const,
  },
  {
    id: "EXP-2026-0421",
    type: "Expense Claim",
    requester: "Alex Brown",
    amount: "$842.50",
    priority: "normal" as const,
  },
] as const;

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Invoice due tomorrow",
    body: "INV-2026-0042 · $4,850.00",
    time: "5 min ago",
    tone: "warning" as const,
  },
  {
    id: "n2",
    title: "PO approved",
    body: "PO-2026-1184 · Jane Doe",
    time: "1 hr ago",
    tone: "success" as const,
  },
] as const;

const PRODUCTS = [
  {
    id: "sku-4412",
    name: "Industrial Fasteners Kit",
    description: "Bulk pack · Zone A · Rack 12",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=128&h=128&fit=crop",
  },
  {
    id: "sku-8820",
    name: "Stainless Steel Bolts M8",
    description: "Low stock · 42 units remaining",
    image:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=128&h=128&fit=crop",
  },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

function statusTone(
  status:
    | "pending"
    | "approved"
    | "overdue"
    | "success"
    | "warning"
    | "high"
    | "normal"
): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "approved":
    case "success":
      return "success";
    case "pending":
    case "warning":
      return "warning";
    case "overdue":
    case "high":
      return "danger";
    case "normal":
      return "info";
    default:
      return "neutral";
  }
}

function ItemListFrame({
  children,
  width = "md",
}: {
  readonly children: ReactNode;
  readonly width?: "sm" | "md" | "lg" | "xl";
}) {
  return <StoryFrame width={width}>{children}</StoryFrame>;
}

function IconMedia({
  icon: Icon,
}: {
  readonly icon: ComponentType<{ className?: string }>;
}) {
  return (
    <ItemMedia variant="icon">
      <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
    </ItemMedia>
  );
}

function InvoiceStatusBadge({
  status,
}: {
  readonly status: (typeof INVOICES)[number]["status"];
}) {
  return (
    <Badge emphasis="soft" size="sm" tone={statusTone(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function VariantItem({
  description,
  title,
  variant,
}: {
  readonly description: string;
  readonly title: string;
  readonly variant: ItemVariant;
}) {
  return (
    <Item variant={variant}>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button emphasis="outline" intent="secondary" size="sm">
          Open
        </Button>
      </ItemActions>
    </Item>
  );
}

function SizeItem({
  label,
  size,
}: {
  readonly label: string;
  readonly size: ItemSize;
}) {
  return (
    <Item size={size} variant="outline">
      <IconMedia icon={FileTextIcon} />
      <ItemContent>
        <ItemTitle>{label}</ItemTitle>
        <ItemDescription>
          Compact list row for dense ERP surfaces.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <ChevronRightIcon
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
      </ItemActions>
    </Item>
  );
}

// ─── Item ──────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Item",
  component: Item,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed list-row primitive for ERP inbox rows, directory entries, notification items, and attachment lists. Compose with `ItemGroup`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`, `ItemHeader`, `ItemFooter`, and `ItemSeparator`. Supports `variant` (`default` · `outline` · `muted`), `size` (`default` · `sm` · `xs`), and `asChild` for links.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "muted"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "xs"],
    },
    asChild: { control: "boolean" },
  },
  args: {
    variant: "outline",
    size: "default",
    asChild: false,
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic patterns ────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <ItemListFrame>
      <Item {...args}>
        <ItemContent>
          <ItemTitle>Basic Item</ItemTitle>
          <ItemDescription>
            A simple item with title, description, and trailing action.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button emphasis="outline" intent="secondary" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const Variants: Story = {
  name: "Item — Variants",
  render: () => (
    <ItemListFrame>
      <StoryStack gap="md">
        <VariantItem
          description="Standard styling with subtle borders for primary lists."
          title="Default Variant"
          variant="default"
        />
        <VariantItem
          description="Outlined style with clear borders for selectable rows."
          title="Outline Variant"
          variant="outline"
        />
        <VariantItem
          description="Subdued appearance for secondary or nested content."
          title="Muted Variant"
          variant="muted"
        />
      </StoryStack>
    </ItemListFrame>
  ),
};

export const Sizes: Story = {
  name: "Item — Sizes",
  render: () => (
    <ItemListFrame>
      <StoryStack gap="sm">
        <SizeItem label="Default size" size="default" />
        <SizeItem label="Small size" size="sm" />
        <SizeItem label="Extra small size" size="xs" />
      </StoryStack>
    </ItemListFrame>
  ),
};

export const IconMediaStory: Story = {
  name: "Item — Icon Media",
  render: () => (
    <ItemListFrame>
      <Item variant="outline">
        <IconMedia icon={BadgeCheckIcon} />
        <ItemContent>
          <ItemTitle>Vendor verification complete</ItemTitle>
          <ItemDescription>
            FastCo Industrial passed compliance review on Jun 18, 2026.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const ImageMedia: Story = {
  name: "Item — Image Media",
  render: () => (
    <ItemListFrame>
      <Item variant="outline">
        <ItemMedia variant="image">
          <img
            alt="Industrial fasteners"
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=80&h=80&fit=crop"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>SKU-4412 · Industrial Fasteners</ItemTitle>
          <ItemDescription>480 units · Zone A · Rack 12</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button emphasis="outline" intent="secondary" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const AsChildLink: Story = {
  name: "Item — asChild Link",
  render: () => (
    <ItemListFrame>
      <Item asChild size="sm" variant="outline">
        <a href="#invoice-detail">
          <IconMedia icon={FileTextIcon} />
          <ItemContent>
            <ItemTitle>INV-2026-0042 · Pending approval</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
          </ItemActions>
        </a>
      </Item>
    </ItemListFrame>
  ),
};

export const ItemGroupWithSeparators: Story = {
  name: "Item — Group + Separators",
  render: () => (
    <ItemListFrame>
      <ItemGroup>
        {TEAM.map((person, index) => (
          <Fragment key={person.id}>
            <Item variant="outline">
              <ItemMedia>
                <Avatar size="sm">
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{person.name}</ItemTitle>
                <ItemDescription>{person.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  aria-label={`Add ${person.name}`}
                  emphasis="ghost"
                  intent="quiet"
                  presentation="icon"
                  size="sm"
                >
                  <PlusIcon aria-hidden="true" />
                </Button>
              </ItemActions>
            </Item>
            {index < TEAM.length - 1 ? <ItemSeparator /> : null}
          </Fragment>
        ))}
      </ItemGroup>
    </ItemListFrame>
  ),
};

export const HeaderAndFooter: Story = {
  name: "Item — Header + Footer",
  render: () => (
    <ItemListFrame width="lg">
      <ItemGroup>
        {PRODUCTS.map((product) => (
          <Item key={product.id} variant="outline">
            <ItemHeader>
              <img
                alt={product.name}
                className="aspect-square w-full rounded-sm object-cover"
                src={product.image}
              />
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{product.name}</ItemTitle>
              <ItemDescription>{product.description}</ItemDescription>
            </ItemContent>
            <ItemFooter>
              <Badge emphasis="soft" size="sm" tone="neutral">
                {product.id}
              </Badge>
              <Button emphasis="outline" intent="secondary" size="sm">
                Adjust Stock
              </Button>
            </ItemFooter>
          </Item>
        ))}
      </ItemGroup>
    </ItemListFrame>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const InvoiceListRow: Story = {
  name: "ERP — Invoice List Row",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame width="lg">
      <ItemGroup>
        {INVOICES.map((invoice, index) => (
          <Fragment key={invoice.id}>
            <Item variant="outline">
              <IconMedia icon={FileTextIcon} />
              <ItemContent>
                <StoryRow align="center" gap="sm" wrap>
                  <ItemTitle>{invoice.id}</ItemTitle>
                  <InvoiceStatusBadge status={invoice.status} />
                </StoryRow>
                <ItemDescription>
                  {invoice.vendor} · Due {invoice.dueDate}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className="font-medium text-sm tabular-nums">
                  {invoice.amount}
                </span>
                <Button
                  emphasis="ghost"
                  intent="quiet"
                  presentation="icon"
                  size="sm"
                >
                  <ChevronRightIcon aria-hidden="true" />
                </Button>
              </ItemActions>
            </Item>
            {index < INVOICES.length - 1 ? <ItemSeparator /> : null}
          </Fragment>
        ))}
      </ItemGroup>
    </ItemListFrame>
  ),
};

export const PurchaseOrderQueue: Story = {
  name: "ERP — Purchase Order Queue",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame width="lg">
      <Item variant="muted">
        <IconMedia icon={PackageIcon} />
        <ItemContent>
          <ItemTitle>PO-2026-1184</ItemTitle>
          <ItemDescription>
            FastCo Industrial · 12 line items · Jane Doe
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge emphasis="soft" size="sm" tone="warning">
            Awaiting approval
          </Badge>
          <Button emphasis="solid" intent="primary" size="sm">
            Review
          </Button>
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const EmployeeDirectoryRow: Story = {
  name: "ERP — Employee Directory Row",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame>
      <ItemGroup>
        {TEAM.map((person, index) => (
          <Fragment key={person.id}>
            <Item size="sm" variant="outline">
              <ItemMedia>
                <Avatar size="sm">
                  <AvatarImage
                    alt={person.name}
                    src={`https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-${index + 1}.png`}
                  />
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{person.name}</ItemTitle>
                <ItemDescription>
                  {person.department} · {person.email}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button emphasis="outline" intent="secondary" size="sm">
                  View Profile
                </Button>
              </ItemActions>
            </Item>
            {index < TEAM.length - 1 ? <ItemSeparator /> : null}
          </Fragment>
        ))}
      </ItemGroup>
    </ItemListFrame>
  ),
};

export const ApprovalInboxItem: Story = {
  name: "ERP — Approval Inbox Item",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame width="lg">
      <ItemGroup>
        {APPROVALS.map((item, index) => (
          <Fragment key={item.id}>
            <Item variant="outline">
              <IconMedia icon={CheckCircle2Icon} />
              <ItemContent>
                <StoryRow align="center" gap="sm" wrap>
                  <ItemTitle>{item.id}</ItemTitle>
                  <Badge
                    emphasis="soft"
                    size="sm"
                    tone={statusTone(item.priority)}
                  >
                    {item.priority}
                  </Badge>
                </StoryRow>
                <ItemDescription>
                  {item.type} · {item.requester} · {item.amount}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button emphasis="outline" intent="secondary" size="sm">
                  Reject
                </Button>
                <Button emphasis="solid" intent="primary" size="sm">
                  Approve
                </Button>
              </ItemActions>
            </Item>
            {index < APPROVALS.length - 1 ? <ItemSeparator /> : null}
          </Fragment>
        ))}
      </ItemGroup>
    </ItemListFrame>
  ),
};

export const NotificationItem: Story = {
  name: "ERP — Notification Item",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame>
      <ItemGroup>
        {NOTIFICATIONS.map((note, index) => (
          <Fragment key={note.id}>
            <Item size="sm" variant="default">
              <IconMedia icon={BellIcon} />
              <ItemContent>
                <StoryRow align="center" justify="between" wrap>
                  <ItemTitle>{note.title}</ItemTitle>
                  <span className="text-muted-foreground text-xs">
                    {note.time}
                  </span>
                </StoryRow>
                <ItemDescription>{note.body}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge emphasis="soft" size="sm" tone={statusTone(note.tone)}>
                  {note.tone}
                </Badge>
              </ItemActions>
            </Item>
            {index < NOTIFICATIONS.length - 1 ? <ItemSeparator /> : null}
          </Fragment>
        ))}
      </ItemGroup>
    </ItemListFrame>
  ),
};

export const VendorContactRow: Story = {
  name: "ERP — Vendor Contact Row",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame>
      <Item variant="outline">
        <IconMedia icon={Building2Icon} />
        <ItemContent>
          <ItemTitle>FastCo Industrial</ItemTitle>
          <ItemDescription>
            Preferred vendor · Net 30 · procurement@fastco.example
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge emphasis="soft" size="sm" tone="success">
            Preferred
          </Badge>
          <Button emphasis="ghost" intent="quiet" presentation="icon" size="sm">
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const InventoryAlertRow: Story = {
  name: "ERP — Inventory Alert Row",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame width="lg">
      <Item variant="muted">
        <IconMedia icon={AlertTriangleIcon} />
        <ItemContent>
          <ItemTitle>Low stock · SKU-8820</ItemTitle>
          <ItemDescription>
            Stainless Steel Bolts M8 · 42 units remaining · reorder at 150
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge emphasis="soft" size="sm" tone="warning">
            Reorder
          </Badge>
          <Button emphasis="solid" intent="primary" size="sm">
            Create PO
          </Button>
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const ShipmentStatusRow: Story = {
  name: "ERP — Shipment Status Row",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame>
      <Item variant="outline">
        <IconMedia icon={TruckIcon} />
        <ItemContent>
          <ItemTitle>SHP-8842 · In transit</ItemTitle>
          <ItemDescription>
            FedEx Freight · ETA Jun 24, 2026 · Warehouse B · Dock 3
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge emphasis="soft" size="sm" tone="info">
            Tracking
          </Badge>
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const ActivityFeedItem: Story = {
  name: "ERP — Activity Feed Item",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame width="lg">
      <Item size="sm" variant="default">
        <ItemMedia>
          <Avatar size="sm">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Jane Doe approved PO-2026-1184</ItemTitle>
          <ItemDescription>2 min ago · Procurement workflow</ItemDescription>
        </ItemContent>
        <ItemActions>
          <span className="text-muted-foreground text-xs">2 min ago</span>
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const IntegrationStatusRow: Story = {
  name: "ERP — Integration Status Row",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame width="lg">
      <Item variant="outline">
        <IconMedia icon={WebhookIcon} />
        <ItemContent>
          <ItemTitle>NetSuite connector</ItemTitle>
          <ItemDescription>
            Last sync Jun 21, 2026 · 08:00 UTC · 142 records pushed
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge emphasis="soft" size="sm" tone="success">
            Connected
          </Badge>
          <Button emphasis="outline" intent="secondary" size="sm">
            Configure
          </Button>
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const DocumentAttachmentRow: Story = {
  name: "ERP — Document Attachment Row",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame>
      <Item size="sm" variant="outline">
        <IconMedia icon={FileTextIcon} />
        <ItemContent>
          <ItemTitle>PO-2026-1184.pdf</ItemTitle>
          <ItemDescription>3 pages · uploaded by Jane Doe</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button emphasis="outline" intent="secondary" size="sm">
            Preview
          </Button>
          <Button emphasis="ghost" intent="secondary" size="sm">
            Download
          </Button>
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const TaskQueueItem: Story = {
  name: "ERP — Task Queue Item",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame width="lg">
      <Item variant="muted">
        <IconMedia icon={UserIcon} />
        <ItemContent>
          <ItemTitle>Review expense claim EXP-2026-0421</ItemTitle>
          <ItemDescription>
            Assigned to you · due today · Finance approval step
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge emphasis="soft" size="sm" tone="danger">
            Due today
          </Badge>
          <Button emphasis="solid" intent="primary" size="sm">
            Open Task
          </Button>
        </ItemActions>
      </Item>
    </ItemListFrame>
  ),
};

export const CompactDropdownRows: Story = {
  name: "ERP — Compact Dropdown Rows",
  parameters: { layout: "padded" },
  render: () => (
    <ItemListFrame width="sm">
      <StoryStack className="rounded-lg border border-border" padding="xs">
        <Item size="xs" variant="default">
          <IconMedia icon={FileTextIcon} />
          <ItemContent>
            <ItemTitle>View invoice</ItemTitle>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item size="xs" variant="default">
          <IconMedia icon={CheckCircle2Icon} />
          <ItemContent>
            <ItemTitle>Approve</ItemTitle>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item size="xs" variant="default">
          <IconMedia icon={PackageIcon} />
          <ItemContent>
            <ItemTitle>Create PO from lines</ItemTitle>
          </ItemContent>
        </Item>
      </StoryStack>
    </ItemListFrame>
  ),
};
