import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsGuidesFolderGroup } from "@/lib/docs-nav.contract";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";
import { OPENAPI_DOCUMENT_ID, shouldGenerateDocsOpenApiPage } from "@/lib/openapi.server";

const appRoot = process.cwd();
const openApiSpecPath = join(appRoot, "openapi/afenda-internal-v1.openapi.json");

function internalV1Dir(locale: DocsLocale): string {
  return join(docsLocaleContentRoot(locale), "integrate/internal-v1");
}

const enInternalV1Dir = internalV1Dir(docsDefaultLocale);

function countSpecOperations(): number {
  const spec = JSON.parse(readFileSync(openApiSpecPath, "utf8")) as {
    paths?: Record<string, Record<string, unknown>>;
  };
  const paths = spec.paths ?? {};
  let count = 0;

  for (const pathItem of Object.values(paths)) {
    for (const method of ["get", "post", "put", "delete"] as const) {
      if (pathItem[method] !== undefined) {
        count += 1;
      }
    }
  }

  return count;
}

describe("@afenda/docs OpenAPI reference", () => {
  it("ships the internal v1 OpenAPI spec for fumadocs-openapi", () => {
    expect(existsSync(openApiSpecPath)).toBe(true);

    const spec = JSON.parse(readFileSync(openApiSpecPath, "utf8")) as {
      openapi?: string;
      info?: { title?: string };
    };

    expect(spec.openapi).toBe("3.1.0");
    expect(spec.info?.title).toBeTruthy();
  });

  it("registers internal-v1 in en integrate meta.json", () => {
    const integrateMeta = JSON.parse(
      readFileSync(
        join(docsLocaleContentRoot(docsDefaultLocale), "integrate/meta.json"),
        "utf8"
      )
    ) as { pages: string[] };

    expect(integrateMeta.pages).toContain("internal-v1");
  });

  it("registers internal-v1 in legacy guides locales via integrate section", () => {
    for (const locale of docsLocales) {
      if (locale === docsDefaultLocale) {
        continue;
      }

      const integrateMeta = JSON.parse(
        readFileSync(
          join(docsLocaleContentRoot(locale), "integrate/meta.json"),
          "utf8"
        )
      ) as { pages: string[] };

      expect(integrateMeta.pages).toContain("internal-v1");
    }
  });

  it("aligns OPENAPI_DOCUMENT_ID across server and generator script", () => {
    const generatorSource = readFileSync(
      join(appRoot, "scripts/generate-openapi-docs.mts"),
      "utf8"
    );
    const serverSource = readFileSync(
      join(appRoot, "src/lib/openapi.server.ts"),
      "utf8"
    );

    expect(OPENAPI_DOCUMENT_ID).toBe("./openapi/afenda-internal-v1.openapi.json");
    expect(serverSource).toContain(OPENAPI_DOCUMENT_ID);
    expect(generatorSource).toContain(OPENAPI_DOCUMENT_ID);
    expect(generatorSource).toContain("integrate/internal-v1");
  });

  it("wires fumadocs-openapi loader plugin and CSS preset", () => {
    const sourceText = readFileSync(join(appRoot, "src/lib/source.ts"), "utf8");
    const slugPageSource = readFileSync(
      join(appRoot, "src/app/[lang]/docs/[[...slug]]/page.tsx"),
      "utf8"
    );
    const apiPageSource = readFileSync(
      join(appRoot, "src/components/api-page.client.tsx"),
      "utf8"
    );
    const globalsCss = readFileSync(join(appRoot, "src/app/globals.css"), "utf8");
    const packageJson = JSON.parse(
      readFileSync(join(appRoot, "package.json"), "utf8")
    ) as { scripts?: Record<string, string> };

    expect(sourceText).toContain("openapi.loaderPlugin()");
    expect(slugPageSource).toContain("OpenAPIPreloadProvider");
    expect(apiPageSource).toContain("OpenAPIPageWithPreload");
    expect(globalsCss).toContain("fumadocs-openapi/css/preset.css");
    expect(packageJson.scripts?.["generate:openapi-docs"]).toBeTruthy();
  });

  it("generates one MDX operation page per OpenAPI operation with _openapi frontmatter", () => {
    const operationCount = countSpecOperations();
    const enMdxFiles = readdirSync(enInternalV1Dir).filter(
      (entry) => entry.endsWith(".mdx") && entry !== "index.mdx"
    );

    expect(operationCount).toBeGreaterThan(0);
    expect(enMdxFiles.length).toBe(operationCount);

    for (const fileName of enMdxFiles) {
      const source = readFileSync(join(enInternalV1Dir, fileName), "utf8");
      expect(source).toContain("_openapi:");
      expect(source).toContain(OPENAPI_DOCUMENT_ID);
      expect(source).toMatch(/<Comp document=/);
    }
  });

  it("lists every operation slug in en internal-v1 meta.json", () => {
    const meta = JSON.parse(
      readFileSync(join(enInternalV1Dir, "meta.json"), "utf8")
    ) as { pages: string[] };
    const operationSlugs = readdirSync(enInternalV1Dir)
      .filter((entry) => entry.endsWith(".mdx") && entry !== "index.mdx")
      .map((entry) => entry.replace(/\.mdx$/, ""));

    expect(meta.pages[0]).toBe("index");

    for (const slug of operationSlugs) {
      expect(meta.pages).toContain(slug);
    }
  });

  it("generates the same operation count for every locale as en", () => {
    const operationCount = countSpecOperations();
    const enMdxFiles = readdirSync(enInternalV1Dir).filter(
      (entry) => entry.endsWith(".mdx") && entry !== "index.mdx"
    );

    for (const locale of docsLocales) {
      const localeDir = internalV1Dir(locale);
      const localeMdxFiles = readdirSync(localeDir).filter(
        (entry) => entry.endsWith(".mdx") && entry !== "index.mdx"
      );

      expect(localeMdxFiles.length).toBe(operationCount);
      expect(localeMdxFiles.length).toBe(enMdxFiles.length);
    }
  });

  it("lists every operation slug in each locale internal-v1 meta.json", () => {
    for (const locale of docsLocales) {
      const localeDir = internalV1Dir(locale);
      const meta = JSON.parse(
        readFileSync(join(localeDir, "meta.json"), "utf8")
      ) as { pages: string[] };
      const operationSlugs = readdirSync(localeDir)
        .filter((entry) => entry.endsWith(".mdx") && entry !== "index.mdx")
        .map((entry) => entry.replace(/\.mdx$/, ""));

      expect(meta.pages[0]).toBe("index");

      for (const slug of operationSlugs) {
        expect(meta.pages).toContain(slug);
      }
    }
  });

  it("generates zh health-get with Chinese title", () => {
    const source = readFileSync(
      join(internalV1Dir("zh"), "health-get.mdx"),
      "utf8"
    );

    expect(source).toContain('title: "获取 ERP 健康状态"');
  });

  it("generates localized internal-v1 index titles for SEA locales", () => {
    const viIndex = readFileSync(
      join(internalV1Dir("vi"), "index.mdx"),
      "utf8"
    );
    const msIndex = readFileSync(
      join(internalV1Dir("ms"), "index.mdx"),
      "utf8"
    );

    expect(viIndex).toContain("Tài liệu tham chiếu API nội bộ");
    expect(msIndex).toContain("Rujukan API Dalaman");
  });

  it("generates zh internal-v1 operation pages for SSG", () => {
    expect(
      shouldGenerateDocsOpenApiPage({
        lang: "zh",
        slug: ["integrate", "internal-v1", "health-get"],
      })
    ).toBe(true);
    expect(
      shouldGenerateDocsOpenApiPage({
        lang: "zh",
        slug: ["integrate", "internal-v1"],
      })
    ).toBe(true);
    expect(
      shouldGenerateDocsOpenApiPage({
        lang: "en",
        slug: ["integrate", "internal-v1", "health-get"],
      })
    ).toBe(true);
  });

  it("includes scaffolded reader IA in non-en SSG and excludes build-afenda", () => {
    expect(
      shouldGenerateDocsOpenApiPage({
        lang: "id",
        slug: ["operate-tenant", "generated", "env"],
      })
    ).toBe(true);
    expect(
      shouldGenerateDocsOpenApiPage({
        lang: "en",
        slug: ["operate-tenant", "generated", "env"],
      })
    ).toBe(true);
    expect(
      shouldGenerateDocsOpenApiPage({
        lang: "id",
        slug: ["use-erp", "sign-in"],
      })
    ).toBe(true);
    expect(
      shouldGenerateDocsOpenApiPage({
        lang: "id",
        slug: ["integrate", "internal-v1", "health-get"],
      })
    ).toBe(true);
    expect(
      shouldGenerateDocsOpenApiPage({
        lang: "id",
        slug: ["build-afenda", "getting-started"],
      })
    ).toBe(false);
    expect(
      shouldGenerateDocsOpenApiPage({
        lang: "en",
        slug: ["build-afenda", "getting-started"],
      })
    ).toBe(true);
  });

  it("does not register api-reference under legacy guides meta for zh", () => {
    const guidesMeta = JSON.parse(
      readFileSync(
        join(docsLocaleContentRoot("zh"), `${docsGuidesFolderGroup}/meta.json`),
        "utf8"
      )
    ) as { pages: string[] };

    expect(guidesMeta.pages).not.toContain("api-reference");
  });
});
