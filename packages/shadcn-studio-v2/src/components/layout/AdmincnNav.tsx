// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import { cn } from "../../lib/cn";
import type {
  AppShellNavGroupWire,
  AppShellNavItemWire,
} from "../../types/app-shell";

export interface AdmincnNavProps {
  readonly groups: readonly AppShellNavGroupWire[];
}

function navItemClassName(item: AppShellNavItemWire): string {
  return cn(
    "block rounded-md px-3 py-2 text-sm transition-colors",
    item.isActive === true
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  );
}

function AdmincnNavItem({ item }: { readonly item: AppShellNavItemWire }) {
  return (
    <li>
      <a className={navItemClassName(item)} href={item.href}>
        {item.label}
      </a>
    </li>
  );
}

export function AdmincnNav({ groups }: AdmincnNavProps) {
  return (
    <nav aria-label="Primary navigation" className="space-y-6">
      {groups.map((group) => (
        <section className="space-y-3" key={group.id}>
          <h2 className="px-3 font-medium text-muted-foreground text-xs uppercase tracking-[0.24em]">
            {group.label}
          </h2>
          <ul className="space-y-1">
            {group.items.map((item) => (
              <AdmincnNavItem item={item} key={item.id} />
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
