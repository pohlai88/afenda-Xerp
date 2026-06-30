import "@testing-library/jest-dom/vitest";
import {
  closeDialogWithEscape,
  openDialog,
  setupUser,
} from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

describe("dialog interaction", () => {
  it("opens on trigger click and closes via Escape", async () => {
    const user = setupUser();

    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogDescription>Dialog body</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const dialog = await openDialog(user, "Open dialog");
    expect(dialog).toHaveTextContent("Dialog body");

    await closeDialogWithEscape(user);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via content close button", async () => {
    const user = setupUser();

    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await openDialog(user, "Open dialog");
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("returns focus to trigger after Escape closes dialog", async () => {
    const user = setupUser();

    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await openDialog(user, "Open dialog");
    await closeDialogWithEscape(user);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });
});
