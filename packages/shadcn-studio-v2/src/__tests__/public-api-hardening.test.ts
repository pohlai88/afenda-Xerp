import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(TEST_DIR, "..");

const BOUNDARY_FILES = {
  clients: path.join(SRC_ROOT, "clients.ts"),
  metadata: path.join(SRC_ROOT, "metadata.ts"),
  root: path.join(SRC_ROOT, "index.ts"),
  server: path.join(SRC_ROOT, "server.ts"),
} as const;

function readBoundary(name: keyof typeof BOUNDARY_FILES): string {
  return readFileSync(BOUNDARY_FILES[name], "utf8");
}

describe("Slice 7 public API hardening", () => {
  it("keeps every public boundary free of wildcard re-exports", () => {
    for (const source of Object.values(BOUNDARY_FILES).map((filePath) =>
      readFileSync(filePath, "utf8")
    )) {
      expect(source).not.toContain("export *");
    }
  });

  it("keeps the client surface independent from root, server, and metadata boundaries", () => {
    const clients = readBoundary("clients");

    expect(clients).not.toContain('from "./index"');
    expect(clients).not.toContain('from "./server"');
    expect(clients).not.toContain('from "./metadata"');
    expect(clients).not.toContain('from "./metadata/');
  });

  it("keeps server exports config/type-only", () => {
    const server = readBoundary("server");

    expect(server).toContain("studioPackageConfig");
    expect(server).toContain("studioThemeConfig");
    expect(server).not.toContain("./components/");
    expect(server).not.toContain("./contexts/");
    expect(server).not.toContain("./hooks/");
    expect(server).not.toContain("./views/");
    expect(server).not.toContain("./metadata/");
  });

  it("keeps metadata isolated from root/client/server and React surfaces", () => {
    const metadata = readBoundary("metadata");

    expect(metadata).not.toContain('from "./index"');
    expect(metadata).not.toContain('from "./clients"');
    expect(metadata).not.toContain('from "./server"');
    expect(metadata).not.toContain("./components/");
    expect(metadata).not.toContain("./views/");
    expect(metadata).not.toContain("ReactNode");
  });
});
