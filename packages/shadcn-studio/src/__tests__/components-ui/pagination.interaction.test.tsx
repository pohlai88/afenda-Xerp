import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components-ui/pagination";

describe("pagination interaction", () => {
  it("activates page link on click", async () => {
    const user = setupUser();
    const onPageClick = vi.fn((event: { preventDefault: () => void }) => {
      event.preventDefault();
    });

    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive onClick={onPageClick}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" onClick={onPageClick}>
              2
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    await user.click(screen.getByRole("button", { name: "2" }));
    expect(onPageClick).toHaveBeenCalled();
  });

  it("exposes previous and next navigation links", async () => {
    const user = setupUser();
    const onNext = vi.fn((event: { preventDefault: () => void }) => {
      event.preventDefault();
    });

    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={onNext} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(
      screen.getByRole("button", { name: "Go to previous page" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(onNext).toHaveBeenCalled();
  });
});
