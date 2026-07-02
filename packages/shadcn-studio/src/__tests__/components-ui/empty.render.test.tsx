import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EMPTY_SLOTS } from "../../components-ui/empty.contract.js";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components-ui/empty.js";

describe("empty render", () => {
  it("renders governed empty anatomy with slot markers", () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">📭</EmptyMedia>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>Try adjusting your filters.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button type="button">Reset filters</button>
        </EmptyContent>
      </Empty>
    );

    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${EMPTY_SLOTS.root}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${EMPTY_SLOTS.header}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${EMPTY_SLOTS.media}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${EMPTY_SLOTS.title}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${EMPTY_SLOTS.description}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${EMPTY_SLOTS.content}"]`)
    ).toBeInTheDocument();
  });
});
