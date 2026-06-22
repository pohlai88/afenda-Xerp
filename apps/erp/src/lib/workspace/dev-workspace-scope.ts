import { DEV_DEFAULT_TENANT_SLUG } from "@/lib/context/context.constants";
import type { WorkspaceApiScope } from "./workspace-api-scope.contract";

/**
 * Slug-based dev workspace scope — must stay aligned with
 * `packages/database/src/seeds/workspace-fixtures.ts` (`DEV_WORKSPACE_FIXTURE`).
 */
export const DEV_WORKSPACE_API_SCOPE = {
  companySlug: "dev-company",
  organizationSlug: "dev-hq",
  tenantSlug: DEV_DEFAULT_TENANT_SLUG,
} satisfies WorkspaceApiScope;
