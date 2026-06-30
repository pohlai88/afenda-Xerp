import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

describe("resizable interaction", () => {
  it("renders governed panelGroup, panel, and handle slots", () => {
    render(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>
          <div>Left panel</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div>Right panel</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(
      document.querySelector('[data-slot="resizable-panel-group"]')
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="resizable-panel"]')
    ).toHaveLength(2);
    expect(
      document.querySelector('[data-slot="resizable-handle"]')
    ).toBeInTheDocument();
  });

  it("renders panel children (smoke — jsdom may not drag resize)", () => {
    render(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>
          <div>Left panel</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div>Right panel</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText("Left panel")).toBeInTheDocument();
    expect(screen.getByText("Right panel")).toBeInTheDocument();
  });
});
