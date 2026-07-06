import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HELPERS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const SRC_ROOT = path.resolve(HELPERS_DIR, "..", "..");
export const VIEWS_ROOT = path.join(SRC_ROOT, "views");

/** Canonical L4 view stems — kebab paths relative to `src/views/`. */
export const L4_VIEW_FILES = [
  "auth/auth-shell.tsx",
  "datatables/data-table-surface.tsx",
  "dialogs/confirm-dialog-surface.tsx",
  "forms/form-surface.tsx",
  "pages/page-surface.tsx",
  "settings/settings-surface.tsx",
  "widgets/widget-evidence.tsx",
  "widgets/widget-metric.tsx",
] as const;

export type L4ViewFile = (typeof L4_VIEW_FILES)[number];

export const L4_VIEW_COUNT = L4_VIEW_FILES.length;

export const VIEW_SURFACE_STATES = [
  "loading",
  "empty",
  "error",
  "unavailable",
] as const;

export type ViewSurfaceStateName = (typeof VIEW_SURFACE_STATES)[number];

export const AUTH_SHELL_STATES = [
  "loading",
  "error",
  "unavailable",
  "disabled",
] as const;

export type AuthShellStateName = (typeof AUTH_SHELL_STATES)[number];

export interface L4ViewExportSpec {
  readonly exportName: string;
  readonly file: L4ViewFile;
  readonly stateSlot: string;
  readonly states: readonly string[];
}

/** Public L4 view components exported from `src/index.ts` (excludes adapter helpers). */
export const L4_VIEW_EXPORTS = [
  {
    exportName: "AuthShell",
    file: "auth/auth-shell.tsx",
    stateSlot: "auth-shell-state",
    states: AUTH_SHELL_STATES,
  },
  {
    exportName: "DataTableSurface",
    file: "datatables/data-table-surface.tsx",
    stateSlot: "data-table-surface-state",
    states: VIEW_SURFACE_STATES,
  },
  {
    exportName: "ConfirmDialogSurface",
    file: "dialogs/confirm-dialog-surface.tsx",
    stateSlot: "confirm-dialog-surface-state",
    states: VIEW_SURFACE_STATES,
  },
  {
    exportName: "FormSurface",
    file: "forms/form-surface.tsx",
    stateSlot: "form-surface-state",
    states: VIEW_SURFACE_STATES,
  },
  {
    exportName: "PageSurface",
    file: "pages/page-surface.tsx",
    stateSlot: "page-surface-state",
    states: VIEW_SURFACE_STATES,
  },
  {
    exportName: "SettingsSurface",
    file: "settings/settings-surface.tsx",
    stateSlot: "settings-surface-state",
    states: VIEW_SURFACE_STATES,
  },
  {
    exportName: "EvidenceWidget",
    file: "widgets/widget-evidence.tsx",
    stateSlot: "evidence-widget-state",
    states: VIEW_SURFACE_STATES,
  },
  {
    exportName: "MetricWidget",
    file: "widgets/widget-metric.tsx",
    stateSlot: "metric-widget-state",
    states: VIEW_SURFACE_STATES,
  },
] as const satisfies readonly L4ViewExportSpec[];

export interface L4ViewStateCase {
  readonly exportName: L4ViewExportSpec["exportName"];
  readonly file: L4ViewFile;
  readonly state: string;
  readonly stateSlot: string;
}

const L4_VIEW_FILE_SET = new Set<string>(L4_VIEW_FILES);
const sourceCache = new Map<L4ViewFile, string>();

export function clearL4ViewSourceCache(): void {
  sourceCache.clear();
}

export function readL4ViewSource(relativePath: L4ViewFile): string {
  const cached = sourceCache.get(relativePath);
  if (cached !== undefined) {
    return cached;
  }

  const source = readFileSync(path.join(VIEWS_ROOT, relativePath), "utf8");
  sourceCache.set(relativePath, source);
  return source;
}

export function listL4ViewFilesFromDisk(): string[] {
  const files: string[] = [];

  for (const name of readdirSync(VIEWS_ROOT)) {
    const categoryPath = path.join(VIEWS_ROOT, name);

    if (!statSync(categoryPath).isDirectory()) {
      continue;
    }

    for (const fileName of readdirSync(categoryPath)) {
      if (!fileName.endsWith(".tsx")) {
        continue;
      }

      files.push(`${name}/${fileName}`);
    }
  }

  return files.sort();
}

export function isL4ViewFile(relativePath: string): relativePath is L4ViewFile {
  return L4_VIEW_FILE_SET.has(relativePath);
}

export function buildL4ViewStateMatrix(): readonly L4ViewStateCase[] {
  const cases: L4ViewStateCase[] = [];

  for (const view of L4_VIEW_EXPORTS) {
    for (const state of view.states) {
      cases.push({
        exportName: view.exportName,
        file: view.file,
        state,
        stateSlot: view.stateSlot,
      });
    }
  }

  return cases;
}

export const L4_VIEW_STATE_MATRIX = buildL4ViewStateMatrix();

const DEFAULT_STATE_MESSAGES_PATTERN =
  /const DEFAULT_[A-Z0-9_]+_STATE_MESSAGES = \{([\s\S]*?)\} satisfies/;

export function getL4ViewStateDefaultViolations(
  relativePath: L4ViewFile,
  requiredStates: readonly string[]
): string[] {
  const source = readL4ViewSource(relativePath);
  const violations: string[] = [];
  const match = DEFAULT_STATE_MESSAGES_PATTERN.exec(source);

  if (match == null) {
    violations.push("missing DEFAULT_*_STATE_MESSAGES block");
    return violations;
  }

  const blockBody = match[1] ?? "";

  for (const state of requiredStates) {
    if (!new RegExp(`\\b${state}:\\s*\\{`).test(blockBody)) {
      violations.push(`missing default message for state "${state}"`);
    }
  }

  if (!source.includes("_SLOTS.state")) {
    violations.push("missing governed state slot reference");
  }

  if (
    !(
      source.includes('role={isError ? "alert" : "status"}') ||
      source.includes('role="alert"')
    )
  ) {
    violations.push("missing accessible state role semantics");
  }

  return violations;
}
