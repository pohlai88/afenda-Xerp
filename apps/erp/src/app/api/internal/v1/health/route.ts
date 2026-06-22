import { healthGetContract } from "@/server/api/contracts/health.api-contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";

export const runtime = "nodejs";
export const dynamic = "auto";
export const revalidate = 30;

export const GET = createApiHandler({
  contract: healthGetContract,
  async handler() {
    return {
      service: "erp",
      status: "ok",
    } as const;
  },
});
