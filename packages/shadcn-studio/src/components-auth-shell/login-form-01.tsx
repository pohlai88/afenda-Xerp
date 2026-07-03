"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <FieldGroup className="gap-4">
        {/* Email */}
        <Field className="gap-2">
          <FieldLabel className="leading-5" htmlFor="userEmail">
            Email address*
          </FieldLabel>
          <Input
            id="userEmail"
            placeholder="Enter your email address"
            type="email"
          />
        </Field>
        {/* Password */}
        <Field className="w-full gap-2">
          <FieldLabel className="leading-5" htmlFor="password">
            Password*
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="password"
              placeholder="••••••••••••••••"
              type={isVisible ? "text" : "password"}
            />
            <InputGroupAddon align="inline-end" className="pr-1.5">
              <Button
                className="rounded-l-none text-muted-foreground hover:bg-transparent"
                onClick={() => {
                  setIsVisible((prevState) => !prevState);
                }}
                size="icon"
                type="button"
                variant="ghost"
              >
                {isVisible ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
                <span className="sr-only">
                  {isVisible ? "Hide password" : "Show password"}
                </span>
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between gap-y-2">
          <Field className="flex items-center gap-2" orientation="horizontal">
            <Checkbox id="rememberMe" />
            <FieldLabel className="text-muted-foreground" htmlFor="rememberMe">
              Remember Me
            </FieldLabel>
          </Field>
          <a className="whitespace-nowrap text-base hover:underline" href="#">
            Forgot Password?
          </a>
        </div>
        <Field>
          <Button className="w-full" type="submit">
            Sign in to Shadcn Studio
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
