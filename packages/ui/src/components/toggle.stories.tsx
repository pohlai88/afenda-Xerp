import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BoldIcon,
  EyeIcon,
  EyeOffIcon,
  ItalicIcon,
  PinIcon,
  UnderlineIcon,
} from "lucide-react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Toggle } from "./toggle";

// ─── Toggle ────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Radix-UI Toggle for standalone pressed states (pin, visibility, formatting icons). For related option sets (view switchers, filters, column pickers), use `ToggleGroup` (Primitives/ToggleGroup). For persisted on/off settings, use `Switch` (Primitives/Switch).",
      },
    },
  },
  argTypes: {
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
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
    disabled: { control: "boolean" },
    pressed: { control: "boolean" },
  },
  args: {
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  ),
};

export const WithLabel: Story = {
  name: "Toggle — With Label",
  render: (args) => (
    <Toggle {...args}>
      <BoldIcon />
      Bold
    </Toggle>
  ),
};

export const Outline: Story = {
  name: "Toggle — Outline Variant",
  args: { variant: "outline" },
  render: (args) => (
    <Toggle {...args}>
      <BoldIcon />
      Bold
    </Toggle>
  ),
};

export const Small: Story = {
  name: "Toggle — Small",
  args: { size: "sm" },
  render: (args) => (
    <Toggle {...args} aria-label="Toggle italic">
      <ItalicIcon />
    </Toggle>
  ),
};

export const Large: Story = {
  name: "Toggle — Large",
  args: { size: "lg" },
  render: (args) => (
    <Toggle {...args} aria-label="Toggle underline">
      <UnderlineIcon />
    </Toggle>
  ),
};

export const Pressed: Story = {
  name: "Toggle — Pressed",
  args: { pressed: true },
  render: (args) => (
    <Toggle {...args} aria-label="Bold active">
      <BoldIcon />
      Bold
    </Toggle>
  ),
};

export const Disabled: Story = {
  name: "Toggle — Disabled",
  args: { disabled: true },
  render: (args) => (
    <Toggle {...args} aria-label="Disabled toggle">
      <BoldIcon />
    </Toggle>
  ),
};

// ─── Governance ────────────────────────────────────────────────────────────

export const GovernanceAllStates: Story = {
  name: "Governance — All States",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="sm">
          <span className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </span>
          <Toggle aria-label={`State ${state}`} pressed state={state}>
            <BoldIcon />
          </Toggle>
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
          "Icon-only toggles require `aria-label`. Pressed state is exposed programmatically via Radix Toggle.",
      },
    },
  },
  render: () => (
    <Toggle
      aria-label="Pin invoice INV-2026-0042 to workspace"
      variant="outline"
    >
      <PinIcon />
      Pin
    </Toggle>
  ),
};

export const AllVariants: Story = {
  name: "Matrix — Toggle Variants",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {(["default", "outline"] as const).map((variant) => (
        <StoryStack gap="xs" key={variant}>
          <span className="font-mono text-muted-foreground text-xs">
            variant=&quot;{variant}&quot;
          </span>
          <StoryRow align="center" gap="sm">
            <Toggle aria-label="Bold" variant={variant}>
              <BoldIcon />
            </Toggle>
            <Toggle aria-label="Bold with label" variant={variant}>
              <BoldIcon />
              Bold
            </Toggle>
            <Toggle aria-label="Pressed bold" pressed variant={variant}>
              <BoldIcon />
              Pressed
            </Toggle>
            <Toggle aria-label="Disabled bold" disabled variant={variant}>
              <BoldIcon />
              Disabled
            </Toggle>
          </StoryRow>
        </StoryStack>
      ))}
    </StoryStack>
  ),
};

export const AllSizes: Story = {
  name: "Matrix — All Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Toggle
          aria-label={`Size ${size}`}
          key={size}
          size={size}
          variant="outline"
        >
          <BoldIcon />
          {size}
        </Toggle>
      ))}
    </StoryRow>
  ),
};

// ─── ERP single-toggle patterns ────────────────────────────────────────────

export const PinRecordToolbar: Story = {
  name: "ERP — Pin Record Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <span className="font-mono text-sm">INV-2026-0042</span>
      <Toggle aria-label="Pin invoice to workspace" pressed variant="outline">
        <PinIcon />
        Pinned
      </Toggle>
    </StoryRow>
  ),
};

export const PreviewVisibilityToggle: Story = {
  name: "ERP — Preview Visibility Toggle",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow align="center" gap="sm">
      <Toggle aria-label="Hide sensitive totals" variant="outline">
        <EyeOffIcon />
        Hide totals
      </Toggle>
      <Toggle aria-label="Show sensitive totals" pressed variant="outline">
        <EyeIcon />
        Show totals
      </Toggle>
    </StoryRow>
  ),
};

export const ToggleGroupReference: Story = {
  name: "ERP — Use ToggleGroup for option sets",
  parameters: {
    docs: {
      description: {
        story:
          "Standalone `Toggle` is for one-off pressed actions. View switchers, period filters, column pickers, and formatting sets belong in `Primitives/ToggleGroup`.",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Single toggle — pin record
          </span>
          <Toggle aria-label="Pin record" variant="outline">
            <PinIcon />
            Pin
          </Toggle>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Need a view switcher or filter row?
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/ToggleGroup for list/grid/table, period filters, and
            approval status chips.
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const ToggleVsSwitch: Story = {
  name: "ERP — Toggle vs Switch",
  parameters: {
    docs: {
      description: {
        story:
          "Toggle: transient pressed UI state. Switch: persisted on/off workspace settings (see Primitives/Switch).",
      },
    },
  },
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Toggle — show/hide totals</span>
          <Toggle aria-label="Show totals" pressed variant="outline">
            <EyeIcon />
            Show totals
          </Toggle>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Switch — email notifications
          </span>
          <span className="text-muted-foreground text-xs">
            See Primitives/Switch for persisted settings panels
          </span>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};
