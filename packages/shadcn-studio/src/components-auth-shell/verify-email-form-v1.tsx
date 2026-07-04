"use client";

import { type FormEvent, useId } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { CANONICAL_VERIFY_EMAIL_FORM_ID } from "./auth-shell-method-manifest.js";

export interface VerifyEmailFormV1Props {
  readonly action?: string;
  readonly className?: string;
  readonly emailLabel?: string;
  readonly emailPlaceholder?: string;
  readonly id?: typeof CANONICAL_VERIFY_EMAIL_FORM_ID | string;
  readonly method?: "get" | "post";
  readonly onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  readonly submitLabel?: string;
  readonly verificationCodeLabel?: string;
  readonly verificationCodePlaceholder?: string;
}

function joinClassName(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function VerifyEmailFormV1({
  id = CANONICAL_VERIFY_EMAIL_FORM_ID,
  className,
  action,
  method = "post",
  emailLabel = "Email address",
  emailPlaceholder = "Enter your email address",
  verificationCodeLabel = "Verification code",
  verificationCodePlaceholder = "6-digit code",
  submitLabel = "Verify email",
  onSubmit,
}: VerifyEmailFormV1Props) {
  const reactId = useId();
  const emailInputId = `${id}-${reactId}-email`;
  const verificationCodeInputId = `${id}-${reactId}-verification-code`;

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

        <Field className="gap-2">
          <FieldLabel className="leading-5" htmlFor={verificationCodeInputId}>
            {verificationCodeLabel}
            <span aria-hidden="true">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              autoComplete="one-time-code"
              id={verificationCodeInputId}
              inputMode="numeric"
              name="verificationCode"
              placeholder={verificationCodePlaceholder}
              required
              type="text"
            />
          </InputGroup>
        </Field>

        <Field>
          <Button className="w-full" type="submit">
            {submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
