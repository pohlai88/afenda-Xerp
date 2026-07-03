"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CANONICAL_RESET_PASSWORD_FORM_ID } from "./auth-shell-method-manifest.js";

export interface ResetPasswordFormV1Props {
  readonly action?: string;
  readonly className?: string;
  readonly confirmPasswordLabel?: string;
  readonly confirmPasswordPlaceholder?: string;
  readonly id?: typeof CANONICAL_RESET_PASSWORD_FORM_ID | string;
  readonly method?: "get" | "post";
  readonly onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  readonly passwordLabel?: string;
  readonly passwordPlaceholder?: string;
  readonly submitLabel?: string;
  readonly token?: string;
}

function joinClassName(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function ResetPasswordFormV1({
  id = CANONICAL_RESET_PASSWORD_FORM_ID,
  className,
  action,
  method = "post",
  token = "",
  passwordLabel = "New password",
  passwordPlaceholder = "Create a strong password",
  confirmPasswordLabel = "Confirm password",
  confirmPasswordPlaceholder = "Repeat your new password",
  submitLabel = "Update password",
  onSubmit,
}: ResetPasswordFormV1Props) {
  const reactId = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const passwordInputId = `${id}-${reactId}-new-password`;
  const confirmPasswordInputId = `${id}-${reactId}-confirm-password`;

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
        <input name="token" type="hidden" value={token} />

        <Field className="w-full gap-2">
          <FieldLabel className="leading-5" htmlFor={passwordInputId}>
            {passwordLabel}
            <span aria-hidden="true">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              autoComplete="new-password"
              id={passwordInputId}
              name="newPassword"
              placeholder={passwordPlaceholder}
              required
              type={isPasswordVisible ? "text" : "password"}
            />
            <InputGroupAddon align="inline-end" className="pr-1.5">
              <Button
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                className="rounded-l-none text-muted-foreground hover:bg-transparent"
                onClick={() =>
                  setIsPasswordVisible((currentValue) => !currentValue)
                }
                size="icon"
                type="button"
                variant="ghost"
              >
                {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Field className="gap-2">
          <FieldLabel className="leading-5" htmlFor={confirmPasswordInputId}>
            {confirmPasswordLabel}
            <span aria-hidden="true">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              autoComplete="new-password"
              id={confirmPasswordInputId}
              name="confirmPassword"
              placeholder={confirmPasswordPlaceholder}
              required
              type={isPasswordVisible ? "text" : "password"}
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
