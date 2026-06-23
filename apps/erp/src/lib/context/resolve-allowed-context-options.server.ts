import {
  type AfendaDatabase,
  findCompanyById,
  findOrganizationById,
  getDb,
  withRlsSessionContext,
} from "@afenda/database";
import type { ApplicationShellAllowedContextOptions } from "@afenda/kernel";
import {
  createProductionAuthorizationDataSources,
  isMembershipActive,
  type MembershipContract,
} from "@afenda/permissions";

import { buildAllowedContextSwitchTargets } from "./build-allowed-context-switch-targets";

async function loadActorMemberships(input: {
  readonly actorUserId: string;
  readonly db: AfendaDatabase;
  readonly tenantId: string;
}): Promise<readonly MembershipContract[]> {
  return withRlsSessionContext(
    input.db,
    {
      tenantId: input.tenantId,
      platformUserId: input.actorUserId,
    },
    async (tx) => {
      const { permission } = createProductionAuthorizationDataSources(tx);
      return permission.findMembershipsForActor({
        actorId: input.actorUserId,
        tenantId: input.tenantId,
      });
    }
  );
}

function collectMembershipScopeIds(
  memberships: readonly MembershipContract[]
): {
  readonly companyIds: ReadonlySet<string>;
  readonly organizationIds: ReadonlySet<string>;
} {
  const companyIds = new Set<string>();
  const organizationIds = new Set<string>();

  for (const membership of memberships) {
    if (!isMembershipActive(membership)) {
      continue;
    }

    if (membership.scopeType === "tenant") {
      continue;
    }

    if (membership.companyId) {
      companyIds.add(membership.companyId);
    }

    if (membership.scopeType === "organization" && membership.organizationId) {
      organizationIds.add(membership.organizationId);
    }
  }

  return { companyIds, organizationIds };
}

export async function resolveAllowedContextOptions(input: {
  readonly actorUserId: string;
  readonly db?: AfendaDatabase;
  readonly memberships?: readonly MembershipContract[];
  readonly selectedCompanySlug: string;
  readonly selectedOrganizationSlug: string | null;
  readonly tenantId: string;
}): Promise<ApplicationShellAllowedContextOptions> {
  const db = input.db ?? getDb();
  const memberships =
    input.memberships ??
    (await loadActorMemberships({
      actorUserId: input.actorUserId,
      db,
      tenantId: input.tenantId,
    }));

  const { companyIds, organizationIds } =
    collectMembershipScopeIds(memberships);

  const companyRows = await Promise.all(
    [...companyIds].map((companyId) => findCompanyById(companyId, db))
  );
  const organizationRows = await Promise.all(
    [...organizationIds].map((organizationId) =>
      findOrganizationById(organizationId, db)
    )
  );

  const companies = companyRows
    .filter(
      (company): company is NonNullable<typeof company> =>
        company !== null && company.tenantId === input.tenantId
    )
    .map((company) => ({
      slug: company.slug,
      label: company.displayName,
      status: company.status,
    }));

  const companySlugById = new Map(
    companyRows
      .filter(
        (company): company is NonNullable<typeof company> => company !== null
      )
      .map((company) => [company.id, company.slug] as const)
  );

  const organizations = organizationRows
    .filter(
      (organization): organization is NonNullable<typeof organization> =>
        organization !== null &&
        organization.tenantId === input.tenantId &&
        companySlugById.has(organization.companyId)
    )
    .map((organization) => ({
      companySlug: companySlugById.get(organization.companyId) ?? "",
      slug: organization.slug,
      label: organization.name,
      status: organization.status,
    }))
    .filter((organization) => organization.companySlug.length > 0);

  return {
    targets: buildAllowedContextSwitchTargets({
      companies,
      organizations,
      selectedCompanySlug: input.selectedCompanySlug,
      selectedOrganizationSlug: input.selectedOrganizationSlug,
    }),
  };
}
