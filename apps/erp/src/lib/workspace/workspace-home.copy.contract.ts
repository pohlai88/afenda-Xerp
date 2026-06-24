export const WORKSPACE_HOME_PAGE_TITLE_ID =
  "workspace-home-page-title" as const;

export interface WorkspaceHomeCopyContract {
  readonly dashboard: {
    readonly errorAlertTitle: string;
    readonly loadingScreenReader: string;
    readonly status: {
      readonly default: string;
      readonly fallbackUnauthenticated: string;
      readonly loading: string;
      readonly savedPrefix: string;
    };
  };
  readonly page: {
    readonly contentLabel: string;
    readonly description: string;
    readonly title: string;
  };
}

export const WORKSPACE_HOME_COPY = {
  page: {
    title: "Workspace home",
    description: "Overview widgets filtered by your workspace permissions.",
    contentLabel: "Workspace dashboard",
  },
  dashboard: {
    loadingScreenReader: "Loading dashboard…",
    errorAlertTitle: "Dashboard layout error",
    status: {
      loading: "Loading dashboard layout…",
      default: "Using default layout.",
      fallbackUnauthenticated:
        "Using default layout (sign in to load or save workspace layout).",
      savedPrefix: "Saved at",
    },
  },
} as const satisfies WorkspaceHomeCopyContract;
