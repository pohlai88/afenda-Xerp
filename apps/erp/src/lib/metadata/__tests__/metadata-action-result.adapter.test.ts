import { AppErrors } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import {
  appErrorToMetadataActionFailure,
  serverActionResultToMetadataActionResult,
} from "../metadata-action-result.adapter.js";

describe("metadata action result adapter", () => {
  it("maps AppError through toAppErrorWire into metadata failure results", () => {
    const error = AppErrors.forbidden("You cannot edit this record.");

    expect(appErrorToMetadataActionFailure("edit", error)).toEqual({
      ok: false,
      actionKey: "edit",
      code: "FORBIDDEN",
      userMessage: "You cannot edit this record.",
    });
  });

  it("maps server action failures into metadata failure results", () => {
    const failure = {
      ok: false as const,
      code: "VALIDATION_ERROR" as const,
      userMessage: "Please check the highlighted fields.",
    };

    expect(serverActionResultToMetadataActionResult("save", failure)).toEqual({
      ok: false,
      actionKey: "save",
      code: "VALIDATION_ERROR",
      userMessage: "Please check the highlighted fields.",
    });
  });

  it("maps server action success into metadata success results", () => {
    expect(
      serverActionResultToMetadataActionResult(
        "refresh-workspace-preview",
        { ok: true, data: { refreshedAt: "2026-06-28T00:00:00.000Z" } },
        "Metadata workspace refreshed."
      )
    ).toEqual({
      ok: true,
      actionKey: "refresh-workspace-preview",
      message: "Metadata workspace refreshed.",
    });
  });

  it("maps optional server action success data into metadata success results", () => {
    expect(
      serverActionResultToMetadataActionResult("save", {
        ok: true,
        data: { id: "doc-1" },
      })
    ).toEqual({
      ok: true,
      actionKey: "save",
    });
  });
});
