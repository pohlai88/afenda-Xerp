import { render, screen, waitFor } from "@testing-library/react";
import {
  INTERACTION_TEST_TIMEOUT_MS,
  setupUser,
} from "@afenda/testing/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

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
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../index";

describe("overlay primitive interactions", () => {
  vi.setConfig({ testTimeout: INTERACTION_TEST_TIMEOUT_MS });

  it("opens alert dialog on trigger click and closes on cancel", async () => {
    const user = setupUser();

    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete record</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByRole("button", { name: "Delete record" }));
    await screen.findByRole("alertdialog", { name: "Delete record?" });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("supports controlled AlertDialog without internal state drift", async () => {
    const user = setupUser();
    const onOpenChange = vi.fn();

    function ControlledAlertDialog() {
      const [open, setOpen] = useState(false);

      return (
        <AlertDialog
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
          open={open}
        >
          <AlertDialogTrigger>Open controlled</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm void</AlertDialogTitle>
              <AlertDialogDescription>
                Void this journal entry?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Void</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    render(<ControlledAlertDialog />);

    await user.click(screen.getByRole("button", { name: "Open controlled" }));
    await screen.findByRole("alertdialog", { name: "Confirm void" });
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("opens dialog on trigger click and closes on Escape", async () => {
    const user = setupUser();

    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog", { name: "Confirm" });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("supports controlled Dialog open passthrough", async () => {
    const user = setupUser();
    const onOpenChange = vi.fn();

    function ControlledDialog() {
      const [open, setOpen] = useState(false);

      return (
        <Dialog
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
          open={open}
        >
          <DialogTrigger>Open controlled dialog</DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Controlled</DialogTitle>
              <DialogDescription>Parent owns open state.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    }

    render(<ControlledDialog />);

    await user.click(
      screen.getByRole("button", { name: "Open controlled dialog" })
    );
    await screen.findByRole("dialog", { name: "Controlled" });
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("traps focus inside an open dialog", async () => {
    const user = setupUser();

    render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Focus trap</DialogTitle>
            <DialogDescription>Tab should stay inside the dialog.</DialogDescription>
          </DialogHeader>
          <button type="button">First action</button>
          <button type="button">Second action</button>
        </DialogContent>
      </Dialog>
    );

    const dialog = await screen.findByRole("dialog", { name: "Focus trap" });
    const firstAction = screen.getByRole("button", { name: "First action" });
    const secondAction = screen.getByRole("button", { name: "Second action" });

    firstAction.focus();
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.tab();
    expect(secondAction).toHaveFocus();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("opens sheet on trigger click and closes via the close button", async () => {
    const user = setupUser();

    render(
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Panel</SheetTitle>
            <SheetDescription>Details</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog", { name: "Panel" });

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes sheet on Escape", async () => {
    const user = setupUser();

    render(
      <Sheet defaultOpen>
        <SheetContent showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Escape sheet</SheetTitle>
            <SheetDescription>Press Escape to dismiss.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    await screen.findByRole("dialog", { name: "Escape sheet" });
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("opens drawer on trigger click and closes on Escape", async () => {
    const user = setupUser();

    render(
      <Drawer>
        <DrawerTrigger>Open drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Mobile panel</DrawerTitle>
            <DrawerDescription>Swipe-friendly surface.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await screen.findByRole("dialog", { name: "Mobile panel" });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("supports controlled CommandDialog open passthrough", async () => {
    const user = setupUser();
    const onOpenChange = vi.fn();

    function ControlledCommandDialog() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Open palette
          </button>
          <CommandDialog
            onOpenChange={(next) => {
              onOpenChange(next);
              setOpen(next);
            }}
            open={open}
            title="ERP command palette"
          >
            <CommandInput aria-label="Search commands" />
            <CommandList>
              <CommandItem>New invoice</CommandItem>
            </CommandList>
          </CommandDialog>
        </>
      );
    }

    render(<ControlledCommandDialog />);

    await user.click(screen.getByRole("button", { name: "Open palette" }));
    await screen.findByRole("dialog", { name: "ERP command palette" });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
