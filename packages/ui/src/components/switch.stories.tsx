import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BellIcon,
  CreditCardIcon,
  LockIcon,
  MailIcon,
  MoonIcon,
  PackageIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldSeparator,
} from "./field";
import { Label } from "./label";
import { Separator } from "./separator";
import { Switch } from "./switch";

// ─── Helpers ───────────────────────────────────────────────────────────────

type SwitchSettingRowProps = {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly badge?: { text: string; tone: "success" | "warning" | "info" };
  readonly size?: "sm" | "md";
};

function SwitchSettingRow({
  id,
  label,
  description,
  defaultChecked,
  disabled,
  badge,
  size = "md",
}: SwitchSettingRowProps) {
  return (
    <StoryRow
      align="center"
      className="rounded-md border border-border"
      justify="between"
      padding="sm"
    >
      <StoryStack gap="xs">
        <StoryRow align="center" gap="sm">
          <span className="font-medium text-sm">{label}</span>
          {badge ? (
            <Badge emphasis="soft" size="sm" tone={badge.tone}>
              {badge.text}
            </Badge>
          ) : null}
        </StoryRow>
        {description ? (
          <span className="text-muted-foreground text-xs">{description}</span>
        ) : null}
      </StoryStack>
      <Switch
        disabled={disabled}
        id={id}
        size={size}
        {...(defaultChecked !== undefined ? { defaultChecked } : {})}
      />
    </StoryRow>
  );
}

function ControlledAutoSaveComponent() {
  const [enabled, setEnabled] = useState(true);

  return (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <Label className="font-medium" htmlFor="ctrl-autosave">
              Auto-save drafts
            </Label>
            <span className="text-muted-foreground text-xs">
              Saves open forms every 30 seconds
            </span>
          </StoryStack>
          <Switch
            checked={enabled}
            id="ctrl-autosave"
            onCheckedChange={setEnabled}
          />
        </StoryRow>
        <span className="text-muted-foreground text-xs">
          Status: {enabled ? "Enabled — drafts sync to server" : "Disabled"}
        </span>
      </StoryStack>
    </StoryFrame>
  );
}

// ─── Switch ────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed binary toggle for ERP settings, feature flags, and filter quick-toggles. Supports `size` (`sm`, `md`) and governed `state`. Pair with `Label` or `Field` for accessible on/off controls. Use `Checkbox` for multi-select lists; use `Toggle` for transient pressed states (toolbars).",
      },
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md"],
      table: { defaultValue: { summary: "md" } },
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  args: {
    size: "md",
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <StoryRow align="center" gap="sm">
      <Switch id="sw-default" {...args} />
      <Label htmlFor="sw-default">Enable notifications</Label>
    </StoryRow>
  ),
};

export const Checked: Story = {
  name: "Switch — Checked",
  args: { defaultChecked: true },
  render: (args) => (
    <StoryRow align="center" gap="sm">
      <Switch id="sw-checked" {...args} />
      <Label htmlFor="sw-checked">Auto-save enabled</Label>
    </StoryRow>
  ),
};

export const Small: Story = {
  name: "Switch — Small",
  args: { size: "sm" },
  render: (args) => (
    <StoryRow align="center" gap="sm">
      <Switch id="sw-sm" {...args} />
      <Label htmlFor="sw-sm">Compact density tables</Label>
    </StoryRow>
  ),
};

export const Disabled: Story = {
  name: "Switch — Disabled",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      <StoryRow align="center" gap="sm">
        <Switch disabled id="sw-dis-off" />
        <Label htmlFor="sw-dis-off">Locked feature (off)</Label>
      </StoryRow>
      <StoryRow align="center" gap="sm">
        <Switch defaultChecked disabled id="sw-dis-on" />
        <Label htmlFor="sw-dis-on">Mandatory policy (read-only)</Label>
      </StoryRow>
    </StoryStack>
  ),
};

// ─── Governance ────────────────────────────────────────────────────────────

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="md">
          <span className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </span>
          <StoryRow align="center" gap="sm">
            <Switch defaultChecked id={`sw-state-${state}`} state={state} />
            <Label htmlFor={`sw-state-${state}`}>State probe</Label>
          </StoryRow>
        </StoryFrame>
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
          "Associate every switch with a visible label via matching `id`/`htmlFor`, or wrap in `Field` with `FieldLabel`. On/off state is exposed to assistive tech via Radix Switch.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <Field orientation="horizontal">
        <Switch defaultChecked id="sw-a11y" />
        <FieldContent>
          <FieldLabel htmlFor="sw-a11y">Email approval alerts</FieldLabel>
          <FieldDescription>
            Sends a notification when a record enters your queue.
          </FieldDescription>
        </FieldContent>
      </Field>
    </StoryFrame>
  ),
};

export const AllSizes: Story = {
  name: "Matrix — All Sizes",
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

// ─── ERP composite patterns ───────────────────────────────────────────────

export const SettingsPanel: Story = {
  name: "ERP — User Settings Panel",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <SwitchSettingRow
          defaultChecked
          description="Receive alerts for approvals and rejections"
          id="sw-email"
          label="Email notifications"
        />
        <SwitchSettingRow
          description="Critical system alerts via SMS"
          id="sw-sms"
          label="SMS alerts"
        />
        <SwitchSettingRow
          badge={{ text: "Required", tone: "warning" }}
          defaultChecked
          description="Required for financial module access"
          id="sw-2fa"
          label="Two-factor authentication"
        />
        <SwitchSettingRow
          description="Switch interface to dark theme"
          id="sw-dark"
          label="Dark mode"
        />
        <SwitchSettingRow
          defaultChecked
          disabled
          description="Log all user actions for compliance"
          id="sw-log"
          label="Audit logging"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const NotificationPreferences: Story = {
  name: "ERP — Notification Preferences",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>Notification channels</FieldLegend>
        <StoryStack gap="sm">
          <SwitchSettingRow
            defaultChecked
            description="Invoice approvals, payment failures, sync errors"
            id="np-email"
            label="Email digest"
          />
          <SwitchSettingRow
            defaultChecked
            description="Only critical incidents and SLA breaches"
            id="np-push"
            label="Push notifications"
          />
          <SwitchSettingRow
            description="Weekly summary of open POs and overdue invoices"
            id="np-weekly"
            label="Weekly rollup"
          />
        </StoryStack>
      </FieldSet>
    </StoryFrame>
  ),
};

export const SecurityPolicies: Story = {
  name: "ERP — Security Policies",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <SwitchSettingRow
          badge={{ text: "Finance", tone: "info" }}
          defaultChecked
          description="Enforce MFA before posting payments or journal entries"
          id="sec-mfa"
          label="MFA for financial actions"
        />
        <SwitchSettingRow
          defaultChecked
          description="Terminate idle sessions after 30 minutes"
          id="sec-session"
          label="Session timeout"
        />
        <SwitchSettingRow
          description="Block sign-in from unrecognized devices until verified"
          id="sec-device"
          label="Device verification"
        />
        <SwitchSettingRow
          defaultChecked
          disabled
          description="Organization policy — cannot be disabled"
          id="sec-audit"
          label="Immutable audit trail"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const FeatureFlags: Story = {
  name: "ERP — Feature Flags (Beta)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <SwitchSettingRow
          badge={{ text: "Beta", tone: "info" }}
          description="AI-assisted PO line-item suggestions"
          id="ff-ai-po"
          label="Smart purchase suggestions"
        />
        <SwitchSettingRow
          badge={{ text: "Beta", tone: "info" }}
          defaultChecked
          description="Real-time bank balance in cash management"
          id="ff-live-bank"
          label="Live bank feed preview"
        />
        <SwitchSettingRow
          description="New inventory valuation engine — finance review required"
          id="ff-inventory"
          label="Inventory costing v2"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const FilterQuickToggles: Story = {
  name: "ERP — Filter Quick Toggles",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <span className="font-medium text-sm">Invoice list filters</span>
        <StoryStack gap="sm">
          <SwitchSettingRow
            description="Due date passed and balance &gt; 0"
            id="flt-overdue"
            label="Overdue only"
            size="sm"
          />
          <SwitchSettingRow
            defaultChecked
            description="Records in your approval queue"
            id="flt-mine"
            label="Assigned to me"
            size="sm"
          />
          <SwitchSettingRow
            description="Hide reconciled and voided records"
            id="flt-open"
            label="Open balances only"
            size="sm"
          />
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const WarehouseAutomation: Story = {
  name: "ERP — Warehouse Automation",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>Warehouse A — automation</FieldLegend>
        <StoryStack gap="sm">
          <SwitchSettingRow
            defaultChecked
            description="Create PO when SKU-8842 falls below reorder point"
            id="wh-reorder"
            label="Auto-reorder fasteners"
          />
          <SwitchSettingRow
            description="Send pick list to floor tablets on PO approval"
            id="wh-pick"
            label="Auto-dispatch pick tasks"
          />
          <SwitchSettingRow
            defaultChecked
            description="Require barcode scan before quantity adjustment posts"
            id="wh-scan"
            label="Scan-to-adjust inventory"
          />
        </StoryStack>
      </FieldSet>
    </StoryFrame>
  ),
};

export const ApprovalWorkflowRules: Story = {
  name: "ERP — Approval Workflow Rules",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <SwitchSettingRow
          defaultChecked
          description="Expenses under $500 skip manager approval"
          id="ap-auto"
          label="Auto-approve under threshold"
        />
        <SwitchSettingRow
          description="Route high-value POs to CFO queue"
          id="ap-cfo"
          label="CFO escalation above $25,000"
        />
        <SwitchSettingRow
          defaultChecked
          description="Notify submitter on every state change"
          id="ap-notify"
          label="Submitter notifications"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const CustomerPortalSettings: Story = {
  name: "ERP — Customer Portal Settings",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>Northwind Traders — portal</FieldLegend>
        <StoryStack gap="sm">
          <SwitchSettingRow
            defaultChecked
            description="Allow self-service invoice PDF downloads"
            id="cp-download"
            label="Invoice downloads"
          />
          <SwitchSettingRow
            description="Customers can upload remittance advice"
            id="cp-upload"
            label="Payment proof upload"
          />
          <SwitchSettingRow
            defaultChecked
            description="Show open balance and aging summary"
            id="cp-aging"
            label="Account aging widget"
          />
        </StoryStack>
      </FieldSet>
    </StoryFrame>
  ),
};

export const TaxAndPricing: Story = {
  name: "ERP — Tax & Pricing Display",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <SwitchSettingRow
          defaultChecked
          description="Show GST/VAT in line totals and PDF exports"
          id="tax-inclusive"
          label="Tax-inclusive pricing"
        />
        <SwitchSettingRow
          description="Convert list prices using daily FX table"
          id="tax-fx"
          label="Multi-currency display"
        />
        <SwitchSettingRow
          description="Round to 2 decimals on customer-facing documents"
          id="tax-round"
          label="Round customer totals"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const PayrollSettings: Story = {
  name: "ERP — Payroll Settings",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <SwitchSettingRow
          defaultChecked
          description="Apply overtime rules for hours above 40/week"
          id="pay-ot"
          label="Overtime calculation"
        />
        <SwitchSettingRow
          description="Split direct deposit across multiple accounts"
          id="pay-split"
          label="Split deposits"
        />
        <SwitchSettingRow
          defaultChecked
          disabled
          description="Statutory requirement — cannot disable"
          id="pay-tax"
          label="Withhold income tax"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const ShippingNotifications: Story = {
  name: "ERP — Shipping Notifications",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <SwitchSettingRow
          defaultChecked
          description="Email when carrier marks shipment in transit"
          id="ship-transit"
          label="In-transit alerts"
        />
        <SwitchSettingRow
          defaultChecked
          description="Notify warehouse when delivery is delayed"
          id="ship-delay"
          label="Delay notifications"
        />
        <SwitchSettingRow
          description="Send ASN to customer ERP on ship confirm"
          id="ship-asn"
          label="Advance ship notice (ASN)"
        />
      </StoryStack>
    </StoryFrame>
  ),
};

export const ControlledInteractive: Story = {
  name: "ERP — Controlled (Interactive)",
  parameters: { layout: "padded" },
  render: () => <ControlledAutoSaveComponent />,
};

export const FieldHorizontalLayout: Story = {
  name: "ERP — Field Horizontal Layout",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <FieldSet>
        <FieldLegend>Workspace preferences</FieldLegend>
        <Field orientation="horizontal">
          <Switch defaultChecked id="fh-notify" />
          <FieldContent>
            <FieldLabel htmlFor="fh-notify">Approval reminders</FieldLabel>
            <FieldDescription>
              Daily digest of pending approvals in your queue.
            </FieldDescription>
          </FieldContent>
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <Switch id="fh-compact" size="sm" />
          <FieldContent>
            <FieldLabel htmlFor="fh-compact">Compact tables</FieldLabel>
            <FieldDescription>
              Reduce row height in data grids across modules.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const SettingsWithIcons: Story = {
  name: "ERP — Settings With Icons",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        {[
          {
            id: "ico-mail",
            icon: MailIcon,
            label: "Email notifications",
            defaultChecked: true,
          },
          {
            id: "ico-bell",
            icon: BellIcon,
            label: "In-app alerts",
            defaultChecked: true,
          },
          {
            id: "ico-lock",
            icon: LockIcon,
            label: "Session lock on idle",
          },
          {
            id: "ico-moon",
            icon: MoonIcon,
            label: "Dark mode",
          },
        ].map(({ id, icon: Icon, label, defaultChecked }) => (
          <StoryRow
            align="center"
            className="rounded-md border border-border"
            justify="between"
            key={id}
            padding="sm"
          >
            <StoryRow align="center" gap="sm">
              <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
              <Label className="font-medium text-sm" htmlFor={id}>{label}</Label>
            </StoryRow>
            <Switch
              id={id}
              {...(defaultChecked !== undefined ? { defaultChecked } : {})}
            />
          </StoryRow>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const ModuleCapabilityMatrix: Story = {
  name: "Matrix — Module Capabilities",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        {[
          {
            module: "Finance",
            icon: CreditCardIcon,
            settings: [
              { id: "mod-fin-ap", label: "AP automation", checked: true },
              { id: "mod-fin-ar", label: "AR collections", checked: false },
            ],
          },
          {
            module: "Procurement",
            icon: PackageIcon,
            settings: [
              { id: "mod-pro-po", label: "PO approvals", checked: true },
              { id: "mod-pro-vendor", label: "Vendor portal", checked: false },
            ],
          },
          {
            module: "Logistics",
            icon: TruckIcon,
            settings: [
              { id: "mod-log-track", label: "Carrier tracking", checked: true },
              { id: "mod-log-asn", label: "ASN export", checked: true },
            ],
          },
        ].map(({ module, icon: Icon, settings }) => (
          <StoryStack gap="sm" key={module}>
            <StoryRow align="center" gap="sm">
              <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
              <span className="font-semibold text-sm">{module}</span>
            </StoryRow>
            <StoryStack gap="xs">
              {settings.map(({ id, label, checked }) => (
                <StoryRow align="center" justify="between" key={id} paddingX="sm">
                  <Label className="font-normal text-sm" htmlFor={id}>
                    {label}
                  </Label>
                  <Switch defaultChecked={checked} id={id} size="sm" />
                </StoryRow>
              ))}
            </StoryStack>
            <Separator />
          </StoryStack>
        ))}
      </StoryStack>
    </StoryFrame>
  ),
};

export const SwitchVsCheckbox: Story = {
  name: "ERP — Switch vs Checkbox",
  parameters: {
    docs: {
      description: {
        story:
          "Switch: single on/off settings and feature flags. Checkbox: multi-select in lists, bulk selection, and indeterminate trees.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Switch — binary setting</span>
          <SwitchSettingRow
            defaultChecked
            description="Persistent workspace preference"
            id="vs-switch"
            label="Enable auto-save"
            size="sm"
          />
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Checkbox — multi-select</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Checkbox for export columns and org-unit trees
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const SwitchVsToggle: Story = {
  name: "ERP — Switch vs Toggle",
  parameters: {
    docs: {
      description: {
        story:
          "Switch: persisted on/off state (settings, policies). Toggle: momentary pressed state (formatting toolbars, view modes).",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Switch — persisted setting</span>
          <SwitchSettingRow
            defaultChecked
            id="vs-tog-switch"
            label="Dark mode"
            size="sm"
          />
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Toggle — toolbar state</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Toggle for list/grid view and rich-text formatting
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ComplianceReadOnly: Story = {
  name: "ERP — Compliance Read-Only Switches",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryStack gap="sm">
        <StoryRow align="center" className="rounded-md border border-border" justify="between" padding="sm">
          <StoryStack gap="xs">
            <StoryRow align="center" gap="sm">
              <ShieldCheckIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="font-medium text-sm">SOC 2 audit logging</span>
              <Badge emphasis="soft" tone="success">Enforced</Badge>
            </StoryRow>
            <span className="text-muted-foreground text-xs">
              Organization policy — controlled by compliance admin
            </span>
          </StoryStack>
          <Switch defaultChecked disabled id="comp-audit" />
        </StoryRow>
        <StoryRow align="center" className="rounded-md border border-border" justify="between" padding="sm">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">PII field encryption</span>
            <span className="text-muted-foreground text-xs">
              Salary and tax ID fields encrypted at rest
            </span>
          </StoryStack>
          <Switch defaultChecked disabled id="comp-pii" />
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  ),
};
