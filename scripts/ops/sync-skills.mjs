#!/usr/bin/env node
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const cursorRoot = path.join(cwd, ".cursor", "skills");
const githubRoot = path.join(cwd, ".github", "skills");
const defaultStateFile = path.join(
  cwd,
  ".cursor",
  ".cache",
  "skill-sync-state.json"
);
const trackedRootFiles = ["NATIVE-EVALUATION.md"];
const rootFileAliases = [
  {
    root: "github",
    source: "NATIVE-EVALUATION.md",
    target: path.join("afenda-coding-session", "NATIVE-EVALUATION.md"),
  },
];

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const preferArg = [...args].find((arg) => arg.startsWith("--prefer="));
const prefer = preferArg ? preferArg.split("=")[1] : "none";
const stateArg = [...args].find((arg) => arg.startsWith("--state-file="));
const stateFile = stateArg
  ? path.resolve(cwd, stateArg.split("=")[1])
  : defaultStateFile;

if (!new Set(["none", "cursor", "github", "newer"]).has(prefer)) {
  console.error(
    "Invalid --prefer value. Use one of: none, cursor, github, newer"
  );
  process.exit(1);
}

const exists = async (targetPath) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const readJson = async (targetPath) => {
  if (!(await exists(targetPath))) {
    return null;
  }
  const raw = await fs.readFile(targetPath, "utf8");
  return JSON.parse(raw);
};

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const computeFileSnapshot = async (filePath) => {
  if (!(await exists(filePath))) {
    return null;
  }

  const stat = await fs.stat(filePath);
  const content = await fs.readFile(filePath);
  const hash = createHash("sha256").update(content).digest("hex");

  return {
    hash,
    latestMtimeMs: stat.mtimeMs,
  };
};

const walkFiles = async (baseDir) => {
  const out = [];
  const walk = async (currentDir) => {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        out.push(fullPath);
      }
    }
  };

  if (await exists(baseDir)) {
    await walk(baseDir);
  }

  return out.sort((a, b) => a.localeCompare(b));
};

const computeSkillSnapshot = async (skillDir) => {
  const files = await walkFiles(skillDir);
  if (files.length === 0) {
    return null;
  }

  const hash = createHash("sha256");
  let latestMtimeMs = 0;

  for (const absFile of files) {
    const rel = path.relative(skillDir, absFile).replaceAll("\\", "/");
    const stat = await fs.stat(absFile);
    if (stat.mtimeMs > latestMtimeMs) {
      latestMtimeMs = stat.mtimeMs;
    }
    const content = await fs.readFile(absFile);
    hash.update(rel);
    hash.update("\n");
    hash.update(content);
    hash.update("\n");
  }

  return {
    hash: hash.digest("hex"),
    latestMtimeMs,
  };
};

const getSkills = async (rootDir) => {
  const result = new Map();
  if (!(await exists(rootDir))) {
    return result;
  }

  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const skillDir = path.join(rootDir, entry.name);
    const skillFile = path.join(skillDir, "SKILL.md");
    if (!(await exists(skillFile))) {
      continue;
    }

    const snapshot = await computeSkillSnapshot(skillDir);
    if (!snapshot) {
      continue;
    }

    result.set(entry.name, {
      dir: skillDir,
      hash: snapshot.hash,
      latestMtimeMs: snapshot.latestMtimeMs,
    });
  }

  return result;
};

const copySkill = async (fromDir, toDir) => {
  await fs.rm(toDir, { recursive: true, force: true });
  await ensureDir(path.dirname(toDir));
  await fs.cp(fromDir, toDir, { recursive: true, force: true });
};

const copyFile = async (fromPath, toPath) => {
  await ensureDir(path.dirname(toPath));
  await fs.copyFile(fromPath, toPath);
};

const chooseByPreference = (cursorMeta, githubMeta) => {
  if (prefer === "cursor") {
    return "cursor";
  }
  if (prefer === "github") {
    return "github";
  }
  if (prefer === "newer") {
    return cursorMeta.latestMtimeMs >= githubMeta.latestMtimeMs
      ? "cursor"
      : "github";
  }
  return null;
};

const formatPlanLine = (status, skill, detail) =>
  `${status.padEnd(10)} ${skill}${detail ? ` (${detail})` : ""}`;

const main = async () => {
  await ensureDir(path.dirname(stateFile));
  const previousState = (await readJson(stateFile)) ?? {
    version: 1,
    skills: {},
  };
  const nextState = { version: 1, skills: {} };

  const cursorSkills = await getSkills(cursorRoot);
  const githubSkills = await getSkills(githubRoot);
  const allSkillNames = new Set([
    ...cursorSkills.keys(),
    ...githubSkills.keys(),
  ]);

  const plan = [];
  const conflicts = [];

  for (const skillName of [...allSkillNames].sort((a, b) =>
    a.localeCompare(b)
  )) {
    const cursorMeta = cursorSkills.get(skillName) ?? null;
    const githubMeta = githubSkills.get(skillName) ?? null;
    const prev = previousState.skills[skillName] ?? null;

    if (cursorMeta && !githubMeta) {
      plan.push({
        action: "copy",
        from: "cursor",
        skillName,
        reason: "missing in github",
      });
      nextState.skills[skillName] = {
        cursorHash: cursorMeta.hash,
        githubHash: cursorMeta.hash,
      };
      continue;
    }

    if (!cursorMeta && githubMeta) {
      plan.push({
        action: "copy",
        from: "github",
        skillName,
        reason: "missing in cursor",
      });
      nextState.skills[skillName] = {
        cursorHash: githubMeta.hash,
        githubHash: githubMeta.hash,
      };
      continue;
    }

    if (!(cursorMeta && githubMeta)) {
      continue;
    }

    if (cursorMeta.hash === githubMeta.hash) {
      plan.push({ action: "noop", skillName, reason: "already in sync" });
      nextState.skills[skillName] = {
        cursorHash: cursorMeta.hash,
        githubHash: githubMeta.hash,
      };
      continue;
    }

    if (prev) {
      const cursorChanged = prev.cursorHash !== cursorMeta.hash;
      const githubChanged = prev.githubHash !== githubMeta.hash;

      if (cursorChanged && !githubChanged) {
        plan.push({
          action: "copy",
          from: "cursor",
          skillName,
          reason: "changed in cursor",
        });
        nextState.skills[skillName] = {
          cursorHash: cursorMeta.hash,
          githubHash: cursorMeta.hash,
        };
        continue;
      }

      if (githubChanged && !cursorChanged) {
        plan.push({
          action: "copy",
          from: "github",
          skillName,
          reason: "changed in github",
        });
        nextState.skills[skillName] = {
          cursorHash: githubMeta.hash,
          githubHash: githubMeta.hash,
        };
        continue;
      }

      if (!(cursorChanged || githubChanged)) {
        const pick = chooseByPreference(cursorMeta, githubMeta);
        if (pick) {
          const pickedHash =
            pick === "cursor" ? cursorMeta.hash : githubMeta.hash;
          plan.push({
            action: "copy",
            from: pick,
            skillName,
            reason: "state drift",
          });
          nextState.skills[skillName] = {
            cursorHash: pickedHash,
            githubHash: pickedHash,
          };
          continue;
        }
      }

      const pick = chooseByPreference(cursorMeta, githubMeta);
      if (pick) {
        const pickedHash =
          pick === "cursor" ? cursorMeta.hash : githubMeta.hash;
        plan.push({
          action: "copy",
          from: pick,
          skillName,
          reason: "both changed; preference applied",
        });
        nextState.skills[skillName] = {
          cursorHash: pickedHash,
          githubHash: pickedHash,
        };
      } else {
        conflicts.push(skillName);
        nextState.skills[skillName] = {
          cursorHash: cursorMeta.hash,
          githubHash: githubMeta.hash,
        };
      }
      continue;
    }

    const pick = chooseByPreference(cursorMeta, githubMeta);
    if (pick) {
      const pickedHash = pick === "cursor" ? cursorMeta.hash : githubMeta.hash;
      plan.push({
        action: "copy",
        from: pick,
        skillName,
        reason: "bootstrap divergence",
      });
      nextState.skills[skillName] = {
        cursorHash: pickedHash,
        githubHash: pickedHash,
      };
    } else {
      conflicts.push(skillName);
      nextState.skills[skillName] = {
        cursorHash: cursorMeta.hash,
        githubHash: githubMeta.hash,
      };
    }
  }

  for (const fileName of trackedRootFiles) {
    const key = `[file] ${fileName}`;
    const cursorPath = path.join(cursorRoot, fileName);
    const githubPath = path.join(githubRoot, fileName);
    const cursorMeta = await computeFileSnapshot(cursorPath);
    const githubMeta = await computeFileSnapshot(githubPath);
    const prev = previousState.skills[key] ?? null;

    if (cursorMeta && !githubMeta) {
      plan.push({
        action: "copy",
        kind: "file",
        from: "cursor",
        fileName,
        reason: "missing in github",
      });
      nextState.skills[key] = {
        cursorHash: cursorMeta.hash,
        githubHash: cursorMeta.hash,
      };
      continue;
    }

    if (!cursorMeta && githubMeta) {
      plan.push({
        action: "copy",
        kind: "file",
        from: "github",
        fileName,
        reason: "missing in cursor",
      });
      nextState.skills[key] = {
        cursorHash: githubMeta.hash,
        githubHash: githubMeta.hash,
      };
      continue;
    }

    if (!(cursorMeta && githubMeta)) {
      continue;
    }

    if (cursorMeta.hash === githubMeta.hash) {
      plan.push({
        action: "noop",
        kind: "file",
        fileName,
        reason: "already in sync",
      });
      nextState.skills[key] = {
        cursorHash: cursorMeta.hash,
        githubHash: githubMeta.hash,
      };
      continue;
    }

    if (prev) {
      const cursorChanged = prev.cursorHash !== cursorMeta.hash;
      const githubChanged = prev.githubHash !== githubMeta.hash;

      if (cursorChanged && !githubChanged) {
        plan.push({
          action: "copy",
          kind: "file",
          from: "cursor",
          fileName,
          reason: "changed in cursor",
        });
        nextState.skills[key] = {
          cursorHash: cursorMeta.hash,
          githubHash: cursorMeta.hash,
        };
        continue;
      }

      if (githubChanged && !cursorChanged) {
        plan.push({
          action: "copy",
          kind: "file",
          from: "github",
          fileName,
          reason: "changed in github",
        });
        nextState.skills[key] = {
          cursorHash: githubMeta.hash,
          githubHash: githubMeta.hash,
        };
        continue;
      }

      if (!(cursorChanged || githubChanged)) {
        const pick = chooseByPreference(cursorMeta, githubMeta);
        if (pick) {
          const pickedHash =
            pick === "cursor" ? cursorMeta.hash : githubMeta.hash;
          plan.push({
            action: "copy",
            kind: "file",
            from: pick,
            fileName,
            reason: "state drift",
          });
          nextState.skills[key] = {
            cursorHash: pickedHash,
            githubHash: pickedHash,
          };
          continue;
        }
      }

      const pick = chooseByPreference(cursorMeta, githubMeta);
      if (pick) {
        const pickedHash =
          pick === "cursor" ? cursorMeta.hash : githubMeta.hash;
        plan.push({
          action: "copy",
          kind: "file",
          from: pick,
          fileName,
          reason: "both changed; preference applied",
        });
        nextState.skills[key] = {
          cursorHash: pickedHash,
          githubHash: pickedHash,
        };
      } else {
        conflicts.push(key);
        nextState.skills[key] = {
          cursorHash: cursorMeta.hash,
          githubHash: githubMeta.hash,
        };
      }
      continue;
    }

    const pick = chooseByPreference(cursorMeta, githubMeta);
    if (pick) {
      const pickedHash = pick === "cursor" ? cursorMeta.hash : githubMeta.hash;
      plan.push({
        action: "copy",
        kind: "file",
        from: pick,
        fileName,
        reason: "bootstrap divergence",
      });
      nextState.skills[key] = {
        cursorHash: pickedHash,
        githubHash: pickedHash,
      };
    } else {
      conflicts.push(key);
      nextState.skills[key] = {
        cursorHash: cursorMeta.hash,
        githubHash: githubMeta.hash,
      };
    }
  }

  for (const step of plan) {
    const itemName =
      step.kind === "file" ? `[file] ${step.fileName}` : step.skillName;
    if (step.action === "noop") {
      console.log(formatPlanLine("NOOP", itemName, step.reason));
      continue;
    }
    const to = step.from === "cursor" ? "github" : "cursor";
    console.log(
      formatPlanLine("COPY", itemName, `${step.from} -> ${to}; ${step.reason}`)
    );
  }

  const aliasPlan = [];
  for (const alias of rootFileAliases) {
    const rootDir = alias.root === "cursor" ? cursorRoot : githubRoot;
    const sourcePath = path.join(rootDir, alias.source);
    const targetPath = path.join(rootDir, alias.target);
    const sourceMeta = await computeFileSnapshot(sourcePath);
    if (!sourceMeta) {
      continue;
    }

    const targetMeta = await computeFileSnapshot(targetPath);
    if (!targetMeta || targetMeta.hash !== sourceMeta.hash) {
      aliasPlan.push(alias);
      console.log(
        formatPlanLine(
          "COPY",
          `[alias] ${alias.target.replaceAll("\\", "/")}`,
          `${alias.source} -> ${alias.target.replaceAll("\\", "/")}`
        )
      );
    } else {
      console.log(
        formatPlanLine(
          "NOOP",
          `[alias] ${alias.target.replaceAll("\\", "/")}`,
          "already in sync"
        )
      );
    }
  }

  if (conflicts.length > 0) {
    console.log("\nConflicts:");
    for (const skillName of conflicts) {
      console.log(`- ${skillName}`);
    }
    console.log(
      "\nRe-run with one of: --prefer=cursor, --prefer=github, or --prefer=newer"
    );
    if (!apply) {
      process.exitCode = 2;
      return;
    }
    process.exit(2);
  }

  if (!apply) {
    console.log("\nDry run complete. Use --apply to execute sync.");
    return;
  }

  for (const step of plan) {
    if (step.action !== "copy") {
      continue;
    }
    if (step.kind === "file") {
      const fromRoot = step.from === "cursor" ? cursorRoot : githubRoot;
      const toRoot = step.from === "cursor" ? githubRoot : cursorRoot;
      await copyFile(
        path.join(fromRoot, step.fileName),
        path.join(toRoot, step.fileName)
      );
      continue;
    }

    const fromRoot = step.from === "cursor" ? cursorRoot : githubRoot;
    const toRoot = step.from === "cursor" ? githubRoot : cursorRoot;
    await copySkill(
      path.join(fromRoot, step.skillName),
      path.join(toRoot, step.skillName)
    );
  }

  for (const alias of aliasPlan) {
    const rootDir = alias.root === "cursor" ? cursorRoot : githubRoot;
    await copyFile(
      path.join(rootDir, alias.source),
      path.join(rootDir, alias.target)
    );
  }

  await fs.writeFile(
    stateFile,
    `${JSON.stringify(nextState, null, 2)}\n`,
    "utf8"
  );
  console.log(
    `\nSync complete. State saved to ${path.relative(cwd, stateFile).replaceAll("\\\\", "/")}`
  );
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
