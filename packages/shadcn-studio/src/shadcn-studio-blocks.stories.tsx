import type { Meta, StoryObj } from "@storybook/react";

import {
  AccountSettings01FullWidthLab,
  AccountSettings01InSettingsShell,
  AccountSettings01MetadataHydratedLab,
} from "./_storybook/account-settings-01.compositions.js";
import HeroSection01Block from "./components/shadcn-studio/blocks/hero-section-01/hero-section-01.js";
import LoginPage04Block from "./components/shadcn-studio/blocks/login-page-04/login-page-04.js";
import { shadcnStudioThemeDecorator } from "./_storybook/shadcn-studio-theme.decorator.js";
import {
  shadcnStudioAccountSettingsBlockDocs,
  shadcnStudioBlockDocs,
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioPageBlockParameters,
  shadcnStudioStoryA11y,
} from "./_storybook/story-parameters.js";

const meta = {
  title: "Shadcn Studio/Blocks",
  component: HeroSection01Block,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component: shadcnStudioBlockDocs.component,
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
  decorators: [shadcnStudioThemeDecorator],
} satisfies Meta<typeof HeroSection01Block>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeroSection01: Story = {};

export const HeroSection01Dark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
};

export const LoginPage04: Story = {
  render: () => <LoginPage04Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

export const LoginPage04Dark: Story = {
  render: () => <LoginPage04Block />,
  globals: shadcnStudioDarkThemeGlobals,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

const accountSettings01Parameters = {
  ...shadcnStudioPageBlockParameters,
  docs: {
    ...shadcnStudioPageBlockParameters.docs,
    description: {
      component: shadcnStudioAccountSettingsBlockDocs.component,
    },
  },
} as const;

export const AccountSettings01InShell: Story = {
  render: () => <AccountSettings01InSettingsShell />,
  parameters: accountSettings01Parameters,
};

export const AccountSettings01InShellDark: Story = {
  render: () => <AccountSettings01InSettingsShell />,
  globals: shadcnStudioDarkThemeGlobals,
  parameters: accountSettings01Parameters,
};

export const AccountSettings01FullWidth: Story = {
  render: () => <AccountSettings01FullWidthLab />,
  parameters: {
    ...accountSettings01Parameters,
    docs: {
      ...accountSettings01Parameters.docs,
      description: {
        story:
          "Fullscreen lab surface without settings chrome — expands block max-width for canvas review.",
      },
    },
  },
};

export const AccountSettings01MetadataHydrated: Story = {
  render: () => <AccountSettings01MetadataHydratedLab />,
  parameters: {
    ...accountSettings01Parameters,
    docs: {
      ...accountSettings01Parameters.docs,
      description: {
        story:
          "Settings shell plus lab slot hydration — fixture values applied to data-afenda-slot markers (mirrors ERP preview pattern).",
      },
    },
  },
};
