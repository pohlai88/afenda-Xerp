import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("Next.js App Router hardening — metadata", () => {
  it("marks protected ERP layout as noindex", () => {
    const layoutSource = readAppSource("src/app/(protected)/layout.tsx");
    const metadataSource = readAppSource("src/lib/metadata/site-metadata.ts");
    expect(layoutSource).toContain("internalErpMetadata");
    expect(metadataSource).toContain("robots");
    expect(metadataSource).toContain("index: false");
  });

  it("marks auth layout as noindex", () => {
    const source = readAppSource("src/app/(auth)/layout.tsx");
    expect(source).toContain("authMetadata");
  });

  it("marks dev harness layout as noindex", () => {
    const source = readAppSource("src/app/(dev)/layout.tsx");
    expect(source).toContain("devHarnessMetadata");
  });
});

describe("Next.js App Router hardening — proxy boundary", () => {
  it("exports correlation header from proxy.ts", () => {
    const source = readAppSource("src/proxy.ts");
    expect(source).toMatch(
      /export (?:const CORRELATION_ID_HEADER|\{ CORRELATION_ID_HEADER \})/
    );
    expect(source).toContain("export function proxy");
  });

  it("does not retain legacy middleware.ts entrypoint", () => {
    expect(() => readAppSource("src/middleware.ts")).toThrow();
  });
});

describe("Next.js App Router hardening — UI surface rules", () => {
  const authAndShellSources = [
    "src/app/(auth)/layout.tsx",
    "src/app/(auth)/sign-in/sign-in-form.tsx",
    "src/components/sign-out-button.tsx",
    "src/app/(protected)/page.tsx",
  ];

  for (const relativePath of authAndShellSources) {
    it(`${relativePath} does not use inline style attributes`, () => {
      const source = readAppSource(relativePath);
      expect(source).not.toMatch(/\bstyle=\{\{/);
    });

    it(`${relativePath} does not use raw hex colors`, () => {
      const source = readAppSource(relativePath);
      expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    });
  }
});

describe("Next.js App Router hardening — configuration", () => {
  it("disables x-powered-by and configures security headers", () => {
    const source = readAppSource("next.config.ts");
    expect(source).toContain("poweredByHeader: false");
    expect(source).toContain("X-Frame-Options");
    expect(source).not.toContain("cacheComponents");
  });

  it("registers Next.js MCP at repository root", () => {
    const source = readFileSync(join(appRoot, "../../.mcp.json"), "utf8");
    expect(source).toContain("next-devtools-mcp");
  });
});

describe("Next.js App Router hardening — error boundaries", () => {
  const boundaryFiles = [
    "src/app/loading.tsx",
    "src/app/error.tsx",
    "src/app/not-found.tsx",
    "src/app/global-error.tsx",
    "src/app/(protected)/loading.tsx",
    "src/app/(protected)/error.tsx",
    "src/app/(auth)/error.tsx",
    "src/app/(dev)/error.tsx",
  ];

  for (const relativePath of boundaryFiles) {
    it(`includes ${relativePath}`, () => {
      expect(() => readAppSource(relativePath)).not.toThrow();
    });
  }
});
