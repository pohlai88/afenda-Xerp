import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const snapshotPath = join(
  repoRoot,
  "apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json"
);

type OpenApiDocument = {
  readonly tags?: ReadonlyArray<{ readonly name: string }>;
  readonly paths?: Record<
    string,
    Record<string, { readonly operationId?: string; readonly tags?: string[] }>
  >;
};

const HTTP_METHODS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace",
]);

function collectStructuralViolations(document: OpenApiDocument): string[] {
  const violations: string[] = [];
  const declaredTags = new Set(
    (document.tags ?? []).map((tag) => tag.name)
  );
  const operationIds = new Map<string, string>();

  for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method)) {
        continue;
      }

      const operationId = operation.operationId;
      if (typeof operationId !== "string" || operationId.length === 0) {
        violations.push(`${method.toUpperCase()} ${path}: missing operationId`);
        continue;
      }

      const priorPath = operationIds.get(operationId);
      if (priorPath !== undefined) {
        violations.push(
          `Duplicate operationId "${operationId}" on ${priorPath} and ${method.toUpperCase()} ${path}`
        );
      } else {
        operationIds.set(operationId, `${method.toUpperCase()} ${path}`);
      }

      for (const tag of operation.tags ?? []) {
        if (!declaredTags.has(tag)) {
          violations.push(
            `${method.toUpperCase()} ${path} (${operationId}): undeclared tag "${tag}"`
          );
        }
      }
    }
  }

  return violations;
}

function main(): void {
  const document = JSON.parse(
    readFileSync(snapshotPath, "utf8")
  ) as OpenApiDocument;
  const violations = collectStructuralViolations(document);

  if (violations.length > 0) {
    console.error("OpenAPI structural lint failed:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log("OpenAPI structural lint passed.");
}

main();
