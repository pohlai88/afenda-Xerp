import { cn } from "@afenda/ui/lib/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BellIcon,
  Building2Icon,
  ChevronRightIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { StoryRow, StoryStack } from "./_storybook/story-frame";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "./sidebar";

// ─── Shared data ─────────────────────────────────────────────────────────────

const APPLICATION_LINKS = [
  { title: "Dashboard", url: "#", icon: LayoutDashboardIcon },
  { title: "Search", url: "#", icon: SearchIcon },
  { title: "Notifications", url: "#", icon: BellIcon, badge: "3" },
  { title: "Settings", url: "#", icon: SettingsIcon },
] as const;

const ERP_MODULE_GROUPS = [
  {
    label: "Core modules",
    items: [
      { title: "Finance", icon: CreditCardIcon, badge: "12", active: true },
      { title: "Procurement", icon: PackageIcon, badge: "5" },
      { title: "Inventory", icon: LayoutGridIcon },
      { title: "Human resources", icon: UsersIcon },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Organization", icon: Building2Icon },
      { title: "Security", icon: ShieldIcon },
      { title: "Audit log", icon: FileTextIcon },
    ],
  },
] as const;

const PROCUREMENT_CHILDREN = [
  { title: "Purchase orders", url: "#", active: true },
  { title: "Vendors", url: "#" },
  { title: "Receiving", url: "#" },
  { title: "RFQ queue", url: "#", badge: "2" },
] as const;

const RECORD_CONTEXT_LINKS = [
  { title: "Overview", active: true },
  { title: "Line items" },
  { title: "Attachments" },
  { title: "Audit trail" },
  { title: "Comments" },
  { title: "Related records" },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

function MainShell({
  title = "Workspace",
  children,
}: {
  readonly title?: string;
  readonly children?: ReactNode;
}) {
  return (
    <StoryStack className="flex-1" gap="md" padding="md">
      <StoryRow align="center" gap="sm">
        <SidebarTrigger />
        <span className="font-medium text-sm">{title}</span>
      </StoryRow>
      {children ?? (
        <span className="text-muted-foreground text-sm">
          Main content area — resize the sidebar or press Ctrl+B to toggle.
        </span>
      )}
    </StoryStack>
  );
}

function SidebarStoryFrame({
  sidebar,
  main,
  defaultOpen = true,
  providerClassName = "flex min-h-svh w-full",
  ...sidebarProps
}: {
  readonly sidebar: ReactNode;
  readonly main?: ReactNode;
  readonly defaultOpen?: boolean;
  readonly providerClassName?: string;
} & React.ComponentProps<typeof Sidebar>) {
  return (
    <SidebarProvider className={providerClassName} defaultOpen={defaultOpen}>
      <Sidebar {...sidebarProps}>{sidebar}</Sidebar>
      <SidebarInset>{main ?? <MainShell />}</SidebarInset>
    </SidebarProvider>
  );
}

function ApplicationNav({
  activeTitle = "Dashboard",
}: {
  readonly activeTitle?: string;
}) {
  return (
    <>
      <SidebarHeader>
        <StoryStack gap="sm" padding="sm">
          <StoryRow align="center" gap="sm">
            <SidebarTrigger />
            <span className="font-semibold tracking-tight">Afenda ERP</span>
          </StoryRow>
        </StoryStack>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {APPLICATION_LINKS.map((item) => {
                const { title, url, icon: Icon } = item;
                const badge = "badge" in item ? item.badge : undefined;

                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      asChild
                      isActive={title === activeTitle}
                      tooltip={title}
                    >
                      <a href={url}>
                        <Icon aria-hidden="true" className="size-4" />
                        <span>{title}</span>
                        {badge ? (
                          <SidebarMenuBadge>{badge}</SidebarMenuBadge>
                        ) : null}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

function ErpModuleNav({
  activeModule = "Finance",
  showSearch = false,
}: {
  readonly activeModule?: string;
  readonly showSearch?: boolean;
}) {
  return (
    <>
      <SidebarHeader>
        <StoryStack gap="sm" padding="sm">
          <StoryRow align="center" gap="sm">
            <SidebarTrigger />
            <span className="font-semibold tracking-tight">Afenda ERP</span>
          </StoryRow>
          {showSearch ? (
            <SidebarInput placeholder="Search modules…" type="search" />
          ) : null}
        </StoryStack>
      </SidebarHeader>
      <SidebarContent>
        {ERP_MODULE_GROUPS.map(({ label, items }) => (
          <SidebarGroup key={label}>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const { title, icon: Icon } = item;
                  const badge = "badge" in item ? item.badge : undefined;
                  const isActive =
                    ("active" in item && item.active) || title === activeModule;

                  return (
                    <SidebarMenuItem key={title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={title}
                      >
                        <a href="#">
                          <Icon aria-hidden="true" className="size-4" />
                          <span>{title}</span>
                          {badge ? (
                            <SidebarMenuBadge>{badge}</SidebarMenuBadge>
                          ) : null}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Jane Doe">
              <Avatar size="sm">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <StoryStack gap="xs">
                <span className="text-sm">Jane Doe</span>
                <span className="text-muted-foreground text-xs">
                  Finance controller
                </span>
              </StoryStack>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

function ProcurementNavWithChildren() {
  return (
    <>
      <SidebarHeader>
        <StoryStack gap="sm" padding="sm">
          <StoryRow align="center" gap="sm">
            <SidebarTrigger />
            <span className="font-semibold tracking-tight">Procurement</span>
          </StoryRow>
        </StoryStack>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Collapsible className="group/collapsible" defaultOpen>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive tooltip="Procurement">
                      <PackageIcon
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                      <span className="flex-1 truncate">Procurement</span>
                      <ChevronRightIcon
                        className={cn(
                          "size-4 shrink-0 transition-transform",
                          "group-data-[state=open]/collapsible:rotate-90"
                        )}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {PROCUREMENT_CHILDREN.map((item) => {
                        const { title, url } = item;
                        const isActive = "active" in item && item.active;
                        const badge = "badge" in item ? item.badge : undefined;

                        return (
                          <SidebarMenuSubItem key={title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={Boolean(isActive)}
                            >
                              <a href={url}>
                                <span>{title}</span>
                                {badge ? (
                                  <SidebarMenuBadge>{badge}</SidebarMenuBadge>
                                ) : null}
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Inventory">
                  <LayoutGridIcon aria-hidden="true" className="size-4" />
                  <span>Inventory</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Primitives/Sidebar",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Governed ERP application sidebar — module navigation, workspace context, collapsible icon rail, and mobile sheet fallback. Wrap with `SidebarProvider`; pair `Sidebar` with `SidebarInset` for main content. See **Shell/AppShell** for the production `@afenda/appshell` composition.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic shapes ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <SidebarStoryFrame sidebar={<ApplicationNav activeTitle="Dashboard" />} />
  ),
};

export const IconCollapsible: Story = {
  name: "Sidebar — Icon Collapsible",
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      sidebar={<ApplicationNav activeTitle="Notifications" />}
      variant="sidebar"
    />
  ),
};

export const FloatingVariant: Story = {
  name: "Sidebar — Floating Variant",
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      sidebar={<ApplicationNav />}
      variant="floating"
    />
  ),
};

export const InsetVariant: Story = {
  name: "Sidebar — Inset Variant",
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      sidebar={<ApplicationNav />}
      variant="inset"
    />
  ),
};

export const RightSide: Story = {
  name: "Sidebar — Right Side",
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      side="right"
      sidebar={<ApplicationNav activeTitle="Settings" />}
    />
  ),
};

export const WithSearchInput: Story = {
  name: "Sidebar — With Search Input",
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      sidebar={<ErpModuleNav showSearch />}
    />
  ),
};

export const WithRail: Story = {
  name: "Sidebar — With Rail",
  parameters: {
    docs: {
      description: {
        story:
          'Drag or click the rail edge to toggle collapse. Pairs with `collapsible="icon"` layouts.',
      },
    },
  },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      sidebar={
        <>
          <ApplicationNav />
          <SidebarRail />
        </>
      }
    />
  ),
};

export const MenuBadges: Story = {
  name: "Sidebar — Menu Badges",
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      sidebar={<ApplicationNav activeTitle="Notifications" />}
    />
  ),
};

export const SubNavigation: Story = {
  name: "Sidebar — Sub Navigation",
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      sidebar={<ProcurementNavWithChildren />}
    />
  ),
};

export const LoadingSkeleton: Story = {
  name: "Sidebar — Loading Skeleton",
  render: () => (
    <SidebarStoryFrame
      sidebar={
        <>
          <SidebarHeader>
            <StoryStack gap="sm" padding="sm">
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton />
              <SidebarMenuSkeleton />
            </StoryStack>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Loading modules…</SidebarGroupLabel>
              <SidebarGroupContent>
                <StoryStack gap="sm" padding="sm">
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                </StoryStack>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </>
      }
    />
  ),
};

export const FooterUserMenu: Story = {
  name: "Sidebar — Footer User Menu",
  render: () => (
    <SidebarStoryFrame collapsible="icon" sidebar={<ErpModuleNav />} />
  ),
};

export const NonCollapsible: Story = {
  name: "Sidebar — Non Collapsible",
  render: () => (
    <SidebarStoryFrame collapsible="none" sidebar={<ApplicationNav />} />
  ),
};

// ─── ERP usage ───────────────────────────────────────────────────────────────

export const ModuleNavigation: Story = {
  name: "ERP — Module Navigation",
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      main={<MainShell title="Finance · Invoices" />}
      sidebar={<ErpModuleNav activeModule="Finance" />}
    />
  ),
};

export const FinanceWorkspace: Story = {
  name: "ERP — Finance Workspace",
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      main={
        <MainShell title="Finance · Accounts receivable">
          <StoryStack gap="sm">
            <StoryRow gap="sm" wrap>
              <Badge emphasis="soft" tone="success">
                12 open invoices
              </Badge>
              <Badge emphasis="soft" tone="warning">
                3 overdue
              </Badge>
            </StoryRow>
            <span className="text-muted-foreground text-sm">
              Invoice register and reconciliation tools render in this inset.
            </span>
          </StoryStack>
        </MainShell>
      }
      sidebar={<ErpModuleNav activeModule="Finance" showSearch />}
      variant="inset"
    />
  ),
};

export const ProcurementModule: Story = {
  name: "ERP — Procurement Module",
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      main={<MainShell title="Purchase orders" />}
      sidebar={<ProcurementNavWithChildren />}
    />
  ),
};

export const CollapsedIconRail: Story = {
  name: "ERP — Collapsed Icon Rail",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Icon-only collapsed state shows tooltips on menu buttons. Use `tooltip` on each `SidebarMenuButton`.",
      },
    },
  },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      defaultOpen={false}
      main={<MainShell title="Collapsed navigation" />}
      sidebar={
        <>
          <ErpModuleNav activeModule="Finance" />
          <SidebarRail />
        </>
      }
    />
  ),
};

export const WorkspaceSwitcherHeader: Story = {
  name: "ERP — Workspace Switcher Header",
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      main={<MainShell title="Operations workspace" />}
      sidebar={
        <>
          <SidebarHeader>
            <StoryStack gap="sm" padding="sm">
              <StoryRow align="center" gap="sm">
                <SidebarTrigger />
                <span className="font-semibold tracking-tight">Afenda ERP</span>
              </StoryRow>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Operations · East region">
                    <Building2Icon
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                    <StoryStack className="min-w-0 flex-1" gap="xs">
                      <span className="text-sm">Operations</span>
                      <span className="text-muted-foreground text-xs">
                        East region
                      </span>
                    </StoryStack>
                    <ChevronRightIcon className="size-4 shrink-0" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </StoryStack>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Modules</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ERP_MODULE_GROUPS[0].items
                    .slice(0, 3)
                    .map(({ title, icon: Icon }) => (
                      <SidebarMenuItem key={title}>
                        <SidebarMenuButton asChild tooltip={title}>
                          <a href="#">
                            <Icon aria-hidden="true" className="size-4" />
                            <span>{title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </>
      }
    />
  ),
};

export const ApprovalQueueBadges: Story = {
  name: "ERP — Approval Queue Badges",
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      main={<MainShell title="Invoice approvals" />}
      sidebar={
        <>
          <SidebarHeader>
            <StoryStack gap="sm" padding="sm">
              <StoryRow align="center" gap="sm">
                <SidebarTrigger />
                <span className="font-semibold tracking-tight">Approvals</span>
              </StoryRow>
            </StoryStack>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Queues</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[
                    { title: "Purchase orders", badge: "8" },
                    { title: "Invoices", badge: "14", active: true },
                    { title: "Expenses", badge: "3" },
                    { title: "Time off", badge: "1" },
                  ].map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        {...(item.active ? { isActive: true } : {})}
                        tooltip={item.title}
                      >
                        <a href="#">
                          <FileTextIcon aria-hidden="true" className="size-4" />
                          <span>{item.title}</span>
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </>
      }
    />
  ),
};

export const SettingsAdminGroup: Story = {
  name: "ERP — Settings & Admin Group",
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      main={<MainShell title="Security policies" />}
      sidebar={
        <>
          <SidebarHeader>
            <StoryStack gap="sm" padding="sm">
              <StoryRow align="center" gap="sm">
                <SidebarTrigger />
                <span className="font-semibold tracking-tight">
                  Administration
                </span>
              </StoryRow>
            </StoryStack>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <StoryRow align="center" justify="between">
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarGroupAction
                  aria-label="Add setting"
                  title="Add setting"
                >
                  <PlusIcon />
                </SidebarGroupAction>
              </StoryRow>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ERP_MODULE_GROUPS[1].items.map(({ title, icon: Icon }) => (
                    <SidebarMenuItem key={title}>
                      <SidebarMenuButton
                        asChild
                        isActive={title === "Security"}
                        tooltip={title}
                      >
                        <a href="#">
                          <Icon aria-hidden="true" className="size-4" />
                          <span>{title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Documentation">
                      <FileTextIcon aria-hidden="true" className="size-4" />
                      <span>Documentation</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </>
      }
    />
  ),
};

export const NestedModuleChildren: Story = {
  name: "ERP — Nested Module Children",
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      main={<MainShell title="Purchase orders · PO-1042" />}
      sidebar={<ProcurementNavWithChildren />}
    />
  ),
};

export const RecordContextSidebar: Story = {
  name: "ERP — Record Context Sidebar",
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      main={
        <MainShell title="PO-1042 · FastCo Industrial">
          <span className="text-muted-foreground text-sm">
            Document body — use a secondary sidebar for record section
            navigation.
          </span>
        </MainShell>
      }
      sidebar={
        <>
          <SidebarHeader>
            <StoryStack gap="xs" padding="sm">
              <span className="font-mono text-xs">PO-1042</span>
              <span className="font-medium text-sm">FastCo Industrial</span>
              <Badge emphasis="soft" tone="warning">
                Pending approval
              </Badge>
            </StoryStack>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Sections</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {RECORD_CONTEXT_LINKS.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        {...("active" in item && item.active
                          ? { isActive: true }
                          : {})}
                        tooltip={item.title}
                      >
                        <a href="#">
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </>
      }
    />
  ),
};

export const MainContentShell: Story = {
  name: "ERP — Main Content Shell",
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      main={
        <StoryStack className="flex-1" gap="md" padding="md">
          <StoryRow align="center" gap="sm">
            <SidebarTrigger />
            <span className="font-medium text-sm">
              Inventory · Stock levels
            </span>
          </StoryRow>
          <StoryStack
            className="flex-1 rounded-md border border-border"
            gap="sm"
            padding="md"
          >
            <StoryRow gap="sm" wrap>
              <Badge emphasis="soft" tone="warning">
                9 low-stock SKUs
              </Badge>
              <Badge emphasis="soft" tone="neutral">
                East warehouse
              </Badge>
            </StoryRow>
            <span className="text-muted-foreground text-sm">
              Data grid and filters occupy the inset while module navigation
              stays in the collapsible sidebar.
            </span>
          </StoryStack>
        </StoryStack>
      }
      sidebar={
        <>
          <ErpModuleNav activeModule="Inventory" />
          <SidebarRail />
        </>
      }
      variant="inset"
    />
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Keyboard & Focus",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Press Ctrl+B (Windows) or ⌘B (macOS) to toggle the sidebar. `SidebarTrigger` exposes an accessible name; collapsed icon mode relies on `tooltip` for menu labels.",
      },
    },
  },
  render: () => (
    <SidebarStoryFrame
      collapsible="icon"
      main={
        <MainShell title="Keyboard navigation">
          <StoryStack gap="sm">
            <span className="text-muted-foreground text-sm">
              Focus the trigger or use the keyboard shortcut to collapse and
              expand the navigation rail.
            </span>
            <StoryRow gap="sm">
              <Badge emphasis="outline" tone="neutral">
                Ctrl+B
              </Badge>
              <span className="text-muted-foreground text-xs">
                Toggle sidebar
              </span>
            </StoryRow>
          </StoryStack>
        </MainShell>
      }
      sidebar={<ApplicationNav />}
    />
  ),
};
