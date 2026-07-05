import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import {
  LabAcceptanceGatesPanel,
  LabSectionCatalog,
  LabWelcomeBriefing,
  LabWelcomeFigmaSurface,
  labWelcomeFigmaDesignUrl,
  LabWelcomeShadcnMcpSurface,
  labWelcomeShadcnMcpRegistryItems,
  LabWelcomeVercelSurface,
  LabWelcomeSurface,
  type LabWelcomeVariant,
} from "./lab-welcome.compositions";
import { vercelLabPreset } from "./lab-welcome-vercel.preset";

const meta = {
  title: "Afenda/Lab",
  component: LabWelcomeSurface,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Verification-only Storybook surface for Afenda presentation review. Not an ERP runtime import path.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["calm", "compact"] satisfies LabWelcomeVariant[],
      description: "Airlock scale — calm (default) or compact title",
    },
  },
  args: {
    variant: "calm",
  },
} satisfies Meta<typeof LabWelcomeSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  tags: ["autodocs", "lab-smoke"],
  parameters: {
    docs: {
      description: {
        story:
          "The airlock — one headline, one promise, one door. Navigation lives in the sidebar.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Afenda Presentation Lab", level: 1 })
    ).toBeVisible();
    await expect(canvas.getByText("Verify before ERP.")).toBeVisible();
    await expect(canvas.getByText("Blocks")).toBeVisible();
    await expect(canvas.getByText("pnpm storybook:ui")).toBeVisible();
  },
};

export const WelcomeFromFigma: Story = {
  render: () => <LabWelcomeFigmaSurface />,
  parameters: {
    design: {
      type: "figma",
      url: labWelcomeFigmaDesignUrl,
    },
    docs: {
      description: {
        story:
          "Figma MCP pipeline — frame authored in Figma (node 2:2), extracted via get_design_context, adapted to lab tokens. Design tab links the source frame.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Afenda Presentation Lab", level: 1 })
    ).toBeVisible();
    await expect(canvas.getByText("Verify before ERP.")).toBeVisible();
    await expect(canvas.getByText("Blocks")).toBeVisible();
  },
};

export const WelcomeFromShadcnMcp: Story = {
  render: () => <LabWelcomeShadcnMcpSurface />,
  parameters: {
    docs: {
      description: {
        story: [
          "shadcn MCP round (`.cursor/mcp.json` → `shadcn`, not `shadcn-studio`):",
          "`search_items_in_registries` → `@shadcn/button`, `@shadcn/badge`",
          "`get_item_examples_from_registries` → button-demo, badge-demo patterns",
          "Compose in Storybook — stock @shadcn has no lab landing block.",
          `@ss-blocks/* requires studio license in MCP env (${labWelcomeShadcnMcpRegistryItems.join(", ")} already installed in @afenda/shadcn-studio).`,
        ].join(" "),
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Afenda Presentation Lab", level: 1 })
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: /Blocks/i })).toBeVisible();
    await expect(canvas.getByText("Verify before ERP.")).toBeVisible();
  },
};

export const WelcomeFromVercel: Story = {
  render: () => <LabWelcomeVercelSurface />,
  parameters: {
    docs: {
      description: {
        story: [
          "Vercel plugin design system round —",
          vercelLabPreset.pluginAuthority,
          "True-black grid shell, zinc borders, Geist sans/mono via @afenda/shadcn-studio tokens,",
          "Card + Separator + outline Button composition (no rainbow gradients).",
        ].join(" "),
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Afenda Presentation Lab", level: 1 })
    ).toBeVisible();
    await expect(canvas.getByText("Verify before ERP.")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /Blocks/i })).toBeVisible();
    await expect(canvas.getByText("Vercel plugin")).toBeVisible();
  },
};

export const WelcomeCompact: Story = {
  args: { variant: "compact" },
  parameters: {
    docs: {
      description: {
        story: "Compact airlock — smaller title, same single message.",
      },
    },
  },
};

export const WelcomeMobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    docs: {
      description: {
        story: "Mobile — centered airlock, no catalog clutter.",
      },
    },
  },
};

export const OperatorBriefing: Story = {
  render: () => <LabWelcomeBriefing />,
  parameters: {
    docs: {
      description: {
        story: "Alias of Welcome — the only briefing surface.",
      },
    },
  },
};

export const SectionCatalog: Story = {
  render: (args) => <LabSectionCatalog {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Appendix — full catalog (not shown on the front door).",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Shadcn Studio / Theme Lab")).toBeVisible();
  },
};

export const AcceptanceGates: Story = {
  render: (args) => <LabAcceptanceGatesPanel {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Appendix — gate pipeline (not shown on the front door).",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Acceptance gates", level: 2 })
    ).toBeVisible();
    await expect(canvas.getByText("pnpm storybook generate")).toBeVisible();
  },
};
