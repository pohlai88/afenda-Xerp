import React from "react";
import {
  GOVERNED_AVATAR_SIZES,
  GOVERNED_STATES,
  STATUS_TONES,
} from "@afenda/ui/governance";
import type { StatusTone } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Building2Icon,
  CheckCircle2Icon,
  ChevronRightIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { StoryFrame, StoryInset, StoryRow, StoryStack } from "./_storybook/story-frame";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// ─── Helpers ───────────────────────────────────────────────────────────────

type PresenceStatus =
  | "online"
  | "away"
  | "busy"
  | "offline"
  | "done"
  | "pending"
  | "waiting";

function presenceTone(status: PresenceStatus): StatusTone {
  if (status === "online" || status === "done") {
    return "success";
  }
  if (status === "away" || status === "pending") {
    return "warning";
  }
  if (status === "busy") {
    return "danger";
  }
  return "neutral";
}

function StatusAvatar({
  initials,
  size = "default",
  status,
}: {
  readonly initials: string;
  readonly size?: "default" | "lg" | "sm";
  readonly status: PresenceStatus;
}) {
  return (
    <Avatar size={size}>
      <AvatarFallback>{initials}</AvatarFallback>
      <AvatarBadge aria-hidden="true" tone={presenceTone(status)} />
    </Avatar>
  );
}

function memberBadgeTone(i: number): "success" | "warning" | "neutral" {
  if (i === 0) {
    return "success";
  }
  if (i === 2) {
    return "warning";
  }
  return "neutral";
}

function memberBadgeLabel(i: number): string {
  if (i === 0) {
    return "Active";
  }
  if (i === 2) {
    return "On Leave";
  }
  return "Active";
}

// ─── Avatar ────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed avatar for ERP user profiles, assignee chips, approval chains, and team displays. Supports `AvatarImage`, `AvatarFallback`, `AvatarBadge`, and `AvatarGroup`.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: [...GOVERNED_AVATAR_SIZES],
      table: { defaultValue: { summary: "default" } },
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      table: { defaultValue: { summary: "ready" } },
    },
  },
  args: {
    size: "default",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sample data ───────────────────────────────────────────────────────────

const TEAM = [
  {
    initials: "JD",
    name: "Jane Doe",
    role: "Senior Engineer",
    dept: "Engineering",
  },
  {
    initials: "AB",
    name: "Alex Brown",
    role: "Product Manager",
    dept: "Product",
  },
  { initials: "SC", name: "Sam Chen", role: "Design Lead", dept: "Design" },
  { initials: "MK", name: "Maria Kim", role: "QA Engineer", dept: "Quality" },
  {
    initials: "OT",
    name: "Omar Tan",
    role: "DevOps Engineer",
    dept: "Infrastructure",
  },
] as const;

const PURCHASE_ORDERS = [
  {
    id: "PO-1042",
    vendor: "Acme Supplies",
    assignee: TEAM[0],
    status: "Pending Approval",
  },
  {
    id: "PO-1041",
    vendor: "Global Parts Co.",
    assignee: TEAM[1],
    status: "Approved",
  },
  {
    id: "PO-1040",
    vendor: "Tech Hardware Ltd",
    assignee: TEAM[2],
    status: "Draft",
  },
] as const;

// ─── Single variant playground ─────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const WithImage: Story = {
  name: "Avatar — With Image",
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage alt="Jane Doe" src="https://github.com/shadcn.png" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  name: "Avatar — Fallback Only",
  render: (args) => (
    <StoryRow align="center" gap="sm">
      {TEAM.map(({ initials, name }) => (
        <Avatar key={name} {...args}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </StoryRow>
  ),
};

export const SmallSize: Story = {
  name: "Size — Small",
  args: { size: "sm" },
  render: (args) => (
    <StoryRow align="center" gap="sm">
      {TEAM.map(({ initials, name }) => (
        <Avatar key={name} {...args}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </StoryRow>
  ),
};

export const LargeSize: Story = {
  name: "Size — Large",
  args: { size: "lg" },
  render: (args) => (
    <StoryRow align="center" gap="sm">
      {TEAM.slice(0, 3).map(({ initials, name }) => (
        <Avatar key={name} {...args}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </StoryRow>
  ),
};

export const AllSizes: Story = {
  name: "Matrix — All Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="md">
      {(["sm", "default", "lg"] as const).map((size) => (
        <StoryStack className="items-center" gap="xs" key={size}>
          <Avatar size={size}>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-xs">
            size=&quot;{size}&quot;
          </span>
        </StoryStack>
      ))}
    </StoryRow>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Avatar images require meaningful `alt` text. Fallback initials and icon avatars must not rely on color alone for meaning.",
      },
    },
  },
  render: () => (
    <StoryRow align="center" gap="lg">
      <StoryStack className="items-center" gap="xs">
        <Avatar>
          <AvatarImage
            alt="Jane Doe, Senior Engineer"
            src="https://github.com/shadcn.png"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-xs">Image + alt</span>
      </StoryStack>
      <StoryStack className="items-center" gap="xs">
        <Avatar>
          <AvatarFallback aria-label="Jane Doe">JD</AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-xs">
          Initials + aria-label
        </span>
      </StoryStack>
      <StoryStack className="items-center" gap="xs">
        <Avatar>
          <AvatarFallback aria-label="Vendor organisation">
            <Building2Icon aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-xs">Icon + aria-label</span>
      </StoryStack>
    </StoryRow>
  ),
};

export const GovernanceStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="md">
          <p className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </p>
          <Avatar state={state}>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const BadgeToneMatrix: Story = {
  name: "Matrix — Badge Tones",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="md" wrap>
      {STATUS_TONES.map((tone) => (
        <StoryStack className="items-center" gap="xs" key={tone}>
          <Avatar>
            <AvatarFallback>{tone.slice(0, 2).toUpperCase()}</AvatarFallback>
            <AvatarBadge aria-hidden="true" tone={tone} />
          </Avatar>
          <span className="font-mono text-muted-foreground text-xs">{tone}</span>
        </StoryStack>
      ))}
    </StoryRow>
  ),
};

// ─── With badges ──────────────────────────────────────────────────────────

export const WithStatusBadge: Story = {
  name: "Avatar — With Status Badge",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="md">
      {(
        [
          { initials: "JD", status: "online" },
          { initials: "AB", status: "away" },
          { initials: "SC", status: "busy" },
          { initials: "MK", status: "offline" },
        ] as const
      ).map(({ initials, status }) => (
        <StoryStack className="items-center" gap="xs" key={initials}>
          <StatusAvatar initials={initials} status={status} />
          <span className="text-muted-foreground text-xs">{status}</span>
        </StoryStack>
      ))}
    </StoryRow>
  ),
};

export const WithVerifiedBadge: Story = {
  name: "Avatar — Verified Account",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="md">
      {TEAM.slice(0, 2).map(({ initials, name }) => (
        <StoryStack className="items-center" gap="xs" key={name}>
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
            <AvatarBadge>
              <CheckCircle2Icon aria-hidden="true" />
            </AvatarBadge>
          </Avatar>
          <span className="font-medium text-xs">{name}</span>
        </StoryStack>
      ))}
    </StoryRow>
  ),
};

export const IconAvatar: Story = {
  name: "Avatar — Icon Fallback",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="md">
      <StoryStack className="items-center" gap="xs">
        <Avatar>
          <AvatarFallback>
            <UserIcon aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-xs">System user</span>
      </StoryStack>
      <StoryStack className="items-center" gap="xs">
        <Avatar>
          <AvatarFallback>
            <Building2Icon aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-xs">Vendor org</span>
      </StoryStack>
    </StoryRow>
  ),
};

export const WithNotificationCount: Story = {
  name: "Avatar — Notification Count",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="lg">
      {[
        { initials: "JD", count: 3 },
        { initials: "AB", count: 12 },
      ].map(({ initials, count }) => (
        <StoryStack className="items-center" gap="xs" key={initials}>
          <div className="relative">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1">
              <Badge emphasis="solid" size="sm" tone="danger">
                <span className="tabular-nums">{count}</span>
              </Badge>
            </div>
          </div>
          <span className="text-muted-foreground text-xs">Unread mentions</span>
        </StoryStack>
      ))}
    </StoryRow>
  ),
};

// ─── Avatar group ─────────────────────────────────────────────────────────

export const AvatarGroupDefault: Story = {
  name: "AvatarGroup — Default",
  parameters: { layout: "padded" },
  render: () => (
    <AvatarGroup>
      {TEAM.map(({ initials, name }) => (
        <Avatar key={name} size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ),
};

export const AvatarGroupWithCount: Story = {
  name: "AvatarGroup — With Overflow Count",
  parameters: { layout: "padded" },
  render: () => (
    <AvatarGroup>
      {TEAM.slice(0, 3).map(({ initials, name }) => (
        <Avatar key={name} size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>
        <span className="tabular-nums">+8</span>
      </AvatarGroupCount>
    </AvatarGroup>
  ),
};

export const AvatarGroupWithTooltips: Story = {
  name: "AvatarGroup — With Tooltips",
  parameters: { layout: "padded" },
  render: () => (
    <TooltipProvider>
      <AvatarGroup>
        {TEAM.slice(0, 4).map(({ initials, name, role }) => (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{name}</p>
              <p className="text-muted-foreground text-xs">{role}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    </TooltipProvider>
  ),
};

export const AvatarGroupWithDropdown: Story = {
  name: "AvatarGroup — Overflow Dropdown",
  parameters: { layout: "padded" },
  render: () => (
    <AvatarGroup>
      {TEAM.slice(0, 3).map(({ initials, name }) => (
        <Avatar key={name} size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AvatarGroupCount>+2</AvatarGroupCount>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Additional stakeholders</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {TEAM.slice(3).map(({ initials, name, role }) => (
            <DropdownMenuItem key={name}>
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <StoryStack gap="xs">
                <span className="font-medium text-sm">{name}</span>
                <span className="text-muted-foreground text-xs">{role}</span>
              </StoryStack>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </AvatarGroup>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const AssigneeChip: Story = {
  name: "ERP — Assignee Chip",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      {TEAM.slice(0, 3).map(({ initials, name, role }) => (
        <StoryInset key={name} padding="sm">
          <StoryRow align="center" gap="sm">
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <StoryStack gap="xs">
              <span className="font-medium text-sm">{name}</span>
              <span className="text-muted-foreground text-xs">{role}</span>
            </StoryStack>
          </StoryRow>
        </StoryInset>
      ))}
    </StoryStack>
  ),
};

export const TeamMemberList: Story = {
  name: "ERP — Team Member List",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="xs">
        {TEAM.map(({ initials, name, role, dept }, i) => (
          <StoryRow
            align="center"
            className="rounded-md hover:bg-muted/40"
            justify="between"
            key={name}
            paddingX="sm"
            paddingY="sm"
          >
            <StoryRow align="center" gap="md">
              <StatusAvatar
                initials={initials}
                size="sm"
                status={i === 2 ? "away" : "online"}
              />
              <StoryStack gap="xs">
                <p className="font-medium text-sm">{name}</p>
                <p className="text-muted-foreground text-xs">
                  {role} · {dept}
                </p>
              </StoryStack>
            </StoryRow>
            <Badge emphasis="soft" size="sm" tone={memberBadgeTone(i)}>
              {memberBadgeLabel(i)}
            </Badge>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const ApprovalChain: Story = {
  name: "ERP — Approval Chain",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="md" wrap>
        {(
          [
            {
              initials: "JD",
              label: "Submitted by",
              name: "Jane Doe",
              status: "done",
            },
            {
              initials: "AB",
              label: "Reviewed by",
              name: "Alex Brown",
              status: "done",
            },
            {
              initials: "SC",
              label: "Pending approval",
              name: "Sam Chen",
              status: "pending",
            },
            {
              initials: "MK",
              label: "Final approval",
              name: "Maria Kim",
              status: "waiting",
            },
          ] as const
        ).map(({ initials, label, name, status }, i) => (
          <StoryRow align="center" gap="sm" key={name}>
            {i > 0 && (
              <ChevronRightIcon className="size-4 text-muted-foreground" />
            )}
            <StoryStack className="items-center" gap="xs">
              <StatusAvatar initials={initials} size="sm" status={status} />
              <span className="text-muted-foreground text-xs">{label}</span>
              <span className="font-medium text-xs">{name.split(" ")[0]}</span>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryRow>
    </StoryFrame>
  ),
};

export const RecordOwnerHeader: Story = {
  name: "ERP — Record Owner Header",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" justify="between">
        <StoryStack gap="xs">
          <span className="font-mono text-muted-foreground text-xs tabular-nums">
            INV-2024-0892
          </span>
          <span className="font-semibold text-lg tracking-tight">
            Vendor Payment — Acme Supplies
          </span>
        </StoryStack>
        <StoryInset padding="sm">
          <StoryRow align="center" gap="sm">
            <Avatar size="sm">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <StoryStack gap="xs">
              <span className="text-muted-foreground text-xs">Record owner</span>
              <span className="font-medium text-sm">Jane Doe</span>
            </StoryStack>
          </StoryRow>
        </StoryInset>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ActivityFeed: Story = {
  name: "ERP — Activity Feed",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        {[
          {
            initials: "AB",
            action: "approved purchase order PO-1042",
            time: "2 min ago",
          },
          {
            initials: "SC",
            action: "added a comment on invoice INV-0892",
            time: "18 min ago",
          },
          {
            initials: "MK",
            action: "uploaded attachment to employee record",
            time: "1 hr ago",
          },
        ].map(({ initials, action, time }) => (
          <StoryRow align="start" gap="sm" key={action} paddingY="xs">
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <StoryStack gap="xs">
              <p className="text-sm">
                <span className="font-medium">
                  {initials === "AB"
                    ? "Alex Brown"
                    : initials === "SC"
                      ? "Sam Chen"
                      : "Maria Kim"}
                </span>{" "}
                {action}
              </p>
              <span className="text-muted-foreground text-xs">{time}</span>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const UserPickerChips: Story = {
  name: "ERP — User Picker Chips",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <span className="font-medium text-sm">Notify on approval</span>
        <StoryRow gap="sm" wrap>
          {TEAM.slice(0, 3).map(({ initials, name }) => (
            <StoryRow
              align="center"
              className="rounded-full border border-border"
              gap="xs"
              key={name}
              paddingX="sm"
              paddingY="xs"
            >
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{name.split(" ")[0]}</span>
            </StoryRow>
          ))}
          <Button emphasis="outline" intent="secondary" size="sm">
            + Add recipient
          </Button>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const VendorContact: Story = {
  name: "ERP — Vendor Contact",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryInset padding="md">
        <StoryRow align="center" gap="md">
          <Avatar size="lg">
            <AvatarFallback>
              <Building2Icon aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <StoryStack gap="xs">
            <span className="font-semibold">Acme Supplies Ltd</span>
            <span className="text-muted-foreground text-sm">
              Primary contact: Sarah Mitchell
            </span>
            <StoryRow gap="md">
              <StoryRow align="center" gap="xs">
                <MailIcon className="size-3 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">
                  sarah@acme.example
                </span>
              </StoryRow>
              <StoryRow align="center" gap="xs">
                <PhoneIcon className="size-3 text-muted-foreground" />
                <span className="text-muted-foreground text-xs tabular-nums">
                  +1 555-0142
                </span>
              </StoryRow>
            </StoryRow>
          </StoryStack>
        </StoryRow>
      </StoryInset>
    </StoryFrame>
  ),
};

export const TableAssigneeColumn: Story = {
  name: "ERP — Table Assignee Column",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Table size="sm">
        <TableHeader>
          <TableRow>
            <TableHead>PO Number</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PURCHASE_ORDERS.map(({ id, vendor, assignee, status }) => (
            <TableRow key={id}>
              <TableCell>
                <span className="font-mono text-sm tabular-nums">{id}</span>
              </TableCell>
              <TableCell>{vendor}</TableCell>
              <TableCell>
                <StoryRow align="center" gap="sm">
                  <Avatar size="sm">
                    <AvatarFallback>{assignee.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{assignee.name}</span>
                </StoryRow>
              </TableCell>
              <TableCell>
                <Badge
                  emphasis="soft"
                  size="sm"
                  tone={
                    status === "Approved"
                      ? "success"
                      : status === "Draft"
                        ? "neutral"
                        : "warning"
                  }
                >
                  {status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StoryFrame>
  ),
};

export const ProjectStakeholders: Story = {
  name: "ERP — Project Stakeholders",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" justify="between">
          <span className="font-medium text-sm">ERP Migration — Phase 2</span>
          <Badge emphasis="soft" size="sm" tone="info">
            8 stakeholders
          </Badge>
        </StoryRow>
        <TooltipProvider>
          <AvatarGroup>
            {TEAM.map(({ initials, name, role }) => (
              <Tooltip key={name}>
                <TooltipTrigger asChild>
                  <Avatar size="sm">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{name}</p>
                  <p className="text-muted-foreground text-xs">{role}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </TooltipProvider>
      </StoryStack>
    </StoryFrame>
  ),
};

export const DelegationOutOfOffice: Story = {
  name: "ERP — Delegation (Out of Office)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryInset padding="md">
        <StoryRow align="center" gap="md">
          <StoryStack className="items-center" gap="xs">
            <StatusAvatar initials="JD" size="lg" status="away" />
            <span className="font-medium text-sm">Jane Doe</span>
            <Badge emphasis="soft" size="sm" tone="warning">
              Out of office
            </Badge>
          </StoryStack>
          <ChevronRightIcon className="size-5 text-muted-foreground" />
          <StoryStack className="items-center" gap="xs">
            <StatusAvatar initials="AB" size="lg" status="online" />
            <span className="font-medium text-sm">Alex Brown</span>
            <Badge emphasis="soft" size="sm" tone="success">
              Acting approver
            </Badge>
          </StoryStack>
          <StoryStack gap="xs">
            <span className="text-muted-foreground text-xs">
              Delegation period
            </span>
            <span className="text-sm tabular-nums">Jun 15 – Jun 28, 2026</span>
            <span className="text-muted-foreground text-xs">
              All PO approvals route to Alex during this period.
            </span>
          </StoryStack>
        </StoryRow>
      </StoryInset>
    </StoryFrame>
  ),
};

export const CustomerAccountManager: Story = {
  name: "ERP — Customer Account Manager",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <span className="font-medium text-sm">
          Northwind Traders — Account team
        </span>
        <StoryInset padding="md">
          <StoryRow align="center" gap="md">
            <Avatar size="lg">
              <AvatarImage
                alt="Account manager"
                src="https://github.com/shadcn.png"
              />
              <AvatarFallback>SC</AvatarFallback>
              <AvatarBadge aria-hidden="true" tone="success" />
            </Avatar>
            <StoryStack gap="xs">
              <StoryRow align="center" gap="sm">
                <span className="font-semibold">Sam Chen</span>
                <Badge emphasis="soft" size="sm" tone="info">
                  Account Manager
                </Badge>
              </StoryRow>
              <span className="text-muted-foreground text-sm">
                Enterprise accounts · APAC region
              </span>
              <StoryRow gap="sm">
                <Button emphasis="outline" intent="secondary" size="sm">
                  <MailIcon />
                  Email
                </Button>
                <Button emphasis="ghost" intent="secondary" size="sm">
                  View profile
                </Button>
              </StoryRow>
            </StoryStack>
          </StoryRow>
        </StoryInset>
      </StoryStack>
    </StoryFrame>
  ),
};

export const EmployeeProfileHeader: Story = {
  name: "ERP — Employee Profile Header",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryRow align="center" gap="lg">
        <Avatar size="lg">
          <AvatarImage alt="Jane Doe" src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
          <AvatarBadge aria-hidden="true" tone="success" />
        </Avatar>
        <StoryStack gap="xs">
          <StoryRow align="center" gap="sm">
            <span className="font-semibold text-xl tracking-tight">Jane Doe</span>
            <Badge emphasis="soft" size="sm" tone="success">
              Active
            </Badge>
          </StoryRow>
          <span className="text-muted-foreground text-sm">
            Senior Engineer · Engineering ·{" "}
            <span className="tabular-nums">EMP-0042</span>
          </span>
          <StoryRow gap="sm">
            <Badge emphasis="outline" size="sm" tone="neutral">
              Full-time
            </Badge>
            <Badge emphasis="outline" size="sm" tone="neutral">
              Sydney, AU
            </Badge>
          </StoryRow>
        </StoryStack>
      </StoryRow>
    </StoryFrame>
  ),
};

export const MentionInComment: Story = {
  name: "ERP — Mention in Comment",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="start" gap="sm">
        <Avatar size="sm">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <StoryStack className="flex-1" gap="xs">
          <StoryRow align="center" gap="sm">
            <span className="font-medium text-sm">Alex Brown</span>
            <span className="text-muted-foreground text-xs">
              Today at 14:32
            </span>
          </StoryRow>
          <StoryInset padding="md">
            <span className="text-sm">
              Can{" "}
              <span className="inline-flex items-center gap-1">
                <Avatar size="sm">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="font-medium text-primary">@Jane Doe</span>
              </span>{" "}
              review the updated budget figures before Friday&apos;s board
              meeting?
            </span>
          </StoryInset>
        </StoryStack>
      </StoryRow>
    </StoryFrame>
  ),
};

export const NotificationActor: Story = {
  name: "ERP — Notification Actor",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {[
          {
            initials: "MK",
            message: "assigned you to review PO-1042",
            time: "Just now",
            unread: true,
          },
          {
            initials: "OT",
            message: "mentioned you in a comment on INV-0892",
            time: "12 min ago",
            unread: true,
          },
          {
            initials: "SC",
            message: "approved your expense report EXP-331",
            time: "2 hr ago",
            unread: false,
          },
        ].map(({ initials, message, time, unread }) => (
          <StoryRow
            align="start"
            className={unread ? "rounded-md bg-muted/30" : ""}
            gap="sm"
            key={message}
            padding="sm"
          >
            <div className="relative">
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              {unread ? (
                <span className="absolute top-0 right-0 size-2 rounded-full bg-primary" />
              ) : null}
            </div>
            <StoryStack gap="xs">
              <p className="text-sm">
                <span className="font-medium">
                  {initials === "MK"
                    ? "Maria Kim"
                    : initials === "OT"
                      ? "Omar Tan"
                      : "Sam Chen"}
                </span>{" "}
                {message}
              </p>
              <span className="text-muted-foreground text-xs">{time}</span>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};
