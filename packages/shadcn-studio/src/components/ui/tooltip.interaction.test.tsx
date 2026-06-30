import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

describe("tooltip interaction", () => {
  it("opens on hover and closes on unhover", async () => {
    const user = setupUser();

    render(
      <TooltipProvider delay={0}>
        <Tooltip>
          <TooltipTrigger>Hover target</TooltipTrigger>
          <TooltipContent>Tooltip body</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.queryByText("Tooltip body")).not.toBeInTheDocument();

    await user.hover(screen.getByText("Hover target"));
    expect(await screen.findByText("Tooltip body")).toBeVisible();

    await user.unhover(screen.getByText("Hover target"));
    expect(screen.queryByText("Tooltip body")).not.toBeInTheDocument();
  });
});
