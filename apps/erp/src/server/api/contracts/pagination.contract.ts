import { z } from "zod";

import type { ApiResponseMeta } from "./api-envelope.contract";

export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

export const paginationQuerySchema = z.object({
  cursor: z.string().trim().min(1).optional().meta({
    description:
      "Opaque cursor from the prior page meta.pagination.nextCursor.",
    example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
  }),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT)
    .meta({
      description: `Maximum number of items to return (1-${MAX_PAGE_LIMIT}).`,
      example: DEFAULT_PAGE_LIMIT,
    }),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const paginationMetaSchema = z.object({
  hasMore: z.boolean().meta({
    description: "Whether additional items exist beyond this page.",
    example: true,
  }),
  limit: z.number().int().positive().meta({
    description: "Applied page size for this response.",
    example: DEFAULT_PAGE_LIMIT,
  }),
  nextCursor: z.string().nullable().meta({
    description:
      "Opaque cursor for the next page, or null when hasMore is false.",
    example: "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
  }),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export type ApiResponseMetaWithPagination = ApiResponseMeta & {
  readonly pagination: PaginationMeta;
};

export function parsePaginationQuery(
  searchParams: URLSearchParams
): PaginationQuery {
  return paginationQuerySchema.parse({
    cursor: searchParams.get("cursor") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });
}

export function buildPaginationMeta(input: {
  readonly hasMore: boolean;
  readonly limit: number;
  readonly nextCursor: string | null;
}): PaginationMeta {
  return paginationMetaSchema.parse(input);
}

export function mergePaginationIntoMeta(
  meta: ApiResponseMeta,
  pagination: PaginationMeta
): ApiResponseMetaWithPagination {
  return {
    ...meta,
    pagination,
  };
}
