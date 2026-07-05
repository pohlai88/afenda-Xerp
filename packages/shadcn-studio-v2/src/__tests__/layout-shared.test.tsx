import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AppShell,
  appShellClassName,
  IconMark,
  Sidebar,
  sidebarClassName,
  Topbar,
  topbarClassName,
} from "../index";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(TEST_DIR, "..");

function readSource(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

describe("Slice 4 layout and shared parts", () => {
  it("renders layout components with governed slots", () => {
    const markup = renderToStaticMarkup(
      <AppShell>
        <Sidebar>Navigation</Sidebar>
        <main>
          <Topbar>Header</Topbar>
        </main>
      </AppShell>
    );

    expect(markup).toContain('data-slot="app-shell"');
    expect(markup).toContain('data-slot="sidebar"');
    expect(markup).toContain('data-slot="topbar"');
  });

  it("keeps layout class helpers token-driven", () => {
    expect(appShellClassName({ density: "compact" })).toContain(
      "bg-background"
    );
    expect(sidebarClassName({ variant: "rail" })).toContain("bg-card");
    expect(topbarClassName({ variant: "transparent" })).toContain(
      "bg-transparent"
    );
  });

  it("renders the shared icon asset accessibly", () => {
    const markup = renderToStaticMarkup(<IconMark label="Afenda studio" />);

    expect(markup).toContain('role="img"');
    expect(markup).toContain("Afenda studio");
    expect(markup).toContain('data-slot="icon-mark"');
  });

  it("does not reuse fixed title ids for repeated icon marks", () => {
    const markup = renderToStaticMarkup(
      <>
        <IconMark label="First mark" />
        <IconMark label="Second mark" />
      </>
    );

    expect(markup).not.toContain("afenda-icon-mark-title");
    expect(markup).toContain("First mark");
    expect(markup).toContain("Second mark");
  });

  it("keeps the shared ThemeToggle client-only and out of neutral/server surfaces", () => {
    const sharedSource = readSource("components", "shared", "ThemeToggle.tsx");

    expect(sharedSource).toContain('"use client"');
    expect(sharedSource).toContain("useTheme()");
    expect(readSource("clients.ts")).toContain("ThemeToggle");
    expect(readSource("index.ts")).not.toContain("ThemeToggle");
    expect(readSource("server.ts")).not.toContain("ThemeToggle");
  });
});
