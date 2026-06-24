/** Dev workspace fixture identifiers — never use real user emails. */
export const DEV_WORKSPACE_FIXTURE = {
  tenant: {
    slug: "dev-local",
    name: "Dev Local Workspace",
  },
  company: {
    slug: "dev-company",
    legalName: "Dev Company Pty Ltd",
    displayName: "Dev Company",
    countryCode: "AU",
    baseCurrency: "AUD",
    registrationNumber: "DEV-LOCAL-001",
  },
  organization: {
    slug: "dev-hq",
    name: "Dev HQ",
    type: "department" as const,
  },
  user: {
    email: "dev-admin@localhost.afenda",
    displayName: "Dev Workspace Admin",
  },
  viewer: {
    email: "dev-viewer@localhost.afenda",
    displayName: "Dev Workspace Viewer",
  },
} as const;

/** Preview workspace fixture identifiers — isolated from dev-local. */
export const PREVIEW_WORKSPACE_FIXTURE = {
  tenant: {
    slug: "preview",
    name: "Preview Workspace",
  },
  company: {
    slug: "preview-company",
    legalName: "Preview Company Pty Ltd",
    displayName: "Preview Company",
    countryCode: "AU",
    baseCurrency: "AUD",
    registrationNumber: "PREVIEW-001",
  },
  organization: {
    slug: "preview-hq",
    name: "Preview HQ",
    type: "department" as const,
  },
  user: {
    email: "preview-admin@localhost.afenda",
    displayName: "Preview Workspace Admin",
  },
  viewer: {
    email: "preview-viewer@localhost.afenda",
    displayName: "Preview Workspace Viewer",
  },
} as const;

/** Demo workspace fixture — blocked in production by seed safety rules. */
export const DEMO_WORKSPACE_FIXTURE = {
  tenant: {
    slug: "demo",
    name: "Demo Workspace",
  },
  company: {
    slug: "demo-company",
    legalName: "Demo Company Pty Ltd",
    displayName: "Demo Company",
    countryCode: "AU",
    baseCurrency: "AUD",
    registrationNumber: "DEMO-001",
  },
  organization: {
    slug: "demo-hq",
    name: "Demo HQ",
    type: "department" as const,
  },
  user: {
    email: "demo-admin@localhost.afenda",
    displayName: "Demo Workspace Admin",
  },
  viewer: {
    email: "demo-viewer@localhost.afenda",
    displayName: "Demo Workspace Viewer",
  },
} as const;

export type WorkspaceFixture =
  | typeof DEMO_WORKSPACE_FIXTURE
  | typeof DEV_WORKSPACE_FIXTURE
  | typeof PREVIEW_WORKSPACE_FIXTURE;
