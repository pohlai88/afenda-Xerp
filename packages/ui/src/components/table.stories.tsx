import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { DENSITIES, GOVERNED_STATES, SIZES } from "@afenda/ui/governance";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { StoryFrame } from "./_storybook/story-frame";

const sampleRows = [
  { id: "1", name: "Jack", role: "Admin" },
  { id: "2", name: "Sam", role: "Editor" },
  { id: "3", name: "Alex", role: "Viewer" },
];

const meta = {
  title: "Primitives/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
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
    density: "standard",
    size: "sm",
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

function SampleTable(props: ComponentProps<typeof Table>) {
  return (
    <StoryFrame width="xl">
      <Table {...props}>
        <TableCaption>Team members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>3 members</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </StoryFrame>
  );
}

export const Default: Story = {
  render: (args) => <SampleTable {...args} />,
};

export const Compact: Story = {
  args: {
    density: "compact",
    size: "sm",
  },
  render: (args) => <SampleTable {...args} />,
};

export const Comfortable: Story = {
  args: {
    density: "comfortable",
    size: "md",
  },
  render: (args) => <SampleTable {...args} />,
};

export const AllDensities: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {DENSITIES.map((density) => (
        <div key={density}>
          <p className="mb-2 text-sm text-muted-foreground">{density}</p>
          <SampleTable density={density} />
        </div>
      ))}
    </div>
  ),
};
