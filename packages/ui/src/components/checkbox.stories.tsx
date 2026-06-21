import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Building2Icon,
  CreditCardIcon,
  FileTextIcon,
  MailIcon,
  PackageIcon,
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Separator } from "./separator";
import { Switch } from "./switch";

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function CheckboxField({
  id,
  label,
  description,
  defaultChecked,
  checked,
  disabled,
  onCheckedChange,
}: {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly defaultChecked?: boolean;
  readonly checked?: boolean | "indeterminate";
  readonly disabled?: boolean;
  readonly onCheckedChange?: (checked: boolean | "indeterminate") => void;
}) {
  return (
    <StoryRow
      align="start"
      className="rounded-md border border-border"
      gap="md"
      padding="sm"
    >
      <Checkbox
        disabled={disabled}
        id={id}
        {...(checked === undefined
          ? defaultChecked === undefined
            ? {}
            : { defaultChecked }
          : {
              checked,
              ...(onCheckedChange ? { onCheckedChange } : {}),
            })}
      />
      <StoryStack className="flex-1" gap="xs">
        <span className="font-medium">
          <Label htmlFor={id}>{label}</Label>
        </span>
        {description ? (
          <span className="text-muted-foreground text-xs">{description}</span>
        ) : null}
      </StoryStack>
    </StoryRow>
  );
}

interface TreeNode {
  readonly children?: readonly TreeNode[];
  readonly id: string;
  readonly label: string;
}

const ORG_UNITS: readonly TreeNode[] = [
  {
    id: "finance",
    label: "Finance",
    children: [
      { id: "payroll", label: "Payroll" },
      { id: "ap", label: "Accounts Payable" },
      { id: "ar", label: "Accounts Receivable" },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    children: [
      { id: "procurement", label: "Procurement" },
      { id: "warehouse", label: "Warehouse" },
    ],
  },
  {
    id: "hr",
    label: "Human Resources",
    children: [
      { id: "recruiting", label: "Recruiting" },
      { id: "benefits", label: "Benefits Administration" },
    ],
  },
];

function collectLeafIds(nodes: readonly TreeNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.children) {
      ids.push(...collectLeafIds(node.children));
    } else {
      ids.push(node.id);
    }
  }
  return ids;
}

function OrgUnitTreeComponent() {
  const defaultSelected = ["payroll", "ap"];
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  const toggleLeaf = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getBranchState = (node: TreeNode): boolean | "indeterminate" => {
    if (!node.children) {
      return selected.includes(node.id);
    }
    const childStates = node.children.map(getBranchState);
    const allChecked = childStates.every((s) => s === true);
    const someChecked = childStates.some(
      (s) => s === true || s === "indeterminate"
    );
    if (allChecked) {
      return true;
    }
    if (someChecked) {
      return "indeterminate";
    }
    return false;
  };

  const toggleBranch = (node: TreeNode) => {
    const leafIds = node.children ? collectLeafIds(node.children) : [node.id];
    const allSelected = leafIds.every((id) => selected.includes(id));
    setSelected((prev) => {
      if (allSelected) {
        return prev.filter((id) => !leafIds.includes(id));
      }
      return [...new Set([...prev, ...leafIds])];
    });
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    const isParent = Boolean(node.children);
    const state = isParent ? getBranchState(node) : selected.includes(node.id);

    return (
      <StoryStack gap="xs" key={node.id}>
        <StoryRow
          align="center"
          gap="sm"
          {...(depth > 0 ? { paddingX: "md" as const } : {})}
        >
          <Checkbox
            checked={state}
            id={`org-${node.id}`}
            onCheckedChange={() =>
              isParent ? toggleBranch(node) : toggleLeaf(node.id)
            }
          />
          <span className="font-medium text-sm">
            <Label htmlFor={`org-${node.id}`}>{node.label}</Label>
          </span>
        </StoryRow>
        {node.children?.map((child) => renderNode(child, depth + 1))}
      </StoryStack>
    );
  };

  return (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryStack gap="xs">
          <span className="font-semibold text-sm">Data access scope</span>
          <span className="text-muted-foreground text-xs">
            Select organizational units included in this role assignment
          </span>
        </StoryStack>
        {ORG_UNITS.map((node) => renderNode(node))}
        <Separator />
        <span className="text-muted-foreground text-xs">
          {selected.length} unit{selected.length === 1 ? "" : "s"} selected
        </span>
      </StoryStack>
    </StoryFrame>
  );
}

const BULK_INVOICES = [
  { id: "INV-2026-001", vendor: "Acme Supplies", amount: 24_850 },
  { id: "INV-2026-002", vendor: "Metro Logistics", amount: 8420 },
  { id: "INV-2026-003", vendor: "TechServe Inc.", amount: 15_600 },
  { id: "INV-2026-004", vendor: "CleanCo Facilities", amount: 3200 },
  { id: "INV-2026-005", vendor: "Global Parts Ltd.", amount: 42_100 },
] as const;

function BulkSelectComponent() {
  const ids = BULK_INVOICES.map((row) => row.id);
  const [checked, setChecked] = useState<string[]>([]);
  const allChecked = checked.length === ids.length;
  const indeterminate = checked.length > 0 && !allChecked;
  const selectedTotal = BULK_INVOICES.filter((row) =>
    checked.includes(row.id)
  ).reduce((sum, row) => sum + row.amount, 0);

  const toggleAll = () => {
    setChecked(allChecked ? [] : [...ids]);
  };

  const toggleOne = (id: string) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <StoryFrame width="xl">
      <StoryStack
        className="overflow-hidden rounded-md border border-border"
        gap="xs"
      >
        <StoryRow
          className="border-border border-b bg-muted/30"
          gap="md"
          justify="between"
          paddingX="lg"
          paddingY="sm"
        >
          <StoryRow align="center" gap="md">
            <Checkbox
              aria-label="Select all invoices"
              checked={indeterminate ? "indeterminate" : allChecked}
              id="bulk-all"
              onCheckedChange={toggleAll}
            />
            <span className="font-medium text-sm">
              <Label htmlFor="bulk-all">
                {checked.length > 0
                  ? `${checked.length} invoice${checked.length === 1 ? "" : "s"} selected`
                  : "Select all"}
              </Label>
            </span>
          </StoryRow>
          {checked.length > 0 ? (
            <Badge emphasis="soft" tone="info">
              {formatCurrency(selectedTotal)} total
            </Badge>
          ) : null}
        </StoryRow>
        {BULK_INVOICES.map(({ id, vendor, amount }) => (
          <StoryRow
            align="center"
            className="border-border border-b last:border-0 hover:bg-muted/20"
            gap="md"
            justify="between"
            key={id}
            paddingX="lg"
            paddingY="sm"
          >
            <StoryRow align="center" gap="md">
              <Checkbox
                checked={checked.includes(id)}
                id={`bulk-${id}`}
                onCheckedChange={() => toggleOne(id)}
              />
              <StoryStack gap="xs">
                <span className="cursor-pointer font-mono text-sm">
                  <Label htmlFor={`bulk-${id}`}>{id}</Label>
                </span>
                <span className="text-muted-foreground text-xs">{vendor}</span>
              </StoryStack>
            </StoryRow>
            <span className="font-medium text-sm tabular-nums">
              {formatCurrency(amount)}
            </span>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  );
}

function TermsAcceptanceComponent() {
  const [accepted, setAccepted] = useState(false);

  return (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <CheckboxField
          checked={accepted}
          description="You must accept the vendor payment policy before submitting this batch."
          id="terms-vendor"
          label="I accept the vendor payment and compliance policy"
          onCheckedChange={(value) => setAccepted(value === true)}
        />
        <StoryRow gap="sm" justify="end">
          <Button emphasis="outline" intent="secondary" size="sm">
            Cancel
          </Button>
          <Button disabled={!accepted} size="sm">
            Submit payment batch
          </Button>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  );
}

function TaskChecklistComponent() {
  const [tasks, setTasks] = useState([
    { id: "t1", label: "Verify vendor W-9 on file", done: true },
    { id: "t2", label: "Match PO line items to invoice", done: true },
    { id: "t3", label: "Confirm receiving report signed", done: false },
    { id: "t4", label: "Route to finance approver", done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const completed = tasks.filter((t) => t.done).length;

  return (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow justify="between">
          <span className="font-semibold text-sm">
            Invoice approval checklist
          </span>
          <Badge
            emphasis="soft"
            tone={completed === tasks.length ? "success" : "warning"}
          >
            {completed}/{tasks.length} complete
          </Badge>
        </StoryRow>
        {tasks.map(({ id, label, done }) => (
          <StoryRow align="center" gap="sm" key={id}>
            <Checkbox
              checked={done}
              id={id}
              onCheckedChange={() => toggleTask(id)}
            />
            <span
              className={done ? "text-muted-foreground line-through" : undefined}
            >
              <Label htmlFor={id}>{label}</Label>
            </span>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix-UI Checkbox for ERP bulk selection, permission matrices, export column pickers, compliance checklists, filter facets, and multi-select form fields. Supports `checked`, indeterminate state, `disabled`, and governed `state`. Always pair with `Label` via matching `id` / `htmlFor`.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
  },
  args: {},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic variants ────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryRow align="center" gap="sm">
      <Checkbox id="cb-default" {...args} />
      <Label htmlFor="cb-default">Accept terms and conditions</Label>
    </StoryRow>
  ),
};

export const Checked: Story = {
  args: { defaultChecked: true },
  render: (args) => (
    <StoryRow align="center" gap="sm">
      <Checkbox id="cb-checked" {...args} />
      <Label htmlFor="cb-checked">Email notifications enabled</Label>
    </StoryRow>
  ),
};

export const Indeterminate: Story = {
  name: "State — Indeterminate",
  render: () => (
    <StoryRow align="center" gap="sm">
      <Checkbox checked="indeterminate" id="cb-indeterminate" />
      <Label htmlFor="cb-indeterminate">
        Partial selection — 3 of 8 records selected
      </Label>
    </StoryRow>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <StoryRow align="center" gap="sm">
      <Checkbox id="cb-disabled" {...args} />
      <Label htmlFor="cb-disabled">Feature locked by admin</Label>
    </StoryRow>
  ),
};

export const DisabledChecked: Story = {
  name: "State — Disabled Checked",
  args: { disabled: true, defaultChecked: true },
  render: (args) => (
    <StoryRow align="center" gap="sm">
      <Checkbox id="cb-dis-chk" {...args} />
      <Label htmlFor="cb-dis-chk">
        Mandatory compliance policy (read-only)
      </Label>
    </StoryRow>
  ),
};

export const WithDescription: Story = {
  name: "Checkbox — With Description",
  render: () => (
    <StoryFrame width="md">
      <CheckboxField
        defaultChecked
        description="Receive email when invoices are approved, rejected, or require your action."
        id="cb-desc"
        label="Approval workflow notifications"
      />
    </StoryFrame>
  ),
};

// ─── Governance probes ─────────────────────────────────────────────────────

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
          <StoryRow align="center" gap="sm">
            <Checkbox defaultChecked id={`cb-state-${state}`} state={state} />
            <Label htmlFor={`cb-state-${state}`}>
              Governed checkbox probe — {state}
            </Label>
          </StoryRow>
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
          "Each checkbox has a unique `id` paired with `Label htmlFor`. Bulk and tree patterns use `aria-label` when the visible label does not describe the control alone.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm">
          <Checkbox
            aria-label="Include archived records in export"
            id="cb-a11y-1"
          />
          <Label htmlFor="cb-a11y-1">Include archived records</Label>
        </StoryRow>
        <StoryRow align="center" gap="sm">
          <Checkbox defaultChecked id="cb-a11y-2" />
          <Label htmlFor="cb-a11y-2">
            Send confirmation email to submitter
          </Label>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── ERP checkbox patterns ─────────────────────────────────────────────────

export const PermissionsGroup: Story = {
  name: "ERP — Module Permissions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <StoryStack gap="xs">
          <span className="font-semibold text-sm">
            Finance module permissions
          </span>
          <span className="text-muted-foreground text-xs">
            Role: Finance Analyst · Applies to all users in this role group
          </span>
        </StoryStack>
        {[
          {
            id: "perm-view",
            label: "View Records",
            description: "Read-only access to invoices, payments, and journals",
            defaultChecked: true,
          },
          {
            id: "perm-create",
            label: "Create Records",
            description: "Add new invoices and payment batches",
            defaultChecked: true,
          },
          {
            id: "perm-edit",
            label: "Edit Records",
            description: "Modify draft invoices before approval",
            defaultChecked: false,
          },
          {
            id: "perm-delete",
            label: "Delete Records",
            description: "Permanently remove draft records",
            defaultChecked: false,
          },
          {
            id: "perm-export",
            label: "Export Data",
            description: "Download records as CSV or Excel",
            defaultChecked: false,
          },
          {
            id: "perm-admin",
            label: "Admin Controls",
            description: "Locked by organization policy",
            disabled: true,
          },
        ].map((field) => (
          <CheckboxField key={field.id} {...field} />
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const BulkSelectPattern: Story = {
  name: "ERP — Bulk Invoice Selection",
  parameters: { layout: "padded" },
  render: () => <BulkSelectComponent />,
};

export const FeatureFlags: Story = {
  name: "ERP — Feature Flags",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        {[
          {
            id: "ff-auto-approve",
            label: "Auto-approve low-value invoices (<$500)",
            defaultChecked: true,
          },
          {
            id: "ff-2fa",
            label: "Require 2FA for financial approvals",
            defaultChecked: true,
          },
          {
            id: "ff-audit",
            label: "Enable full audit trail logging",
            defaultChecked: false,
          },
          {
            id: "ff-api",
            label: "Enable public API access",
            defaultChecked: false,
          },
        ].map(({ id, label, defaultChecked }) => (
          <StoryRow align="center" gap="sm" key={id}>
            <Checkbox defaultChecked={defaultChecked} id={id} />
            <Label htmlFor={id}>{label}</Label>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const ExportColumnPicker: Story = {
  name: "ERP — Export Column Picker",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryStack gap="xs">
          <span className="font-semibold text-sm">Export employee roster</span>
          <span className="text-muted-foreground text-xs">
            Choose columns included in the CSV download
          </span>
        </StoryStack>
        {[
          { id: "col-id", label: "Employee ID", defaultChecked: true },
          { id: "col-name", label: "Full name", defaultChecked: true },
          { id: "col-dept", label: "Department", defaultChecked: true },
          { id: "col-salary", label: "Annual salary", defaultChecked: false },
          { id: "col-manager", label: "Manager", defaultChecked: true },
          { id: "col-start", label: "Start date", defaultChecked: false },
          {
            id: "col-status",
            label: "Employment status",
            defaultChecked: true,
          },
        ].map(({ id, label, defaultChecked }) => (
          <StoryRow align="center" gap="sm" key={id}>
            <Checkbox defaultChecked={defaultChecked} id={id} />
            <Label htmlFor={id}>{label}</Label>
          </StoryRow>
        ))}
        <Separator />
        <StoryRow gap="sm" justify="end">
          <Button emphasis="outline" intent="secondary" size="sm">
            Cancel
          </Button>
          <Button size="sm">Export CSV</Button>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const OrgUnitTree: Story = {
  name: "ERP — Org Unit Tree Selection",
  parameters: { layout: "padded" },
  render: () => <OrgUnitTreeComponent />,
};

export const ComplianceChecklist: Story = {
  name: "ERP — Compliance Checklist",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <StoryStack gap="xs">
          <span className="font-semibold text-sm">
            SOX compliance — payment batch
          </span>
          <span className="text-muted-foreground text-xs">
            All items required before releasing BATCH-2026-06-18
          </span>
        </StoryStack>
        {[
          {
            id: "cx-dual",
            label: "Dual approval obtained",
            description: "Two authorized approvers signed off on this batch",
            defaultChecked: true,
          },
          {
            id: "cx-bank",
            label: "Bank account verified",
            description: "Vendor banking details match master record",
            defaultChecked: true,
          },
          {
            id: "cx-threshold",
            label: "Threshold exceptions documented",
            description:
              "3 invoices exceed single-approval limit — notes attached",
            defaultChecked: false,
          },
          {
            id: "cx-audit",
            label: "Audit trail complete",
            description:
              "All line items linked to source PO and receiving report",
            defaultChecked: false,
          },
        ].map((field) => (
          <CheckboxField key={field.id} {...field} />
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const TermsAcceptance: Story = {
  name: "ERP — Terms Acceptance Gate",
  parameters: { layout: "padded" },
  render: () => <TermsAcceptanceComponent />,
};

export const TaskChecklist: Story = {
  name: "ERP — Task Checklist",
  parameters: { layout: "padded" },
  render: () => <TaskChecklistComponent />,
};

export const FilterFacets: Story = {
  name: "ERP — Record Filter Facets",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-semibold text-sm">Invoice filters</span>
          <span className="text-muted-foreground text-xs">
            Narrow the list before bulk actions
          </span>
        </StoryStack>
        <StoryStack gap="sm">
          <span className="font-medium text-sm">Status</span>
          <StoryRow gap="lg" wrap>
            {[
              { id: "st-open", label: "Open" },
              { id: "st-overdue", label: "Overdue", defaultChecked: true },
              { id: "st-paid", label: "Paid" },
              { id: "st-disputed", label: "Disputed" },
            ].map(({ id, label, defaultChecked }) => (
              <StoryRow align="center" gap="sm" key={id}>
                <Checkbox
                  id={id}
                  {...(defaultChecked ? { defaultChecked: true } : {})}
                />
                <span className="font-normal">
                  <Label htmlFor={id}>{label}</Label>
                </span>
              </StoryRow>
            ))}
          </StoryRow>
        </StoryStack>
        <StoryStack gap="sm">
          <span className="font-medium text-sm">Assignment</span>
          <StoryRow gap="lg" wrap>
            {[
              { id: "as-me", label: "Assigned to me" },
              { id: "as-team", label: "My team", defaultChecked: true },
              { id: "as-unassigned", label: "Unassigned" },
            ].map(({ id, label, defaultChecked }) => (
              <StoryRow align="center" gap="sm" key={id}>
                <Checkbox
                  id={id}
                  {...(defaultChecked ? { defaultChecked: true } : {})}
                />
                <span className="font-normal">
                  <Label htmlFor={id}>{label}</Label>
                </span>
              </StoryRow>
            ))}
          </StoryRow>
        </StoryStack>
        <StoryRow gap="sm" justify="end">
          <Button emphasis="ghost" intent="quiet" size="sm">
            Reset
          </Button>
          <Button size="sm">Apply filters</Button>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const CardStyleOptions: Story = {
  name: "ERP — Card-Style Option Pickers",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <StoryStack gap="xs">
          <span className="font-semibold text-sm">Delivery method</span>
          <span className="text-muted-foreground text-xs">
            PO-2026-1184 — select one or more carriers
          </span>
        </StoryStack>
        {[
          {
            id: "ship-ground",
            icon: TruckIcon,
            label: "Ground freight",
            description: "5–7 business days · Lowest cost",
            defaultChecked: true,
          },
          {
            id: "ship-expedited",
            icon: PackageIcon,
            label: "Expedited",
            description: "2–3 business days · Priority handling",
            defaultChecked: false,
          },
          {
            id: "ship-vendor",
            icon: Building2Icon,
            label: "Vendor direct",
            description: "Ships from supplier warehouse",
            defaultChecked: false,
          },
        ].map(({ id, icon: Icon, label, description, defaultChecked }) => (
          <StoryRow
            align="start"
            className="rounded-md border border-border has-[:checked]:border-primary"
            gap="md"
            key={id}
            padding="sm"
          >
            <Checkbox defaultChecked={defaultChecked} id={id} />
            <StoryStack className="flex-1" gap="xs">
              <StoryRow align="center" gap="sm">
                <Icon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
                <span className="font-medium">
                  <Label htmlFor={id}>{label}</Label>
                </span>
              </StoryRow>
              <span className="text-muted-foreground text-xs">
                {description}
              </span>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const HorizontalCategoryFilters: Story = {
  name: "ERP — Horizontal Category Filters",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="xs">
        <span className="font-medium text-sm">Expense categories</span>
        <StoryRow gap="lg" wrap>
          {[
            "Travel",
            "Meals",
            "Software",
            "Office supplies",
            "Contractors",
          ].map((category, i) => (
            <StoryRow align="center" gap="sm" key={category}>
              <Checkbox defaultChecked={i < 2} id={`cat-${category}`} />
              <span className="font-normal">
                <Label htmlFor={`cat-${category}`}>{category}</Label>
              </span>
            </StoryRow>
          ))}
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

export const NotificationPreferences: Story = {
  name: "ERP — Notification Preferences",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        {[
          {
            id: "np-approval",
            icon: FileTextIcon,
            label: "Approval requests",
            description: "When a record requires your sign-off",
            defaultChecked: true,
          },
          {
            id: "np-payment",
            icon: CreditCardIcon,
            label: "Payment confirmations",
            description: "When payments are processed or fail",
            defaultChecked: true,
          },
          {
            id: "np-team",
            icon: UsersIcon,
            label: "Team activity digest",
            description: "Daily summary of team submissions",
            defaultChecked: false,
          },
          {
            id: "np-security",
            icon: ShieldCheckIcon,
            label: "Security alerts",
            description: "Login from new device or permission changes",
            defaultChecked: true,
          },
        ].map(({ id, icon: Icon, label, description, defaultChecked }) => (
          <StoryRow
            align="start"
            className="rounded-md border border-border"
            gap="md"
            key={id}
            padding="sm"
          >
            <Checkbox defaultChecked={defaultChecked} id={id} />
            <StoryStack className="flex-1" gap="xs">
              <StoryRow align="center" gap="sm">
                <Icon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
                <span className="font-medium">
                  <Label htmlFor={id}>{label}</Label>
                </span>
              </StoryRow>
              <span className="text-muted-foreground text-xs">
                {description}
              </span>
            </StoryStack>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const AuditScopeSelection: Story = {
  name: "ERP — Audit Scope Selection",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryStack gap="xs">
          <span className="font-semibold text-sm">Audit report scope</span>
          <span className="text-muted-foreground text-xs">
            Q2 2026 financial close — select modules to include
          </span>
        </StoryStack>
        {[
          { id: "aud-gl", label: "General ledger", defaultChecked: true },
          { id: "aud-ap", label: "Accounts payable", defaultChecked: true },
          { id: "aud-ar", label: "Accounts receivable", defaultChecked: true },
          { id: "aud-payroll", label: "Payroll", defaultChecked: false },
          { id: "aud-fixed", label: "Fixed assets", defaultChecked: false },
        ].map(({ id, label, defaultChecked }) => (
          <StoryRow align="center" gap="sm" key={id}>
            <Checkbox defaultChecked={defaultChecked} id={id} />
            <Label htmlFor={id}>{label}</Label>
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const EmailDigestOptions: Story = {
  name: "ERP — Email Digest Options",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="start" gap="md" padding="sm">
          <MailIcon
            aria-hidden="true"
            className="size-5 text-muted-foreground"
          />
          <StoryStack className="flex-1" gap="sm">
            <StoryStack gap="xs">
              <span className="font-semibold text-sm">
                Email digest frequency
              </span>
              <span className="text-muted-foreground text-xs">
                Choose which updates are bundled into your daily digest
              </span>
            </StoryStack>
            {[
              {
                id: "dig-pending",
                label: "Pending approvals",
                defaultChecked: true,
              },
              {
                id: "dig-overdue",
                label: "Overdue items",
                defaultChecked: true,
              },
              {
                id: "dig-comments",
                label: "New comments on watched records",
                defaultChecked: false,
              },
              {
                id: "dig-reports",
                label: "Scheduled report outputs",
                defaultChecked: false,
              },
            ].map(({ id, label, defaultChecked }) => (
              <StoryRow align="center" gap="sm" key={id}>
                <Checkbox
                  id={id}
                  {...(defaultChecked ? { defaultChecked: true } : {})}
                />
                <span className="font-normal">
                  <Label htmlFor={id}>{label}</Label>
                </span>
              </StoryRow>
            ))}
          </StoryStack>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};

// ─── Radio Group ──────────────────────────────────────────────────────────

export const RadioGroupDefault: Story = {
  name: "RadioGroup — Default",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <RadioGroup className="flex flex-col gap-2" defaultValue="medium">
        {(["Critical", "High", "Medium", "Low"] as const).map((level) => (
          <StoryRow align="center" gap="sm" key={level}>
            <RadioGroupItem id={`rg-${level}`} value={level.toLowerCase()} />
            <Label htmlFor={`rg-${level}`}>{level}</Label>
          </StoryRow>
        ))}
      </RadioGroup>
    </StoryFrame>
  ),
};

export const RadioGroupApproval: Story = {
  name: "ERP — Approval Decision",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <span className="font-semibold text-sm">
          <Label>Approval Decision</Label>
        </span>
        <RadioGroup className="flex flex-col gap-3" defaultValue="approve">
          {[
            {
              value: "approve",
              label: "Approve",
              description: "Record passes review and proceeds to next stage",
            },
            {
              value: "reject",
              label: "Reject",
              description: "Record is rejected and returned to submitter",
            },
            {
              value: "hold",
              label: "Place on Hold",
              description: "Defer decision pending further information",
            },
          ].map(({ value, label, description }) => (
            <StoryRow
              align="start"
              className="rounded-md border border-border has-[:checked]:border-primary"
              gap="md"
              key={value}
              padding="sm"
            >
              <RadioGroupItem id={`radio-${value}`} value={value} />
              <StoryStack gap="xs">
                <span className="font-medium">
                  <Label htmlFor={`radio-${value}`}>{label}</Label>
                </span>
                <span className="text-muted-foreground text-xs">
                  {description}
                </span>
              </StoryStack>
            </StoryRow>
          ))}
        </RadioGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const RadioGroupHorizontal: Story = {
  name: "ERP — Horizontal Priority Picker",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="xs">
        <span className="font-medium text-sm">
          <Label>Priority</Label>
        </span>
        <RadioGroup className="flex gap-4" defaultValue="medium">
          {["Low", "Medium", "High", "Critical"].map((p) => (
            <StoryRow align="center" gap="xs" key={p}>
              <RadioGroupItem id={`rh-${p}`} value={p.toLowerCase()} />
              <Label htmlFor={`rh-${p}`}>{p}</Label>
            </StoryRow>
          ))}
        </RadioGroup>
      </StoryStack>
    </StoryFrame>
  ),
};

export const RadioGroupDisabled: Story = {
  name: "RadioGroup — Disabled",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="sm">
      <RadioGroup
        className="flex flex-col gap-2"
        defaultValue="medium"
        disabled
      >
        {["Low", "Medium", "High"].map((p) => (
          <StoryRow align="center" gap="sm" key={p}>
            <RadioGroupItem id={`rd-${p}`} value={p.toLowerCase()} />
            <Label htmlFor={`rd-${p}`}>{p}</Label>
          </StoryRow>
        ))}
      </RadioGroup>
    </StoryFrame>
  ),
};

// ─── Switch ───────────────────────────────────────────────────────────────

export const SwitchDefault: Story = {
  name: "Switch — Default",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Switch id="sw-default" />
      <Label htmlFor="sw-default">Enable notifications</Label>
    </StoryRow>
  ),
};

export const SwitchChecked: Story = {
  name: "Switch — Checked",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Switch defaultChecked id="sw-checked" />
      <Label htmlFor="sw-checked">Auto-save enabled</Label>
    </StoryRow>
  ),
};

export const SwitchSmall: Story = {
  name: "Switch — Small",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Switch id="sw-sm" size="sm" />
      <Label htmlFor="sw-sm">Compact mode</Label>
    </StoryRow>
  ),
};

export const SwitchDisabled: Story = {
  name: "Switch — Disabled",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      <StoryRow align="center" gap="sm">
        <Switch disabled id="sw-dis" />
        <Label htmlFor="sw-dis">Locked feature</Label>
      </StoryRow>
      <StoryRow align="center" gap="sm">
        <Switch defaultChecked disabled id="sw-dis-on" />
        <Label htmlFor="sw-dis-on">Mandatory policy (read-only)</Label>
      </StoryRow>
    </StoryStack>
  ),
};

export const SwitchSettingsPanel: Story = {
  name: "ERP — Settings Panel Switches",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        {[
          {
            id: "sw-email",
            label: "Email Notifications",
            description: "Receive alerts for approvals and rejections",
            defaultChecked: true,
          },
          {
            id: "sw-sms",
            label: "SMS Alerts",
            description: "Critical system alerts via SMS",
            defaultChecked: false,
          },
          {
            id: "sw-2fa",
            label: "Two-Factor Authentication",
            description: "Required for financial module access",
            defaultChecked: true,
          },
          {
            id: "sw-dark",
            label: "Dark Mode",
            description: "Switch interface to dark theme",
            defaultChecked: false,
          },
          {
            id: "sw-log",
            label: "Audit Logging",
            description: "Log all user actions for compliance",
            defaultChecked: true,
            disabled: true,
          },
        ].map(({ id, label, description, defaultChecked, disabled }) => (
          <StoryRow
            align="center"
            className="rounded-md border border-border"
            justify="between"
            key={id}
            padding="sm"
          >
            <StoryStack gap="xs">
              <span className="font-medium text-sm">{label}</span>
              <span className="text-muted-foreground text-xs">
                {description}
              </span>
            </StoryStack>
            <Switch
              defaultChecked={defaultChecked}
              disabled={disabled}
              id={id}
            />
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const AllSwitchSizes: Story = {
  name: "Matrix — Switch Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      {(["sm", "md"] as const).map((size) => (
        <StoryRow align="center" gap="sm" key={size}>
          <Switch defaultChecked id={`sw-sz-${size}`} size={size} />
          <Label htmlFor={`sw-sz-${size}`}>Size: {size}</Label>
        </StoryRow>
      ))}
    </StoryStack>
  ),
};
