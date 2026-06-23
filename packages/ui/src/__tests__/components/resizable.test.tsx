import { render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/resizable";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

function getPanelGroup(container: HTMLElement): HTMLElement {
  const group = container.querySelector('[data-slot="resizable-panel-group"]');

  expect(group).toBeTruthy();

  return group as HTMLElement;
}

function renderSplitLayout() {
  return render(
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel defaultSize={50}>Left</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>Right</ResizablePanel>
    </ResizablePanelGroup>
  );
}

describe("Resizable governance", () => {
  it("exposes displayName on resizable parts", () => {
    expect(ResizablePanelGroup.displayName).toBe("ResizablePanelGroup");
    expect(ResizablePanel.displayName).toBe("ResizablePanel");
    expect(ResizableHandle.displayName).toBe("ResizableHandle");
  });

  it("renders group, panel, and handle with governed data-slots", () => {
    const { container } = renderSplitLayout();
    const group = getPanelGroup(container);

    expectGovernedPrimitive(group, {
      component: "Resizable",
      slot: "resizable-panel-group",
      recipe: "surface",
    });
    expect(within(group).getAllByText(/Left|Right/)).toHaveLength(2);
    expect(
      group.querySelectorAll('[data-slot="resizable-panel"]')
    ).toHaveLength(2);
    expect(
      group.querySelector('[data-slot="resizable-handle"]')
    ).toBeTruthy();
  });

  it("keeps governed data attributes authoritative on panel group", () => {
    const { container } = render(
      <ResizablePanelGroup
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        state="ready"
      >
        <ResizablePanel defaultSize={100}>Only panel</ResizablePanel>
      </ResizablePanelGroup>
    );

    expectGovernedDataAuthority(getPanelGroup(container), {
      "data-component": "Resizable",
      "data-recipe": "surface",
      "data-slot": "resizable-panel-group",
      "data-state": "ready",
    });
  });

  it("keeps governed data attributes authoritative on panel", () => {
    const { container } = render(
      <ResizablePanelGroup>
        <ResizablePanel
          data-component="Override"
          data-slot="override"
          defaultSize={100}
        >
          Content
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    const panel = screen.getByText("Content").closest('[data-slot="resizable-panel"]');

    expect(panel).not.toBeNull();
    expectGovernedDataAuthority(panel as HTMLElement, {
      "data-component": "Resizable",
      "data-recipe": "surface",
      "data-slot": "resizable-panel",
    });
    expect(getPanelGroup(container)).toBeTruthy();
  });

  it("keeps governed data attributes authoritative on handle", () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={50}>Left</ResizablePanel>
        <ResizableHandle
          data-component="Override"
          data-slot="override"
          withHandle
        />
        <ResizablePanel defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>
    );

    const handle = screen.getByRole("separator");

    expectGovernedDataAuthority(handle, {
      "data-component": "Resizable",
      "data-recipe": "surface",
      "data-slot": "resizable-handle",
    });
  });

  it("renders handle grip with governed data-slot when withHandle is set", () => {
    renderSplitLayout();

    const handle = screen.getByRole("separator");

    expect(
      handle.querySelector('[data-slot="resizable-handle-grip"]')
    ).toBeTruthy();
  });

  it("propagates loading state on panel group", () => {
    const { container } = render(
      <ResizablePanelGroup state="loading">
        <ResizablePanel defaultSize={100}>Content</ResizablePanel>
      </ResizablePanelGroup>
    );

    expectGovernedPrimitive(getPanelGroup(container), {
      component: "Resizable",
      slot: "resizable-panel-group",
      recipe: "surface",
      state: "loading",
    });
  });

  it("forwards ref on panel group, panel, and handle", () => {
    const groupRef = createRef<HTMLDivElement>();
    const panelRef = createRef<HTMLDivElement>();
    const handleRef = createRef<HTMLDivElement>();

    render(
      <ResizablePanelGroup orientation="horizontal" ref={groupRef}>
        <ResizablePanel defaultSize={50} ref={panelRef}>
          Left
        </ResizablePanel>
        <ResizableHandle ref={handleRef} withHandle />
        <ResizablePanel defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(groupRef.current).toBeInstanceOf(HTMLDivElement);
    expect(panelRef.current).toBeInstanceOf(HTMLDivElement);
    expect(handleRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("preserves separator semantics for keyboard resize", () => {
    renderSplitLayout();

    const handle = screen.getByRole("separator");

    expect(handle).toHaveAttribute("data-slot", "resizable-handle");
    expect(handle).toHaveAttribute("tabindex", "0");
  });
});
