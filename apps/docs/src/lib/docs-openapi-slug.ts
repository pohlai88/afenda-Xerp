const HTTP_METHODS = ["get", "post", "put", "delete", "patch"] as const;

export type OpenApiHttpMethod = (typeof HTTP_METHODS)[number];

export function isOpenApiHttpMethod(value: string): value is OpenApiHttpMethod {
  return (HTTP_METHODS as readonly string[]).includes(value);
}

/** Matches slug rules in generate-openapi-docs.mts for internal-v1 operation pages. */
export function openApiOperationDocSlug(
  openApiPath: string,
  method: string
): string {
  const slug = openApiPath
    .replace(/^\//, "")
    .replaceAll("/", "-")
    .replaceAll(/[^a-zA-Z0-9-]/g, "-")
    .replaceAll(/-+/g, "-")
    .toLowerCase();

  return `${slug}-${method.toLowerCase()}`;
}

export function openApiInternalV1DocHref(docSlug: string): string {
  return `/docs/integrate/internal-v1/${docSlug}`;
}
