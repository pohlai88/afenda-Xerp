import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../index";

describe("@afenda/ui component renders", () => {
  it("renders Button with governed recipe classes", () => {
    render(
      <Button intent="primary" emphasis="solid" size="md">
        Save
      </Button>
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("bg-primary");
  });

  it("renders Input with data-slot marker", () => {
    render(<Input aria-label="Email" placeholder="you@example.com" />);
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "data-slot",
      "input"
    );
  });

  it("renders Table structure", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Acme</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Acme" })).toBeInTheDocument();
  });

  it("renders shell primitives", () => {
    render(
      <div>
        <Badge tone="info">New</Badge>
        <Separator aria-hidden />
        <Skeleton aria-hidden data-testid="skeleton" />
        <Label htmlFor="name">Name</Label>
      </div>
    );

    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton")).toHaveAttribute("data-slot", "skeleton");
    expect(screen.getByText("Name")).toHaveAttribute("for", "name");
  });

  it("renders Card composition with governed density", () => {
    render(
      <Card density="standard" radius="md" shadow="raised">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>Metrics</CardContent>
      </Card>
    );

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Metrics")).toBeInTheDocument();
    expect(screen.getByText("Overview").closest("[data-slot=card]")).toHaveAttribute(
      "data-density",
      "standard"
    );
  });

  it("renders Alert", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Action required</AlertTitle>
        <AlertDescription>Review the failed journal entry.</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Action required")).toBeInTheDocument();
  });
});
