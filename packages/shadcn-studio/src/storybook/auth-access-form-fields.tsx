"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import GithubIcon from "../components-assets/icon-github.js";
import GoogleIcon from "../components-assets/icon-google.js";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

export type AuthAccessFormFieldsProps = {
  readonly className?: string;
  readonly showOAuth?: boolean;
  readonly showSignUpLink?: boolean;
  readonly submitLabel?: string;
};

/**
 * Lab-only shared access form — OAuth (Google/GitHub) + email/password fields.
 * Mirrors login-page-04 chrome without editing production auth-shell blocks.
 */
export function AuthAccessFormFields({
  className,
  showOAuth = true,
  showSignUpLink = true,
  submitLabel = "Sign in",
}: AuthAccessFormFieldsProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={className}>
      {showOAuth ? (
        <>
          <div className="flex flex-col gap-3">
            <Button
              className="grow"
              nativeButton={false}
              render={<a href="#" />}
              variant="outline"
            >
              <GoogleIcon className="size-4" variant="brand" />
              Login with Google
            </Button>
            <Button
              className="grow"
              nativeButton={false}
              render={<a href="#" />}
              variant="outline"
            >
              <GithubIcon className="size-4" variant="brand" />
              Login with GitHub
            </Button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <Separator className="flex-1" />
            <p className="text-muted-foreground text-sm">Or</p>
            <Separator className="flex-1" />
          </div>
        </>
      ) : null}

      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <FieldGroup className="gap-4">
          <Field>
            <Input placeholder="Enter your name" type="text" />
          </Field>
          <Field>
            <Input placeholder="Enter your email address" type="email" />
          </Field>
          <InputGroup>
            <InputGroupInput
              id="auth-lab-password"
              placeholder="••••••••••••••••"
              type={isVisible ? "text" : "password"}
            />
            <InputGroupAddon align="inline-end" className="pr-1.5">
              <Button
                className="rounded-l-none text-muted-foreground hover:bg-transparent"
                onClick={() => setIsVisible((previous) => !previous)}
                size="icon"
                type="button"
                variant="ghost"
              >
                {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                <span className="sr-only">
                  {isVisible ? "Hide password" : "Show password"}
                </span>
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <p className="text-muted-foreground text-xs">
            Enter your Afenda account password.
          </p>
          <div className="flex items-center justify-between gap-y-2">
            <Field className="flex items-center gap-3" orientation="horizontal">
              <Checkbox className="size-6" id="auth-lab-remember" />
              <FieldLabel
                className="text-muted-foreground"
                htmlFor="auth-lab-remember"
              >
                Remember Me
              </FieldLabel>
            </Field>
            <a className="text-nowrap hover:underline" href="#">
              Forgot Password?
            </a>
          </div>
          <Field>
            <Button className="w-full" type="submit">
              {submitLabel}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      {showSignUpLink ? (
        <p className="mt-4 text-center text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <a className="text-foreground hover:underline" href="#">
            Sign Up
          </a>
        </p>
      ) : null}
    </div>
  );
}
