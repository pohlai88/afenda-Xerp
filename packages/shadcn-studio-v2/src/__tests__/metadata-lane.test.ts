import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertStudioViewMetadata,
  defineAuthViewMetadata,
  defineEvidenceWidgetMetadata,
  defineMetricWidgetMetadata,
  definePageViewMetadata,
  isStudioViewMetadata,
  type StudioViewMetadata,
  studioMetadataLaneRegistry,
} from "../metadata";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(TEST_DIR, "..");

describe("Slice 6 metadata lane", () => {
  it("builds JSON-safe metadata descriptors", () => {
    const descriptors: readonly StudioViewMetadata[] = [
      defineAuthViewMetadata({
        description: "Sign in to continue.",
        kind: "auth",
        submitLabel: "Continue",
        title: "Welcome",
      }),
      definePageViewMetadata({
        kind: "page",
        navigation: [{ href: "/records", id: "records", label: "Records" }],
        title: "Records",
        toolbarActions: [{ id: "create", label: "Create", variant: "default" }],
      }),
      defineMetricWidgetMetadata({
        description: "Open records.",
        kind: "widget",
        label: "Open",
        tone: "success",
        value: "128",
        widget: "metric",
      }),
      defineEvidenceWidgetMetadata({
        description: "Audit checkpoint.",
        items: [{ id: "a", label: "Control A", status: "complete" }],
        kind: "widget",
        label: "Evidence",
        summary: "3 of 3 satisfied",
        widget: "evidence",
      }),
    ];

    expect(JSON.parse(JSON.stringify(descriptors))).toEqual(descriptors);
  });

  it("validates known metadata shapes and rejects unknown shapes", () => {
    const metadata = defineMetricWidgetMetadata({
      kind: "widget",
      label: "Open",
      value: "128",
      widget: "metric",
    });

    expect(isStudioViewMetadata(metadata)).toBe(true);
    expect(isStudioViewMetadata({ kind: "widget", widget: "chart" })).toBe(
      false
    );
    expect(
      isStudioViewMetadata(
        defineEvidenceWidgetMetadata({
          kind: "widget",
          label: "Evidence",
          summary: "Ready",
          widget: "evidence",
        })
      )
    ).toBe(true);
    expect(() => assertStudioViewMetadata(metadata)).not.toThrow();
    expect(() => assertStudioViewMetadata({ kind: "unknown" })).toThrow(
      "Invalid shadcn-studio-v2 view metadata."
    );
  });

  it("keeps the metadata registry serializable", () => {
    expect(studioMetadataLaneRegistry.map((entry) => entry.kind)).toEqual([
      "auth",
      "page",
      "widget",
    ]);
    expect(JSON.parse(JSON.stringify(studioMetadataLaneRegistry))).toEqual(
      studioMetadataLaneRegistry
    );
  });

  it("keeps metadata exports isolated from React and view implementations", () => {
    const metadataEntry = readFileSync(
      path.join(SRC_ROOT, "metadata.ts"),
      "utf8"
    );

    expect(metadataEntry).not.toContain("ReactNode");
    expect(metadataEntry).not.toContain("./views/");
    expect(metadataEntry).not.toContain("./components/");
  });
});
