import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentType } from "react";

import {
  LoginPage01,
  LoginPage02,
  LoginPage03,
  LoginPage04,
  LoginPage05,
  LoginPage06,
  RegisterPage01,
} from "../../index.js";
import {
  LOGIN_PAGE_BLOCK_IDS,
  REGISTER_PAGE_BLOCK_IDS,
  getLoginPageManifest,
  getRegisterPageManifest,
  type LoginPageBlockId,
  type RegisterPageBlockId,
} from "../../components-auth-shell/auth-shell-method-manifest.js";
import { agenticFullscreenMetaParameters } from "./agentic-story-parameters.js";

const loginPageRegistry = {
  "login-page-01": LoginPage01,
  "login-page-02": LoginPage02,
  "login-page-03": LoginPage03,
  "login-page-04": LoginPage04,
  "login-page-05": LoginPage05,
  "login-page-06": LoginPage06,
} as const satisfies Record<LoginPageBlockId, ComponentType>;

const registerPageRegistry = {
  "register-page-01": RegisterPage01,
} as const satisfies Record<RegisterPageBlockId, ComponentType>;

const meta = {
  title: "Agentic/Auth Shell/Login Pages",
  component: LoginPage01,
  tags: ["autodocs", "ai-generated"],
  parameters: {
    ...agenticFullscreenMetaParameters,
    docs: {
      ...agenticFullscreenMetaParameters.docs,
      description: {
        ...agenticFullscreenMetaParameters.docs.description,
        component:
          "Six invariant auth page shells bound to one canonical login form manifest. Page chrome varies; credential behavior stays manifest-backed and shared.",
      },
    },
  },
} satisfies Meta<typeof LoginPage01>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Side-by-side catalog of every governed login page shell.
 *
 * @summary for comparing six auth page invariants in one screen flow
 */
export const Overview: Story = {
  render: () => (
    <div className="space-y-10 bg-background px-4 py-6">
      {LOGIN_PAGE_BLOCK_IDS.map((blockId) => {
        const manifest = getLoginPageManifest(blockId);
        const LoginPageComponent = loginPageRegistry[blockId];

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
                Default lane: {manifest.defaultLane}. Canonical form:{" "}
                {manifest.formId}.
              </p>
            </header>
            <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
              <LoginPageComponent />
            </div>
          </section>
        );
      })}
      {REGISTER_PAGE_BLOCK_IDS.map((blockId) => {
        const manifest = getRegisterPageManifest(blockId);
        const RegisterPageComponent = registerPageRegistry[blockId];

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
                Default lane: {manifest.defaultLane}. Canonical form:{" "}
                {manifest.formId}.
              </p>
            </header>
            <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
              <RegisterPageComponent />
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
          "Single-story presentation of all six invariant login pages, useful when validating page-level divergence against one canonical credential frame.",
      },
    },
  },
};

/**
 * Centered card layout with passkey, SSO, OAuth, and canonical credential form.
 *
 * @summary for centered-card auth ingress
 */
export const LoginPage01CenteredCard: Story = {
  render: () => <LoginPage01 />,
  parameters: {
    docs: {
      description: {
        story:
          "Default lane: access. Pattern: centered-card. Canonical form: login-form-v1.",
      },
    },
  },
};

/**
 * Split layout with dashboard preview and back-to-website navigation.
 *
 * @summary for split dashboard preview auth ingress
 */
export const LoginPage02SplitDashboardPreview: Story = {
  render: () => <LoginPage02 />,
  parameters: {
    docs: {
      description: {
        story:
          "Default lane: verify. Pattern: split-dashboard-preview. Canonical form: login-form-v1.",
      },
    },
  },
};

/**
 * Split brand panel layout with standard OAuth pair and canonical form.
 *
 * @summary for split brand panel auth ingress
 */
export const LoginPage03SplitBrandPanel: Story = {
  render: () => <LoginPage03 />,
  parameters: {
    docs: {
      description: {
        story:
          "Default lane: access. Pattern: split-brand-panel. Canonical form: login-form-v1.",
      },
    },
  },
};

/**
 * ERP operator ingress shell with workspace preview and local branding slots.
 *
 * @summary for ERP operator ingress auth shell
 */
export const LoginPage04ErpOperatorIngress: Story = {
  render: () => <LoginPage04 />,
  parameters: {
    docs: {
      description: {
        story:
          "Default lane: access. Pattern: erp-operator-ingress. Canonical form: login-form-v1.",
      },
    },
  },
};

/**
 * Fullscreen proof of the shared access-lane cinematic shell.
 *
 * @summary for access-lane motion baseline review
 */
export const AccessMotionProof: Story = {
  render: () => <LoginPage04 />,
  parameters: {
    docs: {
      description: {
        story:
          "Fullscreen proof story for the shared auth-shell access variant. Use this as the primary visual baseline for the lynx pixel field, vignette, and high-intensity staging.",
      },
    },
  },
};

/**
 * Compact social card with icon-only method affordances and canonical form.
 *
 * @summary for compact social card auth ingress
 */
export const LoginPage05CompactSocialCard: Story = {
  render: () => <LoginPage05 />,
  parameters: {
    docs: {
      description: {
        story:
          "Default lane: recover. Pattern: compact-social-card. Canonical form: login-form-v1.",
      },
    },
  },
};

/**
 * Cinematic split-shell layout with silk background and canonical form.
 *
 * @summary for cinematic silk panel auth ingress
 */
export const LoginPage06CinematicSilkPanel: Story = {
  render: () => <LoginPage06 />,
  parameters: {
    docs: {
      description: {
        story:
          "Default lane: error. Pattern: cinematic-silk-panel. Canonical form: login-form-v1.",
      },
    },
  },
};

/**
 * Invite-first registration shell with the canonical register form.
 *
 * @summary for invite-first register ingress
 */
export const RegisterPage01InviteFirst: Story = {
  render: () => <RegisterPage01 />,
  parameters: {
    docs: {
      description: {
        story:
          "Default lane: access. Pattern: invite-first-centered-card. Canonical form: register-form-v1.",
      },
    },
  },
};
