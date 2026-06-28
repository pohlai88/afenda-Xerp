import { describe, expect, it } from "vitest";

import {
  actionRequiresConfirmation,
  createMetadataActionFailure,
  createMetadataActionSuccess,
  destructiveActionMissingConfirm,
  isMetadataActionFailure,
  isMetadataActionSuccess,
  toMetadataActionWireResult,
} from "../actions/metadata-action-handler.js";

describe("metadata action handler helpers", () => {
  it("creates shaped success and failure results", () => {
    expect(createMetadataActionSuccess("save", "Saved.")).toEqual({
      ok: true,
      actionKey: "save",
      message: "Saved.",
    });

    expect(
      createMetadataActionFailure(
        "delete",
        "FORBIDDEN",
        "You do not have permission."
      )
    ).toEqual({
      ok: false,
      actionKey: "delete",
      code: "FORBIDDEN",
      userMessage: "You do not have permission.",
    });
  });

  it("narrows success and failure results", () => {
    const success = createMetadataActionSuccess("save");
    const failure = createMetadataActionFailure(
      "save",
      "UNAUTHORIZED",
      "Sign in to continue."
    );

    expect(isMetadataActionSuccess(success)).toBe(true);
    expect(isMetadataActionFailure(success)).toBe(false);
    expect(isMetadataActionFailure(failure)).toBe(true);
    expect(isMetadataActionSuccess(failure)).toBe(false);
  });

  it("flags destructive actions missing confirm metadata", () => {
    expect(
      destructiveActionMissingConfirm({
        key: "archive",
        label: "Archive",
        kind: "button",
      })
    ).toBe(false);

    expect(
      actionRequiresConfirmation({
        key: "archive",
        label: "Archive",
        kind: "destructive",
        confirm: {
          title: "Archive?",
          description: "You can restore later.",
          confirmLabel: "Archive",
        },
      })
    ).toBe(true);
  });

  it("round-trips action results to wire shape without reason", () => {
    const failure = createMetadataActionFailure(
      "delete",
      "FORBIDDEN",
      "Denied.",
      "internal audit reason"
    );

    expect(toMetadataActionWireResult(failure)).toEqual({
      ok: false,
      actionKey: "delete",
      code: "FORBIDDEN",
      userMessage: "Denied.",
    });
    expect("reason" in toMetadataActionWireResult(failure)).toBe(false);

    expect(
      toMetadataActionWireResult(createMetadataActionSuccess("save"))
    ).toEqual({
      ok: true,
      actionKey: "save",
    });

    expect(
      toMetadataActionWireResult(createMetadataActionSuccess("save", "Saved."))
    ).toEqual({
      ok: true,
      actionKey: "save",
      message: "Saved.",
    });

    expect(
      JSON.parse(JSON.stringify(toMetadataActionWireResult(failure)))
    ).toEqual({
      ok: false,
      actionKey: "delete",
      code: "FORBIDDEN",
      userMessage: "Denied.",
    });
  });
});
