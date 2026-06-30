import { z } from "zod";

export const openApiDocumentResponseSchema = z
  .record(z.string(), z.unknown())
  .meta({
    id: "OpenApiDocument",
    description:
      "Generated OpenAPI 3.1 document for Afenda internal v1 routes.",
  });

export type OpenApiDocumentResponseDto = z.infer<
  typeof openApiDocumentResponseSchema
>;

export const openApiDocsResponseSchema = z
  .object({
    html: z.string().meta({
      description:
        "Scalar API reference HTML for the internal v1 OpenAPI document.",
    }),
  })
  .meta({
    id: "OpenApiDocsResponse",
    description: "HTML API reference shell for internal OpenAPI exploration.",
  });

export type OpenApiDocsResponseDto = z.infer<typeof openApiDocsResponseSchema>;
