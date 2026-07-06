import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  COMPONENTS_JSON_PATH,
  collectFiles,
  type DriftViolation,
  findFirstMatch,
  isTextFile,
  PACKAGE_JSON_PATH,
  PACKAGE_ROOT,
  PACKAGE_SRC,
  parseJsonFile,
  REPO_ROOT,
  readText,
  toRelative,
} from "./shared.ts";

interface ComponentsJson {
  readonly tailwind?: {
    readonly config?: unknown;
    readonly css?: unknown;
    readonly cssVariables?: unknown;
  };
}

interface PackageJson {
  readonly exports?: Record<string, unknown>;
  readonly sideEffects?: unknown;
}

const TAILWIND_CONFIG_FILE_PATTERN =
  /^tailwind\.config\.(?:cjs|js|mjs|mts|ts)$/u;

const REQUIRED_CSS_EXPORTS = {
  "./shadcn-default.css": "./dist/shadcn-default.css",
  "./themes/afenda-brand.css": "./dist/themes/afenda-brand.css",
  "./themes/swiss-noir.css": "./dist/themes/swiss-noir.css",
  "./themes/verdant-noir.css": "./dist/themes/verdant-noir.css",
} as const;

const V2_INTERNAL_IMPORT_PATTERN =
  /(?<quote>["'])@afenda\/shadcn-studio-v2\/(?<subpath>(?:components|views|contexts|styles|src)(?:\/[^"']*)?|metadata\/[^"']+)\k<quote>/gu;

const V2_SOURCE_STYLE_PATH_PATTERN =
  /(?<quote>["'])(?:\.\.?\/)*packages\/shadcn-studio-v2\/src\/styles\/[^"']+\k<quote>/gu;

const V2_FORBIDDEN_RUNTIME_IMPORT_PATTERNS = [
  {
    label: "_reference import",
    pattern: /(?<quote>["'])(?:\.\.?\/)*_reference\/[^"']+\k<quote>/gu,
  },
  {
    label: "legacy shadcn-studio source import",
    pattern:
      /(?<quote>["'])(?:@afenda\/shadcn-studio\/src|(?:\.\.?\/)*packages\/shadcn-studio\/src)\/[^"']+\k<quote>/gu,
  },
  {
    label: "legacy shadcn-studio package import",
    pattern: /(?<quote>["'])@afenda\/shadcn-studio(?:\/[^"']*)?\k<quote>/gu,
  },
] satisfies ReadonlyArray<{ readonly label: string; readonly pattern: RegExp }>;

export const checkTailwindV4ShadcnBoundary = async (): Promise<
  DriftViolation[]
> => {
  const violations: DriftViolation[] = [];
  const packageFiles = await collectFiles(PACKAGE_ROOT);
  const componentsJson =
    await parseJsonFile<ComponentsJson>(COMPONENTS_JSON_PATH);

  for (const file of packageFiles) {
    if (TAILWIND_CONFIG_FILE_PATTERN.test(path.basename(file))) {
      violations.push({
        rule: "tailwind-v4-config-file",
        file: toRelative(file),
        detail:
          "Tailwind v4 shadcn setup must not restore tailwind.config.* theming.",
      });
    }
  }

  if (!componentsJson) {
    violations.push({
      rule: "missing-components-json",
      file: toRelative(COMPONENTS_JSON_PATH),
      detail: "shadcn components.json is required for CSS variable setup.",
    });

    return violations;
  }

  if (componentsJson.tailwind?.config !== "") {
    violations.push({
      rule: "tailwind-v4-components-config",
      file: toRelative(COMPONENTS_JSON_PATH),
      detail:
        'Tailwind v4 shadcn setup requires "tailwind.config" to be empty.',
    });
  }

  if (componentsJson.tailwind?.css !== "src/styles/shadcn-default.css") {
    violations.push({
      rule: "tailwind-v4-components-css",
      file: toRelative(COMPONENTS_JSON_PATH),
      detail:
        "components.json must point shadcn generation at the Phase 2 default CSS authority file.",
    });
  }

  if (componentsJson.tailwind?.cssVariables !== true) {
    violations.push({
      rule: "tailwind-v4-components-css-variables",
      file: toRelative(COMPONENTS_JSON_PATH),
      detail: "shadcn generation must keep CSS variables enabled.",
    });
  }

  return violations;
};

const getCssExportImport = (value: unknown): string | null => {
  if (typeof value !== "object" || value === null || !("import" in value)) {
    return null;
  }

  const exportValue = value as { readonly import?: unknown };

  return typeof exportValue.import === "string" ? exportValue.import : null;
};

export const checkCssPackageBoundary = async (): Promise<DriftViolation[]> => {
  const violations: DriftViolation[] = [];
  const packageJson = await parseJsonFile<PackageJson>(PACKAGE_JSON_PATH);

  if (!packageJson) {
    return [
      {
        rule: "missing-package-json",
        file: toRelative(PACKAGE_JSON_PATH),
        detail: "package.json is required to expose Phase 2 CSS authority.",
      },
    ];
  }

  for (const [exportPath, distPath] of Object.entries(REQUIRED_CSS_EXPORTS)) {
    const actualDistPath = getCssExportImport(
      packageJson.exports?.[exportPath]
    );

    if (actualDistPath !== distPath) {
      violations.push({
        rule: "css-package-export",
        file: toRelative(PACKAGE_JSON_PATH),
        detail: `${exportPath} must import ${distPath}.`,
      });
    }
  }

  if (!Array.isArray(packageJson.sideEffects)) {
    violations.push({
      rule: "css-package-side-effects",
      file: toRelative(PACKAGE_JSON_PATH),
      detail: "CSS exports must be listed in package sideEffects.",
    });

    return violations;
  }

  for (const distPath of Object.values(REQUIRED_CSS_EXPORTS)) {
    if (!packageJson.sideEffects.includes(distPath)) {
      violations.push({
        rule: "css-package-side-effects",
        file: toRelative(PACKAGE_JSON_PATH),
        detail: `${distPath} must be preserved as a CSS side effect.`,
      });
    }
  }

  return violations;
};

export const checkV2RuntimeImports = async (): Promise<DriftViolation[]> => {
  const files = (await collectFiles(PACKAGE_SRC)).filter(
    (file) =>
      isTextFile(file) && !file.includes(`${path.sep}__tests__${path.sep}`)
  );
  const violations: DriftViolation[] = [];

  for (const file of files) {
    const content = await readText(file);

    for (const { label, pattern } of V2_FORBIDDEN_RUNTIME_IMPORT_PATTERNS) {
      const match = findFirstMatch(content, pattern);

      if (match) {
        violations.push({
          rule: "forbidden-v2-runtime-import",
          file: toRelative(file),
          detail: `${label}: ${match}`,
        });
      }
    }
  }

  return violations;
};

export const checkConsumerDeepImports = async (): Promise<DriftViolation[]> => {
  const candidateRoots = [
    path.join(REPO_ROOT, "apps"),
    path.join(REPO_ROOT, "packages"),
  ];
  const violations: DriftViolation[] = [];

  for (const root of candidateRoots) {
    const files = (await collectFiles(root)).filter(
      (file) => isTextFile(file) && !file.startsWith(PACKAGE_ROOT)
    );

    for (const file of files) {
      const content = await readText(file);
      const internalImport = findFirstMatch(
        content,
        V2_INTERNAL_IMPORT_PATTERN
      );
      const isTsconfigPathAlias = /tsconfig(?:\.[\w-]+)?\.json$/u.test(file);
      const stylePathImport = isTsconfigPathAlias
        ? null
        : findFirstMatch(content, V2_SOURCE_STYLE_PATH_PATTERN);

      if (internalImport) {
        violations.push({
          rule: "forbidden-consumer-v2-internal-import",
          file: toRelative(file),
          detail: `consumer deep import ${internalImport}`,
        });
      }

      if (stylePathImport) {
        violations.push({
          rule: "forbidden-consumer-v2-style-source-import",
          file: toRelative(file),
          detail: `consumer source style import ${stylePathImport}`,
        });
      }
    }
  }

  return violations;
};

export const checkRedundantBiomeSuppressions = async (): Promise<
  DriftViolation[]
> => {
  const policyPath = path.join(
    REPO_ROOT,
    "scripts/studio/shadcn-studio-v2-biome-suppression-policy.mjs"
  );
  const policy = (await import(pathToFileURL(policyPath).href)) as {
    findRedundantV2BiomeSuppressions: () => Array<{
      detail: string;
      file: string;
    }>;
  };

  return policy.findRedundantV2BiomeSuppressions().map((violation) => ({
    rule: "redundant-biome-suppression",
    file: violation.file,
    detail: violation.detail,
  }));
};
