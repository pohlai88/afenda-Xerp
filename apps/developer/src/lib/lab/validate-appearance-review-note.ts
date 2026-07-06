import type { LabAppearanceReviewNoteActionResult } from "./lab-action-contracts";
import { LAB_APPEARANCE_REVIEW_NOTE_MAX_LENGTH } from "./lab-appearance-review-note.constants";

export function validateAppearanceReviewNoteInput(
  value: unknown
): LabAppearanceReviewNoteActionResult {
  if (typeof value !== "string") {
    return {
      code: "invalid-input",
      message: "Review note must be a string.",
      ok: false,
    };
  }

  const note = value.trim();

  if (note.length === 0) {
    return {
      code: "note-empty",
      message: "Review note cannot be empty.",
      ok: false,
    };
  }

  if (note.length > LAB_APPEARANCE_REVIEW_NOTE_MAX_LENGTH) {
    return {
      code: "note-too-long",
      message: `Review note must be ${LAB_APPEARANCE_REVIEW_NOTE_MAX_LENGTH} characters or fewer.`,
      ok: false,
    };
  }

  return {
    note,
    ok: true,
  };
}
