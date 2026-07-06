import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const developerRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const appRoot = path.join(developerRoot, "src", "app");
const rootLayoutPath = path.join(appRoot, "layout.tsx");
const metadataPath = path.join(
  developerRoot,
  "src",
  "lib",
  "lab",
  "hydration-resolution.metadata.ts"
);
const mountedHookPath = path.join(
  developerRoot,
  "src",
  "lib",
  "lab",
  "use-mounted.client.ts"
);

const useClientDirectivePattern = /["']use client["']/;
const runtimeSensitiveHookPatterns = [/useTheme\s*\(/, /useSettings\s*\(/];
const mountedGateImportPattern = /from\s+"@\/lib\/lab\/use-mounted\.client"/;
const mountedGateUsagePattern = /useMounted\s*\(/;
const TS_FILE_RE = /\.(tsx|ts)$/;

const failures = [];

const recordFailure = (filePath, message) => {
  failures.push(`${path.relative(process.cwd(), filePath)}: ${message}`);
};

const readSource = (filePath) => {
  if (!existsSync(filePath)) {
    recordFailure(filePath, "required file is missing");
    return "";
  }

  return readFileSync(filePath, "utf8");
};

const collectClientLeafFiles = (directoryPath, files = []) => {
  for (const entry of readdirSync(directoryPath)) {
    const fullPath = path.join(directoryPath, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      collectClientLeafFiles(fullPath, files);
      continue;
    }

    if (!TS_FILE_RE.test(entry)) {
      continue;
    }

    const source = readFileSync(fullPath, "utf8");

    if (useClientDirectivePattern.test(source)) {
      files.push(fullPath);
    }
  }

  return files;
};

const metadataSource = readSource(metadataPath);
const mountedHookSource = readSource(mountedHookPath);
const rootLayoutSource = readSource(rootLayoutPath);

for (const methodId of [
  "layout-html-suppress",
  "theme-script-prehydrate",
  "mounted-gate",
  "element-suppress-hydration-warning",
]) {
  if (!metadataSource.includes(`id: "${methodId}"`)) {
    recordFailure(
      metadataPath,
      `hydration resolution metadata must declare method "${methodId}"`
    );
  }
}

if (!mountedHookSource.includes("export function useMounted")) {
  recordFailure(
    mountedHookPath,
    "useMounted hook must remain exported for mounted-gate enforcement"
  );
}

if (!rootLayoutSource.includes("suppressHydrationWarning")) {
  recordFailure(
    rootLayoutPath,
    "root layout must set suppressHydrationWarning on <html> (method: layout-html-suppress)"
  );
}

if (!rootLayoutSource.includes("ThemeScript")) {
  recordFailure(
    rootLayoutPath,
    "root layout must render ThemeScript before ThemeProvider (method: theme-script-prehydrate)"
  );
}

for (const clientLeafPath of collectClientLeafFiles(appRoot)) {
  const source = readFileSync(clientLeafPath, "utf8");
  const usesRuntimeSensitiveHook = runtimeSensitiveHookPatterns.some(
    (pattern) => pattern.test(source)
  );

  if (!usesRuntimeSensitiveHook) {
    continue;
  }

  if (!mountedGateImportPattern.test(source)) {
    recordFailure(
      clientLeafPath,
      'client leaf using useTheme/useSettings must import useMounted from "@/lib/lab/use-mounted.client" (method: mounted-gate)'
    );
  }

  if (!mountedGateUsagePattern.test(source)) {
    recordFailure(
      clientLeafPath,
      "client leaf using useTheme/useSettings must call useMounted() before binding hook values to DOM (method: mounted-gate)"
    );
  }
}

if (failures.length > 0) {
  console.error("Developer hydration governance check failed.\n");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Developer hydration governance check passed.");
