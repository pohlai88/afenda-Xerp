import { existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import {
  collectDirectories,
  collectFiles,
  type DriftViolation,
  findFirstMatch,
  isComponentFile,
  PACKAGE_SRC,
  readText,
  toRelative,
} from "./shared.ts";

export const FORBIDDEN_LEGACY_FOLDERS = [
  "components-ui",
  "components-layouts",
  "components-auth-shell",
  "theme-runtime",
  "meta-contracts",
  "blocks",
  "sections",
  "features",
  "domains",
] as const;

export const HARDCODED_HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/u;

export const checkLegacyFolders = async (): Promise<DriftViolation[]> => {
  const directories = await collectDirectories(PACKAGE_SRC);
  const forbiddenNames = new Set(FORBIDDEN_LEGACY_FOLDERS);

  return directories
    .filter((directory) =>
      forbiddenNames.has(
        path.basename(directory) as (typeof FORBIDDEN_LEGACY_FOLDERS)[number]
      )
    )
    .map((directory) => ({
      rule: "forbidden-legacy-folder",
      file: toRelative(directory),
      detail:
        "Legacy or reference structural folder restored inside V2 source.",
    }));
};

export const checkHardcodedHex = async (): Promise<DriftViolation[]> => {
  const roots = [
    path.join(PACKAGE_SRC, "components"),
    path.join(PACKAGE_SRC, "views"),
  ];
  const violations: DriftViolation[] = [];

  for (const root of roots) {
    const rootStat = existsSync(root) ? await stat(root) : null;

    if (!rootStat?.isDirectory()) {
      continue;
    }

    const files = (await collectFiles(root)).filter(isComponentFile);

    for (const file of files) {
      const content = await readText(file);
      const match = findFirstMatch(content, HARDCODED_HEX_PATTERN);

      if (match) {
        violations.push({
          rule: "hardcoded-hex",
          file: toRelative(file),
          detail: `hardcoded color ${match}; use canonical CSS tokens instead`,
        });
      }
    }
  }

  return violations;
};
