import { cookies } from "next/headers";
import { LAB_APPEARANCE_REVIEW_NOTE_COOKIE } from "@/lib/lab/lab-appearance-review-note.constants";

export async function readAppearanceReviewNoteQuery(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(LAB_APPEARANCE_REVIEW_NOTE_COOKIE)?.value ?? null;
}
