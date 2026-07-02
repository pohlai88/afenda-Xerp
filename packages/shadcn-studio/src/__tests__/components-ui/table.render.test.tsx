import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TABLE_SLOTS } from "../../components-ui/table.contract.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components-ui/table.js";

describe("table render", () => {
  it("renders governed table anatomy with slot markers", () => {
    render(
      <Table>
        <TableCaption>Invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV-001</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${TABLE_SLOTS.container}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${TABLE_SLOTS.root}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${TABLE_SLOTS.header}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${TABLE_SLOTS.body}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${TABLE_SLOTS.footer}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${TABLE_SLOTS.row}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${TABLE_SLOTS.head}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${TABLE_SLOTS.cell}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${TABLE_SLOTS.caption}"]`)
    ).toBeInTheDocument();
  });
});
