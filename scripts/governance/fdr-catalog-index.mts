/**
 * Shared parser for docs/delivery/fdr-status-index.md §FDR register table.
 * Used by FDR catalog scaffold / drift validation tests.
 */

export const FDR_REGISTER_SECTION_START = "## §FDR register" as const;
export const FDR_REGISTER_SECTION_END = "## §FDR catalog by PKG" as const;

export const FDR_REGISTER_VALID_STATUSES = [
  "Not started",
  "Partially Implemented",
  "Complete (authority only)",
  "Complete",
  "Maintain Only",
  "Blocked",
] as const;

export type FdrRegisterStatus = (typeof FDR_REGISTER_VALID_STATUSES)[number];

export interface FdrRegisterRow {
  readonly documentFilename: string;
  readonly fdrId: string;
  readonly rowNumber: number;
  readonly status: string;
}

const REGISTER_ROW_PATTERN =
  /^\|\s*(\d+)\s*\|\s*(fdr-[^|]+?)\s*\|(?:[^|]+\|){4}\s*([^|]+?)\s*\|\s*\[FDR\/(\[[^\]]+\]\s+fdr-[^\]]+\.md)\]/;

export function statusPrefix(status: string): string {
  return `[${status}]`;
}

/** Extract `[Status]` prefix from a delivery doc filename. */
export function filenameStatusPrefix(filename: string): string | null {
  const match = filename.match(/^(\[[^\]]+\])/);
  return match?.[1] ?? null;
}

/** Parse §FDR register data rows from fdr-status-index.md markdown. */
export function parseFdrRegister(index: string): FdrRegisterRow[] {
  const registerStart = index.indexOf(FDR_REGISTER_SECTION_START);
  const registerEnd = index.indexOf(FDR_REGISTER_SECTION_END);
  if (
    registerStart === -1 ||
    registerEnd === -1 ||
    registerEnd <= registerStart
  ) {
    return [];
  }

  const section = index.slice(registerStart, registerEnd);
  const rows: FdrRegisterRow[] = [];

  for (const line of section.split("\n")) {
    const match = line.match(REGISTER_ROW_PATTERN);
    if (!match) {
      continue;
    }

    rows.push({
      rowNumber: Number.parseInt(match[1], 10),
      fdrId: match[2].trim(),
      status: match[3].trim(),
      documentFilename: match[4].trim(),
    });
  }

  return rows;
}
