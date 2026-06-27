import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { docsLocalizedReaderRootPages } from "../src/lib/docs-nav.contract.ts";
import { docsDefaultLocale, docsLocales } from "../src/lib/i18n.ts";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const contentDir = join(appDir, "content/docs");

const READER_IA_SECTIONS = [
  "use-erp",
  "configure-tenant",
  "operate-tenant",
  "integrate",
] as const;

function copyReaderSectionFromEn(locale: string, section: string): void {
  const sourceDir = join(contentDir, docsDefaultLocale, section);
  const targetDir = join(contentDir, locale, section);

  if (!existsSync(sourceDir)) {
    throw new Error(
      `Missing English reader section ${sourceDir}. Run generate-reference-pages first.`
    );
  }

  cpSync(sourceDir, targetDir, { recursive: true });
  console.log(`Scaffolded: ${targetDir}`);
}

function updateRootMeta(locale: string): void {
  const metaPath = join(contentDir, locale, "meta.json");
  const existing = existsSync(metaPath)
    ? (JSON.parse(readFileSync(metaPath, "utf8")) as {
        title?: string;
        pages?: string[];
      })
    : { title: "Documentation" };

  const meta = {
    ...existing,
    pages: [...docsLocalizedReaderRootPages],
  };

  writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
  console.log(`Updated meta: ${metaPath}`);
}

function main(): void {
  for (const locale of docsLocales) {
    if (locale === docsDefaultLocale) {
      continue;
    }

    console.log(`[scaffold-reader-ia-locales] locale=${locale}`);

    for (const section of READER_IA_SECTIONS) {
      copyReaderSectionFromEn(locale, section);
    }

    updateRootMeta(locale);
  }
}

main();
