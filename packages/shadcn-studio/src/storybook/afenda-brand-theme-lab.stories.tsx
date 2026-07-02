import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { ChevronDown, LayoutDashboard, Settings, Users } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { expect } from "storybook/test";

import "../../docs/swiss-noir.css";

import { Button } from "../components-ui/button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components-ui/dropdown-menu.js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../components-ui/sidebar.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components-ui/table.js";
import { TooltipProvider } from "../components-ui/tooltip.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioStoryA11y,
} from "../lab/index.js";
import { afendaBrandPreset } from "../styles/presentation-lab-presets.js";

const BRAND_CLASS = afendaBrandPreset.className;

const afendaBrandThemeDecorator: Decorator = (Story, context) => {
  const colorMode = context.globals["theme"] === "dark" ? "dark" : "light";
  const isFullscreen = context.parameters["layout"] === "fullscreen";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={colorMode}
      enableSystem={false}
      forcedTheme={colorMode}
    >
      <TooltipProvider delay={0}>
        <div
          className={
            isFullscreen
              ? `${BRAND_CLASS} min-h-svh bg-background font-sans text-foreground antialiased`
              : `${BRAND_CLASS} bg-background p-4 font-sans text-foreground antialiased`
          }
        >
          <Story />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
};

const meta = {
  title: "Shadcn Studio/Afenda Brand Theme Lab",
  component: Button,
  tags: ["autodocs"],
  decorators: [afendaBrandThemeDecorator],
  parameters: {
    ...shadcnStudioCenteredLayout,
    shadcnStudioPreset: "default",
    docs: {
      description: {
        component:
          "Scoped `.theme-afenda-brand` token verification — Swiss Noir DNA on standard shadcn names. Storybook only; ERP stays AdminCN default until review.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const swatchKeys = [
  "primary",
  "accent",
  "popover",
  "destructive",
  "sidebar",
  "sidebar-primary",
] as const;

export const TokenSwatches: Story = {
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
      {swatchKeys.map((key) => (
        <div
          className="flex flex-col gap-2 rounded-lg border border-border p-3"
          key={key}
        >
          <div
            className="h-16 rounded-md border border-border-subtle"
            style={{ background: `var(--${key})` }}
          />
          <span className="font-mono text-muted-foreground text-xs">{key}</span>
        </div>
      ))}
    </div>
  ),
};

export const ButtonAndDropdown: Story = {
  tags: ["lab-smoke"],
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button">Primary</Button>
      <Button type="button" variant="secondary">
        Secondary
      </Button>
      <Button type="button" variant="outline">
        Outline
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button type="button" variant="outline" />}
        >
          Menu
          <ChevronDown className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Primary" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Menu" })).toBeVisible();
  },
};

export const SidebarPreview: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarProvider className="min-h-[28rem]">
      <Sidebar collapsible="none">
        <SidebarHeader className="border-sidebar-border border-b p-3">
          <span className="font-medium text-sm">Afenda Brand</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <LayoutDashboard />
                    Dashboard
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users />
                    Users
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4">
        <p className="text-muted-foreground text-sm">
          Sidebar tokens: bg-sidebar, sidebar-primary, sidebar-accent hover.
        </p>
      </SidebarInset>
    </SidebarProvider>
  ),
};

const tableRows = [
  {
    id: "PO-1042",
    vendor: "Northwind Traders",
    amount: "$4,280.00",
    status: "Open",
  },
  {
    id: "PO-1043",
    vendor: "Contoso Ltd",
    amount: "$1,120.50",
    status: "Approved",
  },
  { id: "PO-1044", vendor: "Fabrikam Inc", amount: "$890.00", status: "Draft" },
];

export const TableDensity: Story = {
  render: () => (
    <Table className="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>PO</TableHead>
          <TableHead>Vendor</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableRows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.id}</TableCell>
            <TableCell>{row.vendor}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const BrandThemeDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  tags: ["lab-smoke"],
  render: () => (
    <div className="flex max-w-md flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <h2 className="font-semibold text-card-foreground">Dark mode card</h2>
      <p className="text-muted-foreground text-sm">
        Gold primary and blueprint accent on ink background.
      </p>
      <div className="flex gap-2">
        <Button type="button">Primary</Button>
        <Button type="button" variant="outline">
          Outline
        </Button>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Dark mode card")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Primary" })).toBeVisible();
  },
};
