# API Contract — Canonical Shapes

Copy these into `apps/erp/src/lib/api.ts` to establish the shared contract for all route handlers.

## TypeScript types

```ts
// apps/erp/src/lib/api.ts

export interface PaginationMeta {
  total:   number;
  page:    number;
  perPage: number;
  pages:   number;
}

export interface ApiSuccess<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  code:     string;
  message:  string;
  path?:    string[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Type guard
export function isApiError(res: ApiResponse<unknown>): res is ApiError {
  return "code" in res && "message" in res;
}
```

## Zod schemas (for response validation)

```ts
import { z } from "zod";

export const PaginationMetaSchema = z.object({
  total:   z.number().int().nonnegative(),
  page:    z.number().int().positive(),
  perPage: z.number().int().positive(),
  pages:   z.number().int().nonnegative(),
});

export function apiSuccessSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    meta: PaginationMetaSchema.optional(),
  });
}

export const ApiErrorSchema = z.object({
  code:    z.string(),
  message: z.string(),
  path:    z.array(z.string()).optional(),
});
```

## HTTP status map

```ts
// apps/erp/src/lib/api.ts (add to the file above)

export const ERROR_HTTP_STATUS = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED:     401,
  FORBIDDEN:        403,
  NOT_FOUND:        404,
  CONFLICT:         409,
  INTERNAL_ERROR:   500,
} as const satisfies Record<string, number>;

export type ApiErrorCode = keyof typeof ERROR_HTTP_STATUS;
```

## Response helpers

```ts
// apps/erp/src/lib/api.ts

import { NextResponse } from "next/server";

export function apiOk<T>(data: T, status: 200 | 201 = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ data }, { status });
}

export function apiCreated<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ data }, { status: 201 });
}

export function apiNoContent(): NextResponse<never> {
  return new NextResponse(null, { status: 204 }) as NextResponse<never>;
}

export function apiError(
  code: ApiErrorCode,
  message?: string,
  path?: string[]
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      code,
      message: message ?? defaultMessage(code),
      ...(path ? { path } : {}),
    },
    { status: ERROR_HTTP_STATUS[code] }
  );
}

function defaultMessage(code: ApiErrorCode): string {
  const messages: Record<ApiErrorCode, string> = {
    VALIDATION_ERROR: "Invalid request.",
    UNAUTHORIZED:     "Sign in to continue.",
    FORBIDDEN:        "You do not have permission to perform this action.",
    NOT_FOUND:        "The requested resource was not found.",
    CONFLICT:         "A conflict occurred. Please try again.",
    INTERNAL_ERROR:   "Something went wrong. Please try again.",
  };
  return messages[code];
}
```

## Usage in a route handler (with helpers)

```ts
import { apiOk, apiError, apiCreated } from "@/lib/api";

// GET — success
return apiOk({ id: post.id, title: post.title });

// POST — created
return apiCreated({ id: newPost.id });

// Error
return apiError("NOT_FOUND", "Post not found.");
return apiError("VALIDATION_ERROR", "Invalid input.", ["title", "content"]);
```

## Client-side fetch helper

```ts
// apps/erp/src/lib/api-client.ts

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    // Ensure the error shape is valid even if server sends unexpected body
    return ApiErrorSchema.parse(json) as ApiError;
  }

  return json as ApiSuccess<T>;
}
```
