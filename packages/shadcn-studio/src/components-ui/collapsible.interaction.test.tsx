import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

describe("collapsible interaction", () => {
  it("expands and collapses content via trigger", async () => {
    const user = setupUser();

    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle section</CollapsibleTrigger>
        <CollapsibleContent>Hidden body</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole("button", { name: "Toggle section" });
    expect(screen.queryByText("Hidden body")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByText("Hidden body")).toBeVisible();

    await user.click(trigger);
    expect(screen.queryByText("Hidden body")).not.toBeInTheDocument();
  });
});
