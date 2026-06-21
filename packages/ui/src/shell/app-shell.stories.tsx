import {
  AppShell,
  AppShellCommandCenter,
  AppShellContextSwitcher,
  type AppShellIdentity,
  AppShellMain,
  type AppShellNavItem,
  DEFAULT_COMMAND_ITEMS,
  DEFAULT_NAV_ITEMS,
  DEFAULT_WORKSPACE_CONTEXT,
} from "@afenda/appshell";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryFrame } from "../components/_storybook/story-frame";

const DEMO_IDENTITY = {
  displayName: "Jane Doe",
  email: "jane.doe@demo.company",
  userId: "user-demo-001",
} satisfies AppShellIdentity;

const NAV_WITH_CHILDREN: readonly AppShellNavItem[] = DEFAULT_NAV_ITEMS.map(
  (item) =>
    item.id === "inventory"
      ? {
          ...item,
          state: "ready" as const,
          children: [
            {
              id: "inventory",
              label: "Stock overview",
              href: "/inventory/stock",
              icon: "warehouse",
              kind: "module",
              order: 1,
              state: "ready",
            },
            {
              id: "inventory",
              label: "Transfers",
              href: "/inventory/transfers",
              icon: "warehouse",
              kind: "module",
              order: 2,
              state: "coming-soon",
            },
          ],
        }
      : item
);

function ShellPage({
  title = "Dashboard",
  description = "Platform overview and workspace entry for the demo tenant.",
  body = "Main content renders inside governed Card slots. Production apps pass route-specific children here.",
}: {
  readonly body?: string;
  readonly description?: string;
  readonly title?: string;
}) {
  return (
    <AppShellMain description={description} title={title}>
      <p>{body}</p>
    </AppShellMain>
  );
}

const meta = {
  title: "Shell/AppShell",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Governed ERP application shell — floating sidebar, grouped module navigation, workspace context, command center, and main inset. Composes `@afenda/ui` Sidebar primitives with `@afenda/ui/governance` layout policy. Production wiring lives in `apps/erp`.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Application Shell — Default",
  render: () => (
    <AppShell currentPathname="/">
      <ShellPage />
    </AppShell>
  ),
};

export const WithSignedInUser: Story = {
  name: "Application Shell — Signed-in User",
  render: () => (
    <AppShell
      currentPathname="/"
      identity={DEMO_IDENTITY}
      onContextSwitchRequest={() => undefined}
    >
      <ShellPage
        description="Sidebar footer shows the signed-in operator and account menu."
        title="Operations overview"
      />
    </AppShell>
  ),
};

export const ContextSwitcherLoading: Story = {
  name: "Application Shell — Context Loading",
  render: () => (
    <AppShell contextSwitcherState="loading" currentPathname="/">
      <ShellPage title="Loading workspace" />
    </AppShell>
  ),
};

export const WorkspaceExpanded: Story = {
  name: "Application Shell — Expanded Workspace",
  render: () => (
    <AppShell contextSwitcherCompact={false} currentPathname="/">
      <ShellPage description="Tenant label is visible when compact mode is off." />
    </AppShell>
  ),
};

export const CollapsibleModuleNav: Story = {
  name: "Application Shell — Collapsible Nav",
  render: () => (
    <AppShell
      activeItemId="inventory"
      currentPathname="/inventory"
      navItems={NAV_WITH_CHILDREN}
    >
      <ShellPage
        description="Inventory module exposes nested destinations in the sidebar."
        title="Inventory"
      />
    </AppShell>
  ),
};

export const MobileViewport: Story = {
  name: "Application Shell — Mobile",
  render: () => (
    <AppShell currentPathname="/" identity={DEMO_IDENTITY}>
      <ShellPage />
    </AppShell>
  ),
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};

export const ContextSwitcherPart: Story = {
  name: "Part — Context Switcher",
  parameters: { layout: "centered" },
  render: () => (
    <StoryFrame width="lg">
      <AppShellContextSwitcher
        onSwitchRequest={() => undefined}
        workspace={DEFAULT_WORKSPACE_CONTEXT}
      />
    </StoryFrame>
  ),
};

export const ContextSwitcherExpandedPart: Story = {
  name: "Part — Context Switcher (Full Tenant)",
  parameters: { layout: "centered" },
  render: () => (
    <StoryFrame width="lg">
      <AppShellContextSwitcher
        compact={false}
        workspace={DEFAULT_WORKSPACE_CONTEXT}
      />
    </StoryFrame>
  ),
};

export const CommandCenterPart: Story = {
  name: "Part — Command Center",
  parameters: { layout: "centered" },
  render: () => (
    <StoryFrame width="lg">
      <AppShellCommandCenter items={DEFAULT_COMMAND_ITEMS} />
    </StoryFrame>
  ),
};
