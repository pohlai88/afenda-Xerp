/**
 * PAS-001 section slicing for governance gates.
 *
 * Matches sections by numeric prefix (`# 5.`, `# 7.`, …) so gate scripts survive
 * heading prose renames (e.g. "What Kernel Must Never Own" → "What This Package Must Never Own").
 */

export function slicePasSection(
  source: string,
  fromSectionNumber: number,
  toSectionNumber: number
): string {
  const startPattern = new RegExp(`^# ${fromSectionNumber}\\.`, "m");
  const endPattern = new RegExp(`^# ${toSectionNumber}\\.`, "m");

  const sectionStart = source.search(startPattern);
  const sectionEnd = source.search(endPattern);

  if (sectionStart === -1 || sectionEnd === -1 || sectionEnd <= sectionStart) {
    throw new Error(
      `Could not locate PAS §${fromSectionNumber}–§${toSectionNumber} boundaries in PAS-001.`
    );
  }

  return source.slice(sectionStart, sectionEnd);
}

export function extractPasBulletLabels(section: string): string[] {
  const labels: string[] = [];

  for (const line of section.split("\n")) {
    const match = /^\*\s+(.+)\s*$/.exec(line.trim());
    if (match?.[1]) {
      labels.push(match[1].replace(/^`|`$/g, ""));
    }
  }

  return labels;
}
