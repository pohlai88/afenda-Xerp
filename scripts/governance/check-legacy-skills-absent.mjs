#!/usr/bin/env node
/**
 * Fail if deleted presentation skills reappear under .cursor/skills/.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const skillsRoot = join(repoRoot, ".cursor/skills");

const FORBIDDEN_PATHS = [
  ".cursor/skills/_retired/legacy-ui",
  ".cursor/skills/ui-consistency-bundle",
];

const FORBIDDEN_SKILL_NAMES = new Set([
  "css-authority",
  "shadcn-studio-authority",
  "govern-primitive",
  "afenda-ui-quality",
  "afenda-shadcn-components",
  "ui-consistency-bundle",
  "react-erp-quality",
  "enterprise-frontend-audit",
]);

function collectSkillFiles(directory, files = []) {
  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory)) {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      if (entry === "vendor" || entry === "_retired") {
        continue;
      }
      collectSkillFiles(absolutePath, files);
      continue;
    }

    if (entry === "SKILL.md") {
      files.push(absolutePath);
    }
  }

  return files;
}

const violations = [];

for (const relativePath of FORBIDDEN_PATHS) {
  if (existsSync(join(repoRoot, relativePath))) {
    violations.push(`Forbidden path still exists: ${relativePath}`);
  }
}

for (const skillPath of collectSkillFiles(skillsRoot)) {
  const source = readFileSync(skillPath, "utf8");
  const nameMatch = source.match(/^name:\s*(.+)$/m);
  const skillName = nameMatch?.[1]?.trim();

  if (skillName && FORBIDDEN_SKILL_NAMES.has(skillName)) {
    const relative = skillPath.replace(/\\/g, "/").split(".cursor/skills/")[1];
    violations.push(
      `Deleted skill name "${skillName}" found at .cursor/skills/${relative}`
    );
  }
}

if (violations.length > 0) {
  process.stderr.write("legacy skills absent: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

process.stdout.write("legacy skills absent: OK\n");
process.exit(0);
