import { expect } from "vitest";

/** Matches v1 `@afenda/shadcn-studio` imports but not `@afenda/shadcn-studio-v2`. */
export const FORBIDDEN_V1_CONSUMER_IMPORT =
  /from\s+["']@afenda\/shadcn-studio(?:\/(?!v2)|["'])/u;

export function assertNoV1ConsumerImport(source: string, label?: string): void {
  expect(source, label).not.toMatch(FORBIDDEN_V1_CONSUMER_IMPORT);
}

export function assertSourcesFreeOfV1Imports(
  sources: ReadonlyArray<{ readonly label: string; readonly source: string }>
): void {
  for (const { label, source } of sources) {
    assertNoV1ConsumerImport(source, label);
  }
}
