import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

describe("sheet interaction", () => {
  it("opens on trigger click and closes via Escape", async () => {
    const user = setupUser();

    render(
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet title</SheetTitle>
            <SheetDescription>Sheet body</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    const trigger = screen.getByRole("button", { name: "Open sheet" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toHaveTextContent("Sheet body");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("closes via content close button", async () => {
    const user = setupUser();

    render(
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet title</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
