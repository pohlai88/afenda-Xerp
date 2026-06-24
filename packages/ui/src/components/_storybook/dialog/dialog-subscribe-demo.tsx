"use client";

import type { FormEvent, ReactNode } from "react";
import { useId } from "react";
import { Button } from "../../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../dialog";
import { Input } from "../../input";
import { Label } from "../../label";
import {
  DIALOG_SUBSCRIBE_DESCRIPTION,
  DIALOG_SUBSCRIBE_EMAIL_LABEL,
  DIALOG_SUBSCRIBE_EMAIL_PLACEHOLDER,
  DIALOG_SUBSCRIBE_SUBMIT_LABEL,
  DIALOG_SUBSCRIBE_TITLE,
  DIALOG_SUBSCRIBE_TRIGGER_LABEL,
} from "./dialog-fixtures";

export interface StorybookDialogSubscribeProps {
  readonly defaultOpen?: boolean;
  readonly description?: string;
  readonly emailLabel?: string;
  readonly emailPlaceholder?: string;
  readonly submitLabel?: string;
  readonly title?: string;
  readonly triggerLabel?: string;
}

/**
 * Storybook-only subscribe dialog — normalized from shadcn-studio dialog-09.
 *
 * Phase 3 normalization:
 *   - Zero className on Button, Dialog*, Input, Label
 *   - Portaled dialog styles via :has(.afenda-storybook-dialog__form) in dialog-preview.css
 *   - Button: emphasis="outline" trigger, emphasis="solid" submit (not stock variant strings)
 */
export function StorybookDialogSubscribe({
  defaultOpen,
  description = DIALOG_SUBSCRIBE_DESCRIPTION,
  emailLabel = DIALOG_SUBSCRIBE_EMAIL_LABEL,
  emailPlaceholder = DIALOG_SUBSCRIBE_EMAIL_PLACEHOLDER,
  submitLabel = DIALOG_SUBSCRIBE_SUBMIT_LABEL,
  title = DIALOG_SUBSCRIBE_TITLE,
  triggerLabel = DIALOG_SUBSCRIBE_TRIGGER_LABEL,
}: StorybookDialogSubscribeProps): ReactNode {
  const emailId = useId();

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
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <form
            className="afenda-storybook-dialog__form"
            onSubmit={handleSubmit}
          >
            <div className="afenda-storybook-dialog__field">
              <Label htmlFor={emailId}>{emailLabel}</Label>
              <Input
                autoComplete="email"
                id={emailId}
                name="email"
                placeholder={emailPlaceholder}
                required
                type="email"
              />
            </div>
            <div className="afenda-storybook-dialog__submit">
              <Button emphasis="solid" intent="primary" size="md" type="submit">
                {submitLabel}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
