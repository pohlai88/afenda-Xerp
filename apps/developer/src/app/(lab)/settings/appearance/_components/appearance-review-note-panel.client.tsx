"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
} from "@afenda/shadcn-studio-v2";
import { useActionState } from "react";
import type { LabAppearanceReviewNoteActionState } from "@/lib/lab/lab-action-contracts";
import { LAB_APPEARANCE_REVIEW_NOTE_MAX_LENGTH } from "@/lib/lab/lab-appearance-review-note.constants";
import { saveAppearanceReviewNoteAction } from "../_actions/save-appearance-review-note.server";

interface AppearanceReviewNotePanelProps {
  readonly initialNote: string | null;
}

const initialActionState: LabAppearanceReviewNoteActionState = null;

export function AppearanceReviewNotePanel({
  initialNote,
}: AppearanceReviewNotePanelProps) {
  const [state, formAction, isPending] = useActionState(
    saveAppearanceReviewNoteAction,
    initialActionState
  );
  const savedNote = state?.ok ? state.note : initialNote;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Lab review note</CardTitle>
        <CardDescription>
          Route-local Server Action proof. Notes persist in an httpOnly cookie
          for this lab route only — not ERP user settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="appearance-review-note">Review note</Label>
            <Textarea
              defaultValue={savedNote ?? ""}
              id="appearance-review-note"
              maxLength={LAB_APPEARANCE_REVIEW_NOTE_MAX_LENGTH}
              name="reviewNote"
              placeholder="Capture a route-lab review note for promotion review."
              rows={4}
            />
          </div>
          <Button disabled={isPending} type="submit">
            {isPending ? "Saving review note…" : "Save review note"}
          </Button>
        </form>
        {state?.ok ? (
          <p className="text-foreground text-sm" role="status">
            Saved lab review note for this route session.
          </p>
        ) : null}
        {state && !state.ok ? (
          <p className="text-destructive text-sm" role="alert">
            {state.message}
          </p>
        ) : null}
        {savedNote ? (
          <p className="rounded-2xl bg-muted px-4 py-3 text-sm">
            Current note: {savedNote}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            No lab review note saved yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
