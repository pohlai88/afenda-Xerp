import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ActivityIcon,
  BellIcon,
  BuildingIcon,
  CalendarIcon,
  ChevronDownIcon,
  ClipboardListIcon,
  CreditCardIcon,
  FileTextIcon,
  FilterIcon,
  HelpCircleIcon,
  HistoryIcon,
  LockIcon,
  PackageIcon,
  ShieldIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import { type ComponentType, type ReactNode, useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Badge } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";
import { Switch } from "./switch";

// ─── Data ──────────────────────────────────────────────────────────────────

const MODULE_PERMISSIONS = [
  ["Finance", "Read / Write"],
  ["HR", "Read Only"],
  ["Operations", "Read / Write"],
  ["Procurement", "No Access"],
  ["Reports", "Read / Write"],
  ["Admin Console", "No Access"],
] as const;

const FAQ_ITEMS = [
  {
    q: "How do I submit an expense report?",
    a: "Navigate to Finance → Expenses, click 'New Report', fill in the details, attach receipts, and submit for approval. Reports are typically reviewed within 2 business days.",
  },
  {
    q: "How do I request time off?",
    a: "Go to HR → Leave Management, click 'Request Leave', select your dates and leave type, then submit. Your manager will receive a notification to approve or decline.",
  },
  {
    q: "Who has approval authority for invoices?",
    a: "Invoices under $500 auto-approve. $500–$5,000 requires department head approval. Over $5,000 requires VP Finance and CFO sign-off.",
  },
  {
    q: "How do I reset my password?",
    a: "Click 'Forgot Password' on the login screen. Enter your work email and a reset link will be sent within 5 minutes. Links expire after 30 minutes.",
  },
  {
    q: "Can I access the system on mobile?",
    a: "Yes. The system is fully responsive and works on any modern browser. Native iOS and Android apps are available in their respective app stores.",
  },
] as const;

const PO_LINE_ITEMS = [
  {
    id: "PO-LI-001",
    sku: "SKU-4401",
    description: "Ergonomic Office Chair — Black",
    qty: 12,
    unit: "$189.00",
    total: "$2,268.00",
  },
  {
    id: "PO-LI-002",
    sku: "SKU-8820",
    description: "Standing Desk — 160cm Walnut",
    qty: 6,
    unit: "$420.00",
    total: "$2,520.00",
  },
  {
    id: "PO-LI-003",
    sku: "SKU-1190",
    description: "Monitor Arm — Dual VESA",
    qty: 18,
    unit: "$64.50",
    total: "$1,161.00",
  },
] as const;

const AUDIT_EVENTS = [
  {
    id: "evt-1",
    actor: "Jane Doe",
    action: "Submitted for approval",
    timestamp: "Jun 21, 2026 · 09:14",
    tone: "info" as const,
  },
  {
    id: "evt-2",
    actor: "Michael Chen",
    action: "Approved — Department Head",
    timestamp: "Jun 21, 2026 · 11:42",
    tone: "success" as const,
  },
  {
    id: "evt-3",
    actor: "Finance Bot",
    action: "Pending — VP Finance review",
    timestamp: "Awaiting action",
    tone: "warning" as const,
  },
  {
    id: "evt-4",
    actor: "Maria Kim",
    action: "Final sign-off required",
    timestamp: "Not started",
    tone: "neutral" as const,
  },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

function permissionTone(access: string): "success" | "info" | "neutral" {
  if (access === "Read / Write") {
    return "success";
  }
  if (access === "Read Only") {
    return "info";
  }
  return "neutral";
}

function AccordionTriggerWithIcon({
  icon: Icon,
  label,
  badge,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  badge?: ReactNode;
}) {
  return (
    <span className="flex w-full items-center justify-between gap-2">
      <span className="flex items-center gap-2">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        {label}
      </span>
      {badge}
    </span>
  );
}

function DefinitionGrid({
  rows,
  columns = 2,
}: {
  rows: readonly (readonly [string, string])[];
  columns?: 2 | 3;
}) {
  return (
    <dl
      className={`grid gap-x-6 gap-y-3 py-2 text-sm ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}
    >
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-muted-foreground text-xs">{label}</dt>
          <dd className="font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ControlledAccordionComponent() {
  const [value, setValue] = useState("billing");
  return (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <StoryRow align="center" gap="sm" justify="between">
          <span className="text-muted-foreground text-xs">
            Open section: <strong className="text-foreground">{value}</strong>
          </span>
          <Button
            emphasis="ghost"
            intent="secondary"
            onClick={() => setValue("security")}
            size="sm"
          >
            Jump to Security
          </Button>
        </StoryRow>
        <Accordion
          collapsible
          onValueChange={setValue}
          type="single"
          value={value}
        >
          <AccordionItem value="profile">
            <AccordionTrigger>Profile</AccordionTrigger>
            <AccordionContent>
              Controlled accordion — section state is managed externally via
              React state.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="billing">
            <AccordionTrigger>Billing</AccordionTrigger>
            <AccordionContent>
              Billing section is open by default in this controlled demo.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="security">
            <AccordionTrigger>Security</AccordionTrigger>
            <AccordionContent>
              Use the button above to programmatically expand this section.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </StoryStack>
    </StoryFrame>
  );
}

function shipmentStatusTone(
  status: "done" | "active" | "pending"
): "success" | "info" | "neutral" {
  if (status === "done") {
    return "success";
  }
  if (status === "active") {
    return "info";
  }
  return "neutral";
}

function shipmentStatusLabel(status: "done" | "active" | "pending"): string {
  if (status === "done") {
    return "Complete";
  }
  if (status === "active") {
    return "Current";
  }
  return "Pending";
}

// ─── Accordion ─────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix-UI Accordion for ERP settings, record detail sections, FAQ, and collapsible data panels. Supports `single` and `multiple` expansion modes with icon triggers, badge counts, and controlled state.",
      },
    },
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
      table: { defaultValue: { summary: "single" } },
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
    collapsible: { control: "boolean" },
  },
  args: {
    type: "single",
    collapsible: true,
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic variants ────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <StoryFrame width="lg">
      <Accordion collapsible defaultValue="item-1" type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is an ERP system?</AccordionTrigger>
          <AccordionContent>
            An ERP (Enterprise Resource Planning) system integrates core
            business processes — including finance, HR, supply chain, and
            operations — into a single unified platform.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How are permissions managed?</AccordionTrigger>
          <AccordionContent>
            Permissions are assigned at the role level. Administrators can
            create custom roles and assign granular access to specific modules
            and actions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is data encrypted at rest?</AccordionTrigger>
          <AccordionContent>
            Yes. All data is encrypted at rest using AES-256 and in transit via
            TLS 1.3. Encryption keys are managed separately from application
            data.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StoryFrame>
  ),
};

export const MultipleExpand: Story = {
  name: "Accordion — Multiple Expand",
  render: () => (
    <StoryFrame width="lg">
      <Accordion defaultValue={["section-a", "section-b"]} type="multiple">
        <AccordionItem value="section-a">
          <AccordionTrigger>General Settings</AccordionTrigger>
          <AccordionContent>
            Configure company name, locale, timezone, and default currency.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="section-b">
          <AccordionTrigger>Email Settings</AccordionTrigger>
          <AccordionContent>
            Configure SMTP server, notification templates, and delivery
            preferences.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="section-c">
          <AccordionTrigger>Security Settings</AccordionTrigger>
          <AccordionContent>
            Configure password policy, session timeout, and 2FA requirements.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StoryFrame>
  ),
};

export const WithDisabledItem: Story = {
  name: "Accordion — Disabled Item",
  render: () => (
    <StoryFrame width="lg">
      <Accordion collapsible defaultValue="active" type="single">
        <AccordionItem value="active">
          <AccordionTrigger>Active Module</AccordionTrigger>
          <AccordionContent>
            This section is available to all users with read access.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem disabled value="restricted">
          <AccordionTrigger>Restricted Module (no access)</AccordionTrigger>
          <AccordionContent>
            Content hidden — user lacks permission to view this module.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shared">
          <AccordionTrigger>Shared Reports</AccordionTrigger>
          <AccordionContent>
            Reports shared across departments with read-only access.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StoryFrame>
  ),
};

export const TriggerWithBadge: Story = {
  name: "Accordion — Trigger with Badge",
  render: () => (
    <StoryFrame width="lg">
      <Accordion collapsible defaultValue="line-items" type="single">
        <AccordionItem value="summary">
          <AccordionTrigger>
            <AccordionTriggerWithIcon icon={FileTextIcon} label="Summary" />
          </AccordionTrigger>
          <AccordionContent>
            Invoice summary: vendor, amount, dates, and payment terms.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="line-items">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              badge={
                <Badge emphasis="soft" size="sm" tone="neutral">
                  12
                </Badge>
              }
              icon={ClipboardListIcon}
              label="Line Items"
            />
          </AccordionTrigger>
          <AccordionContent>
            Expandable line items table with quantity, unit price, and totals.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="approvals">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              badge={
                <Badge emphasis="soft" size="sm" tone="warning">
                  Pending
                </Badge>
              }
              icon={ShieldIcon}
              label="Approvals"
            />
          </AccordionTrigger>
          <AccordionContent>
            Multi-stage approval workflow with approver names and timestamps.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StoryFrame>
  ),
};

export const Controlled: Story = {
  name: "Accordion — Controlled State",
  render: () => <ControlledAccordionComponent />,
};

// ─── Governance probes ─────────────────────────────────────────────────────

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          'Consumer passes `data-slot="override"` and `data-component="Override"` — governed values (`data-slot="accordion"`, `data-component="Accordion"`, `data-recipe="surface"`) must win in the DOM. Inspect the root element to confirm.',
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <Accordion
        collapsible
        data-component="Override"
        data-slot="override"
        data-testid="governance-accordion-root"
        defaultValue="item-1"
        type="single"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>
            Governed root attributes must override consumer `data-*` props.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section B</AccordionTrigger>
          <AccordionContent>Second section for comparison.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Accordion triggers are native `button` elements with `aria-expanded`. Disabled items remain in the tab order but are inoperable via `disabled`. Verify keyboard focus and expansion semantics in the DOM.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <Accordion collapsible defaultValue="active" type="single">
        <AccordionItem value="active">
          <AccordionTrigger>Active section (expanded)</AccordionTrigger>
          <AccordionContent>
            Trigger exposes `aria-expanded="true"` when open.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem disabled value="restricted">
          <AccordionTrigger>Restricted section (disabled)</AccordionTrigger>
          <AccordionContent>
            Disabled items cannot be expanded by keyboard or pointer.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="available">
          <AccordionTrigger>Available section (collapsed)</AccordionTrigger>
          <AccordionContent>
            Trigger exposes `aria-expanded="false"` when closed.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
          "Reference map of emitted `data-slot` values from `primitive-registry.ts`. Internal slot roles (e.g. `label`, `control`) differ from emitted DOM values (e.g. `accordion-item`, `accordion-trigger`).",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <p className="font-mono text-muted-foreground text-xs">
          root → accordion · label → accordion-item · control →
          accordion-trigger · content → accordion-content · header →
          accordion-header · content-inner → accordion-content-inner · icon →
          accordion-trigger-icon
        </p>
        <Accordion defaultValue="slots" type="single">
          <AccordionItem data-testid="slot-item" value="slots">
            <AccordionTrigger>Inspect slot attributes</AccordionTrigger>
            <AccordionContent>
              Open DevTools and verify `data-component`, `data-recipe`,
              `data-slot`, and `data-state` on each accordion part.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="lg">
          <p className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </p>
          <Accordion
            collapsible
            defaultValue="item-1"
            state={state}
            type="single"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Section A</AccordionTrigger>
              <AccordionContent>
                Governed accordion content for state probe.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Section B</AccordionTrigger>
              <AccordionContent>
                Second section for comparison.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const SettingsAccordion: Story = {
  name: "ERP — Settings Sections",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Accordion collapsible defaultValue="profile" type="single">
        <AccordionItem value="profile">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              icon={UserIcon}
              label="Profile & Account"
            />
          </AccordionTrigger>
          <AccordionContent>
            <DefinitionGrid
              rows={[
                ["Display Name", "Jane Doe"],
                ["Employee ID", "EMP-00142"],
                ["Email", "jane.doe@company.com"],
                ["Phone", "+65 9123 4567"],
                ["Department", "Engineering"],
                ["Time Zone", "Asia/Singapore (UTC+8)"],
              ]}
            />
            <Button emphasis="outline" intent="secondary" size="sm">
              Edit Profile
            </Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="notifications">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              icon={BellIcon}
              label="Notification Preferences"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="sm">
              {[
                {
                  id: "notif-email",
                  label: "Email Notifications",
                  description: "Approval requests, rejections",
                  checked: true,
                },
                {
                  id: "notif-sms",
                  label: "SMS Alerts",
                  description: "Critical system alerts only",
                  checked: false,
                },
                {
                  id: "notif-push",
                  label: "Browser Push",
                  description: "In-app notifications",
                  checked: true,
                },
              ].map(({ id, label, description, checked }) => (
                <div className="flex items-center justify-between" key={id}>
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-sm" htmlFor={id}>
                      {label}
                    </Label>
                    <span className="text-muted-foreground text-xs">
                      {description}
                    </span>
                  </div>
                  <Switch defaultChecked={checked} id={id} size="sm" />
                </div>
              ))}
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="security">
          <AccordionTrigger>
            <AccordionTriggerWithIcon icon={LockIcon} label="Security" />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="sm">
              <StoryRow justify="between">
                <div>
                  <p className="font-medium text-sm">
                    Two-Factor Authentication
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Authenticator app enabled
                  </p>
                </div>
                <Badge emphasis="soft" tone="success">
                  Enabled
                </Badge>
              </StoryRow>
              <StoryRow justify="between">
                <div>
                  <p className="font-medium text-sm">Active Sessions</p>
                  <p className="text-muted-foreground text-xs">
                    3 devices logged in
                  </p>
                </div>
                <Button emphasis="ghost" intent="destructive" size="sm">
                  Revoke All
                </Button>
              </StoryRow>
              <Button emphasis="outline" intent="secondary" size="sm">
                Change Password
              </Button>
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="billing">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              icon={CreditCardIcon}
              label="Billing & Subscription"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryRow justify="between">
              <div>
                <p className="font-medium text-sm">Enterprise Plan</p>
                <p className="text-muted-foreground text-xs">
                  Renews Aug 1, 2026 · $1,200/mo
                </p>
              </div>
              <Button emphasis="outline" intent="secondary" size="sm">
                Manage Plan
              </Button>
            </StoryRow>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="permissions">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              icon={ShieldIcon}
              label="Module Permissions"
            />
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {MODULE_PERMISSIONS.map(([module, access]) => (
                <div className="flex items-center justify-between" key={module}>
                  <span>{module}</span>
                  <Badge
                    emphasis="soft"
                    size="sm"
                    tone={permissionTone(access)}
                  >
                    {access}
                  </Badge>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StoryFrame>
  ),
};

export const EmployeeRecord: Story = {
  name: "ERP — Employee Record Sections",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Accordion collapsible defaultValue="info" type="single">
        <AccordionItem value="info">
          <AccordionTrigger>
            <AccordionTriggerWithIcon icon={UserIcon} label="Personal Info" />
          </AccordionTrigger>
          <AccordionContent>
            <DefinitionGrid
              rows={[
                ["Full Name", "Jane Doe"],
                ["Employee ID", "EMP-00142"],
                ["Email", "jane.doe@company.com"],
                ["Phone", "+65 9123 4567"],
                ["Department", "Engineering"],
                ["Location", "Singapore"],
              ]}
            />
            <StoryRow gap="sm" justify="end">
              <Button emphasis="outline" intent="secondary" size="sm">
                Edit Profile
              </Button>
            </StoryRow>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="employment">
          <AccordionTrigger>
            <AccordionTriggerWithIcon icon={FileTextIcon} label="Employment" />
          </AccordionTrigger>
          <AccordionContent>
            <DefinitionGrid
              rows={[
                ["Job Title", "Senior Software Engineer"],
                ["Manager", "Michael Chen"],
                ["Start Date", "Mar 15, 2022"],
                ["Employment Type", "Full-time"],
                ["Cost Center", "ENG-042"],
                ["Grade", "L5"],
              ]}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="activity">
          <AccordionTrigger>
            <AccordionTriggerWithIcon icon={ActivityIcon} label="Activity" />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="xs">
              {[
                "Submitted leave request — Jun 20, 2026",
                "Completed onboarding module — Jun 18, 2026",
                "Updated emergency contact — Jun 10, 2026",
              ].map((event) => (
                <p className="text-muted-foreground text-sm" key={event}>
                  {event}
                </p>
              ))}
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="access">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              icon={ShieldIcon}
              label="Access & Permissions"
            />
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {MODULE_PERMISSIONS.map(([module, access]) => (
                <div className="flex items-center justify-between" key={module}>
                  <span>{module}</span>
                  <Badge
                    emphasis="soft"
                    size="sm"
                    tone={permissionTone(access)}
                  >
                    {access}
                  </Badge>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="history">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              icon={HistoryIcon}
              label="Change History"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="xs">
              {[
                ["Jun 20, 2026", "Department changed to Engineering"],
                ["Jun 10, 2026", "Emergency contact updated"],
                ["Mar 15, 2022", "Record created"],
              ].map(([date, change]) => (
                <div className="flex gap-3 text-sm" key={date}>
                  <span className="shrink-0 text-muted-foreground text-xs">
                    {date}
                  </span>
                  <span>{change}</span>
                </div>
              ))}
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StoryFrame>
  ),
};

export const InvoiceRecord: Story = {
  name: "ERP — Invoice Detail Sections",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Accordion collapsible defaultValue="summary" type="single">
        <AccordionItem value="summary">
          <AccordionTrigger>
            <AccordionTriggerWithIcon icon={FileTextIcon} label="Summary" />
          </AccordionTrigger>
          <AccordionContent>
            <DefinitionGrid
              columns={3}
              rows={[
                ["Invoice No.", "INV-2026-0042"],
                ["Vendor", "Acme Software Ltd."],
                ["Status", "Pending Approval"],
                ["Amount", "$4,850.00 USD"],
                ["Issue Date", "Jun 21, 2026"],
                ["Due Date", "Jul 15, 2026"],
              ]}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="line-items">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              badge={
                <Badge emphasis="soft" size="sm" tone="neutral">
                  12
                </Badge>
              }
              icon={ClipboardListIcon}
              label="Line Items"
            />
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-hidden rounded-md border border-border text-sm">
              <StoryRow
                className="border-border border-b bg-muted/30 font-medium text-muted-foreground text-xs"
                gap="lg"
                paddingX="lg"
                paddingY="sm"
              >
                <span className="flex-1">Description</span>
                <span className="w-16 text-right">Qty</span>
                <span className="w-24 text-right">Unit</span>
                <span className="w-24 text-right">Total</span>
              </StoryRow>
              {PO_LINE_ITEMS.map(({ id, description, qty, unit, total }) => (
                <div
                  className="flex gap-4 border-border border-b last:border-0"
                  key={id}
                >
                  <span className="flex-1">{description}</span>
                  <span className="w-16 text-right text-muted-foreground">
                    {qty}
                  </span>
                  <span className="w-24 text-right text-muted-foreground">
                    {unit}
                  </span>
                  <span className="w-24 text-right font-medium">{total}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="approvals">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              badge={
                <Badge emphasis="soft" size="sm" tone="warning">
                  Pending
                </Badge>
              }
              icon={ShieldIcon}
              label="Approvals"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="sm">
              {AUDIT_EVENTS.map(({ id, actor, action, timestamp, tone }) => (
                <div
                  className="flex items-start justify-between gap-4"
                  key={id}
                >
                  <div>
                    <p className="font-medium text-sm">{action}</p>
                    <p className="text-muted-foreground text-xs">{actor}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge emphasis="soft" size="sm" tone={tone}>
                      {timestamp}
                    </Badge>
                  </div>
                </div>
              ))}
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="attachments">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              badge={
                <Badge emphasis="soft" size="sm" tone="neutral">
                  3
                </Badge>
              }
              icon={PackageIcon}
              label="Attachments"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="xs">
              {[
                "invoice-0042.pdf — 248 KB",
                "purchase-order-8821.pdf — 112 KB",
                "delivery-receipt.jpg — 1.4 MB",
              ].map((file) => (
                <p className="text-muted-foreground text-sm" key={file}>
                  {file}
                </p>
              ))}
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StoryFrame>
  ),
};

export const ApprovalAuditTrail: Story = {
  name: "ERP — Approval Audit Trail",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Accordion collapsible defaultValue="workflow" type="single">
        <AccordionItem value="workflow">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              badge={
                <Badge emphasis="soft" size="sm" tone="warning">
                  2 of 4
                </Badge>
              }
              icon={ShieldIcon}
              label="Approval Workflow"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="md">
              {AUDIT_EVENTS.map(({ id, actor, action, timestamp, tone }) => (
                <div className="flex items-start gap-3" key={id}>
                  <div className="size-2 shrink-0 rounded-full bg-border" />
                  <div className="flex flex-1 items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{action}</p>
                      <p className="text-muted-foreground text-xs">{actor}</p>
                    </div>
                    <Badge emphasis="soft" size="sm" tone={tone}>
                      {timestamp}
                    </Badge>
                  </div>
                </div>
              ))}
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="comments">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              badge={
                <Badge emphasis="soft" size="sm" tone="neutral">
                  2
                </Badge>
              }
              icon={FileTextIcon}
              label="Reviewer Comments"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="sm">
              {[
                {
                  author: "Michael Chen",
                  text: "Please attach the signed PO before final approval.",
                  date: "Jun 21, 2026",
                },
                {
                  author: "Jane Doe",
                  text: "PO attached — ready for VP Finance review.",
                  date: "Jun 21, 2026",
                },
              ].map(({ author, text, date }) => (
                <StoryStack
                  className="rounded-md border border-border"
                  gap="xs"
                  key={`${author}-${date}`}
                  padding="md"
                >
                  <StoryRow justify="between">
                    <span className="font-medium text-sm">{author}</span>
                    <span className="text-muted-foreground text-xs">
                      {date}
                    </span>
                  </StoryRow>
                  <p className="text-muted-foreground text-sm">{text}</p>
                </StoryStack>
              ))}
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StoryFrame>
  ),
};

export const CreateRecordForm: Story = {
  name: "ERP — Create Record Form Sections",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Accordion defaultValue={["general", "contact"]} type="multiple">
        <AccordionItem value="general">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              icon={BuildingIcon}
              label="General Information"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="rec-name">Company Name</Label>
                  <Input id="rec-name" placeholder="Acme Corp" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="rec-id">Record ID</Label>
                  <Input id="rec-id" placeholder="VND-00001" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Industry</Label>
                <Select defaultValue="tech">
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="contact">
          <AccordionTrigger>
            <AccordionTriggerWithIcon icon={UserIcon} label="Contact Details" />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="rec-email">Email</Label>
                  <Input
                    id="rec-email"
                    placeholder="contact@acme.com"
                    type="email"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="rec-phone">Phone</Label>
                  <Input id="rec-phone" placeholder="+1 555 0100" type="tel" />
                </div>
              </div>
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="billing">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              icon={CreditCardIcon}
              label="Billing & Terms"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="rec-terms">Payment Terms</Label>
                  <Select defaultValue="net30">
                    <SelectTrigger id="rec-terms">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="rec-currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="rec-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="sgd">SGD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator />
      <StoryRow gap="sm" justify="end">
        <Button emphasis="ghost" intent="secondary">
          Cancel
        </Button>
        <Button emphasis="outline" intent="secondary">
          Save Draft
        </Button>
        <Button emphasis="solid" intent="primary">
          Create Record
        </Button>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ReportFilterGroups: Story = {
  name: "ERP — Report Filter Groups",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Accordion type="multiple">
        <AccordionItem value="date">
          <AccordionTrigger>
            <AccordionTriggerWithIcon icon={CalendarIcon} label="Date Range" />
          </AccordionTrigger>
          <AccordionContent>
            <StoryRow gap="sm" wrap>
              <div className="flex min-w-36 flex-1 flex-col gap-1">
                <Label htmlFor="rpt-from">From</Label>
                <Input id="rpt-from" size="sm" type="date" />
              </div>
              <div className="flex min-w-36 flex-1 flex-col gap-1">
                <Label htmlFor="rpt-to">To</Label>
                <Input id="rpt-to" size="sm" type="date" />
              </div>
            </StoryRow>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="org">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              icon={BuildingIcon}
              label="Organization"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="sm">
              <div className="flex flex-col gap-1">
                <Label>Department</Label>
                <Select defaultValue="all">
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="ops">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Cost Center</Label>
                <Select defaultValue="all">
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="All cost centers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cost Centers</SelectItem>
                    <SelectItem value="cc-100">CC-100 HQ</SelectItem>
                    <SelectItem value="cc-200">CC-200 APAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="status">
          <AccordionTrigger>
            <AccordionTriggerWithIcon
              icon={FilterIcon}
              label="Status Filters"
            />
          </AccordionTrigger>
          <AccordionContent>
            <StoryStack gap="sm">
              {[
                { id: "st-active", label: "Active records" },
                { id: "st-pending", label: "Pending approval" },
                { id: "st-overdue", label: "Overdue items" },
                { id: "st-archived", label: "Include archived" },
              ].map(({ id, label }) => (
                <div className="flex items-center gap-2" key={id}>
                  <Checkbox id={id} />
                  <Label className="font-normal text-sm" htmlFor={id}>
                    {label}
                  </Label>
                </div>
              ))}
            </StoryStack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <StoryRow gap="sm" justify="end">
        <Button emphasis="ghost" intent="secondary" size="sm">
          Reset
        </Button>
        <Button emphasis="solid" intent="primary" size="sm">
          Run Report
        </Button>
      </StoryRow>
    </StoryFrame>
  ),
};

export const PurchaseOrderLines: Story = {
  name: "ERP — Purchase Order Line Items",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">PO-2026-0088</p>
          <p className="text-muted-foreground text-xs">
            Office Supplies Co. · Total $5,949.00
          </p>
        </div>
        <Badge emphasis="soft" tone="warning">
          Pending Receipt
        </Badge>
      </div>
      <Accordion type="multiple">
        {PO_LINE_ITEMS.map(({ id, sku, description, qty, unit, total }) => (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger>
              <span className="flex w-full items-center justify-between gap-4">
                <span className="flex flex-col items-start gap-0.5 text-left">
                  <span className="font-medium text-sm">{description}</span>
                  <span className="font-normal text-muted-foreground text-xs">
                    {sku} · Qty {qty}
                  </span>
                </span>
                <span className="shrink-0 font-medium text-sm">{total}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <DefinitionGrid
                rows={[
                  ["SKU", sku],
                  ["Quantity", String(qty)],
                  ["Unit Price", unit],
                  ["Line Total", total],
                  ["Expected Delivery", "Jun 28, 2026"],
                ]}
              />
              <StoryRow gap="sm">
                <Button emphasis="outline" intent="secondary" size="sm">
                  Receive Items
                </Button>
                <Button emphasis="ghost" intent="secondary" size="sm">
                  View History
                </Button>
              </StoryRow>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </StoryFrame>
  ),
};

export const ShipmentTracking: Story = {
  name: "ERP — Shipment Tracking",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <Accordion collapsible defaultValue="in-transit" type="single">
        {[
          {
            id: "picked",
            label: "Order Picked",
            detail: "Warehouse A — Jun 19, 2026 · 08:30",
            status: "done" as const,
          },
          {
            id: "in-transit",
            label: "In Transit",
            detail: "Courier: DHL Express · Tracking #DHL-8829104",
            status: "active" as const,
          },
          {
            id: "out-for-delivery",
            label: "Out for Delivery",
            detail: "Estimated Jun 22, 2026",
            status: "pending" as const,
          },
          {
            id: "delivered",
            label: "Delivered",
            detail: "Awaiting confirmation",
            status: "pending" as const,
          },
        ].map(({ id, label, detail, status }) => (
          <AccordionItem disabled={status === "pending"} key={id} value={id}>
            <AccordionTrigger>
              <AccordionTriggerWithIcon
                badge={
                  <Badge
                    emphasis="soft"
                    size="sm"
                    tone={shipmentStatusTone(status)}
                  >
                    {shipmentStatusLabel(status)}
                  </Badge>
                }
                icon={TruckIcon}
                label={label}
              />
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground text-sm">{detail}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </StoryFrame>
  ),
};

export const HelpCenter: Story = {
  name: "ERP — Help Center Categories",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Accordion type="multiple">
        {[
          {
            id: "getting-started",
            icon: HelpCircleIcon,
            title: "Getting Started",
            articles: [
              "Setting up your account",
              "Navigating the dashboard",
              "Inviting team members",
            ],
          },
          {
            id: "finance",
            icon: CreditCardIcon,
            title: "Finance & Expenses",
            articles: [
              "Submitting expense reports",
              "Understanding approval limits",
              "Exporting financial data",
            ],
          },
          {
            id: "hr",
            icon: UserIcon,
            title: "HR & Leave Management",
            articles: [
              "Requesting time off",
              "Viewing leave balances",
              "Updating personal details",
            ],
          },
        ].map(({ id, icon, title, articles }) => (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger>
              <AccordionTriggerWithIcon
                badge={
                  <Badge emphasis="soft" size="sm" tone="neutral">
                    {articles.length}
                  </Badge>
                }
                icon={icon}
                label={title}
              />
            </AccordionTrigger>
            <AccordionContent>
              <StoryStack gap="xs">
                {articles.map((article) => (
                  <button
                    className="rounded-md text-left text-primary text-sm hover:bg-muted/40"
                    key={article}
                    type="button"
                  >
                    {article}
                  </button>
                ))}
              </StoryStack>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </StoryFrame>
  ),
};

export const FaqAccordion: Story = {
  name: "ERP — FAQ Section",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <Accordion collapsible type="single">
        {FAQ_ITEMS.map(({ q, a }) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </StoryFrame>
  ),
};
