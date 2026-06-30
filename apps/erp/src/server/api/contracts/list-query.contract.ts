import { z } from "zod";

import { ApiRouteError } from "../runtime/api-validation";
import {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  paginationQuerySchema,
} from "./pagination.contract";

const FILTER_PARAM_PATTERN = /^filter\[(.+)\]$/;

export const listQuerySearchSchema = paginationQuerySchema.extend({
  q: z.string().trim().min(1).optional().meta({
    description: "Case-insensitive keyword search across list-visible fields.",
    example: "widget",
  }),
});

export type ListQuerySearch = z.infer<typeof listQuerySearchSchema>;

export const listSortDirectionSchema = z.enum(["asc", "desc"]);

export type ListSortDirection = z.infer<typeof listSortDirectionSchema>;

export interface ListSortField {
  readonly direction: ListSortDirection;
  readonly field: string;
}

export interface ListQuery extends ListQuerySearch {
  readonly filter: Readonly<Record<string, string>>;
  readonly sort: readonly ListSortField[];
}

export interface ParseListQueryOptions<
  TFilterField extends string,
  TSortField extends string,
> {
  readonly allowedFilterFields: readonly TFilterField[];
  readonly allowedSortFields: readonly TSortField[];
}

function parseFilterParams(
  searchParams: URLSearchParams,
  allowedFilterFields: readonly string[]
): Record<string, string> {
  const allowed = new Set(allowedFilterFields);
  const filter: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    const match = FILTER_PARAM_PATTERN.exec(key);
    if (match === null) {
      continue;
    }

    const field = match[1];
    if (field === undefined || field.length === 0) {
      continue;
    }

    if (!allowed.has(field)) {
      throw new ApiRouteError(
        "validation_failed",
        `Filter field "${field}" is not allowed for this list operation.`,
        { field }
      );
    }

    filter[field] = value;
  }

  return filter;
}

function parseSortParam(
  rawSort: string | null,
  allowedSortFields: readonly string[]
): ListSortField[] {
  if (rawSort === null || rawSort.trim().length === 0) {
    return [];
  }

  const allowed = new Set(allowedSortFields);
  const sortFields: ListSortField[] = [];

  for (const token of rawSort.split(",")) {
    const trimmed = token.trim();
    if (trimmed.length === 0) {
      continue;
    }

    const descending = trimmed.startsWith("-");
    const field = descending ? trimmed.slice(1) : trimmed;

    if (field.length === 0 || !allowed.has(field)) {
      throw new ApiRouteError(
        "validation_failed",
        `Sort field "${field}" is not allowed for this list operation.`,
        { field }
      );
    }

    sortFields.push({
      direction: descending ? "desc" : "asc",
      field,
    });
  }

  return sortFields;
}

export function parseListQuery<
  TFilterField extends string,
  TSortField extends string,
>(
  searchParams: URLSearchParams,
  options: ParseListQueryOptions<TFilterField, TSortField>
): ListQuery {
  const search = listQuerySearchSchema.parse({
    cursor: searchParams.get("cursor") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  return {
    ...search,
    filter: parseFilterParams(searchParams, options.allowedFilterFields),
    sort: parseSortParam(searchParams.get("sort"), options.allowedSortFields),
  };
}

export function buildListQueryOpenApiParameters(input: {
  readonly allowedFilterFields: readonly string[];
  readonly allowedSortFields: readonly string[];
  readonly includePagination?: boolean;
}): Array<{
  readonly description: string;
  readonly in: "query";
  readonly name: string;
  readonly required: boolean;
  readonly schema: Record<string, unknown>;
}> {
  const qField = listQuerySearchSchema.shape.q;
  const parameters: Array<{
    description: string;
    in: "query";
    name: string;
    required: boolean;
    schema: Record<string, unknown>;
  }> = [
    {
      description:
        qField.meta()?.description ??
        "Case-insensitive keyword search across list-visible fields.",
      in: "query",
      name: "q",
      required: false,
      schema: { type: "string" },
    },
    {
      description: `Comma-separated sort fields. Prefix with "-" for descending. Allowed: ${input.allowedSortFields.join(", ")}.`,
      in: "query",
      name: "sort",
      required: false,
      schema: { type: "string", example: "-updatedAt,displayName" },
    },
  ];

  for (const field of input.allowedFilterFields) {
    parameters.push({
      description: `Filter by ${field}.`,
      in: "query",
      name: `filter[${field}]`,
      required: false,
      schema: { type: "string" },
    });
  }

  if (input.includePagination === true) {
    const cursorField = paginationQuerySchema.shape.cursor;
    const limitField = paginationQuerySchema.shape.limit;

    parameters.unshift(
      {
        description:
          limitField.meta()?.description ??
          `Maximum number of items to return (1-${MAX_PAGE_LIMIT}).`,
        in: "query",
        name: "limit",
        required: false,
        schema: {
          type: "integer",
          minimum: 1,
          maximum: MAX_PAGE_LIMIT,
          default: DEFAULT_PAGE_LIMIT,
        },
      },
      {
        description:
          cursorField.meta()?.description ??
          "Opaque cursor from the prior page meta.pagination.nextCursor.",
        in: "query",
        name: "cursor",
        required: false,
        schema: { type: "string" },
      }
    );
  }

  return parameters;
}
