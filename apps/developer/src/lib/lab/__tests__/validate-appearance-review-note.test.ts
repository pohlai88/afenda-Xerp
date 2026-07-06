import { describe, expect, it } from "vitest";
import { labActionRouteRegistry } from "@/lib/lab/lab-action-route-registry";
import { validateAppearanceReviewNoteInput } from "@/lib/lab/validate-appearance-review-note";

describe("appearance review note validation", () => {
  it("is registered in the governed action allowlist", () => {
    expect(labActionRouteRegistry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionId: "settings.appearance.save-review-note",
          routeId: "settings.appearance",
        }),
      ])
    );
  });

  it("accepts a trimmed note within the lab limit", () => {
    expect(
      validateAppearanceReviewNoteInput("  Promotion-safe panel  ")
    ).toEqual({
      note: "Promotion-safe panel",
      ok: true,
    });
  });

  it("rejects empty notes", () => {
    expect(validateAppearanceReviewNoteInput("   ")).toEqual(
      expect.objectContaining({
        code: "note-empty",
        ok: false,
      })
    );
  });

  it("rejects notes that exceed the lab limit", () => {
    expect(validateAppearanceReviewNoteInput("a".repeat(281))).toEqual(
      expect.objectContaining({
        code: "note-too-long",
        ok: false,
      })
    );
  });
});
