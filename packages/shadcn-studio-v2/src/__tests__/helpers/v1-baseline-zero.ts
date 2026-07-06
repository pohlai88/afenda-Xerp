import { readFileSync } from "node:fs";
import path from "node:path";
import { expect } from "vitest";

const V1_CONSUMER_IMPORT_BASELINE_RELATIVE = path.join(
  "scripts",
  "lane-b",
  "v1-consumer-import.baseline.json"
);

export interface V1ConsumerImportBaseline {
  readonly imports: readonly unknown[];
  readonly policy: "LANE-B-01";
  readonly totals: {
    readonly all: number;
    readonly developer: number;
    readonly erp: number;
    readonly storybook: number;
  };
}

export function readV1ConsumerImportBaseline(
  packageRoot: string
): V1ConsumerImportBaseline {
  const baselinePath = path.join(
    packageRoot,
    V1_CONSUMER_IMPORT_BASELINE_RELATIVE
  );
  return JSON.parse(
    readFileSync(baselinePath, "utf8")
  ) as V1ConsumerImportBaseline;
}

export function assertZeroV1ConsumerImportBaseline(
  baseline: V1ConsumerImportBaseline
): void {
  expect(baseline.policy).toBe("LANE-B-01");
  expect(baseline.totals.all).toBe(0);
  expect(baseline.totals.developer).toBe(0);
  expect(baseline.totals.erp).toBe(0);
  expect(baseline.totals.storybook).toBe(0);
  expect(baseline.imports.length).toBe(0);
}
