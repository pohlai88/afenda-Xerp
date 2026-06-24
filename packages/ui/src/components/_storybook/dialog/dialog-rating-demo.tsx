"use client";

import type { FormEvent, ReactNode } from "react";
import { useId } from "react";
import { Button } from "../../button";
import { Checkbox } from "../../checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../dialog";
import { Label } from "../../label";
import { RadioGroup, RadioGroupItem } from "../../radio-group";
import { Textarea } from "../../textarea";
import {
  DIALOG_RATING_CANCEL_LABEL,
  DIALOG_RATING_CHAR_COUNT,
  DIALOG_RATING_CONSENT_LABEL,
  DIALOG_RATING_DEFAULT_VALUE,
  DIALOG_RATING_LEGEND,
  DIALOG_RATING_MESSAGE_LABEL,
  DIALOG_RATING_MESSAGE_PLACEHOLDER,
  DIALOG_RATING_OPTIONS,
  DIALOG_RATING_SUBMIT_LABEL,
  DIALOG_RATING_TITLE,
  DIALOG_RATING_TRIGGER_LABEL,
  type DialogRatingOption,
} from "./dialog-rating-fixtures";

export interface StorybookDialogRatingProps {
  readonly defaultOpen?: boolean;
  readonly defaultRating?: string;
  readonly legend?: string;
  readonly ratings?: readonly DialogRatingOption[];
  readonly title?: string;
  readonly triggerLabel?: string;
}

/**
 * Storybook-only rating dialog — normalized from shadcn-studio dialog-11.
 *
 * Phase 3 normalization:
 *   - Zero className on Button, Dialog*, Checkbox, Label, RadioGroup*, Textarea
 *   - Vertical mood list: visible RadioGroupItem + Lucide icon (anti-slop; not emoji pills)
 *   - Row layout + footer muted strip via governed DialogFooter recipe
 */
export function StorybookDialogRating({
  defaultOpen,
  defaultRating = DIALOG_RATING_DEFAULT_VALUE,
  legend = DIALOG_RATING_LEGEND,
  ratings = DIALOG_RATING_OPTIONS,
  title = DIALOG_RATING_TITLE,
  triggerLabel = DIALOG_RATING_TRIGGER_LABEL,
}: StorybookDialogRatingProps): ReactNode {
  const baseId = useId();
  const messageId = `${baseId}-message`;
  const termsId = `${baseId}-terms`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="afenda-storybook-dialog">
      <Dialog {...(defaultOpen ? { defaultOpen: true } : {})}>
        <DialogTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="md">
            {triggerLabel}
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <form
            className="afenda-storybook-dialog__rating-form"
            onSubmit={handleSubmit}
          >
            <fieldset className="afenda-storybook-dialog__rating-fieldset">
              <legend className="afenda-storybook-dialog__rating-legend">
                {legend}
              </legend>
              <div className="afenda-storybook-dialog__rating-group">
                <RadioGroup defaultValue={defaultRating}>
                  {ratings.map(({ value, label, Icon }) => {
                    const optionId = `${baseId}-${value}`;
                    return (
                      <label
                        className="afenda-storybook-dialog__rating-option"
                        key={value}
                      >
                        <RadioGroupItem id={optionId} value={value} />
                        <Icon aria-hidden="true" />
                        <span className="afenda-storybook-dialog__sr-only">
                          {label}
                        </span>
                      </label>
                    );
                  })}
                </RadioGroup>
              </div>
            </fieldset>

            <div className="afenda-storybook-dialog__message-field">
              <Textarea
                aria-label={DIALOG_RATING_MESSAGE_LABEL}
                id={messageId}
                name="message"
                placeholder={DIALOG_RATING_MESSAGE_PLACEHOLDER}
                required
              />
              <p className="afenda-storybook-dialog__char-count">
                {DIALOG_RATING_CHAR_COUNT}
              </p>
            </div>

            <div className="afenda-storybook-dialog__consent-row">
              <Checkbox id={termsId} name="terms" required />
              <Label htmlFor={termsId}>{DIALOG_RATING_CONSENT_LABEL}</Label>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button emphasis="outline" intent="secondary" size="md">
                  {DIALOG_RATING_CANCEL_LABEL}
                </Button>
              </DialogClose>
              <Button emphasis="solid" intent="primary" size="md" type="submit">
                {DIALOG_RATING_SUBMIT_LABEL}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
