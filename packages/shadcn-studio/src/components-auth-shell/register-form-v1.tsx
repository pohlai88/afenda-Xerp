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
import { CANONICAL_REGISTER_FORM_ID } from "./auth-shell-method-manifest.js";

export interface RegisterFormV1Props {
  readonly action?: string;
  readonly className?: string;
  readonly confirmPasswordLabel?: string;
  readonly confirmPasswordPlaceholder?: string;
  readonly emailLabel?: string;
  readonly emailPlaceholder?: string;
  readonly id?: typeof CANONICAL_REGISTER_FORM_ID | string;
  readonly invitationCodeLabel?: string;
  readonly invitationCodePlaceholder?: string;
  readonly method?: "get" | "post";
  readonly nameLabel?: string;
  readonly namePlaceholder?: string;
  readonly onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  readonly passwordLabel?: string;
  readonly passwordPlaceholder?: string;
  readonly submitLabel?: string;
}

function joinClassName(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function RegisterFormV1({
  id = CANONICAL_REGISTER_FORM_ID,
  className,
  action,
  method = "post",
  nameLabel = "Full name",
  namePlaceholder = "Enter your full name",
  emailLabel = "Work email",
  emailPlaceholder = "name@company.com",
  passwordLabel = "Password",
  passwordPlaceholder = "Create a strong password",
  confirmPasswordLabel = "Confirm password",
  confirmPasswordPlaceholder = "Repeat your password",
  invitationCodeLabel = "Invitation or workspace code",
  invitationCodePlaceholder = "Optional",
  submitLabel = "Create account",
  onSubmit,
}: RegisterFormV1Props) {
  const reactId = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const nameInputId = `${id}-${reactId}-name`;
  const emailInputId = `${id}-${reactId}-email`;
  const passwordInputId = `${id}-${reactId}-password`;
  const confirmPasswordInputId = `${id}-${reactId}-confirm-password`;
  const invitationCodeInputId = `${id}-${reactId}-invitation-code`;

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
          <FieldLabel className="leading-5" htmlFor={nameInputId}>
            {nameLabel}
            <span aria-hidden="true">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              autoComplete="name"
              id={nameInputId}
              name="name"
              placeholder={namePlaceholder}
              required
              type="text"
            />
          </InputGroup>
        </Field>

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

        <Field className="w-full gap-2">
          <FieldLabel className="leading-5" htmlFor={passwordInputId}>
            {passwordLabel}
            <span aria-hidden="true">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              autoComplete="new-password"
              id={passwordInputId}
              name="password"
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

        <Field className="gap-2">
          <FieldLabel className="leading-5" htmlFor={invitationCodeInputId}>
            {invitationCodeLabel}
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              autoComplete="off"
              id={invitationCodeInputId}
              name="invitationCode"
              placeholder={invitationCodePlaceholder}
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
