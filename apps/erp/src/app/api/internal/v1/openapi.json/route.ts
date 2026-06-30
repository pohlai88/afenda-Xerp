import { openApiJsonGetContract } from "@/server/api/contracts/api-docs/api-spec.contract";
import { buildOpenApiJsonResponse } from "@/server/api/openapi/serve-openapi-document.server";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: openApiJsonGetContract,
  async handler() {
    return buildOpenApiJsonResponse();
  },
});
