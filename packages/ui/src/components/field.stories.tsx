import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DENSITIES,
  GOVERNED_STATES,
  SIZES,
} from "@afenda/ui/governance";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./field";
import { Input } from "./input";
import { StoryFrame } from "./_storybook/story-frame";

const meta = {
  title: "Primitives/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
    },
    density: {
      control: "select",
      options: [...DENSITIES],
    },
    size: {
      control: "select",
      options: [...SIZES],
    },
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
    },
  },
  args: {
    orientation: "vertical",
    density: "standard",
    size: "md",
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <FieldSet>
        <FieldLegend>Account</FieldLegend>
        <Field {...args}>
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" type="email" placeholder="you@example.com" />
          <FieldDescription>We will never share your email.</FieldDescription>
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <StoryFrame width="xl">
      <Field {...args}>
        <FieldLabel htmlFor="field-name">Name</FieldLabel>
        <Input id="field-name" placeholder="Jane Doe" />
      </Field>
    </StoryFrame>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <FieldSet>
        <Field {...args} state="error">
          <FieldLabel htmlFor="field-password">Password</FieldLabel>
          <Input id="field-password" type="password" />
          <FieldError errors={[{ message: "Password is required" }]} />
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const MultipleErrors: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <FieldSet>
        <Field {...args} state="error">
          <FieldLabel htmlFor="field-username">Username</FieldLabel>
          <Input id="field-username" />
          <FieldError
            errors={[{ message: "Required" }, { message: "Too short" }]}
          />
        </Field>
      </FieldSet>
    </StoryFrame>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <StoryFrame width="md">
      <Field {...args}>
        <FieldLabel htmlFor="field-disabled">Disabled field</FieldLabel>
        <Input id="field-disabled" disabled placeholder="Unavailable" />
      </Field>
    </StoryFrame>
  ),
};
