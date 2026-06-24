import { z } from "zod";

import type { ApiResponseMeta } from "./api-envelope.contract";

export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

export const paginationQuerySchema = z.object({
  cursor: z.string().trim().min(1).optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const paginationMetaSchema = z.object({
  hasMore: z.boolean(),
  limit: z.number().int().positive(),
  nextCursor: z.string().nullable(),
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
