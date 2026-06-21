import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  MetadataActionBar,
  MetadataActionButton,
} from "../client/metadata-action-renderer.client.js";

describe("metadata action renderer", () => {
  it("respects visibility and renders governed data attributes", () => {
    render(
      <MetadataActionBar
        actions={[
          {
            key: "visible-action",
            label: "Visible",
            kind: "button",
            visibility: "visible",
          },
          {
            key: "hidden-action",
            label: "Hidden",
            kind: "button",
            visibility: "hidden",
          },
        ]}
      />
    );

    expect(screen.getByRole("button", { name: "Visible" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hidden" })).toBeNull();
    expect(
      document.querySelector('[data-action-key="visible-action"]')
    ).not.toBeNull();
  });

  it("disables button actions and exposes reason text", () => {
    render(
      <MetadataActionButton
        action={{
          key: "disabled-action",
          label: "Disabled",
          kind: "button",
          visibility: "disabled",
          reason: "You do not have permission.",
        }}
      />
    );

    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
    expect(screen.getByText("You do not have permission.")).toBeInTheDocument();
  });

  it("calls the governed handler with action and context", async () => {
    const user = setupUser();
    const onAction = vi.fn().mockResolvedValue({ ok: true, actionKey: "save" });

    render(
      <MetadataActionButton
        action={{
          key: "save",
          label: "Save",
          kind: "button",
        }}
        onAction={onAction}
      />
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ key: "save" }),
      { source: "metadata-action-button" }
    );
  });

  it("routes handler successes to onActionResult", async () => {
    const user = setupUser();
    const onAction = vi.fn().mockResolvedValue({
      ok: true,
      actionKey: "save",
      message: "Saved.",
    });
    const onActionResult = vi.fn();

    render(
      <MetadataActionButton
        action={{
          key: "save",
          label: "Save",
          kind: "button",
        }}
        onAction={onAction}
        onActionResult={onActionResult}
      />
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onActionResult).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: true,
        actionKey: "save",
        message: "Saved.",
      })
    );
  });

  it("opens a structural confirm dialog before invoking destructive handlers", async () => {
    const user = setupUser();
    const onAction = vi.fn().mockResolvedValue({ ok: true, actionKey: "delete" });

    render(
      <MetadataActionButton
        action={{
          key: "delete",
          label: "Delete order",
          kind: "destructive",
          confirm: {
            title: "Delete order?",
            description: "This cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Keep order",
          },
        }}
        onAction={onAction}
      />
    );

    await user.click(screen.getByRole("button", { name: "Delete order" }));

    expect(onAction).not.toHaveBeenCalled();
    expect(
      document.querySelector('[data-slot="metadata-action-confirm-dialog"]')
    ).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Delete order?" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ key: "delete" }),
      { source: "metadata-action-button" }
    );
  });

  it("routes handler failures to onActionResult without throwing", async () => {
    const user = setupUser();
    const onAction = vi.fn().mockResolvedValue({
      ok: false,
      actionKey: "save",
      code: "FORBIDDEN",
      userMessage: "You do not have permission.",
    });
    const onActionResult = vi.fn();

    render(
      <MetadataActionButton
        action={{
          key: "save",
          label: "Save",
          kind: "button",
        }}
        onAction={onAction}
        onActionResult={onActionResult}
      />
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onActionResult).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: false,
        code: "FORBIDDEN",
        userMessage: "You do not have permission.",
      })
    );
  });

  it("converts thrown handlers into INTERNAL_ERROR results", async () => {
    const user = setupUser();
    const onAction = vi.fn().mockRejectedValue(new Error("db exploded"));
    const onActionResult = vi.fn();

    render(
      <MetadataActionButton
        action={{
          key: "save",
          label: "Save",
          kind: "button",
        }}
        onAction={onAction}
        onActionResult={onActionResult}
      />
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onActionResult).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: false,
        code: "INTERNAL_ERROR",
        userMessage: "Something went wrong. Try again.",
      })
    );
  });

  it("sorts actions by presentation order", () => {
    render(
      <MetadataActionBar
        actions={[
          {
            key: "second",
            label: "Second",
            kind: "button",
            presentation: { order: 20 },
          },
          {
            key: "first",
            label: "First",
            kind: "button",
            presentation: { order: 10 },
          },
        ]}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("First");
    expect(buttons[1]).toHaveTextContent("Second");
  });
});
