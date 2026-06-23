import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/empty";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Empty governance", () => {
  it("keeps governed data attributes authoritative on root", () => {
    render(
      <Empty
        data-component="Override"
        data-recipe="fake"
        data-slot="override"
        data-testid="empty-root"
        state="ready"
      >
        No results
      </Empty>
    );

    const root = screen.getByTestId("empty-root");

    expectGovernedDataAuthority(root, {
      "data-component": "Empty",
      "data-recipe": "surface",
      "data-slot": "empty",
      "data-state": "ready",
    });
    expectGovernedPrimitive(root, {
      component: "Empty",
      recipe: "surface",
      slot: "empty",
      state: "ready",
    });
  });

  it("applies governed state on root", () => {
    render(
      <Empty data-testid="empty-root" state="loading">
        No results
      </Empty>
    );

    expect(screen.getByTestId("empty-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("defaults root to role=status and allows caller override", () => {
    render(<Empty data-testid="empty-root">No results</Empty>);
    expect(screen.getByTestId("empty-root")).toHaveAttribute("role", "status");

    render(
      <Empty data-testid="empty-group" role="group">
        Grouped empty
      </Empty>
    );
    expect(screen.getByTestId("empty-group")).toHaveAttribute("role", "group");
  });

  it("renders governed empty-state slots", () => {
    render(
      <Empty data-testid="empty-root">
        <EmptyHeader data-testid="empty-header">
          <EmptyMedia data-testid="empty-media" variant="icon">
            <span aria-hidden="true">Icon</span>
          </EmptyMedia>
        </EmptyHeader>
        <EmptyContent data-testid="empty-content">
          <EmptyTitle>No records</EmptyTitle>
          <EmptyDescription>Try adjusting your filters.</EmptyDescription>
        </EmptyContent>
      </Empty>
    );

    expect(screen.getByTestId("empty-header")).toHaveAttribute(
      "data-slot",
      "empty-header"
    );
    expect(screen.getByTestId("empty-media")).toHaveAttribute(
      "data-slot",
      "empty-icon"
    );
    expect(screen.getByTestId("empty-content")).toHaveAttribute(
      "data-slot",
      "empty-content"
    );
    expect(screen.getByText("No records")).toHaveAttribute(
      "data-slot",
      "empty-title"
    );
    expect(screen.getByText("Try adjusting your filters.")).toHaveAttribute(
      "data-slot",
      "empty-description"
    );
  });

  it("keeps governed data attributes authoritative on EmptyMedia", () => {
    render(
      <EmptyMedia
        data-component="Override"
        data-slot="override"
        data-testid="empty-media"
        variant="icon"
      >
        Icon
      </EmptyMedia>
    );

    const media = screen.getByTestId("empty-media");

    expectGovernedDataAuthority(media, {
      "data-component": "Empty",
      "data-recipe": "surface",
      "data-slot": "empty-icon",
    });
    expect(media).toHaveAttribute("data-variant", "icon");
  });

  it("forwards refs to root and title slots", () => {
    const rootRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLDivElement>();

    render(
      <Empty ref={rootRef}>
        <EmptyTitle ref={titleRef}>No records</EmptyTitle>
      </Empty>
    );

    expect(rootRef.current).toHaveAttribute("data-slot", "empty");
    expect(titleRef.current).toHaveAttribute("data-slot", "empty-title");
  });

  it("sets displayName on all public slots", () => {
    expect(Empty.displayName).toBe("Empty");
    expect(EmptyHeader.displayName).toBe("EmptyHeader");
    expect(EmptyMedia.displayName).toBe("EmptyMedia");
    expect(EmptyTitle.displayName).toBe("EmptyTitle");
    expect(EmptyDescription.displayName).toBe("EmptyDescription");
    expect(EmptyContent.displayName).toBe("EmptyContent");
  });
});
