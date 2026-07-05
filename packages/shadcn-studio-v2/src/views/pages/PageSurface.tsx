// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
import type { ComponentProps, ReactNode } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { cn } from "../../lib/cn";

export interface PageSurfaceProps extends ComponentProps<"div"> {
  readonly sidebar?: ReactNode;
  readonly title: string;
  readonly toolbar?: ReactNode;
}

const PAGE_SURFACE_MAIN_CLASS = "flex min-w-0 flex-col gap-4";

export function pageSurfaceClassName({
  className,
}: Pick<PageSurfaceProps, "className"> = {}): string {
  return cn(PAGE_SURFACE_MAIN_CLASS, className);
}

export function PageSurface({
  children,
  className,
  sidebar,
  title,
  toolbar,
  ...props
}: PageSurfaceProps) {
  return (
    <div data-slot="page-surface">
      <AppShell>
        {sidebar ? <Sidebar>{sidebar}</Sidebar> : null}
        <div
          {...props}
          className={pageSurfaceClassName({ className })}
          data-slot="page-surface-main"
        >
          <Topbar>
            <h1 className="font-semibold text-lg tracking-tight">{title}</h1>
            {toolbar ? (
              <div data-slot="page-surface-toolbar">{toolbar}</div>
            ) : null}
          </Topbar>
          <div data-slot="page-surface-content">{children}</div>
        </div>
      </AppShell>
    </div>
  );
}
