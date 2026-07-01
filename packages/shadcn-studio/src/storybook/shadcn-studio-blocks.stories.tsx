import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import {
  AccountSettings01FullWidthLab,
  AccountSettings01InSettingsShell,
  AccountSettings01MetadataHydratedLab,
} from "../storybook/account-settings-01.compositions.js";
import HeroSection01Block from "../components-layouts/hero-section-01/hero-section-01.js";
import LoginPage04Block from "../components-auth-shell/login-page-04/login-page-04.js";
import {
  shadcnStudioAccountSettingsBlockDocs,
  shadcnStudioBlockDocs,
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioFigmaDesignFromEnv,
  shadcnStudioPageBlockParameters,
} from "../lab/index.js";

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
  },
} satisfies Meta<typeof HeroSection01Block>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeroSection01: Story = {
  tags: ["autodocs", "lab-smoke"],
  parameters: {
    ...shadcnStudioFigmaDesignFromEnv("STORYBOOK_FIGMA_HERO_SECTION_01"),
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", {
        level: 1,
        name: /Sizzling Summer Delights/i,
      })
    ).toBeVisible();
  },
};

export const HeroSection01Dark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  parameters: {
    ...shadcnStudioFigmaDesignFromEnv("STORYBOOK_FIGMA_HERO_SECTION_01"),
  },
};

export const LoginPage04: Story = {
  tags: ["autodocs", "lab-smoke"],
  render: () => <LoginPage04Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
    ...shadcnStudioFigmaDesignFromEnv("STORYBOOK_FIGMA_LOGIN_PAGE_04"),
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { level: 2, name: "Welcome Back 👋" })
    ).toBeVisible();
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
  tags: ["autodocs", "lab-smoke"],
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
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: /Personal Information/i })
    ).toBeVisible();
  },
};

export const AccountSettings01MetadataHydrated: Story = {
  tags: ["autodocs", "lab-smoke"],
  render: () => <AccountSettings01MetadataHydratedLab />,
  parameters: {
    ...accountSettings01Parameters,
    ...shadcnStudioFigmaDesignFromEnv("STORYBOOK_FIGMA_ACCOUNT_SETTINGS_01"),
    docs: {
      ...accountSettings01Parameters.docs,
      description: {
        story:
          "Settings shell plus lab slot hydration — fixture values applied to data-afenda-slot markers (mirrors ERP preview pattern).",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue("Ada Operator")).toBeVisible();
    await expect(
      canvas.getByText(
        "Display name shown to other members in this workspace (lab fixture)."
      )
    ).toBeVisible();
  },
};
