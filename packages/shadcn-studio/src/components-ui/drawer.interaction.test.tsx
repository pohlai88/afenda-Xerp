import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

describe("drawer interaction", () => {
  it("opens on trigger click and closes via Escape", async () => {
    const user = setupUser();

    render(
      <Drawer>
        <DrawerTrigger>Open drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>Drawer body</DrawerDescription>
        </DrawerContent>
      </Drawer>
    );

    const trigger = screen.getByRole("button", { name: "Open drawer" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    const content = await screen.findByRole("dialog");
    expect(content).toHaveTextContent("Drawer body");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
    expect(content).toHaveAttribute("data-state", "closed");
  });
});
