import { openApiDocsGetContract } from "@/server/api/contracts/api-docs/api-spec.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { buildOpenApiDocsHtml } from "@/server/api/openapi/serve-openapi-document.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: openApiDocsGetContract,
  async handler() {
    return new Response(buildOpenApiDocsHtml("/api/internal/v1/openapi.json"), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
      },
      status: 200,
    });
  },
});
