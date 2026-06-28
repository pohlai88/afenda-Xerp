import type {
  OwnershipContract,
  PackageOwnership,
} from "../contracts/ownership.contract.js";
import { createReadonlyLookupMap } from "./create-readonly-lookup-map.js";

const OWNERSHIP_ROWS = [
  {
    packageName: "@afenda/appshell",
    ownerDomain: "ERP Spine Authority",
    authorityLevel: "erp-spine",
  },
  {
    packageName: "@afenda/auth",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/database",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/design-system",
    ownerDomain: "Design Authority",
    authorityLevel: "design",
  },
  {
    packageName: "@afenda/css-authority",
    ownerDomain: "CSS Authority",
    authorityLevel: "design",
  },
  {
    packageName: "@afenda/docs",
    ownerDomain: "Application Authority",
    authorityLevel: "application",
  },
  {
    packageName: "@afenda/entitlements",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/erp",
    ownerDomain: "Application Authority",
    authorityLevel: "application",
  },
  {
    packageName: "@afenda/storybook",
    ownerDomain: "Application Authority",
    authorityLevel: "application",
  },
  {
    packageName: "@afenda/email",
    ownerDomain: "Application Authority",
    authorityLevel: "application",
  },
  {
    packageName: "@afenda/execution",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/feature-flags",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/kernel",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/ui-composition",
    ownerDomain: "Metadata Authority",
    authorityLevel: "metadata",
  },
  {
    packageName: "@afenda/metadata-ui",
    ownerDomain: "Metadata Authority",
    authorityLevel: "metadata",
  },
  {
    packageName: "@afenda/observability",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/permissions",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/storage",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/testing",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/typescript-config",
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/ui",
    ownerDomain: "Design Authority",
    authorityLevel: "design",
  },
  {
    packageName: "@afenda/architecture-authority",
    ownerDomain: "Architecture Authority",
    authorityLevel: "architecture",
  },
  {
    packageName: "@afenda/ai-governance",
    ownerDomain: "Architecture Authority",
    authorityLevel: "architecture",
  },
  {
    packageName: "@afenda/accounting-standards",
    ownerDomain: "Financial Reporting Standards Authority",
    authorityLevel: "platform",
  },
  {
    packageName: "@afenda/enterprise-knowledge",
    ownerDomain: "Enterprise Knowledge Authority",
    authorityLevel: "platform",
  },
] as const satisfies readonly PackageOwnership[];

function auditApprover(authorityLevel: string): string {
  if (authorityLevel === "architecture") {
    return "Architecture";
  }
  if (authorityLevel === "erp-spine") {
    return "ERP Spine";
  }
  if (authorityLevel === "metadata") {
    return "Metadata";
  }
  if (authorityLevel === "design") {
    return "Design";
  }
  if (authorityLevel === "application") {
    return "Application";
  }
  if (authorityLevel === "domain") {
    return "Domain";
  }
  return "Platform";
}

export const ownershipContract: OwnershipContract = {
  packages: [...OWNERSHIP_ROWS],
  auditRows: OWNERSHIP_ROWS.map((row) => {
    const approver = auditApprover(row.authorityLevel);
    return {
      packageName: row.packageName,
      apiApprover: approver,
      dependencyApprover: approver,
      deprecationApprover: approver,
      exceptionApprover: "Architecture",
    };
  }),
};

export const ownershipByPackage: ReadonlyMap<string, PackageOwnership> =
  createReadonlyLookupMap(
    ownershipContract.packages.map(
      (entry) => [entry.packageName, entry] as const
    )
  );
