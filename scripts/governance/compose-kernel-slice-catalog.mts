/**
 * Regenerates docs/PAS/KERNEL/SLICE/kernel-slice-catalog.md from on-disk b*.md files.
 */
import fs from "node:fs";
import path from "node:path";

const dir = path.join("docs", "PAS", "KERNEL", "SLICE");
const files = fs
  .readdirSync(dir)
  .filter((f) => /^b\d+/.test(f))
  .sort((a, b) => {
    const na = Number(a.match(/^b(\d+)/i)?.[1] ?? 0);
    const nb = Number(b.match(/^b(\d+)/i)?.[1] ?? 0);
    return na - nb;
  });

const rows = files
  .map((f) => {
    const id = f.match(/^(b\d+)/i)?.[1]?.toUpperCase() ?? f;
    return `| ${id} | [${f}](./${f}) |`;
  })
  .join("\n");

const manifest = files.map((f) => `- [${f}](./${f})`).join("\n");

const out = `# Kernel Slice Catalog

| Field | Value |
| --- | --- |
| **SSOT directory** | \`docs/PAS/KERNEL/SLICE/\` |
| **Individual handoffs** | ${files.length} files |
| **Legacy** | \`docs/PAS/slice/\` removed — do not use |
| **Last reviewed** | 2026-06-29 |

> **Catalog only.** Open the linked \`b*.md\` file for the 9-field handoff.

## All individual slice files (${files.length})

${manifest}

## Index table

| ID | File |
| --- | --- |
${rows}

## Build order

\`\`\`text
PAS-001:  B49 → B70
PAS-001A: B71 → B75
PAS-001B: B76 → B106
\`\`\`

See [README.md](./README.md) · [slice-compliance-audit.md](./slice-compliance-audit.md)
`;

fs.writeFileSync(path.join(dir, "kernel-slice-catalog.md"), out);
console.log("wrote catalog", files.length, "slices");
