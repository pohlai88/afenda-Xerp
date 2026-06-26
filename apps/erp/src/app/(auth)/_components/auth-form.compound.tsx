import Link from "next/link";
import type { FormEventHandler, ReactNode } from "react";

import { buildAuthPath } from "@/lib/auth/auth-path.registry";

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

function AuthFormNotice({
  hints,
  lead,
  role = "status",
  tone,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
  readonly role?: "alert" | "status";
  readonly tone: "caution" | "neutral" | "positive";
}) {
  return (
    <div className={`erp-auth-notice erp-auth-notice--${tone}`} role={role}>
      <p className="erp-auth-notice__lead">{lead}</p>
      {hints?.map((hint) => (
        <p className="erp-auth-notice__hint" key={hint}>
          {hint}
        </p>
      ))}
    </div>
  );
}

function AuthFormNoticePositive({
  hints,
  lead,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return <AuthFormNotice hints={hints} lead={lead} tone="positive" />;
}

function AuthFormNoticeCaution({
  hints,
  lead,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return (
    <AuthFormNotice hints={hints} lead={lead} role="alert" tone="caution" />
  );
}

function AuthFormNoticeNeutral({
  hints,
  lead,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return <AuthFormNotice hints={hints} lead={lead} tone="neutral" />;
}

/** @deprecated Use `AuthForm.NoticePositive` */
function AuthFormStatusPositive(props: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return <AuthFormNoticePositive {...props} />;
}

/** @deprecated Use `AuthForm.NoticeCaution` */
function AuthFormStatusCaution(props: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return <AuthFormNoticeCaution {...props} />;
}

/** @deprecated Use `AuthForm.NoticeNeutral` */
function AuthFormStatusNeutral(props: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return <AuthFormNoticeNeutral {...props} />;
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
      <p className="erp-auth-form__loading">{label}</p>
    </div>
  );
}

export const AuthForm = {
  Root: AuthFormRoot,
  BackToSignIn: AuthFormBackToSignIn,
  BackButton: AuthFormBackButton,
  StepLead: AuthFormStepLead,
  FieldError: AuthFormFieldError,
  NoticePositive: AuthFormNoticePositive,
  NoticeCaution: AuthFormNoticeCaution,
  NoticeNeutral: AuthFormNoticeNeutral,
  /** @deprecated Use `NoticePositive` */
  StatusPositive: AuthFormStatusPositive,
  /** @deprecated Use `NoticeCaution` */
  StatusCaution: AuthFormStatusCaution,
  /** @deprecated Use `NoticeNeutral` */
  StatusNeutral: AuthFormStatusNeutral,
  Alternates: AuthFormAlternates,
  AlternateLabel: AuthFormAlternateLabel,
  AlternateNotice: AuthFormAlternateNotice,
  AlternateEntry: AuthFormAlternateEntry,
  Fields: AuthFormFields,
  Skeleton: AuthFormSkeleton,
} as const;
