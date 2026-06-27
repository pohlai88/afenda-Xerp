import { existsSync, globSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateGeneratedMdxPolicy } from "../src/lib/docs-content-policy.ts";
import { docsDefaultLocale } from "../src/lib/i18n.ts";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const contentRoot = join(appDir, "content/docs", docsDefaultLocale);

function collectGeneratedFeatureEvidenceMdx(): string[] {
  const patterns = [
    join(contentRoot, "use-erp/modules/**/*.mdx"),
    join(contentRoot, "use-erp/auth-lanes.mdx"),
    join(contentRoot, "configure-tenant/generated/admin-sections.mdx"),
    join(contentRoot, "integrate/generated/evidence/**/*.mdx"),
  ];

  const files = new Set<string>();
  for (const pattern of patterns) {
    for (const file of globSync(pattern.replace(/\\/g, "/"))) {
      files.add(file);
    }
  }

  return [...files].sort();
}

function main(): void {
  const files = collectGeneratedFeatureEvidenceMdx();
  if (files.length === 0) {
    console.warn(
      "[check:feature-evidence-content-policy] no generated MDX found — run pnpm sync:product-docs first"
    );
    process.exit(1);
  }

  const violations: string[] = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    if (!source.includes("DO NOT EDIT")) {
      continue;
    }
    const result = validateGeneratedMdxPolicy(source, file);
    violations.push(...result.violations);
  }

  if (violations.length > 0) {
    console.error(
      `[check:feature-evidence-content-policy] ${violations.length} violation(s):`
    );
    for (const violation of violations) {
      console.error(`  - ${violation}`);
    }
    process.exit(1);
  }

  console.log(
    `[check:feature-evidence-content-policy] pass (${files.length} files scanned)`
  );
}

main();
