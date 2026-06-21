import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BarChart3Icon,
  BoldIcon,
  Building2Icon,
  CalendarIcon,
  ChartLineIcon,
  ItalicIcon,
  LayoutGridIcon,
  ListIcon,
  MapIcon,
  TableIcon,
  UnderlineIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Separator } from "./separator";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

// ─── Helpers ───────────────────────────────────────────────────────────────

function ControlledViewSwitcherComponent() {
  const [view, setView] = useState("list");

  return (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryRow align="center" gap="sm">
          <span className="text-muted-foreground text-sm">View:</span>
          <ToggleGroup
            onValueChange={(value: string) => {
              if (value) {
                setView(value);
              }
            }}
            type="single"
            value={view}
            variant="outline"
          >
            <ToggleGroupItem aria-label="List view" size="sm" value="list">
              <ListIcon />
              List
            </ToggleGroupItem>
            <ToggleGroupItem aria-label="Grid view" size="sm" value="grid">
              <LayoutGridIcon />
              Grid
            </ToggleGroupItem>
            <ToggleGroupItem aria-label="Table view" size="sm" value="table">
              <TableIcon />
              Table
            </ToggleGroupItem>
          </ToggleGroup>
        </StoryRow>
        <span className="text-muted-foreground text-sm">
          Active view: <span className="font-mono">{view}</span>
        </span>
      </StoryStack>
    </StoryFrame>
  );
}

function ControlledScopeFilterComponent() {
  const [scope, setScope] = useState("mine");

  return (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <ToggleGroup
          onValueChange={(value: string) => {
            if (value) {
              setScope(value);
            }
          }}
          type="single"
          value={scope}
          variant="outline"
        >
          <ToggleGroupItem size="sm" value="mine">
            My queue
          </ToggleGroupItem>
          <ToggleGroupItem size="sm" value="team">
            Team
          </ToggleGroupItem>
          <ToggleGroupItem size="sm" value="all">
            All
          </ToggleGroupItem>
        </ToggleGroup>
        <span className="text-muted-foreground text-sm">
          Filtering approvals for: <span className="font-mono">{scope}</span>
        </span>
      </StoryStack>
    </StoryFrame>
  );
}

// ─── ToggleGroup ───────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Governed Radix-UI toggle group for ERP view switchers, period filters, column pickers, and toolbar formatting sets. Supports `type="single"` or `multiple`, `variant`, `size`, `spacing`, and `orientation`. For standalone icon toggles, see Primitives/Toggle.',
      },
    },
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
      table: { defaultValue: { summary: "single" } },
    },
    variant: {
      control: "radio",
      options: ["default", "outline"],
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "radio",
      options: ["default", "sm", "lg"],
      table: { defaultValue: { summary: "default" } },
    },
    spacing: { control: "number" },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      table: { defaultValue: { summary: "horizontal" } },
    },
  },
  args: {
    type: "single",
    variant: "default",
    size: "default",
    spacing: 2,
    orientation: "horizontal",
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <ToggleGroup {...args} defaultValue="list">
      <ToggleGroupItem aria-label="List view" value="list">
        <ListIcon />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Grid view" value="grid">
        <LayoutGridIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const SingleSelect: Story = {
  name: "ToggleGroup — Single Select",
  render: () => (
    <ToggleGroup defaultValue="list" type="single">
      <ToggleGroupItem aria-label="List view" value="list">
        <ListIcon />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Grid view" value="grid">
        <LayoutGridIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const MultipleSelect: Story = {
  name: "ToggleGroup — Multiple Select",
  render: () => (
    <ToggleGroup defaultValue={["bold"]} type="multiple">
      <ToggleGroupItem aria-label="Bold" value="bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Italic" value="italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Underline" value="underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const OutlineVariant: Story = {
  name: "ToggleGroup — Outline Variant",
  args: { variant: "outline" },
  render: (args) => (
    <ToggleGroup {...args} defaultValue="list" type="single">
      <ToggleGroupItem size="sm" value="list">
        <ListIcon />
        List
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="grid">
        <LayoutGridIcon />
        Grid
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const SmallSize: Story = {
  name: "ToggleGroup — Small Size",
  args: { size: "sm", variant: "outline" },
  render: (args) => (
    <ToggleGroup {...args} defaultValue="usd" type="single">
      <ToggleGroupItem value="usd">USD</ToggleGroupItem>
      <ToggleGroupItem value="eur">EUR</ToggleGroupItem>
      <ToggleGroupItem value="local">Local</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const VerticalOrientation: Story = {
  name: "ToggleGroup — Vertical",
  render: () => (
    <ToggleGroup
      defaultValue="summary"
      orientation="vertical"
      type="single"
      variant="outline"
    >
      <ToggleGroupItem value="summary">Summary</ToggleGroupItem>
      <ToggleGroupItem value="lines">Line items</ToggleGroupItem>
      <ToggleGroupItem value="audit">Audit log</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const DisabledItem: Story = {
  name: "ToggleGroup — Disabled Item",
  render: () => (
    <ToggleGroup defaultValue="list" type="single" variant="outline">
      <ToggleGroupItem aria-label="List view" value="list">
        <ListIcon />
        List
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Grid view" disabled value="grid">
        <LayoutGridIcon />
        Grid
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const SpacingMatrix: Story = {
  name: "Matrix — Spacing",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="lg">
      {[0, 2, 4].map((spacing) => (
        <StoryStack gap="xs" key={spacing}>
          <span className="font-mono text-muted-foreground text-xs">
            spacing={spacing}
          </span>
          <ToggleGroup
            defaultValue="a"
            spacing={spacing}
            type="single"
            variant="outline"
          >
            <ToggleGroupItem size="sm" value="a">
              A
            </ToggleGroupItem>
            <ToggleGroupItem size="sm" value="b">
              B
            </ToggleGroupItem>
            <ToggleGroupItem size="sm" value="c">
              C
            </ToggleGroupItem>
          </ToggleGroup>
        </StoryStack>
      ))}
    </StoryStack>
  ),
};

export const GovernanceItemStates: Story = {
  name: "Governance — Item States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="sm">
          <span className="font-mono text-muted-foreground text-xs">
            item state=&quot;{state}&quot;
          </span>
          <ToggleGroup defaultValue="on" type="single" variant="outline">
            <ToggleGroupItem state={state} value="on">
              On
            </ToggleGroupItem>
            <ToggleGroupItem value="off">Off</ToggleGroupItem>
          </ToggleGroup>
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
          "Icon-only items need `aria-label`. Group root preserves single/multi selection semantics and keyboard traversal.",
      },
    },
  },
  render: () => (
    <ToggleGroup defaultValue="list" type="single" variant="outline">
      <ToggleGroupItem aria-label="List view — employee roster" value="list">
        <ListIcon />
        List
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Grid view — employee cards" value="grid">
        <LayoutGridIcon />
        Grid
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const AlignmentGroup: Story = {
  name: "ToggleGroup — Alignment",
  render: () => (
    <ToggleGroup defaultValue="left" type="single">
      <ToggleGroupItem aria-label="Align left" value="left">
        <AlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Align center" value="center">
        <AlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Align right" value="right">
        <AlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────

export const FormattingToolbar: Story = {
  name: "ERP — Rich Text Formatting Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <ToggleGroup defaultValue={["bold"]} type="multiple">
        <ToggleGroupItem aria-label="Bold" value="bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Italic" value="italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Underline" value="underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="h-5">
        <Separator orientation="vertical" />
      </div>
      <ToggleGroup defaultValue="left" type="single">
        <ToggleGroupItem aria-label="Align left" value="left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align center" value="center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align right" value="right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </StoryRow>
  ),
};

export const ViewModeSwitcher: Story = {
  name: "ERP — View Mode Switcher",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-xs">View:</span>
      <ToggleGroup defaultValue="list" type="single" variant="outline">
        <ToggleGroupItem aria-label="List" size="sm" value="list">
          <ListIcon />
          List
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Grid" size="sm" value="grid">
          <LayoutGridIcon />
          Grid
        </ToggleGroupItem>
      </ToggleGroup>
    </StoryRow>
  ),
};

export const ControlledViewSwitcher: Story = {
  name: "ERP — Controlled View Switcher",
  parameters: { layout: "padded" },
  render: () => <ControlledViewSwitcherComponent />,
};

export const PeriodFilter: Story = {
  name: "ERP — Period Filter",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <CalendarIcon
        aria-hidden="true"
        className="size-4 text-muted-foreground"
      />
      <ToggleGroup defaultValue="month" type="single" variant="outline">
        <ToggleGroupItem size="sm" value="day">
          Day
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="week">
          Week
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="month">
          Month
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="quarter">
          Quarter
        </ToggleGroupItem>
      </ToggleGroup>
    </StoryRow>
  ),
};

export const ChartTypeSwitcher: Story = {
  name: "ERP — Chart Type Switcher",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-sm">Revenue trend</span>
      <ToggleGroup defaultValue="bar" type="single" variant="outline">
        <ToggleGroupItem aria-label="Bar chart" size="sm" value="bar">
          <BarChart3Icon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Line chart" size="sm" value="line">
          <ChartLineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </StoryRow>
  ),
};

export const ApprovalStatusFilter: Story = {
  name: "ERP — Approval Status Filter",
  parameters: { layout: "padded" },
  render: () => (
    <ToggleGroup defaultValue="pending" type="single" variant="outline">
      <ToggleGroupItem size="sm" value="pending">
        Pending
        <Badge emphasis="soft" size="sm" tone="warning">
          18
        </Badge>
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="approved">
        Approved
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="rejected">
        Rejected
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const TableDensitySwitcher: Story = {
  name: "ERP — Table Density Switcher",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-xs">Density:</span>
      <ToggleGroup defaultValue="standard" type="single" variant="outline">
        <ToggleGroupItem size="sm" value="compact">
          Compact
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="standard">
          Standard
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="comfortable">
          Comfortable
        </ToggleGroupItem>
      </ToggleGroup>
    </StoryRow>
  ),
};

export const CurrencyDisplaySwitcher: Story = {
  name: "ERP — Currency Display Switcher",
  parameters: { layout: "padded" },
  render: () => (
    <ToggleGroup defaultValue="usd" type="single" variant="outline">
      <ToggleGroupItem size="sm" value="usd">
        USD
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="eur">
        EUR
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="local">
        Local
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const MapListSwitcher: Story = {
  name: "ERP — Map / List Switcher",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="text-muted-foreground text-sm">Warehouse zones</span>
      <ToggleGroup defaultValue="list" type="single" variant="outline">
        <ToggleGroupItem aria-label="List view" size="sm" value="list">
          <ListIcon />
          List
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Map view" size="sm" value="map">
          <MapIcon />
          Map
        </ToggleGroupItem>
      </ToggleGroup>
    </StoryRow>
  ),
};

export const ShowHideColumns: Story = {
  name: "ERP — Show / Hide Columns",
  parameters: { layout: "padded" },
  render: () => (
    <ToggleGroup
      defaultValue={["id", "name", "dept"]}
      type="multiple"
      variant="outline"
    >
      <ToggleGroupItem size="sm" value="id">
        ID
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="name">
        Name
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="dept">
        Department
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="email">
        Email
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="salary">
        Salary
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const ReportSectionToolbar: Story = {
  name: "ERP — Report Section Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="lg">
      <StoryRow align="center" gap="sm" wrap>
        <ToggleGroup defaultValue="pnl" type="single" variant="outline">
          <ToggleGroupItem size="sm" value="pnl">
            P&amp;L
          </ToggleGroupItem>
          <ToggleGroupItem size="sm" value="balance">
            Balance
          </ToggleGroupItem>
          <ToggleGroupItem size="sm" value="cash">
            Cash flow
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="h-5">
        <Separator orientation="vertical" />
      </div>
        <ToggleGroup defaultValue="chart" type="single" variant="outline">
          <ToggleGroupItem aria-label="Table view" size="sm" value="table">
            <TableIcon />
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Chart view" size="sm" value="chart">
            <BarChart3Icon />
          </ToggleGroupItem>
        </ToggleGroup>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ModuleFilter: Story = {
  name: "ERP — Module Filter",
  parameters: { layout: "padded" },
  render: () => (
    <ToggleGroup defaultValue="finance" type="single" variant="outline">
      <ToggleGroupItem size="sm" value="finance">
        Finance
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="hr">
        HR
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="ops">
        Operations
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="proc">
        Procurement
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const RecordScopeFilter: Story = {
  name: "ERP — Record Scope Filter",
  parameters: { layout: "padded" },
  render: () => <ControlledScopeFilterComponent />,
};

export const TeamQueueFilter: Story = {
  name: "ERP — Team Queue Filter",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <UsersIcon aria-hidden="true" className="size-4 text-muted-foreground" />
      <ToggleGroup defaultValue="mine" type="single" variant="outline">
        <ToggleGroupItem size="sm" value="mine">
          My queue
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="team">
          Team
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="dept">
          Department
        </ToggleGroupItem>
      </ToggleGroup>
    </StoryRow>
  ),
};

export const CostCenterView: Story = {
  name: "ERP — Cost Center View",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Building2Icon
        aria-hidden="true"
        className="size-4 text-muted-foreground"
      />
      <ToggleGroup defaultValue="210" type="single" variant="outline">
        <ToggleGroupItem size="sm" value="210">
          210 Mfg
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="320">
          320 Sales
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="all">
          All centers
        </ToggleGroupItem>
      </ToggleGroup>
    </StoryRow>
  ),
};

export const FiscalPeriodSwitcher: Story = {
  name: "ERP — Fiscal Period Switcher",
  parameters: { layout: "padded" },
  render: () => (
    <ToggleGroup defaultValue="q2" type="single" variant="outline">
      <ToggleGroupItem size="sm" value="q1">
        Q1
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="q2">
        Q2
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="q3">
        Q3
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" value="q4">
        Q4
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const ExportColumnPicker: Story = {
  name: "ERP — Export Column Picker",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="sm">
      <span className="text-muted-foreground text-sm">
        Employee roster export — select columns
      </span>
      <ToggleGroup
        defaultValue={["id", "name", "dept", "status"]}
        type="multiple"
        variant="outline"
      >
        <ToggleGroupItem size="sm" value="id">
          ID
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="name">
          Name
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="dept">
          Department
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="status">
          Status
        </ToggleGroupItem>
        <ToggleGroupItem size="sm" value="salary">
          Salary
        </ToggleGroupItem>
      </ToggleGroup>
    </StoryStack>
  ),
};

export const ToggleGroupVsToggle: Story = {
  name: "ERP — ToggleGroup vs Toggle",
  parameters: {
    docs: {
      description: {
        story:
          "ToggleGroup: related options with single/multi selection. Standalone Toggle: one-off pressed states (see Primitives/Toggle).",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            ToggleGroup — view switcher
          </span>
          <ToggleGroup defaultValue="list" type="single" variant="outline">
            <ToggleGroupItem size="sm" value="list">
              List
            </ToggleGroupItem>
            <ToggleGroupItem size="sm" value="grid">
              Grid
            </ToggleGroupItem>
          </ToggleGroup>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Toggle — single pin action
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Toggle → Pin Record Toolbar
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ToggleGroupVsTabs: Story = {
  name: "ERP — ToggleGroup vs Tabs",
  parameters: {
    docs: {
      description: {
        story:
          "ToggleGroup: compact list-header filters. Tabs: full record detail panels (see Primitives/Tabs).",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            ToggleGroup — open / closed filter
          </span>
          <ToggleGroup defaultValue="open" type="single" variant="outline">
            <ToggleGroupItem size="sm" value="open">
              Open
            </ToggleGroupItem>
            <ToggleGroupItem size="sm" value="closed">
              Closed
            </ToggleGroupItem>
          </ToggleGroup>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Tabs — record sections</span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Tabs for summary, line items, and audit panels
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ToggleGroupVsSwitch: Story = {
  name: "ERP — ToggleGroup vs Switch",
  parameters: {
    docs: {
      description: {
        story:
          "ToggleGroup: transient view/filter selection. Switch: persisted settings (see Primitives/Switch).",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            ToggleGroup — period filter
          </span>
          <ToggleGroup defaultValue="month" type="single" variant="outline">
            <ToggleGroupItem size="sm" value="week">
              Week
            </ToggleGroupItem>
            <ToggleGroupItem size="sm" value="month">
              Month
            </ToggleGroupItem>
          </ToggleGroup>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Switch — email notifications
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Switch for persisted workspace settings
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
