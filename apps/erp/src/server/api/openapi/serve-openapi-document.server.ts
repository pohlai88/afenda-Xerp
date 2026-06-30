import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import { buildAfendaOpenapiDocument } from "@/server/api/contracts/openapi/build-afenda-openapi-document";

export function loadAfendaInternalOpenApiDocument(): Record<string, unknown> {
  return buildAfendaOpenapiDocument(API_CONTRACTS) as unknown as Record<
    string,
    unknown
  >;
}

export function buildOpenApiJsonResponse(): Response {
  return Response.json(loadAfendaInternalOpenApiDocument(), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

export function buildOpenApiDocsHtml(specUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Afenda Internal API</title>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="${specUrl}"
      src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"
    ></script>
  </body>
</html>`;
}
