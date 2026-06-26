import type { Meta, StoryObj } from "@storybook/react";

import { Button, Input, Label } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  AUTH_SHELL_BRAND_HEADLINE,
  AUTH_SHELL_BRAND_KICKER,
  AUTH_SHELL_BRAND_SUPPORTING_TEXT,
  AUTH_SHELL_ENTRY_DEFAULT_FORM_DESCRIPTION,
  AUTH_SHELL_ENTRY_DEFAULT_FORM_HEADING,
} from "./auth-shell.contract.js";
import { AuthShellEntryBrand } from "./auth-shell-brand-panel.js";
import {
  AuthShellEntryPage,
  AuthShellEntry,
} from "./auth-shell-entry-layout.js";
import {
  AuthShellErrorSurface,
  AuthShellError,
} from "./auth-shell-error-surface.client.js";

type AuthShellStoryGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label"
>;

const meta = {
  title: "ERP/AuthShell",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Public-route auth chrome for `(auth)` segment — separate from ApplicationShell. Form logic stays in apps/erp.",
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

export const EntrySignIn: Story = {
  render: () => (
    <AuthShellEntryPage
      formDescription={AUTH_SHELL_ENTRY_DEFAULT_FORM_DESCRIPTION}
      formHeading={AUTH_SHELL_ENTRY_DEFAULT_FORM_HEADING}
    >
      <SampleAuthForm />
    </AuthShellEntryPage>
  ),
};

export const EntryForgotPassword: Story = {
  render: () => (
    <AuthShellEntryPage
      formDescription="Enter your work email and we will send a secure, time-limited link to restore access to Afenda ERP."
      formHeading="Recover access"
    >
      <form className="erp-auth-form">
        <div>
          <Label htmlFor="story-forgot-email">Work email</Label>
          <Input
            autoComplete="email"
            id="story-forgot-email"
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

export const EntryLoadingSkeleton: Story = {
  render: () => (
    <AuthShellEntryPage formDescription="Loading…">
      <div aria-busy="true" aria-live="polite" role="status">
        Loading authentication form…
      </div>
    </AuthShellEntryPage>
  ),
};

export const ErrorWithRetry: Story = {
  render: () => (
    <AuthShellErrorSurface
      description="The sign-in surface failed to load. Refresh the page or try again in a few minutes."
      onRetry={() => undefined}
      title="Something went wrong"
    />
  ),
};

export const ErrorWithoutRetry: Story = {
  render: () => (
    <AuthShellErrorSurface
      description="Authentication is temporarily unavailable."
      title="Service unavailable"
    />
  ),
};

export const EntryMemoryGate: Story = {
  render: () => (
    <AuthShellEntryPage
      brandPanel={<AuthShellEntryBrand.ArtifactPlane />}
      formDescription={AUTH_SHELL_ENTRY_DEFAULT_FORM_DESCRIPTION}
      formHeading={AUTH_SHELL_ENTRY_DEFAULT_FORM_HEADING}
    >
      <SampleAuthForm />
    </AuthShellEntryPage>
  ),
};

export const EntryComposed: Story = {
  render: () => (
    <AuthShellEntry.Root>
      <AuthShellEntry.SkipLink />
      <AuthShellEntry.Card>
        <AuthShellEntryBrand.ArtifactPlane
          eyebrow={AUTH_SHELL_BRAND_KICKER}
          headline={AUTH_SHELL_BRAND_HEADLINE}
          supportingText={AUTH_SHELL_BRAND_SUPPORTING_TEXT}
        />
        <AuthShellEntry.FormColumn>
          <AuthShellEntry.FormInner>
            <AuthShellEntry.FormHeader
              description={AUTH_SHELL_ENTRY_DEFAULT_FORM_DESCRIPTION}
              heading={AUTH_SHELL_ENTRY_DEFAULT_FORM_HEADING}
            />
            <AuthShellEntry.FormBody>
              <SampleAuthForm />
            </AuthShellEntry.FormBody>
          </AuthShellEntry.FormInner>
        </AuthShellEntry.FormColumn>
      </AuthShellEntry.Card>
    </AuthShellEntry.Root>
  ),
};

export const ErrorComposed: Story = {
  render: () => (
    <AuthShellError.Root>
      <AuthShellError.Alert>
        <AuthShellError.Illustration />
        <AuthShellError.Copy>
          <AuthShellError.Eyebrow>
            Authentication unavailable
          </AuthShellError.Eyebrow>
          <AuthShellError.Title>Service unavailable</AuthShellError.Title>
          <AuthShellError.Description>
            Authentication is temporarily unavailable.
          </AuthShellError.Description>
        </AuthShellError.Copy>
      </AuthShellError.Alert>
    </AuthShellError.Root>
  ),
};
