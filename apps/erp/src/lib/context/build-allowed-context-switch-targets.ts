import type { ApplicationShellContextSwitchTarget } from "@afenda/appshell";

export interface AllowedContextCompanyRow {
  readonly label: string;
  readonly slug: string;
  readonly status: "active" | "archived" | "suspended";
}

export interface AllowedContextOrganizationRow {
  readonly companySlug: string;
  readonly label: string;
  readonly slug: string;
  readonly status: "active" | "archived" | "suspended";
}

export function buildAllowedContextSwitchTargets(input: {
  readonly companies: readonly AllowedContextCompanyRow[];
  readonly organizations: readonly AllowedContextOrganizationRow[];
  readonly selectedCompanySlug: string;
  readonly selectedOrganizationSlug: string | null;
}): readonly ApplicationShellContextSwitchTarget[] {
  const activeCompanies = input.companies.filter(
    (company) => company.status === "active"
  );
  const activeOrganizations = input.organizations.filter(
    (organization) => organization.status === "active"
  );

  const organizationsByCompanySlug = new Map<
    string,
    AllowedContextOrganizationRow[]
  >();

  for (const organization of activeOrganizations) {
    const existing =
      organizationsByCompanySlug.get(organization.companySlug) ?? [];
    organizationsByCompanySlug.set(organization.companySlug, [
      ...existing,
      organization,
    ]);
  }

  const targets: ApplicationShellContextSwitchTarget[] = [];

  for (const company of [...activeCompanies].sort((left, right) =>
    left.label.localeCompare(right.label)
  )) {
    const companyOrganizations = [
      ...(organizationsByCompanySlug.get(company.slug) ?? []),
    ].sort((left, right) => left.label.localeCompare(right.label));

    if (companyOrganizations.length > 0) {
      for (const organization of companyOrganizations) {
        targets.push({
          companySlug: company.slug,
          organizationSlug: organization.slug,
          label: `${company.label} · ${organization.label}`,
          isSelected:
            company.slug === input.selectedCompanySlug &&
            organization.slug === input.selectedOrganizationSlug,
        });
      }
      continue;
    }

    targets.push({
      companySlug: company.slug,
      label: company.label,
      isSelected:
        company.slug === input.selectedCompanySlug &&
        input.selectedOrganizationSlug === null,
    });
  }

  return targets;
}
