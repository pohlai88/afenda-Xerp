import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CheckIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FilterIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RefreshCwIcon,
  SaveIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import {
  DENSITIES,
  GOVERNED_STATES,
  SIZES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
} from "@afenda/ui/governance";

import { Button } from "./button";
import { Spinner } from "./spinner";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Governed button primitive for ERP action surfaces. Combines `intent` (primary · secondary · quiet · destructive) with `emphasis` (solid · soft · outline · ghost) and optional `presentation=\"icon\"` for toolbar slots.",
      },
    },
  },
  argTypes: {
    intent: {
      control: "select",
      options: [...VARIANT_INTENTS],
      description: "Semantic action intent",
      table: { defaultValue: { summary: "primary" } },
    },
    emphasis: {
      control: "select",
      options: [...VARIANT_EMPHASES],
      description: "Visual weight",
      table: { defaultValue: { summary: "solid" } },
    },
    size: {
      control: "radio",
      options: [...SIZES],
      description: "Button size token",
      table: { defaultValue: { summary: "md" } },
    },
    density: {
      control: "select",
      options: [...DENSITIES],
      description: "Spacing density override",
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      description: "Governed interaction state",
    },
    presentation: {
      control: "radio",
      options: ["default", "icon"],
      description: "`icon` collapses padding for square icon-only buttons",
      table: { defaultValue: { summary: "default" } },
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Button",
    intent: "primary",
    emphasis: "solid",
    size: "md",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Single variant playground ────────────────────────────────────────────────

export const Default: Story = {};

export const Secondary: Story = {
  args: { intent: "secondary" },
};

export const Quiet: Story = {
  args: { intent: "quiet" },
};

export const Destructive: Story = {
  args: { intent: "destructive" },
};

export const Soft: Story = {
  args: { emphasis: "soft" },
};

export const Outline: Story = {
  args: { emphasis: "outline" },
};

export const Ghost: Story = {
  args: { emphasis: "ghost" },
};

// ─── Size variants ────────────────────────────────────────────────────────────

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

// ─── States ───────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { state: "loading", disabled: true },
  render: (args) => (
    <Button {...args}>
      <Spinner />
      Saving…
    </Button>
  ),
};

// ─── Icon + label (ERP action buttons) ────────────────────────────────────────

export const Save: Story = {
  args: { intent: "primary", emphasis: "solid" },
  render: (args) => (
    <Button {...args}>
      <SaveIcon />
      Save
    </Button>
  ),
};

export const AddRecord: Story = {
  args: { intent: "primary", emphasis: "solid" },
  render: (args) => (
    <Button {...args}>
      <PlusIcon />
      Add Record
    </Button>
  ),
};

export const DeleteRecord: Story = {
  args: { intent: "destructive", emphasis: "solid" },
  render: (args) => (
    <Button {...args}>
      <Trash2Icon />
      Delete
    </Button>
  ),
};

export const CancelAction: Story = {
  args: { intent: "secondary", emphasis: "ghost" },
  render: (args) => (
    <Button {...args}>
      <XIcon />
      Cancel
    </Button>
  ),
};

export const ExportData: Story = {
  args: { intent: "secondary", emphasis: "outline" },
  render: (args) => (
    <Button {...args}>
      <DownloadIcon />
      Export
    </Button>
  ),
};

export const ImportData: Story = {
  args: { intent: "secondary", emphasis: "outline" },
  render: (args) => (
    <Button {...args}>
      <UploadIcon />
      Import
    </Button>
  ),
};

export const Refresh: Story = {
  args: { intent: "quiet", emphasis: "ghost" },
  render: (args) => (
    <Button {...args}>
      <RefreshCwIcon />
      Refresh
    </Button>
  ),
};

// ─── Icon-only (toolbar slots) ────────────────────────────────────────────────

export const IconEdit: Story = {
  name: "Icon — Edit",
  args: { intent: "quiet", emphasis: "ghost", presentation: "icon" },
  render: (args) => (
    <Button {...args} aria-label="Edit">
      <EditIcon />
    </Button>
  ),
};

export const IconDelete: Story = {
  name: "Icon — Delete",
  args: { intent: "destructive", emphasis: "ghost", presentation: "icon" },
  render: (args) => (
    <Button {...args} aria-label="Delete">
      <Trash2Icon />
    </Button>
  ),
};

export const IconView: Story = {
  name: "Icon — View",
  args: { intent: "quiet", emphasis: "ghost", presentation: "icon" },
  render: (args) => (
    <Button {...args} aria-label="View details">
      <EyeIcon />
    </Button>
  ),
};

export const IconMore: Story = {
  name: "Icon — More",
  args: { intent: "quiet", emphasis: "ghost", presentation: "icon" },
  render: (args) => (
    <Button {...args} aria-label="More options">
      <MoreHorizontalIcon />
    </Button>
  ),
};

// ─── Governance probes ────────────────────────────────────────────────────────

export const AsChildLink: Story = {
  name: "Governance — asChild Link",
  parameters: {
    docs: {
      description: {
        story:
          "Button renders as `<a>` via `asChild` (Radix Slot). Governed className, data-intent, and data-emphasis are applied to the anchor.",
      },
    },
  },
  render: (args) => (
    <Button {...args} asChild>
      {/* biome-ignore lint/a11y/useAnchorContent: story probe only */}
      <a href="/example">Open Example</a>
    </Button>
  ),
};

export const AsChildDisabledLink: Story = {
  name: "Governance — asChild Disabled Link",
  parameters: {
    docs: {
      description: {
        story:
          "When `asChild` + `disabled`, the Slot receives `aria-disabled` and `tabIndex=-1` so the anchor is keyboard-inaccessible without `pointer-events:none` hacks.",
      },
    },
  },
  render: () => (
    <Button asChild disabled intent="primary" emphasis="solid">
      {/* biome-ignore lint/a11y/useAnchorContent: story probe only */}
      <a href="/danger">Disabled Link</a>
    </Button>
  ),
};

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  parameters: {
    docs: {
      description: {
        story:
          "Consumer passes `data-intent=\"destructive\"` and `data-emphasis=\"ghost\"` — governed props (`intent=\"primary\"`, `emphasis=\"solid\"`) must win in the DOM. Inspect the element to confirm.",
      },
    },
  },
  render: () => (
    <Button
      intent="primary"
      emphasis="solid"
      size="md"
      data-intent="destructive"
      data-emphasis="ghost"
      data-size="lg"
    >
      Governed Wins
    </Button>
  ),
};

// ─── ERP composite patterns ───────────────────────────────────────────────────

export const FormActions: Story = {
  name: "ERP — Form Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow gap="sm" align="center" justify="end">
        <Button intent="secondary" emphasis="ghost">
          <XIcon />
          Cancel
        </Button>
        <Button intent="secondary" emphasis="outline">
          Save Draft
        </Button>
        <Button intent="primary" emphasis="solid">
          <SaveIcon />
          Save &amp; Close
        </Button>
      </StoryRow>
    </StoryFrame>
  ),
};

export const ConfirmDestructive: Story = {
  name: "ERP — Confirm Destructive",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="md">
      <StoryRow gap="sm" align="center" justify="end">
        <Button intent="secondary" emphasis="ghost">
          Cancel
        </Button>
        <Button intent="destructive" emphasis="solid">
          <Trash2Icon />
          Delete Record
        </Button>
      </StoryRow>
    </StoryFrame>
  ),
};

export const CrudToolbar: Story = {
  name: "ERP — CRUD Toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="xs" align="center">
      <Button intent="primary" emphasis="solid" size="sm">
        <PlusIcon />
        New
      </Button>
      <Button intent="secondary" emphasis="outline" size="sm">
        <FilterIcon />
        Filter
      </Button>
      <Button intent="secondary" emphasis="outline" size="sm">
        <DownloadIcon />
        Export
      </Button>
      <Button
        intent="quiet"
        emphasis="ghost"
        size="sm"
        presentation="icon"
        aria-label="Refresh"
      >
        <RefreshCwIcon />
      </Button>
    </StoryRow>
  ),
};

export const RowActions: Story = {
  name: "ERP — Row Actions",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="xs" align="center">
      <Button
        intent="quiet"
        emphasis="ghost"
        size="sm"
        presentation="icon"
        aria-label="View"
      >
        <EyeIcon />
      </Button>
      <Button
        intent="quiet"
        emphasis="ghost"
        size="sm"
        presentation="icon"
        aria-label="Edit"
      >
        <EditIcon />
      </Button>
      <Button
        intent="destructive"
        emphasis="ghost"
        size="sm"
        presentation="icon"
        aria-label="Delete"
      >
        <Trash2Icon />
      </Button>
      <Button
        intent="quiet"
        emphasis="ghost"
        size="sm"
        presentation="icon"
        aria-label="More options"
      >
        <MoreHorizontalIcon />
      </Button>
    </StoryRow>
  ),
};

export const AsyncSave: Story = {
  name: "ERP — Async Save (loading)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" align="center">
      <Button intent="primary" emphasis="solid" state="loading" disabled>
        <Spinner />
        Saving…
      </Button>
      <Button intent="secondary" emphasis="ghost" disabled>
        Cancel
      </Button>
    </StoryRow>
  ),
};

export const BulkApprove: Story = {
  name: "ERP — Bulk Approve",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" align="center">
      <Button intent="primary" emphasis="soft">
        <CheckIcon />
        Approve Selected
      </Button>
      <Button intent="destructive" emphasis="soft">
        <XIcon />
        Reject Selected
      </Button>
    </StoryRow>
  ),
};

// ─── Full matrix ──────────────────────────────────────────────────────────────

export const AllIntents: Story = {
  name: "Matrix — All Intents (solid)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      {VARIANT_INTENTS.map((intent) => (
        <Button key={intent} intent={intent} emphasis="solid">
          {intent}
        </Button>
      ))}
    </StoryRow>
  ),
};

export const AllEmphases: Story = {
  name: "Matrix — All Emphases (primary)",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" wrap>
      {VARIANT_EMPHASES.map((emphasis) => (
        <Button key={emphasis} intent="primary" emphasis={emphasis}>
          {emphasis}
        </Button>
      ))}
    </StoryRow>
  ),
};

export const AllSizes: Story = {
  name: "Matrix — All Sizes",
  parameters: { layout: "padded" },
  render: () => (
    <StoryRow gap="sm" align="center" wrap>
      {SIZES.map((size) => (
        <Button key={size} size={size} intent="primary" emphasis="solid">
          Size {size}
        </Button>
      ))}
    </StoryRow>
  ),
};

export const AllVariants: Story = {
  name: "Matrix — Intent × Emphasis",
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {VARIANT_INTENTS.map((intent) => (
        <StoryRow key={intent} gap="sm" wrap align="center">
          {VARIANT_EMPHASES.map((emphasis) => (
            <Button key={emphasis} intent={intent} emphasis={emphasis} size="sm">
              {intent}/{emphasis}
            </Button>
          ))}
        </StoryRow>
      ))}
    </StoryStack>
  ),
};
