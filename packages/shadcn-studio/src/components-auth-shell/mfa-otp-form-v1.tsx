"use client";

import { type FormEvent, useId } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { CANONICAL_MFA_OTP_FORM_ID } from "./auth-shell-method-manifest.js";

export interface MfaOtpFormV1Props {
  readonly action?: string;
  readonly className?: string;
  readonly codeLabel?: string;
  readonly codePlaceholder?: string;
  readonly id?: typeof CANONICAL_MFA_OTP_FORM_ID | string;
  readonly method?: "get" | "post";
  readonly onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  readonly submitLabel?: string;
}

function joinClassName(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function MfaOtpFormV1({
  id = CANONICAL_MFA_OTP_FORM_ID,
  className,
  action,
  method = "post",
  codeLabel = "Verification code",
  codePlaceholder = "Enter 6-digit code",
  submitLabel = "Verify code",
  onSubmit,
}: MfaOtpFormV1Props) {
  const reactId = useId();
  const codeInputId = `${id}-${reactId}-code`;

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
          <FieldLabel className="leading-5" htmlFor={codeInputId}>
            {codeLabel}
            <span aria-hidden="true">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              autoComplete="one-time-code"
              id={codeInputId}
              inputMode="numeric"
              maxLength={10}
              name="code"
              placeholder={codePlaceholder}
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
