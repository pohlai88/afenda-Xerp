import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DENSITIES,
  GOVERNED_PANEL_RADII,
  GOVERNED_STATES,
  STATUS_TONES,
} from "@afenda/ui/governance";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";
import { StoryFrame } from "./_storybook/story-frame";

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: [...STATUS_TONES],
    },
    density: {
      control: "select",
      options: [...DENSITIES],
    },
    radius: {
      control: "select",
      options: [...GOVERNED_PANEL_RADII],
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
    },
  },
  args: {
    tone: "neutral",
    density: "standard",
    radius: "md",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const Info: Story = {
  args: { tone: "info" },
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Non-critical status update for the user.</AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const Warning: Story = {
  args: { tone: "warning" },
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Review required before continuing.</AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const Danger: Story = {
  args: { tone: "danger" },
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong. Try again.</AlertDescription>
      </Alert>
    </StoryFrame>
  ),
};

export const WithAction: Story = {
  args: { tone: "info" },
  render: (args) => (
    <StoryFrame width="md">
      <Alert {...args}>
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>A new version is ready to install.</AlertDescription>
        <AlertAction>
          <Button size="sm">Install</Button>
        </AlertAction>
      </Alert>
    </StoryFrame>
  ),
};

export const AllTones: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="flex flex-col gap-3">
        {STATUS_TONES.map((tone) => (
          <Alert key={tone} tone={tone}>
            <AlertTitle>{tone}</AlertTitle>
            <AlertDescription>Status tone preview</AlertDescription>
          </Alert>
        ))}
      </div>
    </StoryFrame>
  ),
};
