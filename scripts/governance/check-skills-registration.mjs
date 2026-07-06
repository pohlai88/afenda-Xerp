#!/usr/bin/env node
/**
 * Skills registration pipeline — native `.cursor/skills/` must match README catalog
 * and YAML `name` must match directory name. See `.cursor/rules/skills-routing.mdc`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const skillsRoot = join(repoRoot, ".cursor/skills");
const readmePath = join(skillsRoot, "README.md");

/** Catalog rows allowed without a filesystem skill directory. */
const PLANNED_CATALOG_SKILLS = new Set(["docs-editorial-design"]);

/** Nested copies of top-level registry files are forbidden. */
const FORBIDDEN_NESTED_REGISTRY = ["NATIVE-EVALUATION.md"];

function listNativeSkillDirs() {
  if (!existsSync(skillsRoot)) {
    return [];
  }

  return readdirSync(skillsRoot).filter((entry) => {
    if (entry === "vendor" || entry === "_retired" || entry.startsWith(".")) {
      return false;
    }
    return statSync(join(skillsRoot, entry)).isDirectory();
  });
}

function isRegisteredInReadme(skillName, readme) {
  return (
    readme.includes(`\`${skillName}\``) ||
    readme.includes(`| \`${skillName}\` `) ||
    readme.includes(`| ${skillName} `)
  );
}

const violations = [];
const readme = existsSync(readmePath) ? readFileSync(readmePath, "utf8") : "";

for (const dirName of listNativeSkillDirs()) {
  const skillDir = join(skillsRoot, dirName);
  const skillPath = join(skillDir, "SKILL.md");

  for (const nested of FORBIDDEN_NESTED_REGISTRY) {
    const nestedPath = join(skillDir, nested);
    if (existsSync(nestedPath)) {
      violations.push(
        `Nested registry file forbidden: .cursor/skills/${dirName}/${nested} (use root .cursor/skills/${nested})`
      );
    }
  }

  if (!existsSync(skillPath)) {
    violations.push(`Missing SKILL.md: .cursor/skills/${dirName}/SKILL.md`);
    continue;
  }

  const source = readFileSync(skillPath, "utf8");
  const nameMatch = source.match(/^name:\s*(.+)$/m);
  const skillName = nameMatch?.[1]?.trim();

  if (!skillName) {
    violations.push(`Missing YAML name in .cursor/skills/${dirName}/SKILL.md`);
    continue;
  }

  if (skillName !== dirName) {
    violations.push(
      `Directory/YAML name mismatch: dir "${dirName}" vs name "${skillName}"`
    );
  }

  if (!source.match(/^description:\s*.+/m)) {
    violations.push(
      `Missing description in .cursor/skills/${dirName}/SKILL.md`
    );
  }

  if (!isRegisteredInReadme(skillName, readme)) {
    violations.push(
      `Skill "${skillName}" not registered in .cursor/skills/README.md`
    );
  }
}

if (readme) {
  for (const planned of PLANNED_CATALOG_SKILLS) {
    if (!isRegisteredInReadme(planned, readme)) {
      violations.push(
        `Planned catalog skill "${planned}" missing from .cursor/skills/README.md`
      );
    }
  }
} else {
  violations.push("Missing catalog: .cursor/skills/README.md");
}

if (violations.length > 0) {
  process.stderr.write("skills registration: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

const count = listNativeSkillDirs().length;
process.stdout.write(`skills registration: OK (${count} native skills)\n`);
process.exit(0);
