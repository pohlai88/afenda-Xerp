import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { docsLocales } from "../src/lib/i18n.ts";

const appDir = join(fileURLToPath(import.meta.url), "../..");
const contentDir = join(appDir, "content/docs");
const openApiSpecPath = join(appDir, "openapi/afenda-internal-v1.openapi.json");
const openApiServerPath = join(appDir, "src/lib/openapi.server.ts");

/** Must match `createOpenAPI({ input: [...] })` in openapi.server.ts */
const OPENAPI_DOCUMENT_ID = "./openapi/afenda-internal-v1.openapi.json";

const ZH_OPERATION_TITLE_BY_EN_SUMMARY: Record<string, string> = {
  "Assign membership role": "分配成员角色",
  "Create membership role assignment": "创建成员角色分配",
  "Create user invitation": "创建用户邀请",
  "Get ERP health status": "获取 ERP 健康状态",
  "Get dashboard layout": "获取仪表盘布局",
  "Initiate tenant brand logo upload": "发起租户品牌 Logo 上传",
  "Invite user": "邀请用户",
  "List audit events": "列出审计事件",
  "List session memberships": "列出会话成员关系",
  "Report client-side error": "上报客户端错误",
  "Reset dashboard layout": "重置仪表盘布局",
  "Update dashboard layout": "更新仪表盘布局",
};

interface OpenApiOperation {
  readonly operationId?: string;
  readonly summary?: string;
  readonly tags?: readonly string[];
}

type OpenApiLocaleMeta = {
  readonly indexTitle: string;
  readonly indexDescription: string;
  readonly indexHeading: string;
  readonly indexIntro: string;
  readonly metaTitle: string;
  readonly resolveTitle: (operation: OpenApiOperation) => string;
};

const englishOperationTitle = (operation: OpenApiOperation): string =>
  operation.summary ?? operation.operationId ?? "Operation";

const OPENAPI_LOCALE_META = {
  en: {
    indexTitle: "Internal API Reference",
    indexDescription:
      "Governed Afenda ERP internal REST API under /api/internal/v1.",
    indexHeading: "Internal API Reference",
    indexIntro:
      "Registry-driven OpenAPI 3.1 catalog for governed `/api/internal/v1/**` routes. Generated from `API_CONTRACTS` — do not edit operation pages by hand.",
    metaTitle: "Internal API Reference",
    resolveTitle: englishOperationTitle,
  },
  zh: {
    indexTitle: "内部 API 参考",
    indexDescription: "Afenda ERP 受治理的内部 REST API（/api/internal/v1）。",
    indexHeading: "内部 API 参考",
    indexIntro:
      "由 `API_CONTRACTS` 生成的 OpenAPI 3.1 目录，涵盖受治理的 `/api/internal/v1/**` 路由。请勿手动编辑操作页面。",
    metaTitle: "内部 API 参考",
    resolveTitle: (operation: OpenApiOperation) => {
      const englishSummary = operation.summary ?? operation.operationId ?? "";
      return (
        ZH_OPERATION_TITLE_BY_EN_SUMMARY[englishSummary] ?? englishSummary
      );
    },
  },
  vi: {
    indexTitle: "Tài liệu tham chiếu API nội bộ",
    indexDescription:
      "REST API nội bộ Afenda ERP được quản trị theo /api/internal/v1.",
    indexHeading: "Tài liệu tham chiếu API nội bộ",
    indexIntro:
      "Danh mục OpenAPI 3.1 được tạo từ `API_CONTRACTS` cho các route `/api/internal/v1/**` được quản trị. Không chỉnh sửa thủ công các trang thao tác.",
    metaTitle: "Tài liệu tham chiếu API nội bộ",
    resolveTitle: englishOperationTitle,
  },
  ms: {
    indexTitle: "Rujukan API Dalaman",
    indexDescription:
      "REST API dalaman Afenda ERP yang ditadbir di bawah /api/internal/v1.",
    indexHeading: "Rujukan API Dalaman",
    indexIntro:
      "Katalog OpenAPI 3.1 dipacu registri untuk laluan `/api/internal/v1/**` yang ditadbir. Dijana daripada `API_CONTRACTS` — jangan sunting halaman operasi secara manual.",
    metaTitle: "Rujukan API Dalaman",
    resolveTitle: englishOperationTitle,
  },
  id: {
    indexTitle: "Referensi API Internal",
    indexDescription:
      "REST API internal Afenda ERP yang teregulasi di bawah /api/internal/v1.",
    indexHeading: "Referensi API Internal",
    indexIntro:
      "Katalog OpenAPI 3.1 berbasis registri untuk rute `/api/internal/v1/**` yang teregulasi. Dihasilkan dari `API_CONTRACTS` — jangan edit halaman operasi secara manual.",
    metaTitle: "Referensi API Internal",
    resolveTitle: englishOperationTitle,
  },
  th: {
    indexTitle: "เอกสารอ้างอิง API ภายใน",
    indexDescription:
      "REST API ภายในของ Afenda ERP ภายใต้ /api/internal/v1 ที่ได้รับการกำกับดูแล",
    indexHeading: "เอกสารอ้างอิง API ภายใน",
    indexIntro:
      "แคตตาล็อก OpenAPI 3.1 ที่ขับเคลื่อนจาก registri สำหรับเส้นทาง `/api/internal/v1/**` ที่ได้รับการกำกับดูแล สร้างจาก `API_CONTRACTS` — อย่าแก้ไขหน้าปฏิบัติการด้วยตนเอง",
    metaTitle: "เอกสารอ้างอิง API ภายใน",
    resolveTitle: englishOperationTitle,
  },
  fil: {
    indexTitle: "Sanggunian ng Panloob na API",
    indexDescription:
      "Pinamamahalaang panloob na REST API ng Afenda ERP sa ilalim ng /api/internal/v1.",
    indexHeading: "Sanggunian ng Panloob na API",
    indexIntro:
      "Registry-driven na OpenAPI 3.1 catalog para sa pinamamahalaang `/api/internal/v1/**` routes. Binuo mula sa `API_CONTRACTS` — huwag i-edit nang manual ang mga pahina ng operasyon.",
    metaTitle: "Sanggunian ng Panloob na API",
    resolveTitle: englishOperationTitle,
  },
} as const satisfies Record<(typeof docsLocales)[number], OpenApiLocaleMeta>;

type OpenApiLocaleConfig = OpenApiLocaleMeta & {
  readonly outputDir: string;
};

function buildLocaleConfig(
  locale: (typeof docsLocales)[number]
): OpenApiLocaleConfig {
  return {
    ...OPENAPI_LOCALE_META[locale],
    outputDir: join(contentDir, `${locale}/integrate/internal-v1`),
  };
}

function fail(message: string): never {
  console.error(`[generate:openapi-docs] ${message}`);
  process.exit(1);
}

function assertOpenApiDocumentIdAligned(): void {
  const serverSource = readFileSync(openApiServerPath, "utf8");
  if (!serverSource.includes(OPENAPI_DOCUMENT_ID)) {
    fail(
      `OPENAPI_DOCUMENT_ID mismatch — update scripts/generate-openapi-docs.mts or src/lib/openapi.server.ts`
    );
  }
}

function assertSpecPresent(): void {
  if (!existsSync(openApiSpecPath)) {
    fail(
      `OpenAPI spec missing at ${openApiSpecPath}. Run: pnpm export:openapi`
    );
  }
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

type ApiDomain = "Auth" | "System Admin" | "Inventory" | "Workspace" | "Platform";

const API_DOMAIN_TAB_ORDER: readonly ApiDomain[] = [
  "Auth",
  "System Admin",
  "Inventory",
  "Workspace",
  "Platform",
] as const;

function classifyApiDomain(openApiPath: string): ApiDomain {
  if (openApiPath.startsWith("/auth/")) {
    return "Auth";
  }
  if (openApiPath.startsWith("/system-admin/")) {
    return "System Admin";
  }
  if (openApiPath.startsWith("/inventory/")) {
    return "Inventory";
  }
  if (openApiPath.startsWith("/workspace/")) {
    return "Workspace";
  }
  return "Platform";
}

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
  readonly title: string;
}): string {
  const operationsJson = JSON.stringify([
    { path: input.openApiPath, method: input.method },
  ]);

  return `---
title: ${JSON.stringify(input.title)}
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

function buildIndexMdx(input: {
  readonly cards: readonly {
    readonly description: string;
    readonly domain: ApiDomain;
    readonly href: string;
    readonly title: string;
  }[];
  readonly config: OpenApiLocaleConfig;
}): string {
  const cardsByDomain = new Map<ApiDomain, typeof input.cards>();
  for (const domain of API_DOMAIN_TAB_ORDER) {
    cardsByDomain.set(domain, []);
  }

  for (const card of input.cards) {
    const bucket = cardsByDomain.get(card.domain) ?? [];
    bucket.push(card);
    cardsByDomain.set(card.domain, bucket);
  }

  const activeDomains = API_DOMAIN_TAB_ORDER.filter(
    (domain) => (cardsByDomain.get(domain)?.length ?? 0) > 0
  );

  const tabItems = activeDomains.map((domain) => JSON.stringify(domain)).join(", ");

  const tabSections = activeDomains
    .map((domain) => {
      const domainCards = cardsByDomain.get(domain) ?? [];
      const cardLines = domainCards
        .map(
          (card) =>
            `  <Card title=${JSON.stringify(card.title)} href=${JSON.stringify(card.href)} description=${JSON.stringify(card.description)} />`
        )
        .join("\n");

      return `<Tab value=${JSON.stringify(domain)}>

<Cards>
${cardLines}
</Cards>

</Tab>`;
    })
    .join("\n\n");

  return `---
title: ${JSON.stringify(input.config.indexTitle)}
description: ${JSON.stringify(input.config.indexDescription)}
full: true
---

import { Card, Cards } from "fumadocs-ui/components/card";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

${input.config.indexIntro}

<Tabs items={[${tabItems}]}>

${tabSections}

</Tabs>
`;
}

function generateLocaleDocs(input: {
  readonly config: OpenApiLocaleConfig;
  readonly paths: Record<string, OpenApiPathItem>;
}): number {
  mkdirSync(input.config.outputDir, { recursive: true });

  const cards: {
    description: string;
    domain: ApiDomain;
    href: string;
    title: string;
  }[] = [];

  for (const [openApiPath, pathItem] of Object.entries(input.paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (operation === undefined) {
        continue;
      }

      const title = input.config.resolveTitle(operation);
      const fileName = operationFileName(openApiPath, method);
      const filePath = join(input.config.outputDir, fileName);
      writeFileSync(
        filePath,
        buildOperationMdx({ openApiPath, method, title }),
        "utf8"
      );
      console.log(`Generated: ${filePath}`);

      cards.push({
        title,
        description: `${method.toUpperCase()} ${openApiPath}`,
        href: `./${fileName.replace(/\.mdx$/, "")}`,
        domain: classifyApiDomain(openApiPath),
      });
    }
  }

  cards.sort((left, right) => left.title.localeCompare(right.title));

  writeFileSync(
    join(input.config.outputDir, "index.mdx"),
    buildIndexMdx({ cards, config: input.config }),
    "utf8"
  );

  const operationSlugs = cards
    .map((card) => card.href.replace(/^\.\//, ""))
    .sort((left, right) => left.localeCompare(right));

  writeFileSync(
    join(input.config.outputDir, "meta.json"),
    `${JSON.stringify(
      {
        title: input.config.metaTitle,
        icon: "Code",
        defaultOpen: false,
        pages: ["index", ...operationSlugs],
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  return cards.length;
}

assertSpecPresent();
assertOpenApiDocumentIdAligned();

const spec = JSON.parse(readFileSync(openApiSpecPath, "utf8")) as OpenApiDocument;
const paths = spec.paths ?? {};

if (Object.keys(paths).length === 0) {
  fail("OpenAPI spec has no paths — regenerate via pnpm export:openapi");
}

let totalOperations = 0;

for (const locale of docsLocales) {
  const config = buildLocaleConfig(locale);
  const operationCount = generateLocaleDocs({ config, paths });
  totalOperations += operationCount;
  console.log(
    `Generated ${operationCount} operation pages under ${config.outputDir}`
  );

  if (operationCount === 0) {
    fail(`No operations generated for ${config.outputDir}`);
  }
}

console.log(`Generated ${totalOperations} total localized operation pages.`);
