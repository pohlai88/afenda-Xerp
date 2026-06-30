import { serviceActorPingGetContract } from "@/server/api/contracts/auth/service-actor-ping.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: serviceActorPingGetContract,
  async handler() {
    return { status: "ok" as const };
  },
});
