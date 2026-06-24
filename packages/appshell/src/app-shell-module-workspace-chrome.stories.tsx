import type { Meta, StoryObj } from "@storybook/react";

import { AppShellModuleWorkspaceChrome } from "./shadcn-studio/blocks/app-shell-module-workspace-chrome.js";

const meta = {
  title: "AppShell/Module Workspace Chrome",
  component: AppShellModuleWorkspaceChrome,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof AppShellModuleWorkspaceChrome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    moduleId: "accounting",
    moduleLabel: "Accounting",
    breadcrumbItems: [{ label: "Home", href: "#" }, { label: "Accounting" }],
    children: <div style={{ padding: "1.5rem" }}>Module content area</div>,
  },
};

export const WithTabs: Story = {
  args: {
    moduleId: "hrm",
    moduleLabel: "Human Resources",
    breadcrumbItems: [{ label: "Home", href: "#" }, { label: "HRM" }],
    tabs: [
      { label: "Overview", href: "#overview", active: true },
      { label: "Employees", href: "#employees" },
      { label: "Payroll", href: "#payroll" },
    ],
    children: <div style={{ padding: "1.5rem" }}>HRM overview content</div>,
  },
};

export const WithPrimaryAction: Story = {
  args: {
    moduleId: "inventory",
    moduleLabel: "Inventory",
    primaryAction: <button type="button">New Item</button>,
    children: <div style={{ padding: "1.5rem" }}>Inventory content</div>,
  },
};
