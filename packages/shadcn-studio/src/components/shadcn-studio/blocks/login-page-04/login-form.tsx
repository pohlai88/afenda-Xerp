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
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <FieldGroup className="gap-4">
        {/* Name */}
        <Field>
          <Input placeholder="Enter your name" type="text" />
        </Field>
        {/* Email */}
        <Field>
          <Input placeholder="Enter your email address" type="email" />
        </Field>
        {/* Password */}
        <InputGroup>
          <InputGroupInput
            id="password"
            placeholder="••••••••••••••••"
            type={isVisible ? "text" : "password"}
          />
          <InputGroupAddon align="inline-end" className="pr-1.5">
            <Button
              className="rounded-l-none text-muted-foreground hover:bg-transparent"
              onClick={() => setIsVisible((prevState) => !prevState)}
              size="icon"
              variant="ghost"
            >
              {isVisible ? <EyeOffIcon /> : <EyeIcon />}
              <span className="sr-only">
                {isVisible ? "Hide password" : "Show password"}
              </span>
            </Button>
          </InputGroupAddon>
        </InputGroup>
        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between gap-y-2">
          <Field className="flex items-center gap-3" orientation="horizontal">
            <Checkbox className="size-6" id="rememberMe" />
            <FieldLabel className="text-muted-foreground" htmlFor="rememberMe">
              Remember Me
            </FieldLabel>
          </Field>
          <a className="text-nowrap hover:underline" href="#">
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
