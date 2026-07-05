import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ConsumerPilotView,
  consumerPilotMetadata,
} from "../storybook/fixtures/consumer-pilot";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = path.resolve(
  TEST_DIR,
  "../storybook/fixtures/consumer-pilot.tsx"
);

describe("Slice 8 consumer pilot", () => {
  it("renders through public client and metadata surfaces", () => {
    const markup = renderToStaticMarkup(<ConsumerPilotView />);

    expect(markup).toContain("Consumer pilot");
    expect(markup).toContain("Pilot checks");
    expect(markup).toContain('data-slot="page-surface"');
    expect(markup).toContain('data-slot="metric-widget"');
  });

  it("keeps pilot metadata serializable", () => {
    expect(JSON.parse(JSON.stringify(consumerPilotMetadata))).toEqual(
      consumerPilotMetadata
    );
  });

  it("does not bypass public V2 entrypoints", () => {
    const source = readFileSync(FIXTURE_PATH, "utf8");

    expect(source).toContain('from "../../clients"');
    expect(source).toContain('from "../../metadata"');
    expect(source).not.toContain("../../components/");
    expect(source).not.toContain("../../views/");
    expect(source).not.toContain("../../contexts/");
  });
});
