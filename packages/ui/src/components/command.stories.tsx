import React from "react";
import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Building2Icon,
  CheckCircle2Icon,
  ClipboardListIcon,
  FileTextIcon,
  FolderOpenIcon,
  LayoutDashboardIcon,
  PackageIcon,
  PlusIcon,
  SettingsIcon,
  TruckIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { type ComponentType, type ReactNode, useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";
import { Kbd, KbdGroup } from "./kbd";

// ─── Sample data ───────────────────────────────────────────────────────────

const MODULES = [
  { id: "finance", label: "Finance", icon: FileTextIcon },
  { id: "procurement", label: "Procurement", icon: PackageIcon },
  { id: "inventory", label: "Inventory", icon: TruckIcon },
  { id: "hr", label: "Human Resources", icon: UsersIcon },
  { id: "sales", label: "Sales", icon: Building2Icon },
] as const;

const RECENT_RECORDS = [
  {
    id: "inv-0042",
    label: "INV-2026-0042 — Acme Supplies",
    module: "Accounts payable",
  },
  {
    id: "po-1184",
    label: "PO-2026-1184 — Industrial fasteners",
    module: "Procurement",
  },
  {
    id: "emp-1024",
    label: "EMP-1024 — Jane Doe",
    module: "Human resources",
  },
  {
    id: "cust-1001",
    label: "CUST-1001 — Northwind Traders",
    module: "Sales",
  },
] as const;

const QUICK_ACTIONS = [
  {
    id: "new-po",
    label: "Create purchase order",
    shortcut: "⌘⇧P",
    icon: PackageIcon,
  },
  {
    id: "new-invoice",
    label: "Create invoice",
    shortcut: "⌘⇧I",
    icon: FileTextIcon,
  },
  {
    id: "new-employee",
    label: "Add employee",
    shortcut: "⌘⇧E",
    icon: UserIcon,
  },
  {
    id: "new-vendor",
    label: "Register vendor",
    shortcut: "⌘⇧V",
    icon: Building2Icon,
  },
] as const;

const APPROVAL_ACTIONS = [
  { id: "approve-batch", label: "Approve payment batch BATCH-2026-06-18" },
  { id: "approve-po", label: "Approve PO-2026-1184" },
  { id: "reject-expense", label: "Reject expense EXP-2026-042" },
  { id: "delegate", label: "Delegate approval to finance lead" },
] as const;

const SETTINGS_ITEMS = [
  { id: "profile", label: "User profile & security" },
  { id: "notifications", label: "Notification preferences" },
  { id: "roles", label: "Role & permission matrix" },
  { id: "audit", label: "Audit log export" },
  { id: "integrations", label: "API & integrations" },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

function InlineCommandShell({ children }: { readonly children: ReactNode }) {
  return (
    <StoryFrame width="md">
      <StoryStack className="overflow-hidden rounded-md border border-border">
        {children}
      </StoryStack>
    </StoryFrame>
  );
}

function CommandPaletteDialog({
  title = "Command palette",
  description = "Search modules, records, and actions",
  children,
}: {
  readonly title?: string;
  readonly description?: string;
  readonly children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <StoryStack gap="sm">
      <StoryRow align="center" gap="md" wrap>
        <Button
          emphasis="solid"
          intent="primary"
          onClick={() => setOpen(true)}
          size="sm"
        >
          Open command palette
        </Button>
        <StoryRow align="center" gap="xs">
          <span className="text-muted-foreground text-sm">Shortcut</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </StoryRow>
      </StoryRow>
      <CommandDialog
        description={description}
        onOpenChange={setOpen}
        open={open}
        title={title}
      >
        {children}
      </CommandDialog>
    </StoryStack>
  );
}

function CommandItemRow({
  icon: Icon,
  label,
  hint,
}: {
  readonly icon?: ComponentType<{ className?: string }>;
  readonly label: string;
  readonly hint?: string;
}) {
  return (
    <StoryRow align="center" className="flex-1" gap="sm">
      {Icon ? (
        <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
      ) : null}
      <StoryStack className="flex-1" gap="xs">
        <span>{label}</span>
        {hint ? (
          <span className="text-muted-foreground text-xs">{hint}</span>
        ) : null}
      </StoryStack>
    </StoryRow>
  );
}

// ─── Command ───────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed cmdk command surface for ERP global palettes, record jump search, quick actions, and settings lookup. Compose with `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, and `CommandShortcut`. Use `CommandDialog` for modal ⌘K-style palettes.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
      table: { defaultValue: { summary: "ready" } },
    },
  },
  args: {
    state: "ready",
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic variants ────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <InlineCommandShell>
      <Command {...args}>
        <CommandInput placeholder="Search commands…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="dashboard">
              <CommandItemRow icon={LayoutDashboardIcon} label="Go to dashboard" />
            </CommandItem>
            <CommandItem value="settings">
              <CommandItemRow icon={SettingsIcon} label="Open settings" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const Default: Story = {
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Search commands…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="dashboard">
              <CommandItemRow
                icon={LayoutDashboardIcon}
                label="Go to dashboard"
              />
            </CommandItem>
            <CommandItem value="invoices">
              <CommandItemRow icon={FileTextIcon} label="Open invoices" />
            </CommandItem>
            <CommandItem value="settings">
              <CommandItemRow icon={SettingsIcon} label="Open settings" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const WithGroups: Story = {
  name: "Command — With Groups",
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem value="finance-module">
              <CommandItemRow icon={FileTextIcon} label="Finance module" />
            </CommandItem>
            <CommandItem value="procurement-module">
              <CommandItemRow icon={PackageIcon} label="Procurement module" />
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem value="create-po">
              <CommandItemRow icon={PlusIcon} label="Create purchase order" />
            </CommandItem>
            <CommandItem value="create-invoice">
              <CommandItemRow icon={PlusIcon} label="Create invoice" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const WithShortcuts: Story = {
  name: "Command — With Shortcuts",
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Type a command…" />
        <CommandList>
          <CommandEmpty>No matching commands.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            {QUICK_ACTIONS.map(({ id, label, shortcut, icon: Icon }) => (
              <CommandItem key={id} value={id}>
                <CommandItemRow icon={Icon} label={label} />
                <CommandShortcut>{shortcut}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const EmptyState: Story = {
  name: "Command — Empty State",
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Search archived vendors…" />
        <CommandList>
          <CommandEmpty>No archived vendors match your search.</CommandEmpty>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

// ─── Governance probes ─────────────────────────────────────────────────────

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` and `data-component="Override"` — governed values (`data-slot="command"`, `data-component="Command"`, `data-recipe="surface"`) must win on the root.',
      },
    },
  },
  render: () => (
    <InlineCommandShell>
      <Command
        data-component="Override"
        data-slot="override"
        data-testid="governance-command-root"
      >
        <CommandInput placeholder="Inspect root attributes…" />
        <CommandList>
          <CommandItem value="probe">Governed root wins over consumer data-*</CommandItem>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Reference map of emitted `data-slot` values from `primitive-registry.ts`. Internal roles (e.g. `control`, `actions`) differ from emitted DOM values (e.g. `command-input`, `command-item`).",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → command · body → command-input-wrapper · control →
          command-input · content → command-list · state → command-empty ·
          label → command-group · footer → command-separator · actions →
          command-item · header → command-shortcut
        </p>
        <InlineCommandShell>
          <Command>
            <CommandInput data-testid="slot-input" placeholder="Search…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="Probe">
                <CommandItem data-testid="slot-item" value="probe">
                  Inspect slot attributes
                  <CommandShortcut>⌘K</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </CommandList>
          </Command>
        </InlineCommandShell>
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
        <StoryFrame key={state} width="md">
          <p className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </p>
          <InlineCommandShell>
            <Command state={state}>
              <CommandInput placeholder="State probe…" />
              <CommandList>
                <CommandItem value="probe">Governed command probe</CommandItem>
              </CommandList>
            </Command>
          </InlineCommandShell>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "CommandDialog exposes title and description to screen readers. Items are keyboard-navigable `option` elements from cmdk. Search icon is decorative (`aria-hidden`).",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <CommandPaletteDialog
        description="Accessible command palette with labeled groups"
        title="ERP command palette"
      >
        <Command>
          <CommandInput
            aria-label="Search ERP commands"
            placeholder="Search…"
          />
          <CommandList>
            <CommandGroup heading="Navigation">
              <CommandItem value="dashboard">
                <CommandItemRow icon={LayoutDashboardIcon} label="Dashboard" />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandPaletteDialog>
    </StoryFrame>
  ),
};

// ─── ERP composite patterns ────────────────────────────────────────────────

export const GlobalCommandPalette: Story = {
  name: "ERP — Global Command Palette",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <CommandPaletteDialog
        description="Jump to modules, records, and run actions across the ERP"
        title="Afenda command palette"
      >
        <Command>
          <CommandInput placeholder="Type a command or search records…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Modules">
              {MODULES.map(({ id, label, icon: Icon }) => (
                <CommandItem key={id} value={id}>
                  <CommandItemRow icon={Icon} label={label} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick actions">
              {QUICK_ACTIONS.slice(0, 3).map(
                ({ id, label, shortcut, icon: Icon }) => (
                  <CommandItem key={id} value={id}>
                    <CommandItemRow icon={Icon} label={label} />
                    <CommandShortcut>{shortcut}</CommandShortcut>
                  </CommandItem>
                )
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandPaletteDialog>
    </StoryFrame>
  ),
};

export const RecordJumpSearch: Story = {
  name: "ERP — Record Jump Search",
  parameters: { layout: "padded" },
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Jump to invoice, PO, employee…" />
        <CommandList>
          <CommandEmpty>No matching records.</CommandEmpty>
          <CommandGroup heading="Recent records">
            {RECENT_RECORDS.map(({ id, label, module }) => (
              <CommandItem key={id} value={id}>
                <CommandItemRow
                  hint={module}
                  icon={FolderOpenIcon}
                  label={label}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const QuickActionsPalette: Story = {
  name: "ERP — Quick Actions Palette",
  parameters: { layout: "padded" },
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Create or import…" />
        <CommandList>
          <CommandEmpty>No actions found.</CommandEmpty>
          <CommandGroup heading="Create">
            {QUICK_ACTIONS.map(({ id, label, shortcut, icon: Icon }) => (
              <CommandItem key={id} value={id}>
                <CommandItemRow icon={Icon} label={label} />
                <CommandShortcut>{shortcut}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Import">
            <CommandItem value="import-employees">
              <CommandItemRow icon={UsersIcon} label="Import employee roster" />
            </CommandItem>
            <CommandItem value="import-invoices">
              <CommandItemRow
                icon={FileTextIcon}
                label="Import vendor invoices"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const ModuleNavigation: Story = {
  name: "ERP — Module Navigation",
  parameters: { layout: "padded" },
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Go to module…" />
        <CommandList>
          <CommandEmpty>No modules found.</CommandEmpty>
          <CommandGroup heading="Core modules">
            {MODULES.map(({ id, label, icon: Icon }) => (
              <CommandItem key={id} value={id}>
                <StoryRow
                  align="center"
                  className="flex-1"
                  gap="sm"
                  justify="between"
                >
                  <CommandItemRow icon={Icon} label={label} />
                  <Badge emphasis="soft" size="sm" tone="neutral">
                    Open
                  </Badge>
                </StoryRow>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const RecentRecords: Story = {
  name: "ERP — Recent Records",
  parameters: { layout: "padded" },
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Search recent activity…" />
        <CommandList>
          <CommandEmpty>No recent records.</CommandEmpty>
          <CommandGroup heading="Opened today">
            {RECENT_RECORDS.map(({ id, label, module }) => (
              <CommandItem key={id} value={id}>
                <StoryRow
                  align="center"
                  className="flex-1"
                  gap="sm"
                  justify="between"
                >
                  <CommandItemRow
                    hint={module}
                    icon={ClipboardListIcon}
                    label={label}
                  />
                  <span className="text-muted-foreground text-xs">Today</span>
                </StoryRow>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const ApprovalActions: Story = {
  name: "ERP — Approval Actions",
  parameters: { layout: "padded" },
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Search pending approvals…" />
        <CommandList>
          <CommandEmpty>No approval actions found.</CommandEmpty>
          <CommandGroup heading="Pending your review">
            {APPROVAL_ACTIONS.map(({ id, label }) => (
              <CommandItem key={id} value={id}>
                <StoryRow
                  align="center"
                  className="flex-1"
                  gap="sm"
                  justify="between"
                >
                  <CommandItemRow icon={CheckCircle2Icon} label={label} />
                  <Badge emphasis="soft" size="sm" tone="warning">
                    Pending
                  </Badge>
                </StoryRow>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const VendorCustomerSearch: Story = {
  name: "ERP — Vendor & Customer Search",
  parameters: { layout: "padded" },
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Search vendors and customers…" />
        <CommandList>
          <CommandEmpty>No accounts found.</CommandEmpty>
          <CommandGroup heading="Vendors">
            <CommandItem value="vnd-acme">
              <CommandItemRow
                hint="VND-88421 · Net 30"
                icon={Building2Icon}
                label="Acme Supplies Ltd."
              />
            </CommandItem>
            <CommandItem value="vnd-metro">
              <CommandItemRow
                hint="VND-55210 · Net 45"
                icon={Building2Icon}
                label="Metro Logistics"
              />
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Customers">
            <CommandItem value="cust-northwind">
              <CommandItemRow
                hint="CUST-1001 · Active"
                icon={UsersIcon}
                label="Northwind Traders"
              />
            </CommandItem>
            <CommandItem value="cust-summit">
              <CommandItemRow
                hint="CUST-1002 · On hold"
                icon={UsersIcon}
                label="Summit Healthcare"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const SettingsSearch: Story = {
  name: "ERP — Settings Search",
  parameters: { layout: "padded" },
  render: () => (
    <InlineCommandShell>
      <Command>
        <CommandInput placeholder="Search settings…" />
        <CommandList>
          <CommandEmpty>No settings found.</CommandEmpty>
          <CommandGroup heading="Workspace">
            {SETTINGS_ITEMS.map(({ id, label }) => (
              <CommandItem key={id} value={id}>
                <CommandItemRow icon={SettingsIcon} label={label} />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </InlineCommandShell>
  ),
};

export const FilteredWorkflowPalette: Story = {
  name: "ERP — Workflow Command Palette",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <CommandPaletteDialog
        description="Procurement workflow actions for PO-2026-1184"
        title="Workflow commands"
      >
        <Command>
          <CommandInput placeholder="Filter workflow actions…" />
          <CommandList>
            <CommandEmpty>No workflow commands match.</CommandEmpty>
            <CommandGroup heading="PO-2026-1184">
              <CommandItem value="view-po">
                <CommandItemRow
                  icon={PackageIcon}
                  label="View purchase order"
                />
              </CommandItem>
              <CommandItem value="add-line">
                <CommandItemRow icon={PlusIcon} label="Add line item" />
                <CommandShortcut>⌘L</CommandShortcut>
              </CommandItem>
              <CommandItem value="submit-approval">
                <CommandItemRow
                  icon={CheckCircle2Icon}
                  label="Submit for approval"
                />
                <CommandShortcut>⌘↵</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Related">
              <CommandItem value="view-vendor">
                <CommandItemRow
                  hint="Acme Supplies Ltd."
                  icon={Building2Icon}
                  label="Open vendor record"
                />
              </CommandItem>
              <CommandItem value="view-receiving">
                <CommandItemRow
                  hint="RR-2026-042"
                  icon={TruckIcon}
                  label="Open receiving report"
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandPaletteDialog>
    </StoryFrame>
  ),
};
