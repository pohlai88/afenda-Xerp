import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { loadArchitectureAuthority, workspaceRoot } from "./shared.mjs";

const authority = await loadArchitectureAuthority();
const markdown = authority.buildOwnershipAuditMarkdown();
const outputPath = join(workspaceRoot, "docs/architecture/ownership-audit.md");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, markdown, "utf8");
console.log(`wrote ${outputPath}`);
