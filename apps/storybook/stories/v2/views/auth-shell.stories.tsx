import {
  AuthShell,
  AUTH_SHELL_CANONICAL_VARIANT_IDS,
  AUTH_SHELL_VARIANT_PRESETS,
  Button,
  getAuthShellVariantPreset,
  Input,
} from "@afenda/shadcn-studio-v2";
import { shadcnStudioFullscreenLayout } from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { expect } from "storybook/test";

import { v2SampleAuthActions } from "../v2-view-fixtures";

const signInPreset = getAuthShellVariantPreset("sign-in");

interface AuthShellStoryProps {
  readonly actions?: ReactNode;
  readonly children?: ReactNode;
  readonly description?: ReactNode;
  readonly footer?: ReactNode;
  readonly secondaryActions?: ReactNode;
  readonly state?: "disabled" | "error" | "loading" | "ready" | "unavailable";
  readonly title: ReactNode;
}

function AuthShellStory({
  actions,
  children,
  description,
  footer,
  secondaryActions,
  state,
  title,
}: AuthShellStoryProps) {
  return (
    <AuthShell
      actions={actions}
      description={description}
      footer={footer}
      secondaryActions={secondaryActions}
      state={state}
      title={title}
    >
      {children}
    </AuthShell>
  );
}

const meta = {
  title: "Shadcn Studio V2/Views/AuthShell",
  component: AuthShell,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioFullscreenLayout,
    docs: {
      description: {
        component:
          "L4 authentication shell with five canonical ingress variant presets and non-ready states.",
      },
    },
  },
  args: {
    title: signInPreset.title,
    description: signInPreset.description,
    actions: v2SampleAuthActions,
    footer: "Need help? Contact your workspace administrator.",
    state: "ready" as const,
  },
} satisfies Meta<typeof AuthShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  tags: ["lab-smoke"],
  args: {
    title: signInPreset.title,
    description: signInPreset.description,
    actions: v2SampleAuthActions,
    state: "ready",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Sign in to Afenda" })
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Sign in" })).toBeVisible();
  },
};

export const Otp: Story = {
  render: () => {
    const preset = getAuthShellVariantPreset("otp");
    return (
      <AuthShellStory
        actions={
          <>
            <Button type="button">Verify code</Button>
            <Button type="button" variant="outline">
              Resend code
            </Button>
          </>
        }
        description={preset.description}
        footer="Codes expire after 10 minutes."
        secondaryActions={
          <Button type="button" variant="link">
            Use backup method
          </Button>
        }
        state="ready"
        title={preset.title}
      >
        <Input aria-label="One-time code" inputMode="numeric" maxLength={6} />
      </AuthShellStory>
    );
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Enter verification code" })
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Verify code" })
    ).toBeVisible();
  },
};

export const Mfa: Story = {
  render: () => {
    const preset = getAuthShellVariantPreset("mfa");
    return (
      <AuthShellStory
        actions={<Button type="button">Confirm</Button>}
        description={preset.description}
        footer="Lost device? Use recovery codes."
        secondaryActions={
          <Button type="button" variant="outline">
            Use recovery code
          </Button>
        }
        state="ready"
        title={preset.title}
      >
        <Input aria-label="Authenticator code" inputMode="numeric" />
      </AuthShellStory>
    );
  },
};

export const Invite: Story = {
  render: () => {
    const preset = getAuthShellVariantPreset("invite");
    return (
      <AuthShellStory
        actions={
          <>
            <Button type="button">Accept invitation</Button>
            <Button type="button" variant="outline">
              Decline
            </Button>
          </>
        }
        description={preset.description}
        footer="Invitation expires in 7 days."
        state="ready"
        title={preset.title}
      />
    );
  },
};

export const ErrorState: Story = {
  render: () => {
    const preset = getAuthShellVariantPreset("error");
    return (
      <AuthShellStory
        description={preset.description}
        footer="Contact support if the problem persists."
        secondaryActions={
          <Button type="button" variant="outline">
            Return to sign in
          </Button>
        }
        state="error"
        title={preset.title}
      />
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Return to sign in" })
    ).toBeVisible();
  },
};

export const Loading: Story = {
  args: { state: "loading" },
};

export const Unavailable: Story = {
  args: { state: "unavailable" },
};

export const Disabled: Story = {
  args: { state: "disabled" },
};

export const VariantCatalog: Story = {
  render: () => (
    <div className="grid gap-8">
      {AUTH_SHELL_CANONICAL_VARIANT_IDS.map((variantId) => {
        const preset = AUTH_SHELL_VARIANT_PRESETS[variantId];
        return (
          <div className="rounded-md border border-border p-4" key={variantId}>
            <p className="mb-2 font-mono text-muted-foreground text-xs">
              {preset.blockId}
            </p>
            <AuthShellStory
              description={preset.description}
              state={variantId === "error" ? "error" : "ready"}
              title={preset.title}
            />
          </div>
        );
      })}
    </div>
  ),
};
