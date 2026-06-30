import type { Meta, StoryObj } from "@storybook/react";

import HeroSection01Block from "./components/shadcn-studio/blocks/hero-section-01/hero-section-01.js";
import LoginPage04Block from "./components/shadcn-studio/blocks/login-page-04/login-page-04.js";
import { shadcnStudioThemeDecorator } from "./_storybook/shadcn-studio-theme.decorator.js";
import {
  shadcnStudioBlockDocs,
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioFullscreenLayout,
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
    ...shadcnStudioFullscreenLayout,
  },
};

export const LoginPage04Dark: Story = {
  render: () => <LoginPage04Block />,
  globals: shadcnStudioDarkThemeGlobals,
  parameters: {
    ...shadcnStudioFullscreenLayout,
  },
};
