import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = join(fileURLToPath(import.meta.url), "../..");
const contentDir = join(appDir, "content/docs");
const outputDir = join(contentDir, "en/(guides)/api-reference");
const openApiSpecPath = join(appDir, "openapi/afenda-internal-v1.openapi.json");

/** Must match `createOpenAPI({ input: [...] })` in openapi.server.ts */
const OPENAPI_DOCUMENT_ID = "./openapi/afenda-internal-v1.openapi.json";

interface OpenApiOperation {
  readonly operationId?: string;
  readonly summary?: string;
  readonly tags?: readonly string[];
}

interface OpenApiPathItem {
  readonly delete?: OpenApiOperation;
  readonly get?: OpenApiOperation;
  readonly post?: OpenApiOperation;
  readonly put?: OpenApiOperation;
}

interface OpenApiDocument {
  readonly paths?: Record<string, OpenApiPathItem>;
}

const HTTP_METHODS = ["get", "post", "put", "delete"] as const;

function slugify(value: string): string {
  return value
    .replace(/^\//, "")
    .replaceAll("/", "-")
    .replaceAll(/[^a-zA-Z0-9-]/g, "-")
    .replaceAll(/-+/g, "-")
    .toLowerCase();
}

function operationFileName(
  openApiPath: string,
  method: (typeof HTTP_METHODS)[number]
): string {
  return `${slugify(openApiPath)}-${method}.mdx`;
}

function buildOperationMdx(input: {
  readonly method: (typeof HTTP_METHODS)[number];
  readonly openApiPath: string;
  readonly operation: OpenApiOperation;
}): string {
  const title =
    input.operation.summary ??
    input.operation.operationId ??
    `${input.method.toUpperCase()} ${input.openApiPath}`;

  const operationsJson = JSON.stringify([
    { path: input.openApiPath, method: input.method },
  ]);

  return `---
title: ${JSON.stringify(title)}
full: true
_openapi:
  preload:
    - ${JSON.stringify(OPENAPI_DOCUMENT_ID)}
  method: ${input.method.toUpperCase()}
---

export default function Layout(props) {
  const { APIPage, OpenAPIPage } = props.components ?? {};
  const Comp = OpenAPIPage ?? APIPage;
  return (
    <>
      {props.children}
      <Comp document=${JSON.stringify(OPENAPI_DOCUMENT_ID)} operations={${operationsJson}} />
    </>
  );
}
`;
}

function buildIndexMdx(
  cards: readonly { readonly description: string; readonly href: string; readonly title: string }[]
): string {
  const cardLines = cards
    .map(
      (card) =>
        `  <Card title=${JSON.stringify(card.title)} href=${JSON.stringify(card.href)} description=${JSON.stringify(card.description)} />`
    )
    .join("\n");

  return `---
title: Internal API Reference
description: Governed Afenda ERP internal REST API under /api/internal/v1.
full: true
---

# Internal API Reference

Registry-driven OpenAPI 3.1 catalog for governed \`/api/internal/v1/**\` routes. Generated from \`API_CONTRACTS\` — do not edit operation pages by hand.

<Cards>
${cardLines}
</Cards>
`;
}

const spec = JSON.parse(readFileSync(openApiSpecPath, "utf8")) as OpenApiDocument;
const paths = spec.paths ?? {};

mkdirSync(outputDir, { recursive: true });

const cards: { description: string; href: string; title: string }[] = [];

for (const [openApiPath, pathItem] of Object.entries(paths)) {
  for (const method of HTTP_METHODS) {
    const operation = pathItem[method];
    if (operation === undefined) {
      continue;
    }

    const fileName = operationFileName(openApiPath, method);
    const filePath = join(outputDir, fileName);
    writeFileSync(filePath, buildOperationMdx({ openApiPath, method, operation }), "utf8");
    console.log(`Generated: ${filePath}`);

    cards.push({
      title: operation.summary ?? operation.operationId ?? fileName,
      description: `${method.toUpperCase()} ${openApiPath}`,
      href: `./${fileName.replace(/\.mdx$/, "")}`,
    });
  }
}

cards.sort((left, right) => left.title.localeCompare(right.title));

writeFileSync(join(outputDir, "index.mdx"), buildIndexMdx(cards), "utf8");
const operationSlugs = cards
  .map((card) => card.href.replace(/^\.\//, ""))
  .sort((left, right) => left.localeCompare(right));

writeFileSync(
  join(outputDir, "meta.json"),
  `${JSON.stringify({ title: "Internal API Reference", pages: ["index", ...operationSlugs] }, null, 2)}\n`,
  "utf8"
);

console.log(`Generated ${cards.length} operation pages under ${outputDir}`);
