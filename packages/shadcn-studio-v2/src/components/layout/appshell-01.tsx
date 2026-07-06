import { cn } from "../../lib/cn";
import type { AppShell01Props } from "../../types/layout";
import { APP_SHELL_01_SLOTS } from "../../types/layout";
import { IconMark } from "../assets/icon-mark";
import { AppShellFrame } from "./appshell-frame";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

const DEFAULT_BRAND_LABEL = "Afenda ERP";
const DEFAULT_MAIN_LABEL = "Workspace content";
const DEFAULT_NAV_LABEL = "Primary navigation";

const APP_SHELL_01_CONTENT_CLASS = "flex min-w-0 flex-1 flex-col gap-6";
const APP_SHELL_01_MAIN_CLASS = "flex min-h-0 min-w-0 flex-1 flex-col gap-6";

interface DefaultBrandProps {
  readonly brandLabel: string;
  readonly workspaceLabel: string;
}

interface DefaultFooterProps {
  readonly legalEntityLabel: string;
  readonly tenantLabel: string;
}

function DefaultBrand({ brandLabel, workspaceLabel }: DefaultBrandProps) {
  return (
    <>
      <div
        className="flex size-10 items-center justify-center rounded-md border border-border bg-background"
        data-slot={APP_SHELL_01_SLOTS.brandMark}
      >
        <IconMark className="size-6" label={`${brandLabel} mark`} />
      </div>
      <div className="min-w-0" data-slot={APP_SHELL_01_SLOTS.brandText}>
        <p className="truncate font-semibold text-sm">{brandLabel}</p>
        <p className="truncate text-muted-foreground text-xs">
          {workspaceLabel}
        </p>
      </div>
    </>
  );
}

function DefaultFooter({ legalEntityLabel, tenantLabel }: DefaultFooterProps) {
  return (
    <div className="rounded-md border border-border bg-muted/40 p-3">
      <p className="font-medium text-sm">{tenantLabel}</p>
      <p className="text-muted-foreground text-xs">{legalEntityLabel}</p>
    </div>
  );
}

export function AppShell01({
  brand,
  brandLabel = DEFAULT_BRAND_LABEL,
  children,
  frameDensity = "comfortable",
  mainLabel = DEFAULT_MAIN_LABEL,
  mainProps,
  navGroups,
  navLabel = DEFAULT_NAV_LABEL,
  operatingContext,
  sidebarFooter,
  topbarActions,
  topbarContent,
  topbarControls,
  topbarDescription,
  topbarHeading,
}: AppShell01Props) {
  const brandContent =
    brand === undefined ? (
      <DefaultBrand
        brandLabel={brandLabel}
        workspaceLabel={operatingContext.workspaceLabel}
      />
    ) : (
      brand
    );
  const footerContent =
    sidebarFooter === undefined ? (
      <DefaultFooter
        legalEntityLabel={operatingContext.legalEntityLabel}
        tenantLabel={operatingContext.tenantLabel}
      />
    ) : (
      sidebarFooter
    );
  const mainAriaLabel =
    mainProps?.["aria-label"] ??
    (mainProps?.["aria-labelledby"] == null ? mainLabel : undefined);

  return (
    <AppShellFrame density={frameDensity} structure="sidebar">
      <Sidebar
        className="gap-6"
        footer={
          footerContent == null ? null : (
            <div data-slot={APP_SHELL_01_SLOTS.footer}>{footerContent}</div>
          )
        }
        groups={navGroups}
        navLabel={navLabel}
      >
        {brandContent == null ? null : (
          <div
            className="flex items-center gap-3 border-border border-b pb-4"
            data-slot={APP_SHELL_01_SLOTS.brand}
          >
            {brandContent}
          </div>
        )}
      </Sidebar>
      <div
        className={APP_SHELL_01_CONTENT_CLASS}
        data-slot={APP_SHELL_01_SLOTS.content}
      >
        <Topbar
          actions={topbarActions}
          content={topbarContent}
          controls={topbarControls}
          description={topbarDescription ?? operatingContext.tenantLabel}
          heading={topbarHeading ?? operatingContext.workspaceLabel}
        />
        <main
          {...mainProps}
          aria-label={mainAriaLabel}
          className={cn(APP_SHELL_01_MAIN_CLASS, mainProps?.className)}
          data-slot={APP_SHELL_01_SLOTS.main}
        >
          {children}
        </main>
      </div>
    </AppShellFrame>
  );
}
