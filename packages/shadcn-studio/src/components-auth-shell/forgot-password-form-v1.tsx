"use client";

import { type FormEvent, useId } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { CANONICAL_FORGOT_PASSWORD_FORM_ID } from "./auth-shell-method-manifest.js";

export interface ForgotPasswordFormV1Props {
  readonly action?: string;
  readonly callbackUrl?: string;
  readonly className?: string;
  readonly emailLabel?: string;
  readonly emailPlaceholder?: string;
  readonly id?: typeof CANONICAL_FORGOT_PASSWORD_FORM_ID | string;
  readonly method?: "get" | "post";
  readonly onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  readonly submitLabel?: string;
}

function joinClassName(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function ForgotPasswordFormV1({
  id = CANONICAL_FORGOT_PASSWORD_FORM_ID,
  className,
  action,
  method = "post",
  emailLabel = "Work email",
  emailPlaceholder = "name@company.com",
  callbackUrl = "/reset-password",
  submitLabel = "Send reset link",
  onSubmit,
}: ForgotPasswordFormV1Props) {
  const reactId = useId();
  const emailInputId = `${id}-${reactId}-email`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (onSubmit !== undefined) {
      onSubmit(event);
      return;
    }

    if (action === undefined) {
      event.preventDefault();
    }
  }

  return (
    <form
      action={action}
      className={joinClassName("w-full", className)}
      id={id}
      method={method}
      noValidate={false}
      onSubmit={handleSubmit}
    >
      <FieldGroup className="gap-4">
        <Field className="gap-2">
          <FieldLabel className="leading-5" htmlFor={emailInputId}>
            {emailLabel}
            <span aria-hidden="true">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              autoComplete="email"
              id={emailInputId}
              inputMode="email"
              name="email"
              placeholder={emailPlaceholder}
              required
              type="email"
            />
          </InputGroup>
        </Field>

        <input name="callbackURL" type="hidden" value={callbackUrl} />

        <Field>
          <Button className="w-full" type="submit">
            {submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
