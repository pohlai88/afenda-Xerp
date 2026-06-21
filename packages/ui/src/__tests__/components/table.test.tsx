import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Table governance", () => {
  it("applies className to table and containerClassName to wrapper", () => {
    render(
      <Table className="w-full" containerClassName="max-h-96">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = screen.getByRole("table");
    const wrapper = table.closest("[data-slot=table-container]");

    expect(table).toHaveClass("w-full");
    expect(wrapper).toHaveClass("max-h-96");
  });

  it("renders correct governed table slot names", () => {
    render(
      <Table>
        <TableCaption>Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jack</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByText("Users")).toHaveAttribute(
      "data-slot",
      "table-caption"
    );
    expect(screen.getByText("Users").closest("thead")).toBeNull();

    const headerSection = screen.getByText("Name").closest("thead");
    expect(headerSection).toHaveAttribute("data-slot", "table-header");

    const bodySection = screen.getByText("Jack").closest("tbody");
    expect(bodySection).toHaveAttribute("data-slot", "table-body");

    const footerSection = screen.getByText("Total").closest("tfoot");
    expect(footerSection).toHaveAttribute("data-slot", "table-footer");

    expect(screen.getByText("Name").closest("tr")).toHaveAttribute(
      "data-slot",
      "table-row"
    );
    expect(screen.getByText("Name")).toHaveAttribute("data-slot", "table-head");
    expect(screen.getByText("Jack")).toHaveAttribute("data-slot", "table-cell");
  });

  it("keeps governed data attributes authoritative on Table root", () => {
    render(
      <Table data-component="Fake" data-recipe="fake" data-state="fake">
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = screen.getByRole("table");

    expectGovernedDataAuthority(table, {
      "data-component": "Table",
      "data-recipe": "table",
      "data-state": "ready",
    });
    expect(table).toHaveAttribute("data-density", "standard");
    expect(table).toHaveAttribute("data-size", "sm");
    expectGovernedPrimitive(table, { component: "Table", slot: "table" });
  });

  it("forwards ref to table cell", () => {
    const ref = createRef<HTMLTableCellElement>();

    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell ref={ref}>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
  });

  it("uses afenda table token classes for row hover and selection states", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>Selected</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Normal</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const rows = document.querySelectorAll("[data-slot=table-row]");
    // row should use afenda token for hover and selection
    expect(rows[0]?.className).toContain("--afenda-table-row-selected");
    expect(rows[0]?.className).toContain("--afenda-table-row-hover");
    expect(rows[0]?.className).toContain("--afenda-table-row-border");
  });

  it("uses afenda token class for table head foreground", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const head = screen.getByText("Column");
    expect(head.className).toContain("--afenda-table-header-foreground");
  });

  it("uses afenda token class for table caption muted text", () => {
    render(
      <Table>
        <TableCaption>Results</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Item</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const caption = screen.getByText("Results");
    expect(caption.className).toContain("--afenda-table-cell-muted");
  });

  it("uses afenda token class for table footer background", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Row</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    const footer = screen.getByText("Total").closest("tfoot");
    expect(footer?.className).toContain("--afenda-table-header-background");
  });

  it("maps semantic table slots to registry vocabulary", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableHead>Column</TableHead>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText("Column")).toHaveAttribute(
      "data-slot",
      "table-head"
    );
    expect(screen.getByText("Value")).toHaveAttribute(
      "data-slot",
      "table-cell"
    );
    expect(screen.getByText("Column").closest("tr")).toHaveAttribute(
      "data-slot",
      "table-row"
    );
  });
});
