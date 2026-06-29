import {
  AFENDA_COMPANY_ID_HEADER,
  AFENDA_COMPANY_SLUG_HEADER,
  AFENDA_ORGANIZATION_ID_HEADER,
  AFENDA_ORGANIZATION_SLUG_HEADER,
  AFENDA_TENANT_ID_HEADER,
  AFENDA_WORKSPACE_ID_HEADER,
} from "../../../../lib/api/api-route-context";
import { TENANT_SLUG_HEADER } from "../../../../lib/context/context.constants";

import type { ApiContextPolicy } from "../context-policy.contract";

export interface ContextPolicyHeaderParameter {
  readonly description: string;
  readonly in: "header";
  readonly name: string;
  readonly required: boolean;
}

const tenantSlugHeader = {
  description:
    "Tenant slug injected by ERP proxy after hostname or path resolution.",
  in: "header" as const,
  name: TENANT_SLUG_HEADER,
  required: true,
};

const tenantIdHeader = {
  description: "Resolved tenant identifier for scoped API calls.",
  in: "header" as const,
  name: AFENDA_TENANT_ID_HEADER,
  required: false,
};

const companyHeaders: readonly ContextPolicyHeaderParameter[] = [
  {
    description: "Selected company identifier.",
    in: "header",
    name: AFENDA_COMPANY_ID_HEADER,
    required: false,
  },
  {
    description: "Selected company slug.",
    in: "header",
    name: AFENDA_COMPANY_SLUG_HEADER,
    required: false,
  },
];

const organizationHeaders: readonly ContextPolicyHeaderParameter[] = [
  {
    description: "Selected organization identifier.",
    in: "header",
    name: AFENDA_ORGANIZATION_ID_HEADER,
    required: false,
  },
  {
    description: "Selected organization slug.",
    in: "header",
    name: AFENDA_ORGANIZATION_SLUG_HEADER,
    required: false,
  },
];

const workspaceHeader: ContextPolicyHeaderParameter = {
  description: "Active workspace identifier when applicable.",
  in: "header",
  name: AFENDA_WORKSPACE_ID_HEADER,
  required: false,
};

/** Progressive context header sets aligned with operating-context resolution. */
const CONTEXT_POLICY_HEADERS = {
  none: [],
  "tenant-required": [tenantSlugHeader],
  "tenant-company-required": [tenantSlugHeader, ...companyHeaders],
  "tenant-company-org-required": [
    tenantSlugHeader,
    ...companyHeaders,
    ...organizationHeaders,
  ],
  "tenant-company-org-team-required": [
    tenantSlugHeader,
    ...companyHeaders,
    ...organizationHeaders,
    workspaceHeader,
  ],
  "tenant-company-org-team-project-required": [
    tenantSlugHeader,
    ...companyHeaders,
    ...organizationHeaders,
    workspaceHeader,
  ],
  "consolidation-scope-required": [
    tenantSlugHeader,
    tenantIdHeader,
    ...companyHeaders,
    ...organizationHeaders,
  ],
} as const satisfies Record<
  ApiContextPolicy,
  readonly ContextPolicyHeaderParameter[]
>;

export function resolveContextPolicyHeaders(
  contextPolicy: ApiContextPolicy
): readonly ContextPolicyHeaderParameter[] {
  return CONTEXT_POLICY_HEADERS[contextPolicy];
}
