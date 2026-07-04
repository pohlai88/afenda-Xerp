import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentType } from "react";

import {
  ErrorAccessDeniedPage01,
  ErrorAuthenticationPage01,
  InviteAcceptPage01,
  InviteConsumedPage01,
  InviteEmailMismatchPage01,
  InviteExpiredPage01,
  InviteInvalidPage01,
  InvitePage01,
  MfaOtpFormV1,
  MfaPage01,
  MfaRecoveryFormV1,
  MfaRecoveryPage01,
  ErrorOauthPage01,
  OtpPage01,
  ErrorPasskeyPage01,
  PasskeyPage01,
  SecurityReviewPage01,
  ErrorSessionExpiredPage01,
  ErrorSsoPage01,
  SsoPage01,
  VerifyEmailExpiredPage01,
  VerifyEmailPage01,
  VerifyEmailSentPage01,
  VerifyEmailSuccessPage01,
} from "../../index.js";
import {
  getPreLoginPageManifest,
  PRE_LOGIN_PAGE_BLOCK_IDS,
  type PreLoginPageBlockId,
} from "../../components-auth-shell/auth-shell-method-manifest.js";
import { agenticFullscreenMetaParameters } from "./agentic-story-parameters.js";
import { getAuthShellStoryPatternLabel } from "./auth-shell-story-patterns.registry.js";

const preLoginPageRegistry = {
  "verify-email-page-01": VerifyEmailPage01,
  "verify-email-sent-page-01": VerifyEmailSentPage01,
  "verify-email-expired-page-01": VerifyEmailExpiredPage01,
  "verify-email-success-page-01": VerifyEmailSuccessPage01,
  "invite-page-01": InvitePage01,
  "invite-accept-page-01": InviteAcceptPage01,
  "invite-expired-page-01": InviteExpiredPage01,
  "invite-invalid-page-01": InviteInvalidPage01,
  "invite-consumed-page-01": InviteConsumedPage01,
  "invite-email-mismatch-page-01": InviteEmailMismatchPage01,
  "passkey-page-01": PasskeyPage01,
  "error-passkey-page-01": ErrorPasskeyPage01,
  "sso-page-01": SsoPage01,
  "error-sso-page-01": ErrorSsoPage01,
  "error-oauth-page-01": ErrorOauthPage01,
  "otp-page-01": OtpPage01,
  "mfa-page-01": MfaPage01,
  "mfa-recovery-page-01": MfaRecoveryPage01,
  "error-session-expired-page-01": ErrorSessionExpiredPage01,
  "error-access-denied-page-01": ErrorAccessDeniedPage01,
  "security-review-page-01": SecurityReviewPage01,
  "error-authentication-page-01": ErrorAuthenticationPage01,
} as const satisfies Record<PreLoginPageBlockId, ComponentType>;

const meta = {
  title: "Agentic/Auth Shell/Pre Login",
  component: VerifyEmailPage01,
  tags: ["autodocs", "ai-generated"],
  parameters: {
    ...agenticFullscreenMetaParameters,
    docs: {
      ...agenticFullscreenMetaParameters.docs,
      description: {
        ...agenticFullscreenMetaParameters.docs.description,
        component:
          "Governed pre-login/auth-in-progress auth shell series. Runtime truth is synchronized into the manifest; page shells own layout and canonical forms own only field frames.",
      },
    },
  },
} satisfies Meta<typeof VerifyEmailPage01>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Side-by-side catalog of every governed pre-login page shell.
 *
 * @summary for validating no pre-login path falls back to generic login pages
 */
export const Overview: Story = {
  render: () => (
    <div className="space-y-10 bg-background px-4 py-6">
      {PRE_LOGIN_PAGE_BLOCK_IDS.map((blockId) => {
        const manifest = getPreLoginPageManifest(blockId);
        const PreLoginPageComponent = preLoginPageRegistry[blockId];

        return (
          <section className="space-y-4" key={blockId}>
            <header className="space-y-1 px-1">
              <p className="font-medium text-muted-foreground text-sm uppercase tracking-[0.18em]">
                {blockId}
              </p>
              <h2 className="font-semibold text-2xl text-foreground">
                {getAuthShellStoryPatternLabel(manifest.blockId)}
              </h2>
              <p className="text-muted-foreground">
                Path: {manifest.path}. Canonical form:{" "}
                {manifest.formId ?? "none"}.
              </p>
            </header>
            <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
              <PreLoginPageComponent />
            </div>
          </section>
        );
      })}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Single-story presentation of all governed pre-login/auth-in-progress pages with manifest-bound public ERP paths.",
      },
    },
  },
};

/**
 * Email verification request/notice entry.
 *
 * @summary for verify-email root ingress
 */
export const VerifyEmailPage: Story = {
  render: () => <VerifyEmailPage01 />,
};

/**
 * Fullscreen proof of the shared verify-lane shell.
 *
 * @summary for verify-lane motion baseline review
 */
export const VerifyMotionProof: Story = {
  render: () => <VerifyEmailPage01 />,
  parameters: {
    docs: {
      description: {
        story:
          "Fullscreen proof story for the shared verify variant. The motion field remains visible, but the content lane is calmer than the access shell.",
      },
    },
  },
};

/**
 * Email verification sent notice.
 *
 * @summary for verify-email sent ingress
 */
export const VerifyEmailSentPage: Story = {
  render: () => <VerifyEmailSentPage01 />,
};

/**
 * Email verification expired notice.
 *
 * @summary for verify-email expired ingress
 */
export const VerifyEmailExpiredPage: Story = {
  render: () => <VerifyEmailExpiredPage01 />,
};

/**
 * Email verification success notice.
 *
 * @summary for verify-email success ingress
 */
export const VerifyEmailSuccessPage: Story = {
  render: () => <VerifyEmailSuccessPage01 />,
};

/**
 * Invitation entry notice.
 *
 * @summary for invite root ingress
 */
export const InvitePage: Story = {
  render: () => <InvitePage01 />,
};

/**
 * Invitation acceptance page using the canonical register form.
 *
 * @summary for invite accept ingress
 */
export const InviteAcceptPage: Story = {
  render: () => <InviteAcceptPage01 />,
};

/**
 * Invitation expired notice.
 *
 * @summary for invite expired ingress
 */
export const InviteExpiredPage: Story = {
  render: () => <InviteExpiredPage01 />,
};

/**
 * Invitation invalid notice.
 *
 * @summary for invite invalid ingress
 */
export const InviteInvalidPage: Story = {
  render: () => <InviteInvalidPage01 />,
};

/**
 * Invitation already consumed notice.
 *
 * @summary for invite consumed ingress
 */
export const InviteConsumedPage: Story = {
  render: () => <InviteConsumedPage01 />,
};

/**
 * Invitation email mismatch notice.
 *
 * @summary for invite email mismatch ingress
 */
export const InviteEmailMismatchPage: Story = {
  render: () => <InviteEmailMismatchPage01 />,
};

/**
 * Passkey sign-in entry surface.
 *
 * @summary for passkey ingress
 */
export const PasskeyPage: Story = {
  render: () => <PasskeyPage01 />,
};

/**
 * Passkey error surface.
 *
 * @summary for passkey error ingress
 */
export const PasskeyErrorPage: Story = {
  render: () => <ErrorPasskeyPage01 />,
};

/**
 * SSO sign-in entry surface.
 *
 * @summary for SSO ingress
 */
export const SsoPage: Story = {
  render: () => <SsoPage01 />,
};

/**
 * SSO error surface.
 *
 * @summary for SSO error ingress
 */
export const SsoErrorPage: Story = {
  render: () => <ErrorSsoPage01 />,
};

/**
 * OAuth callback error surface.
 *
 * @summary for OAuth error ingress
 */
export const OauthErrorPage: Story = {
  render: () => <ErrorOauthPage01 />,
};

/**
 * One-time passcode challenge using the canonical MFA OTP frame.
 *
 * @summary for OTP challenge ingress
 */
export const OtpPage: Story = {
  render: () => <OtpPage01 />,
};

/**
 * MFA challenge using the canonical MFA OTP frame.
 *
 * @summary for MFA code ingress
 */
export const MfaPage: Story = {
  render: () => <MfaPage01 />,
};

/**
 * MFA recovery challenge using the canonical recovery code frame.
 *
 * @summary for MFA recovery ingress
 */
export const MfaRecoveryPage: Story = {
  render: () => <MfaRecoveryPage01 />,
};

/**
 * Session expired boundary state.
 *
 * @summary for session expired ingress
 */
export const SessionExpiredPage: Story = {
  render: () => <ErrorSessionExpiredPage01 />,
};

/**
 * Access denied boundary state.
 *
 * @summary for access denied ingress
 */
export const AccessDeniedPage: Story = {
  render: () => <ErrorAccessDeniedPage01 />,
};

/**
 * Auth-in-progress security review boundary.
 *
 * @summary for security review ingress
 */
export const SecurityReviewPage: Story = {
  render: () => <SecurityReviewPage01 />,
};

/**
 * Fullscreen proof of the restrained error/security shell.
 *
 * @summary for restrained shell baseline review
 */
export const ErrorSecurityMotionProof: Story = {
  render: () => <ErrorAuthenticationPage01 />,
  parameters: {
    docs: {
      description: {
        story:
          "Fullscreen proof story for restrained auth-shell states. Contrast remains strong and motion density is intentionally reduced for security and failure flows.",
      },
    },
  },
};

/**
 * Authentication error boundary state.
 *
 * @summary for auth error ingress
 */
export const AuthErrorPage: Story = {
  render: () => <ErrorAuthenticationPage01 />,
};

/**
 * Canonical MFA OTP field frame, independent from page chrome.
 *
 * @summary for OTP/MFA form verification
 */
export const MfaOtpForm: Story = {
  render: () => (
    <div className="mx-auto max-w-md rounded-xl border bg-card p-6 shadow-sm">
      <MfaOtpFormV1 />
    </div>
  ),
};

/**
 * Canonical MFA recovery code field frame, independent from page chrome.
 *
 * @summary for recovery code form verification
 */
export const MfaRecoveryForm: Story = {
  render: () => (
    <div className="mx-auto max-w-md rounded-xl border bg-card p-6 shadow-sm">
      <MfaRecoveryFormV1 />
    </div>
  ),
};
