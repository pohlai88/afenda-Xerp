import type { ReactNode } from "react";
import { AppShellFrame } from "../../components/layout/appshell-frame";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { cn } from "../../lib/cn";
import type {
  NonReadyViewSurfaceState,
  PageSurfaceProps,
  ViewStateMessage,
  ViewSurfaceState,
} from "../../types/views";
import { PAGE_SURFACE_SLOTS } from "../../types/views";

export type { PageSurfaceProps } from "../../types/views";

const PAGE_SURFACE_MAIN_CLASS = "flex min-w-0 flex-col gap-4";
const DEFAULT_PAGE_MAIN_LABEL = "Page content";

const DEFAULT_PAGE_STATE_MESSAGES = {
  empty: {
    description: "No page content is available for this surface.",
    title: "No content",
  },
  error: {
    description: "The page content could not be rendered.",
    title: "Page unavailable",
  },
  loading: {
    description: "The page content is being prepared.",
    title: "Loading page",
  },
  unavailable: {
    description: "This page surface is not available in the current context.",
    title: "Surface unavailable",
  },
} satisfies Record<NonReadyViewSurfaceState, ViewStateMessage>;

export function pageSurfaceClassName({
  className,
}: Pick<PageSurfaceProps, "className"> = {}): string {
  return cn(PAGE_SURFACE_MAIN_CLASS, className);
}

function getPageStateMessage({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: PageSurfaceProps["stateMessages"];
}): ViewStateMessage {
  return stateMessages?.[state] ?? DEFAULT_PAGE_STATE_MESSAGES[state];
}

function PageSurfaceState({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: PageSurfaceProps["stateMessages"];
}) {
  const message = getPageStateMessage({ state, stateMessages });
  const isError = state === "error";

  return (
    <div data-slot={PAGE_SURFACE_SLOTS.state} data-state={state}>
      <Alert
        aria-busy={state === "loading" ? true : undefined}
        aria-live={isError ? "assertive" : "polite"}
        data-state={state}
        role={isError ? "alert" : "status"}
        variant={isError ? "destructive" : "default"}
      >
        <AlertTitle>{message.title}</AlertTitle>
        {message.description == null ? null : (
          <AlertDescription>{message.description}</AlertDescription>
        )}
        {message.action == null ? null : (
          <div className="mt-3" data-slot={PAGE_SURFACE_SLOTS.stateAction}>
            {message.action}
          </div>
        )}
      </Alert>
    </div>
  );
}

function renderPageSurfaceContent({
  children,
  state,
  stateMessages,
}: {
  readonly children: ReactNode;
  readonly state: ViewSurfaceState | undefined;
  readonly stateMessages: PageSurfaceProps["stateMessages"] | undefined;
}): ReactNode {
  const resolvedState = state ?? "ready";

  if (resolvedState === "ready") {
    return children;
  }

  return (
    <PageSurfaceState state={resolvedState} stateMessages={stateMessages} />
  );
}

export function PageSurface({
  children,
  className,
  description,
  mainLabel = DEFAULT_PAGE_MAIN_LABEL,
  sidebar,
  sidebarLabel,
  sidebarProps,
  state,
  stateMessages,
  title,
  toolbar,
  topbarProps,
  ...props
}: PageSurfaceProps) {
  const frameStructure = sidebar == null ? "single" : "sidebar";
  const mainAriaLabel =
    props["aria-label"] ??
    (props["aria-labelledby"] == null ? mainLabel : undefined);
  const sidebarAriaLabel = sidebarProps?.["aria-label"] ?? sidebarLabel;

  return (
    <div data-slot={PAGE_SURFACE_SLOTS.root}>
      <AppShellFrame structure={frameStructure}>
        {sidebar == null ? null : (
          <div data-slot={PAGE_SURFACE_SLOTS.sidebar}>
            <Sidebar {...sidebarProps} aria-label={sidebarAriaLabel}>
              {sidebar}
            </Sidebar>
          </div>
        )}
        <main
          {...props}
          aria-label={mainAriaLabel}
          className={pageSurfaceClassName({ className })}
          data-slot={PAGE_SURFACE_SLOTS.main}
        >
          <Topbar
            {...topbarProps}
            actions={
              toolbar == null ? null : (
                <div data-slot={PAGE_SURFACE_SLOTS.toolbar}>{toolbar}</div>
              )
            }
            description={
              description == null ? null : (
                <span data-slot={PAGE_SURFACE_SLOTS.description}>
                  {description}
                </span>
              )
            }
            heading={<h1 data-slot={PAGE_SURFACE_SLOTS.title}>{title}</h1>}
          />
          <div data-slot={PAGE_SURFACE_SLOTS.content}>
            {renderPageSurfaceContent({ children, state, stateMessages })}
          </div>
        </main>
      </AppShellFrame>
    </div>
  );
}
