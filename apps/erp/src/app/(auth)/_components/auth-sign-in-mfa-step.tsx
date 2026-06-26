"use client";

import { twoFactor } from "@afenda/auth/client";
import {
  Button,
  Field,
  FieldError,
  FieldLabel,
  Input,
  Spinner,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useRouter } from "next/navigation";
import { type ReactNode, useState, useTransition } from "react";

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import {
  AUTH_MFA_COPY,
  MFA_OTP_DELIVERY_HINT,
  MFA_OTP_DELIVERY_NOTICE,
} from "@/lib/auth/auth-copy.registry";
import { clearMfaChallengeAction } from "@/lib/auth/auth-mfa-challenge.action";
import { fetchPostAuthEntryPath } from "@/lib/auth/fetch-post-auth-entry-path.client";
import { mapAuthClientError } from "@/lib/auth/resolve-auth-entry-error";

export type AuthSignInMfaStepGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Field" | "FieldError" | "FieldLabel" | "Input"
>;

export type AuthSignInMfaMode = "backup-code" | "otp" | "totp";

export interface AuthSignInMfaStepProps {
  readonly methods: readonly AuthSignInMfaMode[];
  readonly nextPath: string;
  readonly onBack: () => void;
}

const MFA_FIELD_HINTS: Record<AuthSignInMfaMode, string> = {
  totp: AUTH_MFA_COPY.fieldHintTotp,
  otp: AUTH_MFA_COPY.fieldHintOtp,
  "backup-code": AUTH_MFA_COPY.fieldHintBackupCode,
};

const MFA_INPUT_PLACEHOLDERS: Record<AuthSignInMfaMode, string> = {
  totp: AUTH_MFA_COPY.placeholderTotp,
  otp: AUTH_MFA_COPY.placeholderOtp,
  "backup-code": AUTH_MFA_COPY.placeholderBackupCode,
};

function resolveInitialMfaMode(
  methods: readonly AuthSignInMfaMode[]
): AuthSignInMfaMode {
  if (methods.includes("totp")) {
    return "totp";
  }

  if (methods.includes("otp")) {
    return "otp";
  }

  return "backup-code";
}

export function AuthSignInMfaStep({
  methods,
  nextPath,
  onBack,
}: AuthSignInMfaStepProps) {
  const router = useRouter();
  const supportsTotp = methods.includes("totp");
  const supportsOtp = methods.includes("otp");
  const [mode, setMode] = useState<AuthSignInMfaMode>(() =>
    resolveInitialMfaMode(methods)
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [otpDeliveryNotice, setOtpDeliveryNotice] = useState<string | null>(
    null
  );
  const [isSendingOtp, startOtpTransition] = useTransition();

  function requestOtpDelivery() {
    setError(null);
    startOtpTransition(async () => {
      const result = await twoFactor.sendOtp({ trustDevice: true });

      if (result.error) {
        setError(
          mapAuthClientError(result.error.message, "mfaVerificationFailed")
        );
        return;
      }

      setOtpDeliveryNotice(MFA_OTP_DELIVERY_NOTICE);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedCode = code.trim();
    if (trimmedCode.length === 0) {
      setError(resolveEmptyCodeMessage(mode));
      return;
    }

    startSubmitTransition(async () => {
      const result = await verifyMfaCode(mode, trimmedCode);

      if (result.error) {
        setError(
          mapAuthClientError(result.error.message, "mfaVerificationFailed")
        );
        return;
      }

      await clearMfaChallengeAction();
      const destination = await fetchPostAuthEntryPath(
        nextPath.length > 0 ? nextPath : null
      );
      router.replace(destination);
      router.refresh();
    });
  }

  function switchMode(nextMode: AuthSignInMfaMode) {
    setMode(nextMode);
    setCode("");
    setError(null);
    setOtpDeliveryNotice(null);

    if (nextMode === "otp") {
      requestOtpDelivery();
    }
  }

  const heading = resolveMfaHeading(mode);
  const fieldToolbarAction = resolveFieldToolbarAction({
    mode,
    supportsOtp,
    supportsTotp,
  });

  const inputId =
    mode === "totp"
      ? "auth-mfa-totp"
      : mode === "otp"
        ? "auth-mfa-otp"
        : "auth-mfa-backup";
  const inputLabel = resolveMfaInputLabel(mode);
  const inputAutoComplete = mode === "backup-code" ? "off" : "one-time-code";
  const alternateLinks = renderModeSwitchLinks({
    fieldToolbarActionMode: fieldToolbarAction?.targetMode ?? null,
    isSubmitting,
    mode,
    onSwitchMode: switchMode,
    supportsOtp,
    supportsTotp,
  });
  const showAlternatesLabel = alternateLinks.length > 0;

  return (
    <AuthForm.Root>
      <AuthForm.BackButton disabled={isSubmitting} onClick={onBack}>
        {AUTH_MFA_COPY.backToSignIn}
      </AuthForm.BackButton>

      <AuthForm.StepLead>{heading}</AuthForm.StepLead>

      {mode === "otp" && isSendingOtp && otpDeliveryNotice === null ? (
        <AuthForm.OtpNotice>{AUTH_MFA_COPY.sendingOtp}</AuthForm.OtpNotice>
      ) : null}

      {otpDeliveryNotice ? (
        <AuthForm.NoticeNeutral
          hints={[MFA_OTP_DELIVERY_HINT]}
          lead={otpDeliveryNotice}
        />
      ) : null}

      <AuthForm.Fields onSubmit={handleSubmit}>
        <Field>
          <div className="erp-auth-form__field-toolbar">
            <FieldLabel htmlFor={inputId}>{inputLabel}</FieldLabel>
            {fieldToolbarAction ? (
              <p className="erp-auth-form__field-toolbar-action">
                <button
                  className="erp-auth-form__text-action"
                  disabled={isSubmitting}
                  onClick={() => switchMode(fieldToolbarAction.targetMode)}
                  type="button"
                >
                  {fieldToolbarAction.label}
                </button>
              </p>
            ) : null}
          </div>
          <Input
            aria-describedby={error ? "auth-mfa-code-error" : undefined}
            aria-invalid={!!error}
            autoComplete={inputAutoComplete}
            id={inputId}
            inputMode={mode === "backup-code" ? "text" : "numeric"}
            name="code"
            onChange={(event) => setCode(event.target.value)}
            placeholder={MFA_INPUT_PLACEHOLDERS[mode]}
            required
            type="text"
            value={code}
          />
          {error ? (
            <FieldError id="auth-mfa-code-error">{error}</FieldError>
          ) : null}
          <AuthForm.FieldHint>{MFA_FIELD_HINTS[mode]}</AuthForm.FieldHint>
        </Field>
        <div className="erp-auth-form__submit-row">
          <Button
            aria-busy={isSubmitting ? "true" : undefined}
            disabled={isSubmitting || (mode === "otp" && isSendingOtp)}
            emphasis="solid"
            intent="primary"
            presentation="default"
            size="md"
            type="submit"
          >
            {isSubmitting ? (
              <>
                <Spinner aria-label="Verifying code" size="sm" />
                {AUTH_MFA_COPY.verifying}
              </>
            ) : (
              AUTH_MFA_COPY.verifyAndContinue
            )}
          </Button>
        </div>
      </AuthForm.Fields>

      {showAlternatesLabel || mode === "otp" ? (
        <AuthForm.Alternates>
          {showAlternatesLabel ? (
            <AuthForm.AlternateLabel>
              {AUTH_MFA_COPY.otherVerificationOptions}
            </AuthForm.AlternateLabel>
          ) : null}
          {alternateLinks}
          {mode === "otp" ? (
            <AuthForm.AlternateNotice>
              <button
                className="erp-auth-form__text-action"
                disabled={isSubmitting || isSendingOtp}
                onClick={() => {
                  requestOtpDelivery();
                }}
                type="button"
              >
                {AUTH_MFA_COPY.resendEmailCode}
              </button>
            </AuthForm.AlternateNotice>
          ) : null}
        </AuthForm.Alternates>
      ) : null}
    </AuthForm.Root>
  );
}

function resolveEmptyCodeMessage(mode: AuthSignInMfaMode): string {
  switch (mode) {
    case "totp":
      return AUTH_MFA_COPY.emptyCodeTotp;
    case "otp":
      return AUTH_MFA_COPY.emptyCodeOtp;
    case "backup-code":
      return AUTH_MFA_COPY.emptyCodeBackupCode;
    default:
      return AUTH_MFA_COPY.emptyCodeDefault;
  }
}

function resolveMfaHeading(mode: AuthSignInMfaMode): string {
  switch (mode) {
    case "totp":
      return AUTH_MFA_COPY.headingTotp;
    case "otp":
      return AUTH_MFA_COPY.headingOtp;
    case "backup-code":
      return AUTH_MFA_COPY.headingBackupCode;
    default:
      return AUTH_MFA_COPY.headingDefault;
  }
}

function resolveMfaInputLabel(mode: AuthSignInMfaMode): string {
  switch (mode) {
    case "totp":
      return AUTH_MFA_COPY.inputLabelTotp;
    case "otp":
      return AUTH_MFA_COPY.inputLabelOtp;
    case "backup-code":
      return AUTH_MFA_COPY.inputLabelBackupCode;
    default:
      return AUTH_MFA_COPY.inputLabelDefault;
  }
}

function resolveFieldToolbarAction({
  mode,
  supportsOtp,
  supportsTotp,
}: {
  readonly mode: AuthSignInMfaMode;
  readonly supportsOtp: boolean;
  readonly supportsTotp: boolean;
}): { label: string; targetMode: AuthSignInMfaMode } | null {
  if (mode === "backup-code") {
    return null;
  }

  if (mode === "totp" && supportsOtp) {
    return { label: AUTH_MFA_COPY.useEmailCodeLabel, targetMode: "otp" };
  }

  if (mode === "otp" && supportsTotp) {
    return { label: AUTH_MFA_COPY.useAuthCodeLabel, targetMode: "totp" };
  }

  return { label: AUTH_MFA_COPY.useBackupCodeLabel, targetMode: "backup-code" };
}

async function verifyMfaCode(mode: AuthSignInMfaMode, code: string) {
  switch (mode) {
    case "totp":
      return twoFactor.verifyTotp({ code, trustDevice: true });
    case "otp":
      return twoFactor.verifyOtp({ code, trustDevice: true });
    case "backup-code":
      return twoFactor.verifyBackupCode({ code, trustDevice: true });
    default:
      throw new Error(`Unsupported MFA mode: ${String(mode)}`);
  }
}

function renderModeSwitchLinks({
  fieldToolbarActionMode,
  isSubmitting,
  mode,
  onSwitchMode,
  supportsOtp,
  supportsTotp,
}: {
  readonly fieldToolbarActionMode: AuthSignInMfaMode | null;
  readonly isSubmitting: boolean;
  readonly mode: AuthSignInMfaMode;
  readonly onSwitchMode: (nextMode: AuthSignInMfaMode) => void;
  readonly supportsOtp: boolean;
  readonly supportsTotp: boolean;
}) {
  const links: ReactNode[] = [];

  if (supportsTotp && mode !== "totp" && fieldToolbarActionMode !== "totp") {
    links.push(
      <AuthForm.AlternateNotice key="totp">
        <button
          className="erp-auth-form__text-action"
          disabled={isSubmitting}
          onClick={() => onSwitchMode("totp")}
          type="button"
        >
          {AUTH_MFA_COPY.useAuthCodeLabel}
        </button>
      </AuthForm.AlternateNotice>
    );
  }

  if (supportsOtp && mode !== "otp" && fieldToolbarActionMode !== "otp") {
    links.push(
      <AuthForm.AlternateNotice key="otp">
        <button
          className="erp-auth-form__text-action"
          disabled={isSubmitting}
          onClick={() => onSwitchMode("otp")}
          type="button"
        >
          {AUTH_MFA_COPY.useEmailCodeLabel}
        </button>
      </AuthForm.AlternateNotice>
    );
  }

  if (mode !== "backup-code" && fieldToolbarActionMode !== "backup-code") {
    links.push(
      <AuthForm.AlternateNotice key="backup">
        <button
          className="erp-auth-form__text-action"
          disabled={isSubmitting}
          onClick={() => onSwitchMode("backup-code")}
          type="button"
        >
          {AUTH_MFA_COPY.useBackupCodeLabel}
        </button>
      </AuthForm.AlternateNotice>
    );
  }

  return links;
}
