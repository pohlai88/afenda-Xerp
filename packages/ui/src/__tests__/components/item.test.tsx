import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "../../components/item";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("Item governance", () => {
  it("keeps governed data attributes authoritative on Item root", () => {
    render(
      <Item
        data-component="Override"
        data-recipe="fake"
        data-slot="override"
        data-testid="item-root"
        state="ready"
        variant="outline"
      >
        <ItemContent>
          <ItemTitle>Invoice</ItemTitle>
        </ItemContent>
      </Item>
    );

    const root = screen.getByTestId("item-root");

    expectGovernedDataAuthority(root, {
      "data-component": "Item",
      "data-recipe": "surface",
      "data-slot": "item",
      "data-state": "ready",
    });
    expectGovernedPrimitive(root, {
      component: "Item",
      recipe: "surface",
      slot: "item",
      state: "ready",
    });
  });

  it("applies governed state and item axes on Item root", () => {
    render(
      <Item data-testid="item-root" size="sm" state="loading" variant="muted">
        <ItemContent>
          <ItemTitle>Row</ItemTitle>
        </ItemContent>
      </Item>
    );

    const root = screen.getByTestId("item-root");

    expect(root).toHaveAttribute("data-state", "loading");
    expect(root).toHaveAttribute("data-variant", "muted");
    expect(root).toHaveAttribute("data-size", "sm");
  });

  it("renders governed item slots", () => {
    render(
      <ItemGroup data-testid="item-group">
        <Item data-testid="item-root" variant="outline">
          <ItemHeader data-testid="item-header">Header</ItemHeader>
          <ItemMedia data-testid="item-media" variant="icon">
            <span aria-hidden="true">Icon</span>
          </ItemMedia>
          <ItemContent data-testid="item-content">
            <ItemTitle>INV-2026-0042</ItemTitle>
            <ItemDescription>Acme Software Ltd.</ItemDescription>
          </ItemContent>
          <ItemActions data-testid="item-actions">
            <button type="button">Open</button>
          </ItemActions>
          <ItemFooter data-testid="item-footer">Footer</ItemFooter>
        </Item>
        <ItemSeparator data-testid="item-separator" />
      </ItemGroup>
    );

    expect(screen.getByTestId("item-group")).toHaveAttribute(
      "data-slot",
      "item-group"
    );
    expect(screen.getByTestId("item-group")).toHaveAttribute("role", "list");
    expect(screen.getByTestId("item-root")).toHaveAttribute(
      "data-slot",
      "item"
    );
    expect(screen.getByTestId("item-header")).toHaveAttribute(
      "data-slot",
      "item-header"
    );
    expect(screen.getByTestId("item-media")).toHaveAttribute(
      "data-slot",
      "item-media"
    );
    expect(screen.getByTestId("item-media")).toHaveAttribute(
      "data-variant",
      "icon"
    );
    expect(screen.getByTestId("item-content")).toHaveAttribute(
      "data-slot",
      "item-content"
    );
    expect(screen.getByText("INV-2026-0042")).toHaveAttribute(
      "data-slot",
      "item-title"
    );
    expect(screen.getByText("Acme Software Ltd.")).toHaveAttribute(
      "data-slot",
      "item-description"
    );
    expect(screen.getByTestId("item-actions")).toHaveAttribute(
      "data-slot",
      "item-actions"
    );
    expect(screen.getByTestId("item-footer")).toHaveAttribute(
      "data-slot",
      "item-footer"
    );
    expect(screen.getByTestId("item-separator")).toHaveAttribute(
      "data-slot",
      "item-separator"
    );
  });

  it("keeps governed data attributes authoritative on ItemMedia", () => {
    render(
      <ItemMedia
        data-component="Override"
        data-slot="override"
        data-testid="item-media"
        variant="image"
      >
        Media
      </ItemMedia>
    );

    const media = screen.getByTestId("item-media");

    expectGovernedDataAuthority(media, {
      "data-component": "Item",
      "data-recipe": "surface",
      "data-slot": "item-media",
    });
    expect(media).toHaveAttribute("data-variant", "image");
  });

  it("forwards ref to Item root", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Item ref={ref}>
        <ItemContent>
          <ItemTitle>Row</ItemTitle>
        </ItemContent>
      </Item>
    );

    expect(ref.current).toHaveAttribute("data-slot", "item");
  });

  it("exposes displayName on all public item parts", () => {
    expect(Item.displayName).toBe("Item");
    expect(ItemGroup.displayName).toBe("ItemGroup");
    expect(ItemSeparator.displayName).toBe("ItemSeparator");
    expect(ItemMedia.displayName).toBe("ItemMedia");
    expect(ItemContent.displayName).toBe("ItemContent");
    expect(ItemTitle.displayName).toBe("ItemTitle");
    expect(ItemDescription.displayName).toBe("ItemDescription");
    expect(ItemActions.displayName).toBe("ItemActions");
    expect(ItemHeader.displayName).toBe("ItemHeader");
    expect(ItemFooter.displayName).toBe("ItemFooter");
  });
});
