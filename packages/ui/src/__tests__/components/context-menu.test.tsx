import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "../../index";
import { expectGovernedDataAuthority } from "../helpers/governance-assertions";

describe("ContextMenu governance", () => {
  it("applies governed presentation on trigger and rejects consumer overrides", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger
          data-component="Override"
          data-slot="override"
        >
          Row actions
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>View</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByText("Row actions");

    expectGovernedDataAuthority(trigger, {
      "data-component": "ContextMenu",
      "data-recipe": "surface",
      "data-slot": "context-menu-trigger",
    });
  });

  it("renders governed content and item slots when open", () => {
    render(
      <ContextMenu open>
        <ContextMenuTrigger>Row actions</ContextMenuTrigger>
        <ContextMenuContent data-slot="override">
          <ContextMenuLabel>Invoice</ContextMenuLabel>
          <ContextMenuItem data-slot="override">View</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(
      document.querySelector('[data-slot="context-menu-content"]')
    ).toBeInTheDocument();
    expect(screen.getByText("View")).toHaveAttribute(
      "data-slot",
      "context-menu-item"
    );
    expect(screen.getByText("Invoice")).toHaveAttribute(
      "data-slot",
      "context-menu-label"
    );
  });

  it("accepts governed state on root without breaking trigger presentation", () => {
    render(
      <ContextMenu open state="loading">
        <ContextMenuTrigger>Row actions</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>View</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(screen.getByText("Row actions")).toHaveAttribute(
      "data-slot",
      "context-menu-trigger"
    );
  });

  it("forwards ref to trigger", () => {
    const triggerRef = createRef<HTMLSpanElement>();

    render(
      <ContextMenu>
        <ContextMenuTrigger ref={triggerRef}>Row actions</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>View</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("exposes displayName on context menu parts", () => {
    expect(ContextMenu.displayName).toBe("ContextMenu");
    expect(ContextMenuTrigger.displayName).toBe("ContextMenuTrigger");
    expect(ContextMenuContent.displayName).toBe("ContextMenuContent");
    expect(ContextMenuItem.displayName).toBe("ContextMenuItem");
  });
});
