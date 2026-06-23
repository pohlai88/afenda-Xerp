import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArchiveIcon,
  Building2Icon,
  CheckCircle2Icon,
  CopyIcon,
  CreditCardIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FileTextIcon,
  HistoryIcon,
  LinkIcon,
  PackageIcon,
  PrinterIcon,
  SaveIcon,
  SendIcon,
  SettingsIcon,
  ShareIcon,
  Trash2Icon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  StoryCaption,
  StoryFrame,
  StoryRow,
  StoryStack,
} from "./_storybook/story-frame";
import { Badge } from "./badge";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./menubar";

// ─── Shared data ─────────────────────────────────────────────────────────────

const GRID_COLUMNS = [
  { id: "col-id", label: "Record ID", checked: true },
  { id: "col-name", label: "Name", checked: true },
  { id: "col-status", label: "Status", checked: true },
  { id: "col-owner", label: "Owner", checked: false },
  { id: "col-updated", label: "Last updated", checked: true },
  { id: "col-amount", label: "Amount", checked: false },
] as const;

const WORKSPACE_PROFILES = [
  { id: "ops", label: "Operations" },
  { id: "finance", label: "Finance" },
  { id: "procurement", label: "Procurement" },
] as const;

function FileMenuItems() {
  return (
    <>
      <MenubarItem>
        New purchase order
        <MenubarShortcut>Ctrl+N</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        New invoice
        <MenubarShortcut>Ctrl+Shift+N</MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarSub>
        <MenubarSubTrigger>Import</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>CSV upload</MenubarItem>
          <MenubarItem>Excel workbook</MenubarItem>
          <MenubarItem>API sync</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
      <MenubarSub>
        <MenubarSubTrigger>Export</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>
            <DownloadIcon />
            Download CSV
          </MenubarItem>
          <MenubarItem>
            <FileTextIcon />
            PDF summary
          </MenubarItem>
          <MenubarItem>
            <PrinterIcon />
            Print register
          </MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
      <MenubarSeparator />
      <MenubarItem>
        <SaveIcon />
        Save draft
        <MenubarShortcut>Ctrl+S</MenubarShortcut>
      </MenubarItem>
      <MenubarItem disabled>Close without saving</MenubarItem>
    </>
  );
}

function EditMenuItems() {
  return (
    <>
      <MenubarItem>
        Undo
        <MenubarShortcut>Ctrl+Z</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        Redo
        <MenubarShortcut>Ctrl+Y</MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem>
        <CopyIcon />
        Duplicate line
      </MenubarItem>
      <MenubarItem>
        <EditIcon />
        Edit selected
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem variant="destructive">
        <Trash2Icon />
        Delete selected
      </MenubarItem>
    </>
  );
}

function ViewMenuItems() {
  return (
    <>
      <MenubarLabel>Toggle columns</MenubarLabel>
      <MenubarSeparator />
      {GRID_COLUMNS.map(({ id, label, checked }) => (
        <MenubarCheckboxItem checked={checked} key={id}>
          {label}
        </MenubarCheckboxItem>
      ))}
      <MenubarSeparator />
      <MenubarLabel>Density</MenubarLabel>
      <MenubarRadioGroup value="comfortable">
        <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
        <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
        <MenubarRadioItem value="spacious">Spacious</MenubarRadioItem>
      </MenubarRadioGroup>
    </>
  );
}

function ErpMenubarShell({
  children,
  width = "xl",
}: {
  readonly children: ReactNode;
  readonly width?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <StoryFrame width={width}>
      <StoryStack gap="sm">{children}</StoryStack>
    </StoryFrame>
  );
}

// ─── Menubar ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix-UI Menubar for persistent ERP module commands — document editors, register toolbars, view toggles, and workspace switchers. Prefer `DropdownMenu` for single-action triggers on rows or cards.",
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
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ErpMenubarShell>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <FileMenuItems />
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <EditMenuItems />
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <ViewMenuItems />
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const WithLabel: Story = {
  name: "Menubar — With Label",
  render: () => (
    <ErpMenubarShell width="md">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Actions</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>INV-2048</MenubarLabel>
            <MenubarSeparator />
            <MenubarItem>
              <EyeIcon />
              View invoice
            </MenubarItem>
            <MenubarItem>
              <EditIcon />
              Edit
            </MenubarItem>
            <MenubarItem>
              <SendIcon />
              Send to customer
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const WithSubMenu: Story = {
  name: "Menubar — Sub Menu",
  render: () => (
    <ErpMenubarShell width="md">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Share</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <LinkIcon />
              Copy link
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>
                <ShareIcon />
                Share via
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email</MenubarItem>
                <MenubarItem>Slack</MenubarItem>
                <MenubarItem>Teams</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger>Export as</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>CSV</MenubarItem>
                <MenubarItem>Excel</MenubarItem>
                <MenubarItem>PDF</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const WithCheckboxItems: Story = {
  name: "Menubar — Checkbox Items",
  render: () => (
    <ErpMenubarShell width="md">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Columns</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Visible columns</MenubarLabel>
            <MenubarSeparator />
            {GRID_COLUMNS.map(({ id, label, checked }) => (
              <MenubarCheckboxItem checked={checked} key={id}>
                {label}
              </MenubarCheckboxItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const WithRadioItems: Story = {
  name: "Menubar — Radio Items",
  render: () => (
    <ErpMenubarShell width="md">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Sort</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Sort records by</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value="date-desc">
              <MenubarRadioItem value="date-desc">
                Date (newest first)
              </MenubarRadioItem>
              <MenubarRadioItem value="date-asc">
                Date (oldest first)
              </MenubarRadioItem>
              <MenubarRadioItem value="amount-desc">
                Amount (high → low)
              </MenubarRadioItem>
              <MenubarRadioItem value="amount-asc">
                Amount (low → high)
              </MenubarRadioItem>
              <MenubarRadioItem value="status">Status</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const WithShortcuts: Story = {
  name: "Menubar — Shortcuts",
  render: () => (
    <ErpMenubarShell width="md">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New tab
              <MenubarShortcut>Ctrl+T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Save
              <MenubarShortcut>Ctrl+S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Print
              <MenubarShortcut>Ctrl+P</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Quit
              <MenubarShortcut>Ctrl+Q</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const WithDisabledItems: Story = {
  name: "Menubar — Disabled Items",
  render: () => (
    <ErpMenubarShell width="md">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>Undo (nothing to undo)</MenubarItem>
            <MenubarItem disabled>Redo</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <CopyIcon />
              Copy selection
            </MenubarItem>
            <MenubarItem disabled>Cut (read-only record)</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const WithDestructiveItem: Story = {
  name: "Menubar — Destructive Item",
  render: () => (
    <ErpMenubarShell width="md">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Record</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <ArchiveIcon />
              Archive
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <Trash2Icon />
              Delete permanently
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const WithInsetItems: Story = {
  name: "Menubar — Inset Items",
  render: () => (
    <ErpMenubarShell width="md">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel inset>Layout</MenubarLabel>
            <MenubarSeparator />
            <MenubarCheckboxItem checked inset>
              Show sidebar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem inset>Show footer</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel inset>Panels</MenubarLabel>
            <MenubarItem inset>Activity feed</MenubarItem>
            <MenubarItem inset>Audit trail</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

// ─── Playground & governance probes ─────────────────────────────────────────

function MenubarStateProbe({
  state,
}: {
  readonly state: (typeof GOVERNED_STATES)[number];
}) {
  return (
    <StoryRow align="center" gap="md">
      <StoryCaption>{state}</StoryCaption>
      <StoryFrame width="md">
        <Menubar state={state} value="file">
          <MenubarMenu value="file">
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent forceMount>
              <MenubarItem>View ({state})</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </StoryFrame>
    </StoryRow>
  );
}

export const Playground: Story = {
  render: (args) => (
    <ErpMenubarShell>
      <Menubar state={args.state}>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New document</MenubarItem>
            <MenubarItem>Open</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Save</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` and `data-state="fake"` — governed attributes must win on root, trigger, content, and items.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Menubar
        data-slot="override"
        data-state="fake"
        state="ready"
        value="file"
      >
        <MenubarMenu value="file">
          <MenubarTrigger data-slot="override">File</MenubarTrigger>
          <MenubarContent data-slot="override" forceMount>
            <MenubarItem data-slot="override">View</MenubarItem>
            <MenubarItem variant="destructive">Delete</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </StoryFrame>
  ),
};

export const GovernanceSlotMap: Story = {
  name: "Governance — Slot Map",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Reference map of emitted `data-slot` values from `primitive-registry.ts`. Internal roles (`control`, `state`, `footer`, `actions`) emit `menubar-item`, `menubar-label`, `menubar-separator`, `menubar-shortcut`.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → menubar · trigger → menubar-trigger · content → menubar-content
          · control → menubar-item · state → menubar-label · footer →
          menubar-separator · actions → menubar-shortcut · checkbox-item →
          menubar-checkbox-item · radio-item → menubar-radio-item · sub-trigger
          → menubar-sub-trigger · sub-content → menubar-sub-content ·
          item-indicator → menubar-checkbox-item-indicator
        </p>
        <Menubar value="inspect">
          <MenubarMenu value="inspect">
            <MenubarTrigger>Inspect</MenubarTrigger>
            <MenubarContent forceMount>
              <MenubarLabel>Slot map</MenubarLabel>
              <MenubarSeparator />
              <MenubarItem>
                View
                <MenubarShortcut>⌘V</MenubarShortcut>
              </MenubarItem>
              <MenubarCheckboxItem checked>Grid lines</MenubarCheckboxItem>
              <MenubarSub open>
                <MenubarSubTrigger>More</MenubarSubTrigger>
                <MenubarSubContent forceMount>
                  <MenubarItem>Nested item</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
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
        <MenubarStateProbe key={state} state={state} />
      ))}
    </StoryStack>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          'Menubar triggers are keyboard navigable across top-level menus. Destructive items use `variant="destructive"`. Decorative Lucide icons use `aria-hidden="true"`.',
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Record</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <EyeIcon aria-hidden="true" />
              View record
            </MenubarItem>
            <MenubarItem variant="destructive">
              <Trash2Icon aria-hidden="true" />
              Delete record
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </StoryFrame>
  ),
};

// ─── ERP usage ───────────────────────────────────────────────────────────────

export const DocumentEditorMenubar: Story = {
  name: "ERP — Document Editor Menubar",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <StoryRow align="center" gap="sm" wrap>
        <Badge emphasis="soft" tone="neutral">
          PO-1042 · Draft
        </Badge>
      </StoryRow>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <FileMenuItems />
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <EditMenuItems />
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <ViewMenuItems />
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Tools</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <HistoryIcon />
              Revision history
            </MenubarItem>
            <MenubarItem>
              <CheckCircle2Icon />
              Validate totals
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <SettingsIcon />
              Document settings
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const FinanceModuleMenubar: Story = {
  name: "ERP — Finance Module Menubar",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Transactions</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <CreditCardIcon />
              New payment
            </MenubarItem>
            <MenubarItem>
              <FileTextIcon />
              Post journal entry
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <HistoryIcon />
              Reconciliation queue
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Reports</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Profit &amp; loss</MenubarItem>
            <MenubarItem>Balance sheet</MenubarItem>
            <MenubarItem>Cash flow</MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Export</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>CSV</MenubarItem>
                <MenubarItem>Excel</MenubarItem>
                <MenubarItem>PDF</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Period</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Fiscal period</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value="q2-2026">
              <MenubarRadioItem value="q1-2026">Q1 2026</MenubarRadioItem>
              <MenubarRadioItem value="q2-2026">Q2 2026</MenubarRadioItem>
              <MenubarRadioItem value="q3-2026">Q3 2026</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const ProcurementActionsMenubar: Story = {
  name: "ERP — Procurement Actions",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Create</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <PackageIcon />
              Purchase order
            </MenubarItem>
            <MenubarItem>
              <Building2Icon />
              Vendor
            </MenubarItem>
            <MenubarItem>
              <FileTextIcon />
              Request for quote
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Receive</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Goods receipt</MenubarItem>
            <MenubarItem>Quality inspection</MenubarItem>
            <MenubarItem disabled>Return to vendor</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Bulk</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>3 POs selected</MenubarLabel>
            <MenubarSeparator />
            <MenubarItem>Approve selected</MenubarItem>
            <MenubarItem>Send to vendor</MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <Trash2Icon />
              Cancel selected
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const ViewColumnVisibilityMenubar: Story = {
  name: "ERP — View & Column Visibility",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <ViewMenuItems />
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Filters</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked>Show archived</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>My records only</MenubarCheckboxItem>
            <MenubarCheckboxItem>Overdue only</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem>Reset filters</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const WorkspaceProfileSwitcher: Story = {
  name: "ERP — Workspace Profile Switcher",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Workspace</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Active profile</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value="finance">
              {WORKSPACE_PROFILES.map(({ id, label }) => (
                <MenubarRadioItem key={id} value={id}>
                  {label}
                </MenubarRadioItem>
              ))}
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem>
              <SettingsIcon />
              Manage profiles
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Signed in as</MenubarLabel>
            <MenubarSeparator />
            <MenubarItem>
              <UserIcon />
              Profile settings
            </MenubarItem>
            <MenubarItem>Switch organization</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Sign out</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const InvoiceRecordMenubar: Story = {
  name: "ERP — Invoice Record Bar",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <StoryRow align="center" gap="sm" wrap>
        <Badge emphasis="soft" tone="warning">
          Pending approval
        </Badge>
        <Badge emphasis="soft" tone="neutral">
          INV-2048 · $4,850
        </Badge>
      </StoryRow>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Invoice</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>INV-2048</MenubarLabel>
            <MenubarSeparator />
            <MenubarItem>
              <EyeIcon />
              Preview PDF
            </MenubarItem>
            <MenubarItem>
              <EditIcon />
              Edit lines
            </MenubarItem>
            <MenubarItem>
              <CopyIcon />
              Duplicate
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <SendIcon />
              Send to customer
            </MenubarItem>
            <MenubarItem>
              <CreditCardIcon />
              Record payment
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Status</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Update status</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value="pending">
              <MenubarRadioItem value="draft">Draft</MenubarRadioItem>
              <MenubarRadioItem value="pending">Pending</MenubarRadioItem>
              <MenubarRadioItem value="approved">Approved</MenubarRadioItem>
              <MenubarRadioItem value="paid">Paid</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>More</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <HistoryIcon />
              Audit log
            </MenubarItem>
            <MenubarItem>
              <ArchiveIcon />
              Archive
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <Trash2Icon />
              Void invoice
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const InventoryGridMenubar: Story = {
  name: "ERP — Inventory Grid Menubar",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Stock</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <PackageIcon />
              Adjust quantity
            </MenubarItem>
            <MenubarItem>Transfer between warehouses</MenubarItem>
            <MenubarItem>Cycle count</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Columns</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>SKU register columns</MenubarLabel>
            <MenubarSeparator />
            <MenubarCheckboxItem checked>SKU</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>On hand</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>Reserved</MenubarCheckboxItem>
            <MenubarCheckboxItem>Reorder point</MenubarCheckboxItem>
            <MenubarCheckboxItem>Last counted</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Export</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <DownloadIcon />
              Current view (CSV)
            </MenubarItem>
            <MenubarItem>Full stock snapshot</MenubarItem>
            <MenubarItem>Low-stock alert list</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const ApprovalWorkflowMenubar: Story = {
  name: "ERP — Approval Workflow Bar",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <StoryRow align="center" gap="sm" wrap>
        <Badge emphasis="soft" tone="warning">
          Awaiting your approval
        </Badge>
      </StoryRow>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Workflow</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <CheckCircle2Icon />
              Approve
              <MenubarShortcut>Ctrl+Enter</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Request changes</MenubarItem>
            <MenubarItem>Delegate</MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">Reject</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Route</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Send to</MenubarLabel>
            <MenubarSeparator />
            <MenubarItem>Finance controller</MenubarItem>
            <MenubarItem>Department head</MenubarItem>
            <MenubarItem>Legal review</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>History</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <HistoryIcon />
              Approval trail
            </MenubarItem>
            <MenubarItem>Comments log</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const HREmployeeDirectoryMenubar: Story = {
  name: "ERP — HR Employee Directory",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>People</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <UserPlusIcon />
              Add employee
            </MenubarItem>
            <MenubarItem>Import roster</MenubarItem>
            <MenubarItem>
              <DownloadIcon />
              Export directory
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked>Active only</MenubarCheckboxItem>
            <MenubarCheckboxItem>Include contractors</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarRadioGroup value="name">
              <MenubarRadioItem value="name">Sort by name</MenubarRadioItem>
              <MenubarRadioItem value="dept">
                Sort by department
              </MenubarRadioItem>
              <MenubarRadioItem value="start">
                Sort by start date
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Department</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="all">
              <MenubarRadioItem value="all">All departments</MenubarRadioItem>
              <MenubarRadioItem value="ops">Operations</MenubarRadioItem>
              <MenubarRadioItem value="finance">Finance</MenubarRadioItem>
              <MenubarRadioItem value="hr">Human resources</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const ReportsExportMenubar: Story = {
  name: "ERP — Reports Export Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Report</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Sales by region</MenubarItem>
            <MenubarItem>Vendor spend</MenubarItem>
            <MenubarItem>Inventory aging</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Export</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Format</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value="csv">
              <MenubarRadioItem value="csv">CSV</MenubarRadioItem>
              <MenubarRadioItem value="xlsx">Excel (.xlsx)</MenubarRadioItem>
              <MenubarRadioItem value="pdf">PDF summary</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem>
              <DownloadIcon />
              Download now
            </MenubarItem>
            <MenubarItem>
              <SendIcon />
              Schedule email
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Share</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <ShareIcon />
              Share link
            </MenubarItem>
            <MenubarItem>Copy embed code</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};

export const SettingsPreferencesMenubar: Story = {
  name: "ERP — Settings & Preferences",
  parameters: { layout: "padded" },
  render: () => (
    <ErpMenubarShell>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Preferences</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked>Show row numbers</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>
              Confirm destructive actions
            </MenubarCheckboxItem>
            <MenubarCheckboxItem>Compact toolbar</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel>Default module</MenubarLabel>
            <MenubarRadioGroup value="dashboard">
              <MenubarRadioItem value="dashboard">Dashboard</MenubarRadioItem>
              <MenubarRadioItem value="finance">Finance</MenubarRadioItem>
              <MenubarRadioItem value="inventory">Inventory</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Integrations</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Connected apps</MenubarItem>
            <MenubarItem>API keys</MenubarItem>
            <MenubarItem>Webhooks</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Documentation</MenubarItem>
            <MenubarItem>Keyboard shortcuts</MenubarItem>
            <MenubarItem>Contact support</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ErpMenubarShell>
  ),
};
