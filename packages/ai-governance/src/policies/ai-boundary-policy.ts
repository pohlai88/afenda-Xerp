import {
  BUSINESS_LOGIC_FORBIDDEN_LAYERS,
  FORBIDDEN_AI_PACKAGE_PATTERNS,
  FORBIDDEN_BROAD_SCOPE_GLOBS,
} from "../contracts/ai-boundary.contract.js";

export {
  BUSINESS_LOGIC_FORBIDDEN_LAYERS,
  FORBIDDEN_AI_PACKAGE_PATTERNS,
  FORBIDDEN_BROAD_SCOPE_GLOBS,
};

export const DOMAIN_LAYER = "Domain" as const;

export const ARCHITECTURE_AUTHORITY_PACKAGE = "@afenda/architecture-authority";

export const IMPORT_PATTERN =
  /\bfrom\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']/gu;

export const DEEP_RELATIVE_PACKAGE_PATTERN =
  /\.\.\/(?:\.\.\/)+packages\/[^/"']+\/src\//u;

export const PRIVATE_AFENDA_SUBPATH_PATTERN =
  /^@afenda\/[^/]+\/(?:src|dist)\//u;

export function extractWorkspacePackageName(specifier: string): string {
  const segments = specifier.split("/");
  return `${segments[0]}/${segments[1]}`;
}

function matchesWildcardExportKey(
  exportKey: string,
  exportKeys: readonly string[]
): boolean {
  for (const key of exportKeys) {
    if (!key.endsWith("/*")) {
      continue;
    }

    const prefix = key.slice(0, -1);
    if (exportKey.startsWith(prefix) && exportKey.length > prefix.length) {
      return true;
    }
  }

  return false;
}

export function isPublicExportSpecifier(
  specifier: string,
  exportKeys: readonly string[]
): boolean {
  if (!specifier.startsWith("@afenda/")) {
    return true;
  }

  const packageName = extractWorkspacePackageName(specifier);
  const subpath = specifier.slice(packageName.length);

  if (!subpath) {
    return exportKeys.includes(".");
  }

  const exportKey = `.${subpath}`;
  if (exportKeys.includes(exportKey)) {
    return true;
  }

  return matchesWildcardExportKey(exportKey, exportKeys);
}
