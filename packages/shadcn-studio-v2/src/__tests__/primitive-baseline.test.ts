import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { badgeClassName } from "../components/ui/Badge";
import { buttonClassName } from "../components/ui/Button";
import { cardClassName } from "../components/ui/Card";
import { cn } from "../lib/cn";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");

const REQUIRED_PRIMITIVES = ["Badge.tsx", "Button.tsx", "Card.tsx"] as const;

function readSource(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

describe("shadcn-studio-v2 primitive baseline", () => {
  it("keeps Slice 3A primitives in the registered ui lane", () => {
    for (const fileName of REQUIRED_PRIMITIVES) {
      const source = readSource("components", "ui", fileName);

      expect(source).toContain("export function");
      expect(source).not.toContain("window.");
      expect(source).not.toContain("document.");
      expect(source).not.toContain("localStorage");
    }
  });

  it("uses canonical semantic token utilities in primitive variants", () => {
    expect(buttonClassName({ variant: "default" })).toContain("bg-primary");
    expect(buttonClassName({ variant: "outline" })).toContain("border-input");
    expect(badgeClassName({ variant: "secondary" })).toContain("bg-secondary");
    expect(cardClassName()).toContain("bg-card");
  });

  it("keeps class merging deterministic without external runtime dependency", () => {
    expect(cn("base", false, null, ["nested"], { enabled: true })).toBe(
      "base nested enabled"
    );
  });

  it("does not expose quarantine through public surfaces", () => {
    expect(readSource("index.ts")).not.toContain("quarantine");
    expect(readSource("clients.ts")).not.toContain("quarantine");
    expect(readSource("server.ts")).not.toContain("quarantine");
  });

  it("serializes primitive ownership through stable data-slot markers", () => {
    expect(readSource("components", "ui", "Button.tsx")).toContain(
      'data-slot="button"'
    );
    expect(readSource("components", "ui", "Badge.tsx")).toContain(
      'data-slot="badge"'
    );

    const cardSource = readSource("components", "ui", "Card.tsx");

    expect(cardSource).toContain('data-slot="card"');
    expect(cardSource).toContain('data-slot="card-header"');
    expect(cardSource).toContain('data-slot="card-title"');
    expect(cardSource).toContain('data-slot="card-description"');
    expect(cardSource).toContain('data-slot="card-content"');
    expect(cardSource).toContain('data-slot="card-footer"');
  });
});
