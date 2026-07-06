import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const domainsRoot = "packages/kernel/src/erp-domain";

function listDomainDirs() {
  return readdirSync(domainsRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !["_internal", "__tests__", "catalog"].includes(entry.name)
    )
    .map((entry) => join(domainsRoot, entry.name));
}

function screamFromSlug(slug) {
  return slug.replace(/-/g, "_").toUpperCase();
}

for (const dir of listDomainDirs()) {
  const slug = basename(dir);
  const prefix = screamFromSlug(slug);
  const registryPath = join(
    dir,
    `${slug}-domain-vocabulary.registry.ts`
  );
  const testPath = join(
    dir,
    "__tests__",
    `${slug}-domain-vocabulary.contract.test.ts`
  );

  if (!exists(registryPath) || !exists(testPath)) {
    continue;
  }

  const registry = readFileSync(registryPath, "utf8");
  let test = readFileSync(testPath, "utf8");

  if (test.includes("assertDeliveredDomainVocabularyRegistry")) {
    continue;
  }

  const closedBlockMatch = registry.match(
    new RegExp(
      `export const ${prefix}_DOMAIN_CLOSED_VOCABULARIES = \\[([\\s\\S]*?)\\] as const`
    )
  );
  const closedEntries = [...(closedBlockMatch?.[1] ?? "").matchAll(/id: "([^"]+)"/g)].map(
    (m) => m[1]
  );
  const valueCounts = [...(closedBlockMatch?.[1] ?? "").matchAll(/valueCount: ([^,\n]+)/g)].map(
    (m) => m[1].trim()
  );
  const lengths = Object.fromEntries(
    closedEntries.map((id, index) => [id, valueCounts[index]])
  );
  const lengthEntries = Object.entries(lengths)
    .map(([id, count]) => `        "${id}": ${count},`)
    .join("\n");

  const excluded =
    slug === "procurement"
      ? `\n      excludedBrandedIdTypeNames: ["SupplierId", "ProductId"],`
      : slug === "ecommerce"
        ? `\n      excludedBrandedIdTypeNames: ["CustomerId", "ProductId"],`
        : "";

  const harnessBlock = `  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: ${prefix}_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: ${prefix}_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyConstantLengths: {
${lengthEntries}
      },
      brandedIdTypeNames: ${prefix}_DOMAIN_BRANDED_ID_TYPE_NAMES,${excluded}
      auditActionCount: ${prefix}_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: ${prefix}_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

`;

  if (!test.includes("domain-vocabulary-registry.harness.js")) {
    test = test.replace(
      /import \{ describe, expect, it \} from "vitest";\n\nimport \{/,
      'import { describe, expect, it } from "vitest";\n\nimport { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";\nimport {'
    );
  }

  test = test.replace(
    /describe\("PAS-001B [^"]+ domain vocabulary registry", \(\) => \{\n/,
    (match) => `${match}${harnessBlock}`
  );

  writeFileSync(testPath, test);
}

function exists(path) {
  try {
    readFileSync(path);
    return true;
  } catch {
    return false;
  }
}

console.log("harness tests added");
