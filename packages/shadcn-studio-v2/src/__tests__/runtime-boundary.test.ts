import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");

const CONFIG_FILES = ["theme-config.ts", "studio-config.ts"] as const;
const RUNTIME_FORBIDDEN_IN_CONFIG = [
  '"use client"',
  'from "react"',
  "window.",
  "document.",
  "localStorage",
] as const;

function readSource(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

describe("shadcn-studio-v2 config and runtime boundary", () => {
  it("keeps config files static and runtime-neutral", () => {
    for (const fileName of CONFIG_FILES) {
      const source = readSource("configs", fileName);

      for (const forbiddenText of RUNTIME_FORBIDDEN_IN_CONFIG) {
        expect(source).not.toContain(forbiddenText);
      }
    }
  });

  it("keeps React runtime behavior in contexts, hooks, and shared components", () => {
    expect(readSource("contexts", "ThemeProvider.tsx")).toContain(
      '"use client"'
    );
    expect(readSource("hooks", "use-theme.ts")).toContain('"use client"');
    expect(readSource("components", "shared", "ThemeToggle.tsx")).toContain(
      '"use client"'
    );
  });

  it("keeps neutral exports free from client runtime providers", () => {
    const neutralSurface = readSource("index.ts");
    const serverSurface = readSource("server.ts");
    const clientSurface = readSource("clients.ts");

    expect(neutralSurface).not.toContain("ThemeProvider");
    expect(neutralSurface).not.toContain("ThemeToggle");
    expect(serverSurface).not.toContain("ThemeProvider");
    expect(serverSurface).not.toContain("ThemeToggle");
    expect(clientSurface).toContain("ThemeProvider");
    expect(clientSurface).toContain("ThemeToggle");
  });
});
