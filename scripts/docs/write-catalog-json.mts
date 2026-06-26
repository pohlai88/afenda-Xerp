import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export function writeCatalogJson(
  outputPath: string,
  catalog: unknown
): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}
