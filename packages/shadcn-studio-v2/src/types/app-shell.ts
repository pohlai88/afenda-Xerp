export interface AppShellNavItemWire {
  readonly href: string;
  readonly id: string;
  readonly isActive?: boolean;
  readonly label: string;
}

export interface AppShellNavGroupWire {
  readonly id: string;
  readonly items: readonly AppShellNavItemWire[];
  readonly label: string;
}

export interface AppShellOperatingContextWire {
  readonly legalEntityLabel: string;
  readonly tenantLabel: string;
  readonly workspaceLabel: string;
}
