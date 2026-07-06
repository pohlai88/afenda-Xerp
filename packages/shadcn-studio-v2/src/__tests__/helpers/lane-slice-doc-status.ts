import { readFileSync } from "node:fs";
import path from "node:path";
import { expect } from "vitest";

const SLICE_COMPLETE_PATTERN = /Status: \*\*Complete\*\*/u;

export function readSliceDocument(
  slicesRoot: string,
  fileName: string
): string {
  return readFileSync(path.join(slicesRoot, fileName), "utf8");
}

export function assertSliceDocumentComplete(
  slicesRoot: string,
  fileName: string
): void {
  const sliceDocument = readSliceDocument(slicesRoot, fileName);
  expect(sliceDocument, fileName).toMatch(SLICE_COMPLETE_PATTERN);
}

export function assertSliceDocumentsComplete(
  slicesRoot: string,
  fileNames: readonly string[]
): void {
  for (const fileName of fileNames) {
    assertSliceDocumentComplete(slicesRoot, fileName);
  }
}
