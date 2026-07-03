"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CANONICAL_LOGIN_FORM_ID } from "./auth-shell-method-manifest.js";

export interface LoginFormV1Props {
  readonly action?: string;
  readonly className?: string;
  readonly emailLabel?: string;
  readonly emailPlaceholder?: string;
  readonly forgotPasswordHref?: string;
  readonly forgotPasswordLabel?: string;
  readonly id?: typeof CANONICAL_LOGIN_FORM_ID | string;
  readonly method?: "get" | "post";
  readonly onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  readonly passwordLabel?: string;
  readonly passwordPlaceholder?: string;
  readonly rememberMeLabel?: string;
  readonly submitLabel?: string;
}

function joinClassName(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function LoginFormV1({
  id = CANONICAL_LOGIN_FORM_ID,
  className,
  action,
  method = "post",
  emailLabel = "Email address",
  emailPlaceholder = "Enter your email address",
  passwordLabel = "Password",
  passwordPlaceholder = "••••••••••••••••",
  rememberMeLabel = "Remember me",
  forgotPasswordHref = "#",
  forgotPasswordLabel = "Forgot password?",
  submitLabel = "Sign in",
  onSubmit,
}: LoginFormV1Props) {
  const reactId = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const emailInputId = `${id}-${reactId}-email`;
  const passwordInputId = `${id}-${reactId}-password`;
  const rememberMeInputId = `${id}-${reactId}-remember-me`;

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

        <Field className="w-full gap-2">
          <FieldLabel className="leading-5" htmlFor={passwordInputId}>
            {passwordLabel}
            <span aria-hidden="true">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              autoComplete="current-password"
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

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Field className="flex items-center gap-2" orientation="horizontal">
            <Checkbox id={rememberMeInputId} name="rememberMe" />
            <FieldLabel
              className="text-muted-foreground"
              htmlFor={rememberMeInputId}
            >
              {rememberMeLabel}
            </FieldLabel>
          </Field>

          <a
            className="text-nowrap text-base hover:underline"
            href={forgotPasswordHref}
          >
            {forgotPasswordLabel}
          </a>
        </div>

        <Field>
          <Button className="w-full" type="submit">
            {submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
