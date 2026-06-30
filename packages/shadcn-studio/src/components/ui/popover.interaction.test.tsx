import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

describe("popover interaction", () => {
  it("opens on trigger click and closes on outside click", async () => {
    const user = setupUser();

    render(
      <Popover>
        <PopoverTrigger>Open menu</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Title</PopoverTitle>
            <PopoverDescription>Description</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    );

    expect(screen.queryByText("Title")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(await screen.findByText("Title")).toBeVisible();
    expect(screen.getByText("Description")).toBeVisible();

    await user.click(document.body);
    expect(screen.queryByText("Title")).not.toBeInTheDocument();
  });
});
