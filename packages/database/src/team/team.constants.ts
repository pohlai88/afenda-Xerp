/**
 * Teams are persisted as organization units until TIP-030 delivers a dedicated table.
 *
 * @see packages/kernel/src/context/team-context.contract.ts
 */
export const TEAM_ORGANIZATION_UNIT_TYPE = "team" as const;

export type TeamOrganizationUnitType = typeof TEAM_ORGANIZATION_UNIT_TYPE;
