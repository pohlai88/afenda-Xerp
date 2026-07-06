import { existsSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import {
  collectFiles,
  type DriftViolation,
  findFirstMatch,
  isTextFile,
  PACKAGE_ROOT,
  PACKAGE_SRC,
  parseJsonFile,
  QUARANTINE_INVENTORY_BASELINE_PATH,
  QUARANTINE_ROOT,
  REPO_ROOT,
  readText,
  toRelative,
} from "./shared.ts";

export const QUARANTINE_STALE_ADVISORY_DAYS = 30;
const MS_PER_DAY = 86_400_000;

const QUARANTINE_PUBLIC_ENTRYPOINTS = [
  "index.ts",
  "clients.ts",
  "server.ts",
  "metadata.ts",
] as const;

const QUARANTINE_IMPLEMENTATION_FILE_PATTERN = /\.(ts|tsx)$/u;
const QUARANTINE_KEBAB_STEM_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*\.tsx$/u;

const V2_QUARANTINE_IMPORT_PATTERNS = [
  {
    label: "package quarantine import",
    pattern:
      /(?<quote>["'])(?:\.\.?\/)+components\/quarantine\/[^"']+\k<quote>/gu,
  },
  {
    label: "consumer quarantine deep import",
    pattern:
      /(?<quote>["'])@afenda\/shadcn-studio-v2(?:\/[^"']*)?\/components\/quarantine\/[^"']+\k<quote>/gu,
  },
  {
    label: "consumer quarantine source import",
    pattern:
      /(?<quote>["'])(?:\.\.?\/)*packages\/shadcn-studio-v2\/src\/components\/quarantine\/[^"']+\k<quote>/gu,
  },
] satisfies ReadonlyArray<{ readonly label: string; readonly pattern: RegExp }>;

interface QuarantineInventoryBaseline {
  readonly files: ReadonlyArray<
    | string
    | {
        readonly decision?: string;
        readonly path: string;
        readonly recordedAt?: string;
      }
  >;
}

export interface QuarantineInventorySummary {
  readonly advisoryCount: number;
  readonly baselinePaths: readonly string[];
  readonly onDiskPaths: readonly string[];
}

const listQuarantineImplementationPaths = async (): Promise<string[]> => {
  if (!existsSync(QUARANTINE_ROOT)) {
    return [];
  }

  const entries = await readdir(QUARANTINE_ROOT, { withFileTypes: true });

  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        QUARANTINE_IMPLEMENTATION_FILE_PATTERN.test(entry.name)
    )
    .map((entry) => `components/quarantine/${entry.name}`)
    .sort();
};

const normalizeQuarantineBaselinePaths = (
  baseline: QuarantineInventoryBaseline
): string[] =>
  baseline.files
    .map((entry) => (typeof entry === "string" ? entry : entry.path))
    .sort();

const checkQuarantinePublicExports = async (): Promise<DriftViolation[]> => {
  const violations: DriftViolation[] = [];

  for (const entrypoint of QUARANTINE_PUBLIC_ENTRYPOINTS) {
    const filePath = path.join(PACKAGE_SRC, entrypoint);

    if (!existsSync(filePath)) {
      continue;
    }

    const content = await readText(filePath);

    if (
      content.includes("components/quarantine") ||
      content.includes("/quarantine/")
    ) {
      violations.push({
        rule: "quarantine-public-export",
        file: toRelative(filePath),
        detail:
          "Public entrypoints must not export or import quarantine paths.",
      });
    }
  }

  return violations;
};

const checkQuarantineImports = async (): Promise<DriftViolation[]> => {
  const violations: DriftViolation[] = [];
  const packageFiles = (await collectFiles(PACKAGE_SRC)).filter(isTextFile);
  const consumerRoots = [
    path.join(REPO_ROOT, "apps"),
    path.join(REPO_ROOT, "packages"),
  ];

  for (const file of packageFiles) {
    if (file.startsWith(QUARANTINE_ROOT)) {
      continue;
    }

    const content = await readText(file);

    for (const { label, pattern } of V2_QUARANTINE_IMPORT_PATTERNS) {
      const match = findFirstMatch(content, pattern);

      if (match) {
        violations.push({
          rule: "quarantine-import",
          file: toRelative(file),
          detail: `${label}: ${match}`,
        });
      }
    }
  }

  for (const root of consumerRoots) {
    const files = (await collectFiles(root)).filter(
      (file) => isTextFile(file) && !file.startsWith(PACKAGE_ROOT)
    );

    for (const file of files) {
      const content = await readText(file);

      for (const { label, pattern } of V2_QUARANTINE_IMPORT_PATTERNS.slice(1)) {
        const match = findFirstMatch(content, pattern);

        if (match) {
          violations.push({
            rule: "quarantine-consumer-import",
            file: toRelative(file),
            detail: `${label}: ${match}`,
          });
        }
      }
    }
  }

  return violations;
};

const checkQuarantineInventory = async (): Promise<{
  readonly summary: QuarantineInventorySummary;
  readonly violations: DriftViolation[];
}> => {
  const onDiskPaths = await listQuarantineImplementationPaths();
  const baseline = await parseJsonFile<QuarantineInventoryBaseline>(
    QUARANTINE_INVENTORY_BASELINE_PATH
  );
  const violations: DriftViolation[] = [];
  let advisoryCount = 0;

  if (!baseline) {
    return {
      summary: {
        advisoryCount: 0,
        baselinePaths: [],
        onDiskPaths,
      },
      violations: [
        {
          rule: "quarantine-inventory-baseline",
          file: toRelative(QUARANTINE_INVENTORY_BASELINE_PATH),
          detail:
            "Quarantine inventory baseline is required (see components/quarantine/README.md).",
        },
      ],
    };
  }

  const baselinePaths = normalizeQuarantineBaselinePaths(baseline);
  const baselineSet = new Set(baselinePaths);
  const onDiskSet = new Set(onDiskPaths);

  for (const filePath of onDiskPaths) {
    if (!baselineSet.has(filePath)) {
      violations.push({
        rule: "quarantine-inventory-drift",
        file: toRelative(QUARANTINE_ROOT),
        detail: `${filePath} exists on disk but is missing from inventory.baseline.json.`,
      });
    }
  }

  for (const filePath of baselinePaths) {
    if (!onDiskSet.has(filePath)) {
      violations.push({
        rule: "quarantine-inventory-drift",
        file: toRelative(QUARANTINE_INVENTORY_BASELINE_PATH),
        detail: `${filePath} is listed in inventory.baseline.json but missing on disk.`,
      });
    }
  }

  const baselineByPath = new Map(
    baseline.files.map((entry) =>
      typeof entry === "string"
        ? [entry, { path: entry, decision: "pending" as const }]
        : [entry.path, entry]
    )
  );
  const staleThresholdMs = QUARANTINE_STALE_ADVISORY_DAYS * MS_PER_DAY;
  const now = Date.now();

  for (const filePath of onDiskPaths) {
    const fileName = path.basename(filePath);
    const absolutePath = path.join(QUARANTINE_ROOT, fileName);

    if (
      fileName.endsWith(".tsx") &&
      !QUARANTINE_KEBAB_STEM_PATTERN.test(fileName)
    ) {
      violations.push({
        rule: "quarantine-kebab-stem",
        file: toRelative(absolutePath),
        detail: `${fileName} must use kebab-case before promotion (pnpm normalize:kebab-stems --check).`,
      });
    }

    const entry = baselineByPath.get(filePath);
    const decision = entry?.decision ?? "pending";
    const fileStat = await stat(absolutePath);
    const ageMs = now - fileStat.mtimeMs;

    if (
      decision === "pending" &&
      ageMs > staleThresholdMs &&
      fileName.endsWith(".tsx")
    ) {
      advisoryCount += 1;
      console.warn(
        `[quarantine-stale-advisory] ${filePath} is older than ${QUARANTINE_STALE_ADVISORY_DAYS} days without promotion decision.`
      );
    }
  }

  return {
    summary: {
      advisoryCount,
      baselinePaths,
      onDiskPaths,
    },
    violations,
  };
};

export const checkQuarantineGovernance = async (): Promise<{
  readonly summary: QuarantineInventorySummary;
  readonly violations: DriftViolation[];
}> => {
  const inventory = await checkQuarantineInventory();

  return {
    summary: inventory.summary,
    violations: [
      ...(await checkQuarantinePublicExports()),
      ...(await checkQuarantineImports()),
      ...inventory.violations,
    ],
  };
};
