"use client";

import { Spinner } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import Link from "next/link";
import {
  createContext,
  type FormEventHandler,
  type ReactNode,
  use,
} from "react";

import { AuthStatusSurface } from "@/app/(auth)/_components/auth-status-surface";
import type { AuthFormContextValue } from "@/lib/auth/auth-form-state";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";

const AuthFormContext = createContext<AuthFormContextValue | null>(null);

function AuthFormProvider({
  children,
  value,
}: {
  readonly children: ReactNode;
  readonly value: AuthFormContextValue;
}) {
  return <AuthFormContext value={value}>{children}</AuthFormContext>;
}

export function useAuthFormContext(): AuthFormContextValue {
  const ctx = use(AuthFormContext);
  if (!ctx) {
    throw new Error("useAuthFormContext must be used within AuthForm.Provider");
  }
  return ctx;
}

function AuthFormRoot({ children }: { readonly children: ReactNode }) {
  return <div className="erp-auth-form">{children}</div>;
}

function AuthFormBackToSignIn() {
  return (
    <Link className="erp-auth-form__back-link" href={buildAuthPath("signIn")}>
      Back to sign in
    </Link>
  );
}

function AuthFormBackButton({
  children,
  disabled,
  onClick,
}: {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly onClick: () => void;
}) {
  return (
    <button
      className="erp-auth-form__back-link"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function AuthFormStepLead({ children }: { readonly children: ReactNode }) {
  return (
    <p className="erp-auth-form__step-lead" role="status">
      {children}
    </p>
  );
}

function AuthFormFieldError({ children }: { readonly children: ReactNode }) {
  return (
    <p className="erp-auth-form__error" role="alert">
      {children}
    </p>
  );
}

function AuthFormNoticePositive({
  hints,
  lead,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return (
    <AuthStatusSurface
      {...(hints === undefined ? {} : { hints })}
      lead={lead}
      tone="positive"
    />
  );
}

function AuthFormNoticeCaution({
  hints,
  lead,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return (
    <AuthStatusSurface
      {...(hints === undefined ? {} : { hints })}
      lead={lead}
      tone="caution"
    />
  );
}

function AuthFormNoticeNeutral({
  hints,
  lead,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return (
    <AuthStatusSurface
      {...(hints === undefined ? {} : { hints })}
      lead={lead}
      tone="neutral"
    />
  );
}

function AuthFormAlternates({ children }: { readonly children: ReactNode }) {
  return <div className="erp-auth-form__alternates">{children}</div>;
}

function AuthFormAlternateLabel({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <p className="erp-auth-form__alternates-label">{children}</p>;
}

function AuthFormAlternateNotice({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <p className="erp-auth-form__notice">{children}</p>;
}

function AuthFormAlternateEntry({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <div className="erp-auth-form__alternate-entry">{children}</div>;
}

function AuthFormOtherMethods({ children }: { readonly children: ReactNode }) {
  return <div className="erp-auth-form__other-methods">{children}</div>;
}

function AuthFormSignUpPrompt({ children }: { readonly children: ReactNode }) {
  return <p className="erp-auth-form__signup-prompt">{children}</p>;
}

function AuthFormFields({
  children,
  onSubmit,
}: {
  readonly children: ReactNode;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <form className="erp-auth-form__fields" onSubmit={onSubmit}>
      {children}
    </form>
  );
}

function AuthFormFieldHint({ children }: { readonly children: ReactNode }) {
  return <p className="erp-auth-form__field-hint">{children}</p>;
}

function AuthFormOtpNotice({ children }: { readonly children: ReactNode }) {
  return (
    <p className="erp-auth-form__notice erp-auth-form__notice--lead">
      {children}
    </p>
  );
}

function AuthFormSkeleton({ label }: { readonly label: string }) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="erp-auth-form-skeleton"
      role="status"
    >
      <div className="erp-auth-form-skeleton__bar" />
      <div className="erp-auth-form-skeleton__bar" />
      <div className="erp-auth-form-skeleton__bar" />
      <div className="erp-auth-form-skeleton__bar erp-auth-form-skeleton__bar--short" />
      <Spinner aria-label={label} size="sm" />
    </div>
  );
}

export type AuthFormCompoundGovernedComponents = Extract<
  GovernedUiComponentName,
  "Spinner"
>;

export const AuthForm = {
  Provider: AuthFormProvider,
  Root: AuthFormRoot,
  BackToSignIn: AuthFormBackToSignIn,
  BackButton: AuthFormBackButton,
  StepLead: AuthFormStepLead,
  FieldError: AuthFormFieldError,
  FieldHint: AuthFormFieldHint,
  OtpNotice: AuthFormOtpNotice,
  NoticePositive: AuthFormNoticePositive,
  NoticeCaution: AuthFormNoticeCaution,
  NoticeNeutral: AuthFormNoticeNeutral,
  Alternates: AuthFormAlternates,
  AlternateLabel: AuthFormAlternateLabel,
  AlternateNotice: AuthFormAlternateNotice,
  AlternateEntry: AuthFormAlternateEntry,
  OtherMethods: AuthFormOtherMethods,
  SignUpPrompt: AuthFormSignUpPrompt,
  Fields: AuthFormFields,
  Skeleton: AuthFormSkeleton,
} as const;
