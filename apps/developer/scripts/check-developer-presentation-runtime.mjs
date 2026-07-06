import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const developerRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const packageJsonPath = path.join(developerRoot, "package.json");
const nextConfigPath = path.join(developerRoot, "next.config.ts");
const rootLayoutPath = path.join(developerRoot, "src", "app", "layout.tsx");
const labShellPath = path.join(
  developerRoot,
  "src",
  "app",
  "(lab)",
  "_components",
  "lab-shell.client.tsx"
);
const v2ProofClientPath = path.join(
  developerRoot,
  "src",
  "app",
  "design-system",
  "v2-proof",
  "_components",
  "v2-proof-route.client.tsx"
);

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

const nextConfigSource = readSource(nextConfigPath);
const packageJsonSource = readSource(packageJsonPath);
const rootLayoutSource = readSource(rootLayoutPath);
const labShellSource = readSource(labShellPath);
const v2ProofClientSource = readSource(v2ProofClientPath);

if (!rootLayoutSource.includes('from "@afenda/shadcn-studio-v2/clients"')) {
  recordFailure(
    rootLayoutPath,
    "root layout must import StudioPresentationProviders from @afenda/shadcn-studio-v2/clients (same entry as useTheme consumers; /theme subpath splits ThemeProvider under Turbopack dev)"
  );
}

if (!rootLayoutSource.includes("StudioPresentationProviders")) {
  recordFailure(
    rootLayoutPath,
    "root layout must wrap children with StudioPresentationProviders"
  );
}

if (
  rootLayoutSource.includes("@afenda/shadcn-studio-v2/theme") &&
  rootLayoutSource.includes("StudioPresentationProviders")
) {
  recordFailure(
    rootLayoutPath,
    "root layout must not wire StudioPresentationProviders through @afenda/shadcn-studio-v2/theme in Turbopack dev"
  );
}

const FORBIDDEN_V1_LAB_SHELL_IMPORT =
  /from\s+["']@afenda\/shadcn-studio(?:\/(?!v2)|["'])/u;

if (!labShellSource.includes("AppShell01")) {
  recordFailure(
    labShellPath,
    "lab shell must render v2 AppShell01 from @afenda/shadcn-studio-v2/clients (Lane B-04)"
  );
}

if (FORBIDDEN_V1_LAB_SHELL_IMPORT.test(labShellSource)) {
  recordFailure(
    labShellPath,
    "lab shell must not import @afenda/shadcn-studio (Lane B-04)"
  );
}

if (
  v2ProofClientSource.includes("useTheme") &&
  !v2ProofClientSource.includes("@afenda/shadcn-studio-v2/clients")
) {
  recordFailure(
    v2ProofClientPath,
    "v2 proof client hooks must import from @afenda/shadcn-studio-v2/clients"
  );
}

if (!nextConfigSource.includes("transpilePackages")) {
  recordFailure(
    nextConfigPath,
    "must transpile @afenda/shadcn-studio-v2 so /clients resolves from package source"
  );
}

if (FORBIDDEN_V1_LAB_SHELL_IMPORT.test(nextConfigSource)) {
  recordFailure(
    nextConfigPath,
    "next.config must not transpile or alias @afenda/shadcn-studio (Lane B-12)"
  );
}

if (packageJsonSource.includes('"@afenda/shadcn-studio"')) {
  recordFailure(
    packageJsonPath,
    "developer package.json must not depend on @afenda/shadcn-studio (Lane B-12)"
  );
}

if (failures.length > 0) {
  console.error("Developer presentation runtime check failed.\n");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Developer presentation runtime check passed.");
