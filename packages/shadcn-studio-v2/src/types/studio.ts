export interface StudioPackageConfig {
  readonly defaultExportSurface: "neutral";
  readonly packageName: "@afenda/shadcn-studio-v2";
  readonly runtimeBoundary: "client-runtime";
  readonly taxonomyVersion: "v2";
}

export interface AppShellNavItemWire {
  readonly href: string;
  readonly isActive?: boolean;
  readonly label: string;
}

export interface AppShellNavGroupWire {
  readonly items: readonly AppShellNavItemWire[];
  readonly label: string;
}

export interface AppShellOperatingContextWire {
  readonly legalEntityLabel: string;
  readonly tenantLabel: string;
  readonly workspaceLabel: string;
}
