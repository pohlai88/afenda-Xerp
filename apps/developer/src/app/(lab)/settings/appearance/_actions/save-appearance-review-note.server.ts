"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { LabAppearanceReviewNoteActionState } from "@/lib/lab/lab-action-contracts";
import {
  LAB_APPEARANCE_REVIEW_NOTE_COOKIE,
  LAB_APPEARANCE_REVIEW_NOTE_ROUTE_PATH,
} from "@/lib/lab/lab-appearance-review-note.constants";
import { validateAppearanceReviewNoteInput } from "@/lib/lab/validate-appearance-review-note";

export async function saveAppearanceReviewNoteAction(
  _previousState: LabAppearanceReviewNoteActionState,
  formData: FormData
): Promise<LabAppearanceReviewNoteActionState> {
  const parsed = validateAppearanceReviewNoteInput(formData.get("reviewNote"));

  if (!parsed.ok) {
    return parsed;
  }

  const cookieStore = await cookies();

  cookieStore.set(LAB_APPEARANCE_REVIEW_NOTE_COOKIE, parsed.note, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: LAB_APPEARANCE_REVIEW_NOTE_ROUTE_PATH,
    sameSite: "lax",
  });

  revalidatePath(LAB_APPEARANCE_REVIEW_NOTE_ROUTE_PATH);

  return parsed;
}
