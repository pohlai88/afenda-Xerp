import Link from "next/link";
import type { FormEventHandler, ReactNode } from "react";

import { AuthV2StatusSurface } from "@/app/(auth-v2)/_components/auth-v2-status-surface";
import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";

function AuthV2FormRoot({ children }: { readonly children: ReactNode }) {
  return <div className="erp-auth-v2-form">{children}</div>;
}

function AuthV2FormBackToSignIn() {
  return (
    <Link
      className="erp-auth-v2-form__back-link"
      href={buildAuthV2Path("signIn")}
    >
      Back to sign in
    </Link>
  );
}

function AuthV2FormBackButton({
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
      className="erp-auth-v2-form__back-link"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function AuthV2FormStepLead({ children }: { readonly children: ReactNode }) {
  return (
    <p className="erp-auth-v2-form__step-lead" role="status">
      {children}
    </p>
  );
}

function AuthV2FormFieldError({ children }: { readonly children: ReactNode }) {
  return (
    <p className="erp-auth-v2-form__error" role="alert">
      {children}
    </p>
  );
}

function AuthV2FormNoticePositive({
  hints,
  lead,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return (
    <AuthV2StatusSurface
      {...(hints === undefined ? {} : { hints })}
      lead={lead}
      tone="positive"
    />
  );
}

function AuthV2FormNoticeCaution({
  hints,
  lead,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return (
    <AuthV2StatusSurface
      {...(hints === undefined ? {} : { hints })}
      lead={lead}
      tone="caution"
    />
  );
}

function AuthV2FormNoticeNeutral({
  hints,
  lead,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
}) {
  return (
    <AuthV2StatusSurface
      {...(hints === undefined ? {} : { hints })}
      lead={lead}
      tone="neutral"
    />
  );
}

function AuthV2FormAlternates({ children }: { readonly children: ReactNode }) {
  return <div className="erp-auth-v2-form__alternates">{children}</div>;
}

function AuthV2FormAlternateLabel({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <p className="erp-auth-v2-form__alternates-label">{children}</p>;
}

function AuthV2FormAlternateNotice({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <p className="erp-auth-v2-form__notice">{children}</p>;
}

function AuthV2FormAlternateEntry({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <div className="erp-auth-v2-form__alternate-entry">{children}</div>;
}

function AuthV2FormFields({
  children,
  onSubmit,
}: {
  readonly children: ReactNode;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <form className="erp-auth-v2-form__fields" onSubmit={onSubmit}>
      {children}
    </form>
  );
}

function AuthV2FormSkeleton({ label }: { readonly label: string }) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="erp-auth-v2-form-skeleton"
      role="status"
    >
      <div className="erp-auth-v2-form-skeleton__bar" />
      <div className="erp-auth-v2-form-skeleton__bar" />
      <div className="erp-auth-v2-form-skeleton__bar" />
      <div className="erp-auth-v2-form-skeleton__bar erp-auth-v2-form-skeleton__bar--short" />
      <p className="erp-auth-v2-form__loading">{label}</p>
    </div>
  );
}

export const AuthV2Form = {
  Root: AuthV2FormRoot,
  BackToSignIn: AuthV2FormBackToSignIn,
  BackButton: AuthV2FormBackButton,
  StepLead: AuthV2FormStepLead,
  FieldError: AuthV2FormFieldError,
  NoticePositive: AuthV2FormNoticePositive,
  NoticeCaution: AuthV2FormNoticeCaution,
  NoticeNeutral: AuthV2FormNoticeNeutral,
  Alternates: AuthV2FormAlternates,
  AlternateLabel: AuthV2FormAlternateLabel,
  AlternateNotice: AuthV2FormAlternateNotice,
  AlternateEntry: AuthV2FormAlternateEntry,
  Fields: AuthV2FormFields,
  Skeleton: AuthV2FormSkeleton,
} as const;
