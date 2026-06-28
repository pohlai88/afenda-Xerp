import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import type { CssAuthorityDomainSource } from "../contracts/css-authority.contract.js";
import { CSS_AUTHORITY_TOKENS } from "../index.js";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = join(packageRoot, "../..");
const authoritiesRoot = join(packageRoot, "src/authorities");

function loadDomain(fileName: string): CssAuthorityDomainSource {
  return JSON.parse(
    readFileSync(join(authoritiesRoot, fileName), "utf8")
  ) as CssAuthorityDomainSource;
}

function parsePropertyNames(
  cssPath: string,
  options?: { prefix?: string; selectorIncludes?: string }
): string[] {
  const css = readFileSync(cssPath, "utf8");
  let source = css;

  if (options?.selectorIncludes !== undefined) {
    const selectorPattern = new RegExp(
      `[^{]*${options.selectorIncludes.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^{]*\\{([\\s\\S]*?)\\}`,
      "m"
    );
    const match = selectorPattern.exec(css);
    expect(match).not.toBeNull();
    source = match?.[1] ?? "";
  }

  const names = new Set<string>();
  for (const match of source.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)) {
    const name = match[1];
    if (name === undefined) {
      continue;
    }
    if (options?.prefix !== undefined && !name.startsWith(options.prefix)) {
      continue;
    }
    names.add(name);
  }

  return [...names];
}

describe("domain authority sync", () => {
  it("populates afenda-extensions.json with all --afenda-* tokens", () => {
    const domain = loadDomain("afenda-extensions.json");
    const cssPath = join(
      repoRoot,
      "packages/design-system/src/css/afenda-tokens.css"
    );
    const expectedNames = parsePropertyNames(cssPath, { prefix: "--afenda-" });

    expect(domain.domain).toBe("afenda-extensions");
    expect(domain.owner).toBe("@afenda/css-authority");
    expect(domain.tokens.length).toBe(expectedNames.length);
    expect(domain.tokens.length).toBeGreaterThanOrEqual(465);

    for (const name of expectedNames) {
      const token = domain.tokens.find((row) => row.name === name);
      expect(token, `missing afenda token ${name}`).toBeDefined();
      expect(token?.authority).toBe("afenda-extensions");
      expect(token?.introducedIn).toBe("PAS-005-B34");
      expect(token?.editable).toBe(false);
    }
  });

  it("populates appshell.json with .app-shell-root custom properties", () => {
    const domain = loadDomain("appshell.json");
    const cssPath = join(
      repoRoot,
      "packages/appshell/src/styles/afenda-appshell.css"
    );
    const expectedNames = parsePropertyNames(cssPath, {
      prefix: "--app-shell-",
      selectorIncludes: ".app-shell-root",
    });

    expect(domain.domain).toBe("appshell");
    expect(domain.owner).toBe("@afenda/appshell");
    expect(domain.tokens.length).toBe(expectedNames.length);
    expect(domain.tokens.length).toBeGreaterThanOrEqual(40);

    for (const name of expectedNames) {
      const token = domain.tokens.find((row) => row.name === name);
      expect(token, `missing appshell token ${name}`).toBeDefined();
      expect(token?.authority).toBe("appshell");
      expect(token?.source).toBe(
        "packages/appshell/src/styles/afenda-appshell.css"
      );
    }
  });

  it("populates auth-editorial.json with auth editorial block tokens", () => {
    const domain = loadDomain("auth-editorial.json");
    const cssPath = join(
      repoRoot,
      "packages/appshell/src/styles/afenda-appshell-studio.css"
    );
    const expectedNames = parsePropertyNames(cssPath, {
      prefix: "--auth-editorial-",
    });

    expect(domain.domain).toBe("auth-editorial");
    expect(domain.owner).toBe("@afenda/appshell");
    expect(domain.tokens.length).toBe(14);
    expect(domain.tokens.length).toBe(expectedNames.length);

    for (const name of expectedNames) {
      const token = domain.tokens.find((row) => row.name === name);
      expect(token, `missing auth-editorial token ${name}`).toBeDefined();
      expect(token?.authority).toBe("auth-editorial");
    }
  });

  it("keeps id-sequence.json nextTokenId above max assigned token id", () => {
    const sequence = JSON.parse(
      readFileSync(join(authoritiesRoot, "id-sequence.json"), "utf8")
    ) as { nextTokenId: number };

    const maxId = CSS_AUTHORITY_TOKENS.reduce((max, token) => {
      const match = /^CSS-TOKEN-(\d+)$/.exec(token.id);
      const value = match === null ? 0 : Number.parseInt(match[1] ?? "0", 10);
      return Math.max(max, value);
    }, 0);

    expect(sequence.nextTokenId).toBeGreaterThan(maxId);
  });

  it("registers domain tokens in the merged CSS authority registry", () => {
    const afendaCount = CSS_AUTHORITY_TOKENS.filter(
      (token) => token.authority === "afenda-extensions"
    ).length;
    const appshellCount = CSS_AUTHORITY_TOKENS.filter(
      (token) => token.authority === "appshell"
    ).length;
    const authEditorialCount = CSS_AUTHORITY_TOKENS.filter(
      (token) => token.authority === "auth-editorial"
    ).length;

    expect(afendaCount).toBeGreaterThanOrEqual(465);
    expect(appshellCount).toBeGreaterThanOrEqual(40);
    expect(authEditorialCount).toBe(14);
    expect(CSS_AUTHORITY_TOKENS.length).toBeGreaterThan(500);
  });

  it("keeps unique ids and names across all domains", () => {
    const ids = CSS_AUTHORITY_TOKENS.map((token) => token.id);
    const names = CSS_AUTHORITY_TOKENS.map((token) => token.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });
});
