import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HELPERS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const UI_ROOT = path.resolve(
  HELPERS_DIR,
  "..",
  "..",
  "components",
  "ui"
);
export const SRC_ROOT = path.resolve(HELPERS_DIR, "..", "..");

/** Canonical L1 primitive stems — must match every `*.tsx` file under `components/ui/`. */
export const UI_PRIMITIVE_FILES = [
  "accordion.tsx",
  "alert-dialog.tsx",
  "alert.tsx",
  "avatar.tsx",
  "badge.tsx",
  "breadcrumb.tsx",
  "button.tsx",
  "card.tsx",
  "checkbox.tsx",
  "collapsible.tsx",
  "combobox.tsx",
  "command.tsx",
  "context-menu.tsx",
  "dialog.tsx",
  "drawer.tsx",
  "dropdown-menu.tsx",
  "field.tsx",
  "hover-card.tsx",
  "input-otp.tsx",
  "input.tsx",
  "label.tsx",
  "menubar.tsx",
  "navigation-menu.tsx",
  "number-field.tsx",
  "pagination.tsx",
  "popover.tsx",
  "progress.tsx",
  "radio-group.tsx",
  "scroll-area.tsx",
  "select.tsx",
  "separator.tsx",
  "sheet.tsx",
  "skeleton.tsx",
  "switch.tsx",
  "table.tsx",
  "tabs.tsx",
  "textarea.tsx",
  "toggle-group.tsx",
  "toggle.tsx",
  "tooltip.tsx",
] as const;

export type UiPrimitiveFile = (typeof UI_PRIMITIVE_FILES)[number];

export const UI_PRIMITIVE_COUNT = UI_PRIMITIVE_FILES.length;

/** Primitives with direct or delegated focus / ring interaction semantics. */
export const INTERACTIVE_PRIMITIVES = [
  "accordion.tsx",
  "button.tsx",
  "checkbox.tsx",
  "combobox.tsx",
  "context-menu.tsx",
  "dropdown-menu.tsx",
  "input.tsx",
  "menubar.tsx",
  "navigation-menu.tsx",
  "number-field.tsx",
  "radio-group.tsx",
  "select.tsx",
  "switch.tsx",
  "tabs.tsx",
  "textarea.tsx",
  "toggle-group.tsx",
  "toggle.tsx",
] as const satisfies readonly UiPrimitiveFile[];

const KEBAB_STEM_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*\.tsx$/;
const SIBLING_IMPORT_PATTERN = /from\s+["']\.\/([a-z0-9-]+)["']/g;
const FOCUS_VISIBLE_PATTERN = /focus-visible|ring-ring/;
const RAW_HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/;
const FORBIDDEN_TOKEN_FAMILY_PATTERN =
  /--(?:brand|afenda|surface|luxury)-[a-z0-9-]*/;

const UI_PRIMITIVE_FILE_SET = new Set<string>(UI_PRIMITIVE_FILES);
const sourceCache = new Map<UiPrimitiveFile, string>();

export function clearUiPrimitiveSourceCache(): void {
  sourceCache.clear();
}

export function readUiPrimitiveSource(fileName: UiPrimitiveFile): string {
  const cached = sourceCache.get(fileName);
  if (cached !== undefined) {
    return cached;
  }

  const source = readFileSync(path.join(UI_ROOT, fileName), "utf8");
  sourceCache.set(fileName, source);
  return source;
}

export function readPackageSrcFile(...segments: string[]): string {
  return readFileSync(path.join(SRC_ROOT, ...segments), "utf8");
}

export function listUiPrimitiveFilesFromDisk(): string[] {
  return readdirSync(UI_ROOT)
    .filter((name) => name.endsWith(".tsx"))
    .sort();
}

export function assertKebabStem(fileName: string): boolean {
  return KEBAB_STEM_PATTERN.test(fileName);
}

export function isUiPrimitiveFile(
  fileName: string
): fileName is UiPrimitiveFile {
  return UI_PRIMITIVE_FILE_SET.has(fileName);
}

export function listSiblingPrimitiveImports(source: string): UiPrimitiveFile[] {
  const imports: UiPrimitiveFile[] = [];

  for (const match of source.matchAll(SIBLING_IMPORT_PATTERN)) {
    const fileName = `${match[1]}.tsx`;
    if (isUiPrimitiveFile(fileName) && !imports.includes(fileName)) {
      imports.push(fileName);
    }
  }

  return imports;
}

/** Resolves focus-visible / ring-ring via sibling primitive imports (transitive). */
export function hasFocusVisibleSemantics(
  fileName: UiPrimitiveFile,
  visited = new Set<UiPrimitiveFile>()
): boolean {
  if (visited.has(fileName)) {
    return false;
  }

  visited.add(fileName);

  const source = readUiPrimitiveSource(fileName);
  if (FOCUS_VISIBLE_PATTERN.test(source)) {
    return true;
  }

  for (const importedFile of listSiblingPrimitiveImports(source)) {
    if (hasFocusVisibleSemantics(importedFile, visited)) {
      return true;
    }
  }

  return false;
}

export function isReExportBarrel(source: string): boolean {
  return /^export \{/m.test(source.trimStart());
}

export function getUiLaneSafetyViolations(
  source: string,
  options: {
    readonly requireExportFunction?: boolean;
    readonly forbidClientHooks?: boolean;
    readonly forbidRouter?: boolean;
  } = {}
): string[] {
  const violations: string[] = [];

  if (options.requireExportFunction) {
    const hasExportFunction = source.includes("export function");
    const hasReExportBarrel = isReExportBarrel(source);
    if (!(hasExportFunction || hasReExportBarrel)) {
      violations.push("missing export function or re-export barrel");
    }
  }

  for (const forbidden of ["window.", "document.", "localStorage"]) {
    if (source.includes(forbidden)) {
      violations.push(forbidden);
    }
  }

  if (options.forbidClientHooks) {
    for (const hook of ["useState", "useEffect"]) {
      if (source.includes(hook)) {
        violations.push(hook);
      }
    }
  }

  if (options.forbidRouter) {
    for (const forbidden of [
      "useRouter",
      'from "next/link"',
      "next/navigation",
    ]) {
      if (source.includes(forbidden)) {
        violations.push(forbidden);
      }
    }
  }

  return violations;
}

export function getComponentQualityBarViolations(source: string): string[] {
  const violations: string[] = [];
  const hasExportFunction = source.includes("export function");
  const hasReExportBarrel = isReExportBarrel(source);

  if (!(hasExportFunction || hasReExportBarrel)) {
    violations.push("export function or re-export barrel");
    return violations;
  }

  if (hasReExportBarrel) {
    if (!/from "\.\//.test(source)) {
      violations.push("re-export from sibling primitive");
    }
    return violations;
  }

  if (RAW_HEX_PATTERN.test(source)) {
    violations.push("raw hex");
  }

  if (FORBIDDEN_TOKEN_FAMILY_PATTERN.test(source)) {
    violations.push("forbidden token families");
  }

  const hasDataSlot = source.includes("data-slot=");
  const hasClassNameHelper = /export function \w+ClassName/.test(source);
  if (!(hasDataSlot || hasClassNameHelper)) {
    violations.push("data-slot or *ClassName helper");
  }

  return violations;
}
