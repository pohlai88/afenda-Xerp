import { cn } from "../../lib/cn";
import type {
  AppShellNavGroupWire,
  AppShellNavItemWire,
} from "../../types/app-shell";
import type { SidebarProps, SidebarVariant } from "../../types/layout";
import { SIDEBAR_SLOTS } from "../../types/layout";

const SIDEBAR_BASE_CLASS =
  "flex min-h-0 flex-col rounded-lg border border-border bg-card text-card-foreground shadow-sm";

const SIDEBAR_VARIANT_CLASSES = {
  default: "w-full p-4",
} satisfies Record<SidebarVariant, string>;

const EMPTY_NAV_GROUPS: readonly AppShellNavGroupWire[] = [];

export function sidebarClassName({
  className,
  variant = "default",
}: Pick<SidebarProps, "className" | "variant"> = {}): string {
  return cn(SIDEBAR_BASE_CLASS, SIDEBAR_VARIANT_CLASSES[variant], className);
}

function sidebarNavItemClassName(item: AppShellNavItemWire): string {
  return cn(
    "block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    item.isActive === true
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  );
}

function SidebarNavItem({ item }: { readonly item: AppShellNavItemWire }) {
  return (
    <li data-slot={SIDEBAR_SLOTS.navItem}>
      <a
        aria-current={item.isActive === true ? "page" : undefined}
        className={sidebarNavItemClassName(item)}
        data-slot={SIDEBAR_SLOTS.navLink}
        href={item.href}
      >
        {item.label}
      </a>
    </li>
  );
}

function SidebarNavGroup({ group }: { readonly group: AppShellNavGroupWire }) {
  return (
    <section className="space-y-3" data-slot={SIDEBAR_SLOTS.navGroup}>
      <div
        className="px-3 font-medium text-muted-foreground text-xs uppercase tracking-[0.24em]"
        data-slot={SIDEBAR_SLOTS.navGroupLabel}
      >
        {group.label}
      </div>
      <ul className="space-y-1" data-slot={SIDEBAR_SLOTS.navGroupItems}>
        {group.items.map((item) => (
          <SidebarNavItem item={item} key={item.id} />
        ))}
      </ul>
    </section>
  );
}

export function Sidebar({
  children,
  className,
  footer,
  groups,
  navLabel = "Primary navigation",
  variant = "default",
  ...props
}: SidebarProps) {
  const navGroups = groups ?? EMPTY_NAV_GROUPS;
  const hasNavGroups = navGroups.length > 0;

  return (
    <aside
      {...props}
      className={sidebarClassName({ className, variant })}
      data-slot={SIDEBAR_SLOTS.root}
    >
      {children}
      {hasNavGroups ? (
        <nav
          aria-label={navLabel}
          className="space-y-6"
          data-slot={SIDEBAR_SLOTS.nav}
        >
          {navGroups.map((group) => (
            <SidebarNavGroup group={group} key={group.id} />
          ))}
        </nav>
      ) : null}
      {footer == null ? null : (
        <div className="mt-auto" data-slot={SIDEBAR_SLOTS.footer}>
          {footer}
        </div>
      )}
    </aside>
  );
}
