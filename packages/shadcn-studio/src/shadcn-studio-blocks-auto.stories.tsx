/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-block-auto-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import AccountSettings01Block from "./components/shadcn-studio/blocks/account-settings-01/account-settings-01.js";
import AccountSettings02Block from "./components/shadcn-studio/blocks/account-settings-02/account-settings-02.js";
import AccountSettings03Block from "./components/shadcn-studio/blocks/account-settings-03/account-settings-03.js";
import AccountSettings04Block from "./components/shadcn-studio/blocks/account-settings-04/account-settings-04.js";
import AccountSettings05Block from "./components/shadcn-studio/blocks/account-settings-05/account-settings-05.js";
import AccountSettings06Block from "./components/shadcn-studio/blocks/account-settings-06/account-settings-06.js";
import AccountSettings07Block from "./components/shadcn-studio/blocks/account-settings-07/account-settings-07.js";
import EmptyState01Block from "./components/shadcn-studio/blocks/empty-state-01/empty-state-01.js";
import EmptyState02Block from "./components/shadcn-studio/blocks/empty-state-02/empty-state-02.js";
import ErrorPage02Block from "./components/shadcn-studio/blocks/error-page-02/error-page-02.js";
import FormLayout02Block from "./components/shadcn-studio/blocks/form-layout-02/form-layout-02.js";
import HeroSection01Block from "./components/shadcn-studio/blocks/hero-section-01/hero-section-01.js";
import LoginPage04Block from "./components/shadcn-studio/blocks/login-page-04/login-page-04.js";
import { shadcnStudioThemeDecorator } from "./_storybook/shadcn-studio-theme.decorator.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioPageBlockParameters,
  shadcnStudioStoryA11y,
} from "./_storybook/story-parameters.js";

const meta = {
  title: "Shadcn Studio/Blocks Auto",
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "Auto-discovered self-contained MCP page blocks (folder entry files). Prop-driven flat components are listed in block-story-manifest.generated.json — add curated stories in shadcn-studio-blocks.stories.tsx.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
  decorators: [shadcnStudioThemeDecorator],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccountSettings01: Story = {
  render: () => <AccountSettings01Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

export const AccountSettings02: Story = {
  render: () => <AccountSettings02Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

export const AccountSettings03: Story = {
  render: () => <AccountSettings03Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

export const AccountSettings04: Story = {
  render: () => <AccountSettings04Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

export const AccountSettings05: Story = {
  render: () => <AccountSettings05Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

export const AccountSettings06: Story = {
  render: () => <AccountSettings06Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

export const AccountSettings07: Story = {
  render: () => <AccountSettings07Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

export const EmptyState01: Story = {
  render: () => <EmptyState01Block />,
};

export const EmptyState02: Story = {
  render: () => <EmptyState02Block />,
};

export const ErrorPage02: Story = {
  render: () => <ErrorPage02Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

export const FormLayout02: Story = {
  render: () => <FormLayout02Block />,
};

export const HeroSection01: Story = {
  render: () => <HeroSection01Block />,
};

export const LoginPage04: Story = {
  render: () => <LoginPage04Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};
