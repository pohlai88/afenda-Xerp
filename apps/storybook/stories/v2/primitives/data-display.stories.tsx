import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@afenda/shadcn-studio-v2";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
} from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

const meta = {
  title: "Shadcn Studio V2/Primitives/Data Display",
  component: Card,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "Card and Table primitives from @afenda/shadcn-studio-v2 for operator data surfaces.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardDefault: Story = {
  tags: ["lab-smoke"],
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Procurement readiness</CardTitle>
        <CardDescription>
          Snapshot of requisition and PO coverage for the workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          12 open requisitions · 4 POs awaiting approval
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <Badge variant="secondary">Updated today</Badge>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Procurement readiness")).toBeVisible();
  },
};

export const CardDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dark mode card</CardTitle>
        <CardDescription>
          Uses global theme toolbar dark tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Token-backed surface.</p>
      </CardContent>
    </Card>
  ),
};

export const TableDefault: Story = {
  render: () => (
    <TableContainer className="w-full max-w-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alex Chen</TableCell>
            <TableCell>Operator</TableCell>
            <TableCell className="text-right">Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jordan Lee</TableCell>
            <TableCell>Reviewer</TableCell>
            <TableCell className="text-right">Pending</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("columnheader", { name: "Name" })
    ).toBeVisible();
    await expect(canvas.getByRole("cell", { name: "Alex Chen" })).toBeVisible();
  },
};
