import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Button, Input, Label } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  AUTH_SHELL_ENTRY_DEFAULT_DESCRIPTION,
  AUTH_SHELL_ENTRY_DEFAULT_EYEBROW,
  AUTH_SHELL_ENTRY_DEFAULT_HEADING,
} from "./auth-shell.constants.js";
import { AuthShellEntryPage } from "./auth-shell-entry-layout.js";
import { AuthShellBrandPanel } from "./auth-shell-brand-panel.js";
import { AuthShellErrorSurface } from "./auth-shell-error-surface.client.js";
import { AuthShellStatusSurface, AuthShellVisualPanel } from "./auth-shell.js";

type AuthShellV2StoryGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

const meta = {
  title: "ERP/AuthShellV2",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Isolated AUTH-SHELL-V2 chrome for `(auth)` /v2/* routes. Form logic stays in apps/erp.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SampleAuthForm() {
  return (
    <form className="erp-auth-form">
      <div>
        <Label htmlFor="story-auth-email">Email</Label>
        <Input
          autoComplete="email"
          id="story-auth-email"
          name="email"
          type="email"
        />
      </div>
      <div>
        <Label htmlFor="story-auth-password">Password</Label>
        <Input
          autoComplete="current-password"
          id="story-auth-password"
          name="password"
          type="password"
        />
      </div>
      <Button emphasis="solid" intent="primary" size="md" type="submit">
        Sign In
      </Button>
    </form>
  );
}

export const AccessSignIn: Story = {
  render: () => (
    <AuthShellEntryPage
      description={AUTH_SHELL_ENTRY_DEFAULT_DESCRIPTION}
      eyebrow={AUTH_SHELL_ENTRY_DEFAULT_EYEBROW}
      lane="access"
      title={AUTH_SHELL_ENTRY_DEFAULT_HEADING}
    >
      <SampleAuthForm />
    </AuthShellEntryPage>
  ),
};

export const TenantBrandedSignIn: Story = {
  render: () => (
    <AuthShellEntryPage
      description={AUTH_SHELL_ENTRY_DEFAULT_DESCRIPTION}
      eyebrow={AUTH_SHELL_ENTRY_DEFAULT_EYEBROW}
      lane="access"
      shellStyle={{ "--af-auth-brand": "#1f4d36" } as CSSProperties}
      title={AUTH_SHELL_ENTRY_DEFAULT_HEADING}
      visual={
        <AuthShellVisualPanel>
          <AuthShellBrandPanel
            brandColor="#1f4d36"
            headline="Northwind access, remembered."
            logoAlt="Northwind logo"
            logoUrl="https://placehold.co/160x48/png?text=NW"
            productLabel="Northwind ERP"
            supportingText="Secure entry for your tenant workspace."
          />
        </AuthShellVisualPanel>
      }
    >
      <SampleAuthForm />
    </AuthShellEntryPage>
  ),
};

export const AccessSignUp: Story = {
  render: () => (
    <AuthShellEntryPage
      description="Complete your profile to join your organization workspace."
      eyebrow="Access Lane · /v2/sign-up"
      lane="access"
      title="Create account"
    >
      <SampleAuthForm />
    </AuthShellEntryPage>
  ),
};

export const VerifyEmailSent: Story = {
  render: () => (
    <AuthShellEntryPage
      description="We sent a verification link. Open it from the same device when you are ready."
      eyebrow="Verify Lane · /v2/verify-email/sent"
      lane="verify"
      title="Check your inbox"
    >
      <AuthShellStatusSurface
        description="If you do not see the email within a few minutes, check spam or promotions."
        title="Verification email sent"
        tone="positive"
      />
    </AuthShellEntryPage>
  ),
};

export const RecoverForgotPassword: Story = {
  render: () => (
    <AuthShellEntryPage
      description="Enter the email associated with your Afenda account."
      eyebrow="Recovery Lane · /v2/forgot-password"
      lane="recover"
      title="Reset your password"
    >
      <form className="erp-auth-form">
        <div>
          <Label htmlFor="story-forgot-v2-email">Work email</Label>
          <Input
            autoComplete="email"
            id="story-forgot-v2-email"
            name="email"
            placeholder="name@company.com"
            type="email"
          />
        </div>
        <Button emphasis="solid" intent="primary" size="md" type="submit">
          Send reset link
        </Button>
      </form>
    </AuthShellEntryPage>
  ),
};

export const RecoverResetPassword: Story = {
  render: () => (
    <AuthShellEntryPage
      description="Create a strong password to restore access to your Afenda workspace."
      eyebrow="Recovery Lane · /v2/reset-password"
      lane="recover"
      title="Choose a new password"
    >
      <SampleAuthForm />
    </AuthShellEntryPage>
  ),
};

export const ErrorExpiredLink: Story = {
  render: () => (
    <AuthShellEntryPage
      description="This link is no longer valid."
      eyebrow="Error Lane · /v2/verify-email/expired"
      lane="error"
      title="Link expired"
    >
      <AuthShellStatusSurface
        description="Request a new verification email from your administrator or sign in again."
        title="Verification link expired"
        tone="warning"
      />
    </AuthShellEntryPage>
  ),
};

export const ErrorForbidden: Story = {
  render: () => (
    <AuthShellEntryPage
      description="You do not have permission to access this workspace."
      eyebrow="Error Lane · /v2/access-denied"
      lane="error"
      title="Access denied"
    >
      <AuthShellStatusSurface
        description="Contact your organization administrator if you believe this is a mistake."
        title="Access denied"
        tone="warning"
      />
    </AuthShellEntryPage>
  ),
};

export const MobileNarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => (
    <AuthShellEntryPage
      description={AUTH_SHELL_ENTRY_DEFAULT_DESCRIPTION}
      eyebrow={AUTH_SHELL_ENTRY_DEFAULT_EYEBROW}
      lane="access"
      title={AUTH_SHELL_ENTRY_DEFAULT_HEADING}
    >
      <SampleAuthForm />
    </AuthShellEntryPage>
  ),
};

export const ErrorSurfaceWithRetry: Story = {
  render: () => (
    <AuthShellErrorSurface
      actions={
        <Button emphasis="outline" intent="secondary" size="md" type="button">
          Try again
        </Button>
      }
      description="The sign-in surface failed to load. Refresh the page or try again in a few minutes."
      title="Something went wrong"
    />
  ),
};
