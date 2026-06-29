import {
  type CompanyMemberListRow,
  listCompanyMembers,
} from "@afenda/database";

export async function listCompanyMembersForScope(input: {
  readonly companyId: string;
  readonly tenantId: string;
}): Promise<readonly CompanyMemberListRow[]> {
  return listCompanyMembers(input);
}
