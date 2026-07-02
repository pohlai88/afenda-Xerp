import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components-ui/alert-dialog";

function renderDeleteAlertDialog() {
  return render(
    <AlertDialog>
      <AlertDialogTrigger>Open alert</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete item?</AlertDialogTitle>
        <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("alert-dialog interaction", () => {
  it("closes via cancel button", async () => {
    const user = setupUser();
    renderDeleteAlertDialog();

    await user.click(screen.getByRole("button", { name: "Open alert" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes via confirm action button", async () => {
    const user = setupUser();
    renderDeleteAlertDialog();

    await user.click(screen.getByRole("button", { name: "Open alert" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes via Escape and returns focus to trigger", async () => {
    const user = setupUser();
    renderDeleteAlertDialog();

    const trigger = screen.getByRole("button", { name: "Open alert" });
    await user.click(trigger);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("returns focus to trigger after cancel closes dialog", async () => {
    const user = setupUser();
    renderDeleteAlertDialog();

    const trigger = screen.getByRole("button", { name: "Open alert" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("renders viewport slot in portal anatomy", async () => {
    const user = setupUser();

    render(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Body</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(
      document.querySelector('[data-slot="alert-dialog-viewport"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="alert-dialog-content"]')
    ).toBeInTheDocument();
  });

  it("keeps governed data-slot when consumer passes override on trigger", async () => {
    const user = setupUser();

    render(
      <AlertDialog>
        <AlertDialogTrigger data-slot="wrong-trigger">Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Body</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(
      document.querySelector('[data-slot="alert-dialog-trigger"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="wrong-trigger"]')
    ).not.toBeInTheDocument();
  });

  it("keeps governed data-slot when consumer passes override on header", () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader data-slot="wrong-header">
            <AlertDialogTitle>Title</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>Body</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(
      document.querySelector('[data-slot="alert-dialog-header"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="wrong-header"]')
    ).not.toBeInTheDocument();
  });
});
