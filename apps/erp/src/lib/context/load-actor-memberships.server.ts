import {
  type AfendaDatabase,
  getDb,
  withRlsSessionContext,
} from "@afenda/database";
import {
  createProductionAuthorizationDataSources,
  type MembershipContract,
} from "@afenda/permissions";

export async function loadActorMemberships(input: {
  readonly actorUserId: string;
  readonly db?: AfendaDatabase;
  readonly tenantId: string;
}): Promise<readonly MembershipContract[]> {
  const db = input.db ?? getDb();

  return withRlsSessionContext(
    db,
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
