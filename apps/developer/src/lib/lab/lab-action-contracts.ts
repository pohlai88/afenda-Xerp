export type LabServerActionFailureCode =
  | "invalid-input"
  | "note-empty"
  | "note-too-long";

export interface LabServerActionFailure {
  code: LabServerActionFailureCode;
  message: string;
  ok: false;
}

export interface LabAppearanceReviewNoteActionSuccess {
  note: string;
  ok: true;
}

export type LabAppearanceReviewNoteActionResult =
  | LabAppearanceReviewNoteActionSuccess
  | LabServerActionFailure;

export type LabAppearanceReviewNoteActionState =
  LabAppearanceReviewNoteActionResult | null;
