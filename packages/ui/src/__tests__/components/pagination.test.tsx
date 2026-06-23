import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/pagination";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Pagination governance", () => {
  it("exposes displayName on exported subcomponents", () => {
    expect(Pagination.displayName).toBe("Pagination");
    expect(PaginationContent.displayName).toBe("PaginationContent");
    expect(PaginationItem.displayName).toBe("PaginationItem");
    expect(PaginationLink.displayName).toBe("PaginationLink");
    expect(PaginationPrevious.displayName).toBe("PaginationPrevious");
    expect(PaginationNext.displayName).toBe("PaginationNext");
    expect(PaginationEllipsis.displayName).toBe("PaginationEllipsis");
  });

  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Pagination
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="pagination-root"
        state="ready"
      >
        <PaginationContent>
          <PaginationItem />
        </PaginationContent>
      </Pagination>
    );

    expectGovernedDataAuthority(screen.getByTestId("pagination-root"), {
      "data-component": "Pagination",
      "data-recipe": "surface",
      "data-slot": "pagination",
      "data-state": "ready",
    });
    expect(screen.getByRole("navigation", { name: "pagination" })).toBe(
      screen.getByTestId("pagination-root")
    );
  });

  it("keeps governed data attributes authoritative on content", () => {
    render(
      <Pagination>
        <PaginationContent
          data-component="Override"
          data-recipe="override"
          data-slot="override"
          data-testid="pagination-content"
        >
          <PaginationItem />
        </PaginationContent>
      </Pagination>
    );

    expectGovernedDataAuthority(screen.getByTestId("pagination-content"), {
      "data-component": "Pagination",
      "data-recipe": "surface",
      "data-slot": "pagination-content",
    });
  });

  it("keeps canonical isActive authoritative over consumer aria-current", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink aria-current="step" href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("keeps pagination-item data-slot authoritative", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem data-slot="override" data-testid="pagination-item" />
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByTestId("pagination-item")).toHaveAttribute(
      "data-slot",
      "pagination-item"
    );
  });

  it("renders governed content slot on list wrapper", () => {
    render(
      <Pagination>
        <PaginationContent data-testid="pagination-content">
          <PaginationItem />
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByTestId("pagination-content")).toHaveAttribute(
      "data-slot",
      "pagination-content"
    );
  });

  it("renders PaginationItem as intentional governance passthrough", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem data-testid="pagination-item" />
        </PaginationContent>
      </Pagination>
    );

    const item = screen.getByTestId("pagination-item");

    expect(item).toHaveAttribute("data-slot", "pagination-item");
    expect(item).not.toHaveAttribute("data-component");
    expect(item).not.toHaveAttribute("data-recipe");
  });

  it("renders active page link with aria-current and data-active", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const link = screen.getByRole("link", { name: "2" });

    expect(link).toHaveAttribute("data-slot", "pagination-link");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("data-active", "true");
  });

  it("exposes prev/next aria labels and hides decorative icons", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(
      screen.getByRole("link", { name: "Go to previous page" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to next page" })).toBeInTheDocument();

    const icons = document.querySelectorAll("svg");
    for (const icon of icons) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("renders ellipsis with governed slots and screen-reader label", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis data-testid="pagination-ellipsis" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const ellipsis = screen.getByTestId("pagination-ellipsis");

    expect(ellipsis).toHaveAttribute("data-slot", "pagination-ellipsis");
    expect(screen.getByText("More pages")).toHaveAttribute(
      "data-slot",
      "pagination-ellipsis"
    );
    expect(ellipsis.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("applies governed state on root", () => {
    render(
      <Pagination data-testid="pagination-root" state="loading">
        <PaginationContent>
          <PaginationItem />
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByTestId("pagination-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("forwards ref to root nav element", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Pagination ref={ref}>
        <PaginationContent>
          <PaginationItem />
        </PaginationContent>
      </Pagination>
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expectGovernedPrimitive(ref.current as HTMLElement, {
      component: "Pagination",
      recipe: "surface",
      slot: "pagination",
    });
  });

  it("forwards ref to pagination links", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" ref={ref}>
              3
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current).toHaveAttribute("data-slot", "pagination-link");
  });

  it("forwards ref to prev/next links", () => {
    const previousRef = createRef<HTMLAnchorElement>();
    const nextRef = createRef<HTMLAnchorElement>();

    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" ref={previousRef} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" ref={nextRef} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(previousRef.current).toBeInstanceOf(HTMLAnchorElement);
    expect(nextRef.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
