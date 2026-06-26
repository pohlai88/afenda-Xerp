import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { EnvCatalog } from "../../apps/docs/src/lib/docs-product-catalog.contract.ts";
import {
  DEPRECATED_CONFIG_KEYS,
  DEPRECATED_SECRET_KEYS,
} from "../env-utils.mjs";
import { catalogOutputPath, repoRoot } from "./docs-catalog-paths.mts";
import { writeCatalogJson } from "./write-catalog-json.mts";

const deprecatedKeys = new Set<string>([
  ...DEPRECATED_CONFIG_KEYS,
  ...DEPRECATED_SECRET_KEYS,
]);

function parseEnvExample(content: string): EnvCatalog["variables"] {
  const variables: EnvCatalog["variables"][number][] = [];
  let currentSection = "general";
  let pendingDescription: string[] = [];

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trimEnd();

    if (line.startsWith("# ---") && line.endsWith("---")) {
      currentSection = line
        .slice("# ---".length, -" ---".length)
        .trim();
      pendingDescription = [];
      continue;
    }

    if (line.startsWith("#")) {
      const comment = line.slice(1).trim();
      if (comment.length > 0) {
        pendingDescription.push(comment);
      }
      continue;
    }

    const match = /^([A-Z][A-Z0-9_]*)=/.exec(line);
    if (!match?.[1]) {
      continue;
    }

    const name = match[1];
    variables.push({
      name,
      section: currentSection,
      ...(pendingDescription.length > 0
        ? { description: pendingDescription.join(" ") }
        : {}),
      ...(deprecatedKeys.has(name) ? { deprecated: true } : {}),
    });
    pendingDescription = [];
  }

  return variables;
}

export async function exportEnvCatalog(
  outputPath = catalogOutputPath("env")
): Promise<EnvCatalog> {
  const envExamplePath = join(repoRoot, ".env.example");
  const content = readFileSync(envExamplePath, "utf8");
  const variables = parseEnvExample(content);

  const catalog = {
    catalogId: "env",
    exportedAt: new Date().toISOString(),
    variables,
  } satisfies EnvCatalog;

  writeCatalogJson(outputPath, catalog);
  console.log(`[export:env] wrote ${outputPath} (${catalog.variables.length} variables)`);
  return catalog;
}
