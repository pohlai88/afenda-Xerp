import React from "react";
import {
  DENSITIES,
  GOVERNED_PANEL_RADII,
  GOVERNED_PANEL_SHADOWS,
  GOVERNED_STATES,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Building2Icon,
  FileTextIcon,
  MapPinIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { Separator } from "./separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// ─── Helpers ───────────────────────────────────────────────────────────────

const AVATAR_URL = "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png";

function MetaRow({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <StoryRow align="start" justify="between">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-right text-xs">{children}</span>
    </StoryRow>
  );
}

function RecordLinkTrigger({ children }: { readonly children: ReactNode }) {
  return (
    <Button emphasis="ghost" intent="primary" size="sm">
      {children}
    </Button>
  );
}

function HoverCardPanel({
  children,
  width = "w-72",
}: {
  readonly children: ReactNode;
  readonly width?: string;
}) {
  return (
    <HoverCardContent>
      <div className={width}>{children}</div>
    </HoverCardContent>
  );
}

function UserIdentity({
  initials,
  name,
  subtitle,
  imageSrc,
}: {
  readonly initials: string;
  readonly name: string;
  readonly subtitle: string;
  readonly imageSrc?: string;
}) {
  return (
    <StoryRow align="center" gap="sm">
      <Avatar size="lg">
        {imageSrc ? <AvatarImage alt={name} src={imageSrc} /> : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <StoryStack gap="xs">
        <span className="font-semibold text-sm">{name}</span>
        <span className="text-muted-foreground text-xs">{subtitle}</span>
      </StoryStack>
    </StoryRow>
  );
}

function HoverCardStateProbe({
  state,
}: {
  readonly state: (typeof GOVERNED_STATES)[number];
}) {
  return (
    <StoryFrame width="md">
      <p className="font-mono text-muted-foreground text-xs">
        state=&quot;{state}&quot;
      </p>
      <HoverCard open>
        <HoverCardTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Governed state probe
          </Button>
        </HoverCardTrigger>
        <HoverCardContent state={state}>
          <span className="text-sm">Inspect `data-state` on hover-card-content.</span>
        </HoverCardContent>
      </HoverCard>
    </StoryFrame>
  );
}

// ─── HoverCard ─────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed hover card for ERP record previews, user profiles, and contextual metadata on hover — without requiring a click. Supports governed `density` / `radius` / `shadow` / `state` on `HoverCardContent`. Use on table links, @mentions, assignee chips, and document references.",
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const OpenByDefault: Story = {
  name: "HoverCard — Open (Canvas Preview)",
  render: () => (
    <HoverCard defaultOpen>
      <HoverCardTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          @jane.doe
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <UserIdentity
          initials="JD"
          name="Jane Doe"
          subtitle="Senior Engineer · Engineering"
        />
      </HoverCardContent>
    </HoverCard>
  ),
};

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          @jane.doe
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <UserIdentity
          initials="JD"
          name="Jane Doe"
          subtitle="Senior Engineer · Engineering"
        />
      </HoverCardContent>
    </HoverCard>
  ),
};

export const SideTop: Story = {
  name: "HoverCard — Side: Top",
  render: () => (
    <StoryFrame width="md">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Hover for preview (top)
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="top">
          <span className="text-sm">Preview opens above the trigger.</span>
        </HoverCardContent>
      </HoverCard>
    </StoryFrame>
  ),
};

export const SideRight: Story = {
  name: "HoverCard — Side: Right",
  render: () => (
    <StoryFrame width="md">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Hover for preview (right)
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="right">
          <span className="text-sm">Preview opens to the right.</span>
        </HoverCardContent>
      </HoverCard>
    </StoryFrame>
  ),
};

export const SideBottom: Story = {
  name: "HoverCard — Side: Bottom",
  render: () => (
    <StoryFrame width="md">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Hover for preview (bottom)
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="bottom">
          <span className="text-sm">Default placement below the trigger.</span>
        </HoverCardContent>
      </HoverCard>
    </StoryFrame>
  ),
};

export const SideLeft: Story = {
  name: "HoverCard — Side: Left",
  render: () => (
    <StoryFrame width="md">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            Hover for preview (left)
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="left">
          <span className="text-sm">Preview opens to the left.</span>
        </HoverCardContent>
      </HoverCard>
    </StoryFrame>
  ),
};

export const OpenDelay: Story = {
  name: "HoverCard — Open Delay",
  render: () => (
    <HoverCard closeDelay={100} openDelay={400}>
      <HoverCardTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          Slow reveal (400ms)
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <span className="text-sm">
          Delayed open reduces accidental previews in dense tables.
        </span>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithAvatarImage: Story = {
  name: "HoverCard — With Avatar Image",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          @jane.doe
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <UserIdentity
          imageSrc={AVATAR_URL}
          initials="JD"
          name="Jane Doe"
          subtitle="Procurement Manager · AP Team"
        />
      </HoverCardContent>
    </HoverCard>
  ),
};

export const LongContent: Story = {
  name: "HoverCard — Long Content",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          aria-label="Tax code help"
          emphasis="ghost"
          intent="quiet"
          presentation="icon"
        >
          <FileTextIcon />
        </Button>
      </HoverCardTrigger>
      <HoverCardPanel width="max-w-xs">
        <StoryStack gap="xs">
          <span className="font-semibold text-sm">GST-AU-10</span>
          <span className="text-muted-foreground text-xs">
            Standard Australian GST at 10%. Applied to taxable supplies unless
            the transaction is zero-rated or input-taxed per ATO guidance.
          </span>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

// ─── ERP record previews ───────────────────────────────────────────────────

export const RecordPreviewInvoice: Story = {
  name: "ERP — Invoice Record Preview",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <RecordLinkTrigger>INV-2026-0042</RecordLinkTrigger>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <StoryRow align="center" justify="between">
            <span className="font-semibold text-sm">
              Invoice #INV-2026-0042
            </span>
            <Badge emphasis="soft" tone="warning">
              Pending
            </Badge>
          </StoryRow>
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Vendor">Acme Software Ltd.</MetaRow>
            <MetaRow label="Amount">
              <span className="font-medium tabular-nums">$4,850.00</span>
            </MetaRow>
            <MetaRow label="Due">Jul 15, 2026</MetaRow>
            <MetaRow label="Submitted by">Jane Doe</MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const UserProfile: Story = {
  name: "ERP — User Profile",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          <StoryRow align="center" gap="xs">
            <Avatar size="sm">
              <AvatarImage alt="Jane Doe" src={AVATAR_URL} />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span>Jane Doe</span>
          </StoryRow>
        </Button>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <UserIdentity
            imageSrc={AVATAR_URL}
            initials="JD"
            name="Jane Doe"
            subtitle="Senior Software Engineer · Singapore"
          />
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Employee ID">EMP-00142</MetaRow>
            <MetaRow label="Start date">Mar 2024</MetaRow>
            <MetaRow label="Status">
              <Badge emphasis="soft" size="sm" tone="success">
                Active
              </Badge>
            </MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const VendorMasterPreview: Story = {
  name: "ERP — Vendor Master",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <RecordLinkTrigger>VND-0042</RecordLinkTrigger>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <StoryRow align="center" gap="sm">
            <Building2Icon className="size-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Acme Supplies Ltd</span>
          </StoryRow>
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Tax ID">12 345 678 901</MetaRow>
            <MetaRow label="Payment terms">Net 30</MetaRow>
            <MetaRow label="AP email">ap@acme.example</MetaRow>
            <MetaRow label="Status">
              <Badge emphasis="soft" size="sm" tone="success">
                Approved
              </Badge>
            </MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const PurchaseOrderPreview: Story = {
  name: "ERP — Purchase Order",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <RecordLinkTrigger>PO-2026-0118</RecordLinkTrigger>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <StoryRow align="center" justify="between">
            <span className="font-semibold text-sm">PO-2026-0118</span>
            <Badge emphasis="soft" tone="info">
              Awaiting receipt
            </Badge>
          </StoryRow>
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Vendor">Global Parts Co.</MetaRow>
            <MetaRow label="Total">
              <span className="tabular-nums">$12,400.00</span>
            </MetaRow>
            <MetaRow label="Buyer">Alex Chen</MetaRow>
            <MetaRow label="Delivery">Aug 3, 2026</MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const CustomerPreview: Story = {
  name: "ERP — Customer",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <RecordLinkTrigger>CUST-0091</RecordLinkTrigger>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <span className="font-semibold text-sm">Northwind Traders</span>
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Segment">Enterprise</MetaRow>
            <MetaRow label="Terms">Net 30</MetaRow>
            <MetaRow label="Open AR">
              <span className="tabular-nums">$28,150.00</span>
            </MetaRow>
            <MetaRow label="Account owner">Sarah Kim</MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const ProductSkuPreview: Story = {
  name: "ERP — Product SKU",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <RecordLinkTrigger>SKU-WDG-442</RecordLinkTrigger>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <StoryRow align="center" gap="sm">
            <PackageIcon className="size-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Industrial Widget 442</span>
          </StoryRow>
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Category">Components</MetaRow>
            <MetaRow label="On hand">
              <span className="tabular-nums">1,240 units</span>
            </MetaRow>
            <MetaRow label="Reorder point">
              <span className="tabular-nums">500</span>
            </MetaRow>
            <MetaRow label="Unit cost">
              <span className="tabular-nums">$18.50</span>
            </MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const GLAccountPreview: Story = {
  name: "ERP — GL Account",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <RecordLinkTrigger>6100</RecordLinkTrigger>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <span className="font-semibold text-sm">6100 — Office Supplies</span>
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Type">Expense</MetaRow>
            <MetaRow label="Fiscal year">FY 2026</MetaRow>
            <MetaRow label="YTD balance">
              <span className="tabular-nums">$42,180.00</span>
            </MetaRow>
            <MetaRow label="Status">
              <Badge emphasis="soft" size="sm" tone="success">
                Active
              </Badge>
            </MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const WarehouseLocationPreview: Story = {
  name: "ERP — Warehouse Location",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <RecordLinkTrigger>WH-SYD-A12</RecordLinkTrigger>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <StoryRow align="center" gap="sm">
            <MapPinIcon className="size-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Sydney · Aisle 12</span>
          </StoryRow>
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Zone">Pick face</MetaRow>
            <MetaRow label="Capacity">
              <span className="tabular-nums">82%</span>
            </MetaRow>
            <MetaRow label="SKUs stored">
              <span className="tabular-nums">38</span>
            </MetaRow>
            <MetaRow label="Last count">Jun 10, 2026</MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const CostCentrePreview: Story = {
  name: "ERP — Cost Centre",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <RecordLinkTrigger>CC-ENG-100</RecordLinkTrigger>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <span className="font-semibold text-sm">CC-ENG-100</span>
          <span className="text-muted-foreground text-xs">
            Engineering — Platform
          </span>
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Manager">Jane Doe</MetaRow>
            <MetaRow label="Budget YTD">
              <span className="tabular-nums">$1.2M / $1.5M</span>
            </MetaRow>
            <MetaRow label="Open POs">
              <span className="tabular-nums">4</span>
            </MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const TaxCodeReference: Story = {
  name: "ERP — Tax Code Reference",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          GST-AU-10
        </Button>
      </HoverCardTrigger>
      <HoverCardPanel width="max-w-xs">
        <StoryStack gap="xs">
          <span className="font-semibold text-sm">GST-AU-10</span>
          <span className="text-muted-foreground text-xs">
            Standard rate 10% · Taxable supplies
          </span>
          <Separator />
          <MetaRow label="Jurisdiction">Australia</MetaRow>
          <MetaRow label="Reporting">BAS Box 1A</MetaRow>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const LinkedDocumentPreview: Story = {
  name: "ERP — Linked Document",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          <StoryRow align="center" gap="xs">
            <FileTextIcon className="size-3.5" />
            <span>contract-v3.pdf</span>
          </StoryRow>
        </Button>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <span className="font-semibold text-sm">contract-v3.pdf</span>
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Uploaded">Jun 12, 2026</MetaRow>
            <MetaRow label="Size">2.4 MB</MetaRow>
            <MetaRow label="Linked to">PO-2026-0118</MetaRow>
            <MetaRow label="Uploaded by">Alex Chen</MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const ApprovalAssignee: Story = {
  name: "ERP — Approval Assignee",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          <StoryRow align="center" gap="xs">
            <Avatar size="sm">
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <span>Alex Chen</span>
            <Badge emphasis="soft" size="sm" tone="warning">
              Pending
            </Badge>
          </StoryRow>
        </Button>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <UserIdentity
            initials="AC"
            name="Alex Chen"
            subtitle="Finance Director · Approver L2"
          />
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Queue">PO approvals</MetaRow>
            <MetaRow label="SLA">2 business days</MetaRow>
            <MetaRow label="Delegated">No</MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const CommentAuthorPreview: Story = {
  name: "ERP — Comment Author",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button emphasis="ghost" intent="quiet" size="sm">
          @sarah.kim
        </Button>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <UserIdentity
            imageSrc="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png"
            initials="SK"
            name="Sarah Kim"
            subtitle="Customer Success · APAC"
          />
          <Separator />
          <span className="text-muted-foreground text-xs">
            Last comment on INV-2026-0042 · 2 hours ago
          </span>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const EmployeeTableCell: Story = {
  name: "ERP — Employee in Table",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button emphasis="ghost" intent="quiet" size="sm">
                    <StoryRow align="center" gap="xs">
                      <Avatar size="sm">
                        <AvatarImage alt="Jane Doe" src={AVATAR_URL} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      Jane Doe
                    </StoryRow>
                  </Button>
                </HoverCardTrigger>
                <HoverCardPanel>
                  <UserIdentity
                    imageSrc={AVATAR_URL}
                    initials="JD"
                    name="Jane Doe"
                    subtitle="EMP-00142 · Engineering"
                  />
                </HoverCardPanel>
              </HoverCard>
            </TableCell>
            <TableCell>Engineering</TableCell>
            <TableCell>
              <Badge emphasis="soft" tone="success">
                Active
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </StoryFrame>
  ),
};

export const TableRowRecordLinks: Story = {
  name: "ERP — Table Record Links",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            {
              id: "INV-2026-0042",
              vendor: "Acme Software",
              amount: "$4,850.00",
              status: "warning" as const,
              statusLabel: "Pending",
            },
            {
              id: "INV-2026-0038",
              vendor: "Global Parts",
              amount: "$1,200.00",
              status: "success" as const,
              statusLabel: "Paid",
            },
          ].map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <RecordLinkTrigger>{row.id}</RecordLinkTrigger>
                  </HoverCardTrigger>
                  <HoverCardPanel>
                    <StoryStack gap="sm">
                      <StoryRow align="center" justify="between">
                        <span className="font-semibold text-sm">{row.id}</span>
                        <Badge emphasis="soft" tone={row.status}>
                          {row.statusLabel}
                        </Badge>
                      </StoryRow>
                      <Separator />
                      <MetaRow label="Vendor">{row.vendor}</MetaRow>
                      <MetaRow label="Amount">{row.amount}</MetaRow>
                    </StoryStack>
                  </HoverCardPanel>
                </HoverCard>
              </TableCell>
              <TableCell>{row.vendor}</TableCell>
              <TableCell>
                <span className="tabular-nums">{row.amount}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StoryFrame>
  ),
};

export const MultiMentionRow: Story = {
  name: "ERP — Multi @Mention",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="xs" wrap>
        {[
          { handle: "@jane.doe", name: "Jane Doe", role: "Engineering" },
          { handle: "@alex.chen", name: "Alex Chen", role: "Finance" },
          { handle: "@sarah.kim", name: "Sarah Kim", role: "Operations" },
        ].map((person) => (
          <HoverCard key={person.handle}>
            <HoverCardTrigger asChild>
              <Button emphasis="ghost" intent="quiet" size="sm">
                {person.handle}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <UserIdentity
                initials={person.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
                name={person.name}
                subtitle={person.role}
              />
            </HoverCardContent>
          </HoverCard>
        ))}
      </StoryRow>
    </StoryFrame>
  ),
};

export const StatusWithDetails: Story = {
  name: "ERP — Status With Details",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge emphasis="soft" tone="warning">
          Pending approval
        </Badge>
      </HoverCardTrigger>
      <HoverCardPanel>
        <StoryStack gap="sm">
          <span className="font-semibold text-sm">Approval pending</span>
          <Separator />
          <StoryStack gap="xs">
            <MetaRow label="Submitted">Jun 18, 2026</MetaRow>
            <MetaRow label="Approver">Alex Chen</MetaRow>
            <MetaRow label="SLA due">Jun 20, 2026</MetaRow>
            <MetaRow label="Step">2 of 3</MetaRow>
          </StoryStack>
        </StoryStack>
      </HoverCardPanel>
    </HoverCard>
  ),
};

export const GovernanceSurfaceVariants: Story = {
  name: "Governance — Surface Variants",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {(
        [
          { label: "standard / md", density: "standard", radius: "md" },
          { label: "compact / sm", density: "compact", radius: "sm" },
          { label: "standard / lg", density: "standard", radius: "lg" },
        ] as const
      ).map(({ label, density, radius }) => (
        <HoverCard key={label} open>
          <HoverCardTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              {label}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent density={density} radius={radius} shadow="overlay">
            <StoryStack gap="xs">
              <span className="font-semibold text-sm">Surface probe</span>
              <span className="text-muted-foreground text-xs">{label}</span>
            </StoryStack>
          </HoverCardContent>
        </HoverCard>
      ))}
    </StoryStack>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` on `HoverCardContent` — governed values (`data-slot="hover-card-content"`, `data-component="HoverCard"`, `data-recipe="surface"`) must win in the DOM.',
      },
    },
  },
  render: () => (
    <HoverCard open>
      <HoverCardTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Data authority probe
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        data-component="Override"
        data-slot="override"
        data-testid="governance-hover-card-content"
      >
        <span className="text-sm">
          Inspect the content root — governed `data-*` attributes must override
          consumer props.
        </span>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Reference map of emitted `data-slot` values from `primitive-registry.ts`. Root role emits `hover-card-content`; portal and trigger use slot keys.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → hover-card-content · trigger → hover-card-trigger · portal →
          hover-card-portal
        </p>
        <HoverCard open>
          <HoverCardTrigger asChild>
            <Button emphasis="outline" intent="secondary" size="sm">
              Inspect slots
            </Button>
          </HoverCardTrigger>
          <HoverCardContent data-testid="slot-map-content">
            <span className="text-sm">
              Open DevTools and verify `data-component`, `data-recipe`, and
              `data-slot` on each hover card part.
            </span>
          </HoverCardContent>
        </HoverCard>
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <HoverCardStateProbe key={state} state={state} />
      ))}
    </StoryStack>
  ),
};

export const GovernancePlayground: Story = {
  name: "Governance — Playground",
  parameters: { layout: "padded" },
  argTypes: {
    density: { control: "select", options: [...DENSITIES] },
    radius: { control: "select", options: [...GOVERNED_PANEL_RADII] },
    shadow: { control: "select", options: [...GOVERNED_PANEL_SHADOWS] },
    state: { control: "select", options: [...GOVERNED_STATES] },
  },
  args: {
    density: "standard",
    radius: "md",
    shadow: "overlay",
    state: "ready",
  },
  render: ({ density, radius, shadow, state }) => (
    <HoverCard open>
      <HoverCardTrigger asChild>
        <Button emphasis="outline" intent="secondary" size="sm">
          Hover card playground
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        density={density}
        radius={radius}
        shadow={shadow}
        state={state}
      >
        <span className="text-sm">
          Adjust density, radius, shadow, and governed state from controls.
        </span>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "Trigger is a focusable button with visible label. Content is portaled and positioned by Radix; pair with semantic triggers in tables and mention lists.",
      },
    },
  },
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          aria-describedby="hover-card-desc"
          emphasis="ghost"
          intent="quiet"
          size="sm"
        >
          <StoryRow align="center" gap="xs">
            <UserIcon className="size-3.5" />
            <span>View assignee</span>
          </StoryRow>
        </Button>
      </HoverCardTrigger>
      <HoverCardPanel>
        <div id="hover-card-desc">
          <UserIdentity
            initials="JD"
            name="Jane Doe"
            subtitle="Primary assignee · Engineering"
          />
        </div>
      </HoverCardPanel>
    </HoverCard>
  ),
};
