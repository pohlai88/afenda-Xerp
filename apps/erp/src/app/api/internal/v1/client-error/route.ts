import { clientErrorPostContract } from "@/server/api/contracts/observability/client-error.contract";
import { createApiHandlerLogger } from "@/server/api/runtime/api-handler-logging";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createApiHandler({
  contract: clientErrorPostContract,
  async handler(context) {
    const logger = createApiHandlerLogger(context.correlationId);

    logger.warn("client.error.reported", {
      digest: context.requestBody.digest,
      requestId: context.requestId,
      segment: context.requestBody.segment,
    });

    return { accepted: true as const };
  },
});
