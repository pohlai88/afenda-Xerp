import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentType } from "react";

import {
  ForgotPasswordFormV1,
  ForgotPasswordPage01,
  ForgotPasswordSuccessPage01,
  ResetPasswordFormV1,
  ResetPasswordPage01,
  ResetPasswordSuccessPage01,
} from "../../index.js";
import {
  getResetPasswordPageManifest,
  RESET_PASSWORD_PAGE_BLOCK_IDS,
  type ResetPasswordPageBlockId,
} from "../../components-auth-shell/auth-shell-method-manifest.js";
import { agenticFullscreenMetaParameters } from "./agentic-story-parameters.js";

const resetPasswordPageRegistry = {
  "forgot-password-page-01": ForgotPasswordPage01,
  "forgot-password-success-page-01": ForgotPasswordSuccessPage01,
  "reset-password-page-01": ResetPasswordPage01,
  "reset-password-success-page-01": ResetPasswordSuccessPage01,
} as const satisfies Record<ResetPasswordPageBlockId, ComponentType>;

const meta = {
  title: "Agentic/Auth Shell/Reset Password",
  component: ForgotPasswordPage01,
  tags: ["autodocs", "ai-generated"],
  parameters: {
    ...agenticFullscreenMetaParameters,
    docs: {
      ...agenticFullscreenMetaParameters.docs,
      description: {
        ...agenticFullscreenMetaParameters.docs.description,
        component:
          "Governed reset-password auth shell series for forgot-password request, forgot-password success, reset-password completion, and reset-password success ingress paths. Page chrome owns presentation; canonical forms own request/reset credential frames.",
      },
    },
  },
} satisfies Meta<typeof ForgotPasswordPage01>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Side-by-side catalog of reset-password ingress pages.
 *
 * @summary for validating recover path page invariants
 */
export const Overview: Story = {
  render: () => (
    <div className="space-y-10 bg-background px-4 py-6">
      {RESET_PASSWORD_PAGE_BLOCK_IDS.map((blockId) => {
        const manifest = getResetPasswordPageManifest(blockId);
        const ResetPasswordPageComponent = resetPasswordPageRegistry[blockId];

        return (
          <section className="space-y-4" key={blockId}>
            <header className="space-y-1 px-1">
              <p className="font-medium text-muted-foreground text-sm uppercase tracking-[0.18em]">
                {blockId}
              </p>
              <h2 className="font-semibold text-2xl text-foreground">
                {manifest.designPattern}
              </h2>
              <p className="text-muted-foreground">
                Path: {manifest.path}. Canonical form:{" "}
                {manifest.formId ?? "none"}.
              </p>
            </header>
            <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
              <ResetPasswordPageComponent />
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
          "Single-story presentation of all governed reset-password pages with manifest-bound form ids and public ERP paths.",
      },
    },
  },
};

/**
 * Forgot-password request page for the public `/forgot-password` ingress path.
 *
 * @summary for reset link request ingress
 */
export const ForgotPasswordPage: Story = {
  render: () => <ForgotPasswordPage01 />,
  parameters: {
    docs: {
      description: {
        story:
          "Path: /forgot-password. Canonical form: forgot-password-form-v1. Runtime endpoint metadata: /request-password-reset.",
      },
    },
  },
};

/**
 * Forgot-password success page for the public `/forgot-password/success` path.
 *
 * @summary for reset link sent confirmation ingress
 */
export const ForgotPasswordSuccessPage: Story = {
  render: () => <ForgotPasswordSuccessPage01 />,
  parameters: {
    docs: {
      description: {
        story:
          "Path: /forgot-password/success. This page has no form and confirms that reset instructions were sent if the account exists.",
      },
    },
  },
};

/**
 * Reset-password completion page for the public `/reset-password` ingress path.
 *
 * @summary for new password completion ingress
 */
export const ResetPasswordPage: Story = {
  render: () => <ResetPasswordPage01 />,
  parameters: {
    docs: {
      description: {
        story:
          "Path: /reset-password. Canonical form: reset-password-form-v1. Runtime endpoint metadata: /reset-password.",
      },
    },
  },
};

/**
 * Reset-password success page for the public `/reset-password/success` path.
 *
 * @summary for post-reset confirmation ingress
 */
export const ResetPasswordSuccessPage: Story = {
  render: () => <ResetPasswordSuccessPage01 />,
  parameters: {
    docs: {
      description: {
        story:
          "Path: /reset-password/success. This page has no form and returns the user to sign in.",
      },
    },
  },
};

/**
 * Canonical forgot-password form frame, independent from page chrome.
 *
 * @summary for reset link request form verification
 */
export const ForgotPasswordForm: Story = {
  render: () => (
    <div className="mx-auto max-w-md rounded-xl border bg-card p-6 shadow-sm">
      <ForgotPasswordFormV1 />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Canonical email-only request form. The form exposes action, method, and onSubmit props, and remains preview-safe when no action is provided.",
      },
    },
  },
};

/**
 * Canonical reset-password form frame, independent from page chrome.
 *
 * @summary for new password form verification
 */
export const ResetPasswordForm: Story = {
  render: () => (
    <div className="mx-auto max-w-md rounded-xl border bg-card p-6 shadow-sm">
      <ResetPasswordFormV1 />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Canonical password and confirm-password reset form. The token field is hidden and caller-provided for runtime pages.",
      },
    },
  },
};
