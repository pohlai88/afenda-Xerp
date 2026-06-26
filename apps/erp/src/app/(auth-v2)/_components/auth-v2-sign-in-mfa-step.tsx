"use client";

import { twoFactor } from "@afenda/auth/client";
import { Button, Input, Label } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { AuthV2Form } from "@/app/(auth-v2)/_components/auth-v2-form.compound";
import {
  MFA_OTP_DELIVERY_HINT,
  MFA_OTP_DELIVERY_NOTICE,
} from "@/app/(auth-v2)/_components/auth-v2-form.copy";
import { clearMfaChallengeAction } from "@/lib/auth/auth-mfa-challenge.action";
import { fetchPostAuthEntryPath } from "@/lib/auth/fetch-post-auth-entry-path.client";
import { mapAuthClientError } from "@/lib/auth/resolve-auth-entry-error";

export type AuthV2SignInMfaStepGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

export type AuthV2SignInMfaMode = "backup-code" | "otp" | "totp";

export interface AuthV2SignInMfaStepProps {
  readonly methods: readonly AuthV2SignInMfaMode[];
  readonly nextPath: string;
  readonly onBack: () => void;
}

const MFA_FIELD_HINTS: Record<AuthV2SignInMfaMode, string> = {
  totp: "Open your authenticator app and enter the current 6-digit code.",
  otp: "Check your inbox for a one-time sign-in code.",
  "backup-code":
    "Enter one of the backup codes you saved when you enabled two-factor authentication.",
};

const MFA_INPUT_PLACEHOLDERS: Record<AuthV2SignInMfaMode, string> = {
  totp: "000000",
  otp: "000000",
  "backup-code": "Backup code",
};

function resolveInitialMfaMode(
  methods: readonly AuthV2SignInMfaMode[]
): AuthV2SignInMfaMode {
  if (methods.includes("totp")) {
    return "totp";
  }

  if (methods.includes("otp")) {
    return "otp";
  }

  return "backup-code";
}

export function AuthV2SignInMfaStep({
  methods,
  nextPath,
  onBack,
}: AuthV2SignInMfaStepProps) {
  const router = useRouter();
  const supportsTotp = methods.includes("totp");
  const supportsOtp = methods.includes("otp");
  const [mode, setMode] = useState<AuthV2SignInMfaMode>(() =>
    resolveInitialMfaMode(methods)
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpDeliveryNotice, setOtpDeliveryNotice] = useState<string | null>(
    null
  );
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const otpRequestedRef = useRef(false);

  async function requestOtpDelivery() {
    setError(null);
    setIsSendingOtp(true);

    const result = await twoFactor.sendOtp({ trustDevice: true });

    setIsSendingOtp(false);

    if (result.error) {
      setError(
        mapAuthClientError(result.error.message, "mfaVerificationFailed")
      );
      return;
    }

    setOtpDeliveryNotice(MFA_OTP_DELIVERY_NOTICE);
  }

  useEffect(() => {
    if (mode !== "otp" || otpRequestedRef.current) {
      return;
    }

    otpRequestedRef.current = true;

    void (async () => {
      setError(null);
      setIsSendingOtp(true);

      const result = await twoFactor.sendOtp({ trustDevice: true });

      setIsSendingOtp(false);

      if (result.error) {
        setError(
          mapAuthClientError(result.error.message, "mfaVerificationFailed")
        );
        return;
      }

      setOtpDeliveryNotice(MFA_OTP_DELIVERY_NOTICE);
    })();
  }, [mode]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedCode = code.trim();
    if (trimmedCode.length === 0) {
      setError(resolveEmptyCodeMessage(mode));
      return;
    }

    setIsSubmitting(true);

    const result = await verifyMfaCode(mode, trimmedCode);

    setIsSubmitting(false);

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
  }

  function switchMode(nextMode: AuthV2SignInMfaMode) {
    setMode(nextMode);
    setCode("");
    setError(null);
    setOtpDeliveryNotice(null);

    if (nextMode === "otp") {
      otpRequestedRef.current = false;
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
      ? "auth-v2-mfa-totp"
      : mode === "otp"
        ? "auth-v2-mfa-otp"
        : "auth-v2-mfa-backup";
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
    <AuthV2Form.Root>
      <AuthV2Form.BackButton disabled={isSubmitting} onClick={onBack}>
        Back to sign in
      </AuthV2Form.BackButton>

      <AuthV2Form.StepLead>{heading}</AuthV2Form.StepLead>

      {mode === "otp" && isSendingOtp && otpDeliveryNotice === null ? (
        <p className="erp-auth-v2-form__notice erp-auth-v2-form__notice--lead">
          Sending sign-in code…
        </p>
      ) : null}

      {otpDeliveryNotice ? (
        <AuthV2Form.NoticeNeutral
          hints={[MFA_OTP_DELIVERY_HINT]}
          lead={otpDeliveryNotice}
        />
      ) : null}

      {error ? <AuthV2Form.FieldError>{error}</AuthV2Form.FieldError> : null}

      <AuthV2Form.Fields onSubmit={handleSubmit}>
        <div className="erp-auth-v2-form__field">
          <div className="erp-auth-v2-form__field-toolbar">
            <Label htmlFor={inputId}>{inputLabel}</Label>
            {fieldToolbarAction ? (
              <p className="erp-auth-v2-form__field-toolbar-action">
                <button
                  className="erp-auth-v2-form__text-action"
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
          <p className="erp-auth-v2-form__field-hint">
            {MFA_FIELD_HINTS[mode]}
          </p>
        </div>
        <div className="erp-auth-v2-form__submit-row">
          <Button
            disabled={isSubmitting || (mode === "otp" && isSendingOtp)}
            emphasis="solid"
            intent="primary"
            presentation="default"
            size="md"
            type="submit"
          >
            {isSubmitting ? "Verifying…" : "Verify and continue"}
          </Button>
        </div>
      </AuthV2Form.Fields>

      {showAlternatesLabel || mode === "otp" ? (
        <AuthV2Form.Alternates>
          {showAlternatesLabel ? (
            <AuthV2Form.AlternateLabel>
              Other verification options
            </AuthV2Form.AlternateLabel>
          ) : null}
          {alternateLinks}
          {mode === "otp" ? (
            <AuthV2Form.AlternateNotice>
              <button
                className="erp-auth-v2-form__text-action"
                disabled={isSubmitting || isSendingOtp}
                onClick={() => {
                  otpRequestedRef.current = false;
                  void requestOtpDelivery();
                }}
                type="button"
              >
                Resend email code
              </button>
            </AuthV2Form.AlternateNotice>
          ) : null}
        </AuthV2Form.Alternates>
      ) : null}
    </AuthV2Form.Root>
  );
}

function resolveEmptyCodeMessage(mode: AuthV2SignInMfaMode): string {
  switch (mode) {
    case "totp":
      return "Enter the code from your authenticator app.";
    case "otp":
      return "Enter the code sent to your email.";
    case "backup-code":
      return "Enter a backup code.";
    default:
      return "Enter your verification code.";
  }
}

function resolveMfaHeading(mode: AuthV2SignInMfaMode): string {
  switch (mode) {
    case "totp":
      return "Enter your authenticator code";
    case "otp":
      return "Enter the code from your email";
    case "backup-code":
      return "Enter a backup code";
    default:
      return "Verify your identity";
  }
}

function resolveMfaInputLabel(mode: AuthV2SignInMfaMode): string {
  switch (mode) {
    case "totp":
      return "Authentication code";
    case "otp":
      return "Email code";
    case "backup-code":
      return "Backup code";
    default:
      return "Verification code";
  }
}

function resolveFieldToolbarAction({
  mode,
  supportsOtp,
  supportsTotp,
}: {
  readonly mode: AuthV2SignInMfaMode;
  readonly supportsOtp: boolean;
  readonly supportsTotp: boolean;
}): { label: string; targetMode: AuthV2SignInMfaMode } | null {
  if (mode === "backup-code") {
    return null;
  }

  if (mode === "totp" && supportsOtp) {
    return { label: "Use email code instead", targetMode: "otp" };
  }

  if (mode === "otp" && supportsTotp) {
    return { label: "Use authenticator code instead", targetMode: "totp" };
  }

  return { label: "Use a backup code instead", targetMode: "backup-code" };
}

async function verifyMfaCode(mode: AuthV2SignInMfaMode, code: string) {
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
  readonly fieldToolbarActionMode: AuthV2SignInMfaMode | null;
  readonly isSubmitting: boolean;
  readonly mode: AuthV2SignInMfaMode;
  readonly onSwitchMode: (nextMode: AuthV2SignInMfaMode) => void;
  readonly supportsOtp: boolean;
  readonly supportsTotp: boolean;
}) {
  const links: ReactNode[] = [];

  if (supportsTotp && mode !== "totp" && fieldToolbarActionMode !== "totp") {
    links.push(
      <AuthV2Form.AlternateNotice key="totp">
        <button
          className="erp-auth-v2-form__text-action"
          disabled={isSubmitting}
          onClick={() => onSwitchMode("totp")}
          type="button"
        >
          Use authenticator code instead
        </button>
      </AuthV2Form.AlternateNotice>
    );
  }

  if (supportsOtp && mode !== "otp" && fieldToolbarActionMode !== "otp") {
    links.push(
      <AuthV2Form.AlternateNotice key="otp">
        <button
          className="erp-auth-v2-form__text-action"
          disabled={isSubmitting}
          onClick={() => onSwitchMode("otp")}
          type="button"
        >
          Use email code instead
        </button>
      </AuthV2Form.AlternateNotice>
    );
  }

  if (mode !== "backup-code" && fieldToolbarActionMode !== "backup-code") {
    links.push(
      <AuthV2Form.AlternateNotice key="backup">
        <button
          className="erp-auth-v2-form__text-action"
          disabled={isSubmitting}
          onClick={() => onSwitchMode("backup-code")}
          type="button"
        >
          Use a backup code instead
        </button>
      </AuthV2Form.AlternateNotice>
    );
  }

  return links;
}
