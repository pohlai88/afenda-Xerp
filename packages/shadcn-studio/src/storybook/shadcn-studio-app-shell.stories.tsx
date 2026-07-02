import type { Meta, StoryObj } from "@storybook/react";

import {
  AdmincnShell,
  type AdmincnShellProps,
} from "../components-app-shell/admincn-shell.js";
import {
  resolveShell,
  type ShellSlug,
} from "../components-app-shell/resolve-shell.js";
import { ErpPresentationProviders } from "../theme/erp-presentation-providers.js";
import {
  shadcnStudioFullscreenLayout,
  shadcnStudioStoryA11y,
} from "../lab/index.js";

const sampleNavGroups = [
  {
    label: "Platform",
    items: [
      {
        href: "/metadata-workspace",
        label: "Metadata Workspace",
        isActive: true,
      },
    ],
  },
  {
    label: "System Admin",
    items: [
      { href: "/system-admin/users", label: "Users" },
      { href: "/system-admin/roles", label: "Roles" },
    ],
  },
] as const;

const sampleOperatingContext = {
  tenantLabel: "Acme Holdings",
  legalEntityLabel: "Acme US LLC",
  workspaceLabel: "Acme US LLC · Operations",
} as const;

const shellStoryArgs = {
  navGroups: sampleNavGroups,
  operatingContext: sampleOperatingContext,
  children: (
    <div className="rounded-lg border bg-card p-6 text-card-foreground">
      <h2 className="font-semibold text-lg">Shell content region</h2>
      <p className="text-muted-foreground text-sm">
        Protected ERP routes render inside this inset panel. Open the palette
        control in the header to switch sidebar variant (default, floating,
        inset).
      </p>
    </div>
  ),
} as const satisfies AdmincnShellProps;

const meta: Meta<typeof AdmincnShell> = {
  title: "Shadcn Studio/App Shell/AdminCN",
  component: AdmincnShell,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioFullscreenLayout,
    a11y: shadcnStudioStoryA11y,
    shellSlug: "admincn" satisfies ShellSlug,
    docs: {
      description: {
        component:
          "L3 AdminCN shell composer. Use `parameters.shellSlug` to lab-flip between shells: `admincn` (default), `crm-shell`, `ai-shell` (future — unregistered slugs fall back to admincn). ThemeCustomizer in the header toggles sidebar variant: Default / Floating / Inset.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ErpPresentationProviders>
        <Story />
      </ErpPresentationProviders>
    ),
  ],
  render: (args, { parameters }) => {
    const shellSlug = (parameters["shellSlug"] ?? "admincn") as ShellSlug;
    const Shell = resolveShell(shellSlug);
    return <Shell {...args} />;
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultAppShell: Story = {
  args: shellStoryArgs,
  parameters: {
    shellSlug: "admincn" satisfies ShellSlug,
  },
};

/**
 * Lab placeholder — `crm-shell` resolves to admincn until `crm-shell.tsx` ships.
 */
export const CrmShellLab: Story = {
  args: shellStoryArgs,
  parameters: {
    shellSlug: "crm-shell" satisfies ShellSlug,
  },
};

/**
 * Lab placeholder — `ai-shell` resolves to admincn until `ai-shell.tsx` ships.
 */
export const AiShellLab: Story = {
  args: shellStoryArgs,
  parameters: {
    shellSlug: "ai-shell" satisfies ShellSlug,
  },
};
