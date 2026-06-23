import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BellIcon,
  HistoryIcon,
  PaperclipIcon,
} from "lucide-react";
import {
  ATTACHMENTS,
  AUDIT_EVENTS,
  FILTER_CHIPS,
  formatCurrency,
  INVOICE_RECORDS,
  KPI_METRICS,
  MODULE_LINKS,
  MutedCaption,
  NOTIFICATIONS,
  PO_LINE_ITEMS,
  RELEASE_TAGS,
  ScrollAreaShell,
  SectionTitle,
  TEAM_MEMBERS,
  TRANSACTIONS,
  WAREHOUSE_BINS,
} from "./_storybook/scroll-area-story.compositions";
import {
  StoryCaption,
  StoryFrame,
  StoryRow,
  StoryStack,
} from "./_storybook/story-frame";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

const meta = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix ScrollArea for ERP overflow surfaces — sidebar navigation, audit logs, notification feeds, record pickers, and constrained panel bodies. Prefer ScrollArea over raw `overflow-auto` when custom scrollbars must match the design system.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ScrollAreaShell width="w-48">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Release tags</SectionTitle>
        {RELEASE_TAGS.map((tag) => (
          <StoryStack gap="sm" key={tag}>
            <span className="text-sm">{tag}</span>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const FixedHeight: Story = {
  name: "ScrollArea — Fixed Height",
  render: () => (
    <ScrollAreaShell height="h-64">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Scrollable content</SectionTitle>
        {Array.from({ length: 24 }, (_, index) => (
          <span className="text-sm" key={`row-${index}`}>
            Row {index + 1} — sample register entry
          </span>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const WithSeparators: Story = {
  name: "ScrollArea — With Separators",
  render: () => (
    <ScrollAreaShell>
      <StoryStack gap="md" padding="md">
        <SectionTitle>Version history</SectionTitle>
        {RELEASE_TAGS.slice(0, 20).map((tag) => (
          <StoryStack gap="sm" key={tag}>
            <StoryRow justify="between">
              <span className="text-sm">{tag}</span>
              <MutedCaption>Deployed</MutedCaption>
            </StoryRow>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const CompactHeight: Story = {
  name: "ScrollArea — Compact Height",
  render: () => (
    <ScrollAreaShell height="h-48" width="max-w-md">
      <StoryStack gap="xs" padding="sm">
        {INVOICE_RECORDS.map(({ id, customer }) => (
          <StoryRow justify="between" key={id}>
            <span className="font-mono text-xs">{id}</span>
            <span className="text-muted-foreground text-xs">{customer}</span>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const HorizontalContent: Story = {
  name: "ScrollArea — Horizontal Content",
  parameters: {
    docs: {
      description: {
        story:
          "Wide inline content scrolls within the viewport. The governed root mounts a vertical scrollbar by default; horizontal overflow uses native viewport scrolling.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <ScrollArea className="w-full rounded-md border border-border">
        <StoryRow className="w-max" gap="sm" padding="sm">
          {FILTER_CHIPS.map((chip) => (
            <Badge emphasis="soft" key={chip} tone="neutral">
              {chip}
            </Badge>
          ))}
        </StoryRow>
      </ScrollArea>
    </StoryFrame>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    docs: {
      description: {
        story:
          "Consumer `data-*` props cannot override governed ScrollArea root or viewport attributes.",
      },
    },
  },
  render: () => (
    <ScrollArea
      className="h-32 w-full rounded-md border border-border"
      data-component="Override"
      data-recipe="override"
      data-slot="override"
      data-state="fake"
      state="ready"
    >
      <StoryStack gap="xs" padding="sm">
        <span className="text-sm">Governed scroll viewport content</span>
      </StoryStack>
    </ScrollArea>
  ),
};

export const GovernanceStates: Story = {
  name: "Governance — States",
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        {GOVERNED_STATES.map((state) => (
          <StoryRow align="start" gap="md" key={state}>
            <StoryCaption width="sm">{state}</StoryCaption>
            <ScrollArea
              className="h-32 min-w-0 flex-1 rounded-md border border-border"
              state={state}
            >
              <StoryStack gap="xs" padding="sm">
                {Array.from({ length: 8 }, (_, index) => (
                  <span className="text-sm" key={`${state}-${index}`}>
                    {state} row {index + 1}
                  </span>
                ))}
              </StoryStack>
            </ScrollArea>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP usage ───────────────────────────────────────────────────────────────

export const SidebarNavigation: Story = {
  name: "ERP — Sidebar Navigation",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="sm" height="h-96" width="w-48">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Modules</SectionTitle>
        {MODULE_LINKS.map(({ id, label, icon: Icon, count }) => (
          <StoryRow justify="between" key={id}>
            <StoryRow gap="sm">
              <Icon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm">{label}</span>
            </StoryRow>
            <Badge emphasis="soft" tone="neutral">
              {count}
            </Badge>
          </StoryRow>
        ))}
        {MODULE_LINKS.map(({ id, label, icon: Icon }) => (
          <StoryRow gap="sm" key={`extra-${id}`}>
            <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {label} archive
            </span>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const AuditEventLog: Story = {
  name: "ERP — Audit Event Log",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md" height="h-80">
      <StoryStack gap="md" padding="md">
        <StoryRow align="center" gap="sm">
          <HistoryIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <SectionTitle>PO-1042 audit trail</SectionTitle>
        </StoryRow>
        {AUDIT_EVENTS.map(({ id, actor, action, timestamp }) => (
          <StoryStack gap="xs" key={id}>
            <StoryRow justify="between">
              <span className="font-medium text-sm">{actor}</span>
              <MutedCaption>{timestamp}</MutedCaption>
            </StoryRow>
            <span className="text-sm">{action}</span>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const ActivityFeed: Story = {
  name: "ERP — Activity Feed",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="md" padding="md">
        <SectionTitle>Comments · PO-1042</SectionTitle>
        {AUDIT_EVENTS.slice(0, 4).map(({ id, actor, action, timestamp }) => (
          <StoryRow align="start" gap="sm" key={id}>
            <Avatar size="sm">
              <AvatarFallback>
                {actor
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <StoryStack gap="xs">
              <StoryRow gap="sm">
                <span className="font-medium text-sm">{actor}</span>
                <MutedCaption>{timestamp}</MutedCaption>
              </StoryRow>
              <span className="text-sm">{action}</span>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const NotificationList: Story = {
  name: "ERP — Notification List",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md" height="h-80">
      <StoryStack gap="sm" padding="md">
        <StoryRow align="center" gap="sm">
          <BellIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
          <SectionTitle>Notifications</SectionTitle>
        </StoryRow>
        {NOTIFICATIONS.map(({ id, title, body, time, unread }) => (
          <StoryStack gap="xs" key={id}>
            <StoryRow justify="between">
              <span className="font-medium text-sm">{title}</span>
              {unread ? (
                <Badge emphasis="solid" tone="info">
                  New
                </Badge>
              ) : null}
            </StoryRow>
            <span className="text-muted-foreground text-sm">{body}</span>
            <MutedCaption>{time}</MutedCaption>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const RecordPickerList: Story = {
  name: "ERP — Record Picker List",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="xs" padding="sm">
        <SectionTitle>Select invoice</SectionTitle>
        {INVOICE_RECORDS.map(({ id, customer, amount, status }) => (
          <StoryRow justify="between" key={id}>
            <StoryStack gap="xs">
              <span className="font-mono text-sm">{id}</span>
              <MutedCaption>{customer}</MutedCaption>
            </StoryStack>
            <StoryStack gap="xs">
              <Badge
                emphasis="soft"
                tone={
                  status === "Overdue"
                    ? "danger"
                    : status === "Pending"
                      ? "warning"
                      : "neutral"
                }
              >
                {status}
              </Badge>
              <span className="text-right text-sm tabular-nums">
                {formatCurrency(amount)}
              </span>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const FilterChipRail: Story = {
  name: "ERP — Filter Chip Rail",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <SectionTitle>Register filters</SectionTitle>
        <ScrollArea className="w-full rounded-md border border-border">
          <StoryRow className="w-max" gap="sm" padding="sm">
            {FILTER_CHIPS.map((chip) => (
              <Badge emphasis="outline" key={chip} tone="neutral">
                {chip}
              </Badge>
            ))}
          </StoryRow>
        </ScrollArea>
      </StoryStack>
    </StoryFrame>
  ),
};

export const POLineItemsPanel: Story = {
  name: "ERP — PO Line Items Panel",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md" height="h-64">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>PO-1042 lines</SectionTitle>
        {PO_LINE_ITEMS.map(({ line, sku, desc, qty }) => (
          <StoryStack gap="xs" key={line}>
            <StoryRow justify="between">
              <span className="font-mono text-xs">{sku}</span>
              <span className="text-muted-foreground text-xs">Line {line}</span>
            </StoryRow>
            <StoryRow justify="between">
              <span className="text-sm">{desc}</span>
              <span className="text-sm tabular-nums">Qty {qty}</span>
            </StoryRow>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const ApprovalQueueInbox: Story = {
  name: "ERP — Approval Queue Inbox",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Awaiting approval</SectionTitle>
        {INVOICE_RECORDS.map(({ id, customer, amount, status }) => (
          <StoryStack gap="xs" key={id}>
            <StoryRow justify="between">
              <span className="font-mono text-sm">{id}</span>
              <Badge emphasis="soft" tone="warning">
                {status}
              </Badge>
            </StoryRow>
            <StoryRow justify="between">
              <span className="text-muted-foreground text-sm">{customer}</span>
              <span className="font-medium text-sm tabular-nums">
                {formatCurrency(amount)}
              </span>
            </StoryRow>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const WarehouseBinList: Story = {
  name: "ERP — Warehouse Bin List",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md" height="h-72">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Bin locations</SectionTitle>
        {WAREHOUSE_BINS.map(({ id, sku, qty, location }) => (
          <StoryRow justify="between" key={id}>
            <StoryStack gap="xs">
              <span className="font-mono text-xs">{sku}</span>
              <MutedCaption>{location}</MutedCaption>
            </StoryStack>
            <Badge emphasis="soft" tone={qty < 50 ? "warning" : "success"}>
              {qty} on hand
            </Badge>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const SettingsMenu: Story = {
  name: "ERP — Settings Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="sm" height="h-80" width="w-48">
      <StoryStack gap="xs" padding="md">
        <SectionTitle>Settings</SectionTitle>
        {[
          "Organization profile",
          "Users & roles",
          "Approval workflows",
          "Integrations",
          "API keys",
          "Webhooks",
          "Notifications",
          "Billing",
          "Audit retention",
          "Data export",
        ].map((item) => (
          <span className="text-sm" key={item}>
            {item}
          </span>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const TransactionHistory: Story = {
  name: "ERP — Transaction History",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Recent transactions</SectionTitle>
        {TRANSACTIONS.map(({ id, desc, amount, date }) => (
          <StoryRow justify="between" key={id}>
            <StoryStack gap="xs">
              <span className="text-sm">{desc}</span>
              <MutedCaption>{id}</MutedCaption>
            </StoryStack>
            <StoryStack gap="xs">
              <span
                className={
                  amount < 0
                    ? "text-destructive text-sm tabular-nums"
                    : "text-sm tabular-nums"
                }
              >
                {amount < 0 ? "−" : "+"}
                {formatCurrency(amount)}
              </span>
              <MutedCaption>{date}</MutedCaption>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const TeamMemberRoster: Story = {
  name: "ERP — Team Member Roster",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="md" padding="md">
        <SectionTitle>Assign to</SectionTitle>
        {TEAM_MEMBERS.map(({ id, name, role, dept }) => (
          <StoryRow align="center" gap="sm" key={id}>
            <Avatar size="sm">
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <StoryStack gap="xs">
              <span className="font-medium text-sm">{name}</span>
              <MutedCaption>{`${role} · ${dept}`}</MutedCaption>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const DocumentAttachments: Story = {
  name: "ERP — Document Attachments",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="md" height="h-48">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Attachments</SectionTitle>
        {ATTACHMENTS.map(({ id, name, size }) => (
          <StoryRow gap="sm" key={id}>
            <PaperclipIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <StoryStack gap="xs">
              <span className="text-sm">{name}</span>
              <MutedCaption>{size}</MutedCaption>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const KpiMetricsColumn: Story = {
  name: "ERP — KPI Metrics Column",
  parameters: { layout: "padded" },
  render: () => (
    <ScrollAreaShell frameWidth="sm" height="h-80" width="w-48">
      <StoryStack gap="md" padding="md">
        <SectionTitle>Today</SectionTitle>
        {KPI_METRICS.map(({ label, value, delta }) => (
          <StoryStack gap="xs" key={label}>
            <MutedCaption>{label}</MutedCaption>
            <span className="font-semibold text-lg tabular-nums">{value}</span>
            <span className="text-muted-foreground text-xs">{delta}</span>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Keyboard & Focus",
  parameters: {
    docs: {
      description: {
        story:
          "ScrollArea viewport content remains keyboard-scrollable. Pair with visible headings and list semantics in production sidebars and pickers.",
      },
    },
  },
  render: () => (
    <ScrollAreaShell frameWidth="md">
      <StoryStack gap="sm" padding="md">
        <SectionTitle>Keyboard-scrollable list</SectionTitle>
        <span className="text-muted-foreground text-sm">
          Tab into the panel and use arrow keys or Page Up/Down when focus is
          inside the scrollable region.
        </span>
        {Array.from({ length: 16 }, (_, index) => (
          <span className="text-sm" key={`a11y-${index}`}>
            Focusable row {index + 1}
          </span>
        ))}
      </StoryStack>
    </ScrollAreaShell>
  ),
};
