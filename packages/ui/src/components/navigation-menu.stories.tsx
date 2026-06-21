import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BarChart3Icon,
  Building2Icon,
  FileTextIcon,
  PackageIcon,
  SettingsIcon,
  ShieldIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";

// ─── Helpers ───────────────────────────────────────────────────────────────

interface NavLinkItem {
  readonly description?: string;
  readonly href: string;
  readonly label: string;
}

function NavLinkCard({ href, label, description }: NavLinkItem) {
  return (
    <NavigationMenuLink asChild>
      <a href={href}>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">{label}</span>
          {description ? (
            <span className="text-muted-foreground text-xs">{description}</span>
          ) : null}
        </StoryStack>
      </a>
    </NavigationMenuLink>
  );
}

function MegaMenuColumn({
  title,
  links,
}: {
  readonly title: string;
  readonly links: readonly NavLinkItem[];
}) {
  return (
    <StoryStack className="min-w-44" gap="sm">
      <span className="font-medium text-sm">{title}</span>
      <StoryStack gap="xs">
        {links.map((link) => (
          <NavLinkCard key={link.label} {...link} />
        ))}
      </StoryStack>
    </StoryStack>
  );
}

function ErpNavMenu({ children }: { readonly children: ReactNode }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>{children}</NavigationMenuList>
    </NavigationMenu>
  );
}

function ModuleMegaMenu({
  label,
  columns,
}: {
  readonly label: string;
  readonly columns: ReadonlyArray<{
    readonly title: string;
    readonly links: readonly NavLinkItem[];
  }>;
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <StoryFrame padding="md" width="lg">
          <StoryRow align="start" gap="lg" wrap>
            {columns.map((column) => (
              <MegaMenuColumn key={column.title} {...column} />
            ))}
          </StoryRow>
        </StoryFrame>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

// ─── NavigationMenu ────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed horizontal navigation menu for ERP top bars and marketing-style module pickers. Supports mega-menu panels via `NavigationMenuContent`, simple links via `NavigationMenuLink`, and optional `NavigationMenuIndicator`. Use `DropdownMenu` for compact toolbar actions.",
      },
    },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ErpNavMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Modules</NavigationMenuTrigger>
        <NavigationMenuContent>
          <StoryFrame padding="md" width="md">
            <StoryStack gap="sm">
              <NavLinkCard
                description="Dashboard and workspace entry"
                href="#"
                label="Nexus"
              />
              <NavLinkCard
                description="Invoices, payments, and GL"
                href="#"
                label="Finance"
              />
              <NavLinkCard
                description="Purchase orders and vendors"
                href="#"
                label="Procurement"
              />
            </StoryStack>
          </StoryFrame>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Reports</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Settings</NavigationMenuLink>
      </NavigationMenuItem>
    </ErpNavMenu>
  ),
};

export const SimpleLinksOnly: Story = {
  name: "NavigationMenu — Simple Links",
  render: () => (
    <ErpNavMenu>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Dashboard</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Invoices</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Vendors</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Approvals</NavigationMenuLink>
      </NavigationMenuItem>
    </ErpNavMenu>
  ),
};

export const WithoutViewport: Story = {
  name: "NavigationMenu — Without Viewport",
  render: () => (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Finance</NavigationMenuTrigger>
          <NavigationMenuContent>
            <StoryFrame padding="md" width="sm">
              <StoryStack gap="xs">
                <NavLinkCard href="#" label="Invoices" />
                <NavLinkCard href="#" label="Payment batches" />
                <NavLinkCard href="#" label="Journal entries" />
              </StoryStack>
            </StoryFrame>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const WithIndicator: Story = {
  name: "NavigationMenu — With Indicator",
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Modules</NavigationMenuTrigger>
          <NavigationMenuContent>
            <StoryFrame padding="md" width="sm">
              <NavLinkCard href="#" label="Finance" />
            </StoryFrame>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Settings</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
    </NavigationMenu>
  ),
};

// ─── ERP module navigation ─────────────────────────────────────────────────

export const ErpTopNavigation: Story = {
  name: "ERP — Top Navigation Bar",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <ErpNavMenu>
        <ModuleMegaMenu
          columns={[
            {
              title: "Core",
              links: [
                {
                  href: "#",
                  label: "Nexus",
                  description: "Workspace home",
                },
                {
                  href: "#",
                  label: "Command center",
                  description: "⌘K global search",
                },
              ],
            },
            {
              title: "Operations",
              links: [
                {
                  href: "#",
                  label: "Procurement",
                  description: "POs and vendors",
                },
                {
                  href: "#",
                  label: "Inventory",
                  description: "Stock and warehouses",
                },
              ],
            },
          ]}
          label="Modules"
        />
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Approvals</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Reports</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Settings</NavigationMenuLink>
        </NavigationMenuItem>
      </ErpNavMenu>
    </StoryFrame>
  ),
};

export const ErpFinanceModule: Story = {
  name: "ERP — Finance Module Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <ModuleMegaMenu
        columns={[
          {
            title: "Accounts payable",
            links: [
              {
                href: "#",
                label: "Invoices",
                description: "Vendor bills and matching",
              },
              {
                href: "#",
                label: "Payment batches",
                description: "Scheduled disbursements",
              },
              {
                href: "#",
                label: "Vendor credits",
                description: "Adjustments and refunds",
              },
            ],
          },
          {
            title: "General ledger",
            links: [
              {
                href: "#",
                label: "Journal entries",
                description: "Post and reverse entries",
              },
              {
                href: "#",
                label: "Chart of accounts",
                description: "GL structure FY 2026",
              },
              {
                href: "#",
                label: "Trial balance",
                description: "Period close review",
              },
            ],
          },
        ]}
        label="Finance"
      />
    </ErpNavMenu>
  ),
};

export const ErpProcurementModule: Story = {
  name: "ERP — Procurement Module Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <ModuleMegaMenu
        columns={[
          {
            title: "Purchasing",
            links: [
              {
                href: "#",
                label: "Purchase orders",
                description: "Create and track POs",
              },
              {
                href: "#",
                label: "Requisitions",
                description: "Internal requests",
              },
              {
                href: "#",
                label: "Goods receipt",
                description: "Receive against POs",
              },
            ],
          },
          {
            title: "Suppliers",
            links: [
              {
                href: "#",
                label: "Vendor master",
                description: "Approved supplier list",
              },
              {
                href: "#",
                label: "Contracts",
                description: "Terms and pricing",
              },
            ],
          },
        ]}
        label="Procurement"
      />
    </ErpNavMenu>
  ),
};

export const ErpHrModule: Story = {
  name: "ERP — HR Module Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <ModuleMegaMenu
        columns={[
          {
            title: "People",
            links: [
              {
                href: "#",
                label: "Employee roster",
                description: "Active headcount",
              },
              {
                href: "#",
                label: "Onboarding",
                description: "New hire workflows",
              },
              {
                href: "#",
                label: "Org chart",
                description: "Departments and managers",
              },
            ],
          },
          {
            title: "Payroll",
            links: [
              {
                href: "#",
                label: "Pay runs",
                description: "Fortnightly payroll",
              },
              {
                href: "#",
                label: "Leave balances",
                description: "Accruals and requests",
              },
            ],
          },
        ]}
        label="Human Resources"
      />
    </ErpNavMenu>
  ),
};

export const ErpInventoryModule: Story = {
  name: "ERP — Inventory Module Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <ModuleMegaMenu
        columns={[
          {
            title: "Stock",
            links: [
              {
                href: "#",
                label: "Stock levels",
                description: "On-hand by warehouse",
              },
              {
                href: "#",
                label: "Transfers",
                description: "Inter-location moves",
              },
              {
                href: "#",
                label: "Adjustments",
                description: "Cycle count corrections",
              },
            ],
          },
          {
            title: "Planning",
            links: [
              {
                href: "#",
                label: "Reorder rules",
                description: "Min/max thresholds",
              },
              {
                href: "#",
                label: "SKU catalog",
                description: "Item master data",
              },
            ],
          },
        ]}
        label="Inventory"
      />
    </ErpNavMenu>
  ),
};

export const ErpSalesModule: Story = {
  name: "ERP — Sales Module Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <ModuleMegaMenu
        columns={[
          {
            title: "Customers",
            links: [
              {
                href: "#",
                label: "Customer master",
                description: "Accounts and contacts",
              },
              {
                href: "#",
                label: "Quotes",
                description: "Open opportunities",
              },
            ],
          },
          {
            title: "Billing",
            links: [
              {
                href: "#",
                label: "Sales orders",
                description: "Fulfillment pipeline",
              },
              {
                href: "#",
                label: "AR invoices",
                description: "Customer billing",
              },
            ],
          },
        ]}
        label="Sales"
      />
    </ErpNavMenu>
  ),
};

export const ErpReportsMegaMenu: Story = {
  name: "ERP — Reports Mega Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <ModuleMegaMenu
        columns={[
          {
            title: "Financial",
            links: [
              { href: "#", label: "P&L statement" },
              { href: "#", label: "Balance sheet" },
              { href: "#", label: "Cash flow" },
            ],
          },
          {
            title: "Operational",
            links: [
              { href: "#", label: "AP aging" },
              { href: "#", label: "Inventory valuation" },
              { href: "#", label: "PO spend by vendor" },
            ],
          },
          {
            title: "Compliance",
            links: [
              { href: "#", label: "Audit trail export" },
              { href: "#", label: "Tax summary" },
            ],
          },
        ]}
        label="Reports"
      />
    </ErpNavMenu>
  ),
};

export const ErpSettingsMenu: Story = {
  name: "ERP — Settings Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <ModuleMegaMenu
        columns={[
          {
            title: "Organization",
            links: [
              { href: "#", label: "Company profile" },
              { href: "#", label: "Fiscal calendar" },
              { href: "#", label: "Currencies" },
            ],
          },
          {
            title: "Access",
            links: [
              { href: "#", label: "Users and roles" },
              { href: "#", label: "Approval policies" },
              { href: "#", label: "API keys" },
            ],
          },
        ]}
        label="Settings"
      />
    </ErpNavMenu>
  ),
};

export const ErpAdminMenu: Story = {
  name: "ERP — System Admin Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <ModuleMegaMenu
        columns={[
          {
            title: "Platform",
            links: [
              {
                href: "#",
                label: "Tenant settings",
                description: "Multi-entity config",
              },
              {
                href: "#",
                label: "Integrations",
                description: "Bank feeds and EDI",
              },
            ],
          },
          {
            title: "Security",
            links: [
              {
                href: "#",
                label: "SSO configuration",
                description: "Identity provider",
              },
              {
                href: "#",
                label: "Audit logs",
                description: "Admin activity",
              },
            ],
          },
        ]}
        label="System Admin"
      />
    </ErpNavMenu>
  ),
};

export const ErpApprovalsMenu: Story = {
  name: "ERP — Approvals Inbox Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger>
          <StoryRow align="center" gap="xs">
            <span>Approvals</span>
            <Badge emphasis="soft" size="sm" tone="warning">
              12
            </Badge>
          </StoryRow>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <StoryFrame padding="md" width="md">
            <StoryStack gap="sm">
              <NavLinkCard
                description="3 POs awaiting L2 approval"
                href="#"
                label="Purchase orders"
              />
              <NavLinkCard
                description="5 invoices over threshold"
                href="#"
                label="Invoices"
              />
              <NavLinkCard
                description="4 expense reports"
                href="#"
                label="Expenses"
              />
            </StoryStack>
          </StoryFrame>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </ErpNavMenu>
  ),
};

export const ErpQuickCreateMenu: Story = {
  name: "ERP — Quick Create Menu",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Create</NavigationMenuTrigger>
        <NavigationMenuContent>
          <StoryFrame padding="md" width="sm">
            <StoryStack gap="xs">
              <NavLinkCard href="#" label="Purchase order" />
              <NavLinkCard href="#" label="Invoice" />
              <NavLinkCard href="#" label="Journal entry" />
              <NavLinkCard href="#" label="Employee" />
              <NavLinkCard href="#" label="Vendor" />
            </StoryStack>
          </StoryFrame>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </ErpNavMenu>
  ),
};

export const ErpRecordTypesMenu: Story = {
  name: "ERP — Record Types Picker",
  parameters: { layout: "padded" },
  render: () => (
    <StoryFrame width="xl">
      <ErpNavMenu>
        <ModuleMegaMenu
          columns={[
            {
              title: "Finance",
              links: [
                { href: "#", label: "INV-2026-0042" },
                { href: "#", label: "BATCH-2026-06-18" },
                { href: "#", label: "JE-2026-0891" },
              ],
            },
            {
              title: "Procurement",
              links: [
                { href: "#", label: "PO-2026-1184" },
                { href: "#", label: "VND-0042" },
              ],
            },
            {
              title: "HR",
              links: [
                { href: "#", label: "EMP-1024" },
                { href: "#", label: "ONB-2026-014" },
              ],
            },
          ]}
          label="Recent records"
        />
      </ErpNavMenu>
    </StoryFrame>
  ),
};

export const ErpModuleIconsMenu: Story = {
  name: "ERP — Module Icons Row",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Modules</NavigationMenuTrigger>
        <NavigationMenuContent>
          <StoryFrame padding="md" width="lg">
            <StoryRow gap="md" wrap>
              {[
                { icon: FileTextIcon, label: "Finance", href: "#" },
                { icon: PackageIcon, label: "Procurement", href: "#" },
                { icon: TruckIcon, label: "Inventory", href: "#" },
                { icon: UsersIcon, label: "HR", href: "#" },
                { icon: Building2Icon, label: "Sales", href: "#" },
                { icon: BarChart3Icon, label: "Analytics", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <NavigationMenuLink asChild key={label}>
                  <a href={href}>
                    <StoryRow align="center" gap="xs">
                      <Icon className="size-5 text-muted-foreground" />
                      <span className="text-sm">{label}</span>
                    </StoryRow>
                  </a>
                </NavigationMenuLink>
              ))}
            </StoryRow>
          </StoryFrame>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">
          <StoryRow align="center" gap="xs">
            <ShieldIcon className="size-4" />
            <span>Admin</span>
          </StoryRow>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">
          <StoryRow align="center" gap="xs">
            <SettingsIcon className="size-4" />
            <span>Settings</span>
          </StoryRow>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </ErpNavMenu>
  ),
};

export const ErpAnalyticsMenu: Story = {
  name: "ERP — Analytics & Insights",
  parameters: { layout: "padded" },
  render: () => (
    <ErpNavMenu>
      <ModuleMegaMenu
        columns={[
          {
            title: "Dashboards",
            links: [
              {
                href: "#",
                label: "Executive summary",
                description: "KPIs and cash position",
              },
              {
                href: "#",
                label: "AP operations",
                description: "Invoice throughput",
              },
            ],
          },
          {
            title: "Exports",
            links: [
              { href: "#", label: "Scheduled reports" },
              { href: "#", label: "Data warehouse sync" },
            ],
          },
        ]}
        label="Analytics"
      />
    </ErpNavMenu>
  ),
};

export const NavigationMenuVsDropdown: Story = {
  name: "ERP — NavigationMenu vs DropdownMenu",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "NavigationMenu: persistent top-bar module pickers and mega menus with hover/focus panels. DropdownMenu: compact actions from buttons and row menus.",
      },
    },
  },
  render: () => (
    <StoryFrame width="xl">
      <StoryStack gap="lg">
        <StoryStack gap="xs">
          <span className="font-medium text-sm">Top bar (NavigationMenu)</span>
          <ErpNavMenu>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Finance</NavigationMenuTrigger>
              <NavigationMenuContent>
                <StoryFrame padding="sm" width="sm">
                  <NavLinkCard href="#" label="Invoices" />
                </StoryFrame>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </ErpNavMenu>
        </StoryStack>
        <StoryStack gap="xs">
          <span className="font-medium text-sm">
            Toolbar action (DropdownMenu)
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button emphasis="outline" intent="secondary" size="sm">
                Row actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Invoice INV-2026-0042</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>View</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Approve</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </StoryStack>
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  parameters: {
    docs: {
      description: {
        story:
          "NavigationMenu provides keyboard navigation between triggers and panel links. Use descriptive link labels; supplement icon-only entries with visible text or `aria-label` on the trigger.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <nav aria-label="ERP module navigation">
        <ErpNavMenu>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Finance</NavigationMenuTrigger>
            <NavigationMenuContent>
              <StoryFrame padding="md" width="sm">
                <StoryStack gap="xs">
                  <NavigationMenuLink asChild>
                    <a href="#">Invoices — accounts payable</a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a href="#">Journal entries — general ledger</a>
                  </NavigationMenuLink>
                </StoryStack>
              </StoryFrame>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Approvals inbox</NavigationMenuLink>
          </NavigationMenuItem>
        </ErpNavMenu>
      </nav>
    </StoryFrame>
  ),
};
