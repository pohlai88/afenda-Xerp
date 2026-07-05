import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const developerRoot = path.resolve("apps/developer");
const appRoot = path.join(developerRoot, "src", "app");
const routePolicyPath = path.join(
  developerRoot,
  "src",
  "lib",
  "lab",
  "route-policy.ts"
);
const routeSurfaceRegistryPath = path.join(
  developerRoot,
  "src",
  "lib",
  "lab",
  "route-surface-registry.ts"
);
const contractsPath = path.join(
  developerRoot,
  "src",
  "lib",
  "lab",
  "contracts.ts"
);
const navConfigPath = path.join(
  developerRoot,
  "src",
  "config",
  "nav-config.ts"
);
const smokeSpecPath = path.join(
  developerRoot,
  "src",
  "app",
  "__tests__",
  "route-lab-smoke.spec.ts"
);

const prohibitedImportPatterns = [
  /@afenda\/auth/,
  /@afenda\/kernel/,
  /@afenda\/database/,
  /@afenda\/server/,
  /apps\/erp\//,
  /src\/app\/api\//,
  /@\/app\/api\//,
];
const useClientDirectivePattern = /["']use client["']/;

const routePolicySource = readFileSync(routePolicyPath, "utf8");
const routeSurfaceRegistrySource = readFileSync(
  routeSurfaceRegistryPath,
  "utf8"
);
const contractsSource = readFileSync(contractsPath, "utf8");
const navConfigSource = readFileSync(navConfigPath, "utf8");
const smokeSpecSource = readFileSync(smokeSpecPath, "utf8");

const activeRouteHrefs = [
  ...routeSurfaceRegistrySource.matchAll(/href:\s*"([^"]+)"/g),
].map((match) => match[1]);
const activeRouteActionSeams = [
  ...routeSurfaceRegistrySource.matchAll(
    /actionSeam:\s*"(governed-active|placeholder-only)"/g
  ),
].map((match) => match[1]);
const activeRouteQuerySeams = [
  ...routeSurfaceRegistrySource.matchAll(
    /querySeam:\s*"(governed-active|placeholder-only)"/g
  ),
].map((match) => match[1]);
const activeRoutePaths = [
  ...routeSurfaceRegistrySource.matchAll(/routePath:\s*"([^"]+)"/g),
].map((match) => match[1]);

const activeRoutes = activeRouteHrefs
  .map((href, index) => ({
    actionSeam: activeRouteActionSeams[index] ?? "placeholder-only",
    href,
    querySeam: activeRouteQuerySeams[index] ?? "placeholder-only",
    routePath: activeRoutePaths[index] ?? href,
  }))
  .filter((route) => route.href !== "/");

const failures = [];

const recordFailure = (filePath, message) => {
  failures.push(`${path.relative(process.cwd(), filePath)}: ${message}`);
};

const hasUseClientDirective = (source) =>
  useClientDirectivePattern.test(source);

const toRouteDir = (href) =>
  path.join(appRoot, "(lab)", ...href.split("/").filter(Boolean));

const findNearestRouteActionsDir = (routeDir) => {
  let currentDir = routeDir;

  while (currentDir.startsWith(path.join(appRoot, "(lab)"))) {
    const candidate = path.join(currentDir, "_actions");

    if (existsSync(candidate)) {
      return candidate;
    }

    if (currentDir === path.join(appRoot, "(lab)")) {
      break;
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
};

const findNearestRouteQueriesDir = (routeDir) => {
  let currentDir = routeDir;

  while (currentDir.startsWith(path.join(appRoot, "(lab)"))) {
    const candidate = path.join(currentDir, "_queries");

    if (existsSync(candidate)) {
      return candidate;
    }

    if (currentDir === path.join(appRoot, "(lab)")) {
      break;
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
};

const getImports = (source) =>
  [...source.matchAll(/import\s+[\s\S]*?\s+from\s+"([^"]+)";/g)].map(
    (match) => match[1]
  );

const hasSerializableContractEvidence = (loaderSource, contractName) =>
  loaderSource.includes(`satisfies ${contractName}`) ||
  loaderSource.includes(`satisfies readonly ${contractName}`);

const appApiPath = path.join(appRoot, "api");

if (existsSync(appApiPath)) {
  recordFailure(
    appApiPath,
    "route-lab law forbids repo-owned app/api surfaces under apps/developer/src/app/api"
  );
}

if (!routePolicySource.includes("labRouteSurfaceRegistry")) {
  recordFailure(
    routePolicyPath,
    "route policy must derive active route metadata from src/lib/lab/route-surface-registry.ts"
  );
}

if (!navConfigSource.includes("labRouteSurfaceRegistry")) {
  recordFailure(
    navConfigPath,
    "nav config must derive route navigation metadata from src/lib/lab/route-surface-registry.ts"
  );
}

if (!smokeSpecSource.includes("route-surface-registry.ts")) {
  recordFailure(
    smokeSpecPath,
    "smoke coverage must derive active route expectations from src/lib/lab/route-surface-registry.ts"
  );
}

for (const route of activeRoutes) {
  const routeDir = toRouteDir(route.routePath);
  const actionsDir = findNearestRouteActionsDir(routeDir);
  const queriesDir = findNearestRouteQueriesDir(routeDir);
  const pagePath = path.join(routeDir, "page.tsx");
  const loadingPath = path.join(routeDir, "loading.tsx");
  const notFoundPath = path.join(routeDir, "not-found.tsx");
  const componentsDir = path.join(routeDir, "_components");

  if (!existsSync(pagePath)) {
    recordFailure(pagePath, `missing page.tsx for active route ${route.href}`);
    continue;
  }

  if (!existsSync(loadingPath)) {
    recordFailure(
      loadingPath,
      `missing loading.tsx for active route ${route.href}`
    );
  }

  if (route.routePath.includes("[") && !existsSync(notFoundPath)) {
    recordFailure(
      notFoundPath,
      `dynamic active route ${route.href} must provide a route-owned not-found.tsx boundary`
    );
  }

  if (!existsSync(componentsDir)) {
    recordFailure(
      componentsDir,
      `missing route-local _components directory for active route ${route.href}`
    );
  }

  const pageSource = readFileSync(pagePath, "utf8");
  const pageImports = getImports(pageSource);
  const loaderImports = pageImports.filter((entry) =>
    entry.startsWith("@/lib/lab/load-")
  );
  const routeLocalImports = pageImports.filter((entry) =>
    entry.startsWith("./_components/")
  );
  const relativeNonRouteLocalImports = pageImports.filter(
    (entry) => entry.startsWith("./") && !entry.startsWith("./_components/")
  );

  if (hasUseClientDirective(pageSource)) {
    recordFailure(
      pagePath,
      'page.tsx must remain server-first and must not use "use client"'
    );
  }

  if (!/export\s+default\s+async\s+function\s+\w+\s*\(/.test(pageSource)) {
    recordFailure(pagePath, "page.tsx must export a thin async route boundary");
  }

  if (loaderImports.length !== 1) {
    recordFailure(
      pagePath,
      `page.tsx must import exactly one route loader; found ${loaderImports.length}`
    );
  }

  for (const importPath of relativeNonRouteLocalImports) {
    recordFailure(
      pagePath,
      `relative route UI imports must stay under ./_components; found ${importPath}`
    );
  }

  if (routeLocalImports.length === 0) {
    recordFailure(
      pagePath,
      "page.tsx must render route-local panels imported from ./_components"
    );
  }

  if (/await\s+Promise\.(all|allSettled|race|any)\s*\(/.test(pageSource)) {
    recordFailure(
      pagePath,
      "page.tsx must call exactly one route loader instead of orchestrating multiple async flows"
    );
  }

  for (const pattern of prohibitedImportPatterns) {
    if (pattern.test(pageSource)) {
      recordFailure(
        pagePath,
        `page.tsx imports a prohibited runtime authority matching ${pattern}`
      );
    }
  }

  if (loaderImports.length === 1) {
    const [loaderImportPath] = loaderImports;
    const loaderFileName = `${loaderImportPath.replace("@/lib/lab/", "")}.ts`;
    const loaderPath = path.join(
      developerRoot,
      "src",
      "lib",
      "lab",
      loaderFileName
    );
    const importedLoaderName =
      pageSource.match(
        /import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+"@\/lib\/lab\/load-[^"]+"/
      )?.[1] ?? null;

    if (existsSync(loaderPath)) {
      const loaderSource = readFileSync(loaderPath, "utf8");
      const loaderTypeMatch = loaderSource.match(
        /LabRouteLoader<\s*([A-Za-z0-9_]+)\s*(?:,[^>]*)?>/
      );
      const contractName = loaderTypeMatch?.[1] ?? null;

      if (contractName) {
        const hasContractDefinition =
          contractsSource.includes(`export interface ${contractName}`) ||
          contractsSource.includes(`export type ${contractName}`);

        if (!hasContractDefinition) {
          recordFailure(
            loaderPath,
            `loader contract ${contractName} is not declared in src/lib/lab/contracts.ts`
          );
        }

        if (!hasSerializableContractEvidence(loaderSource, contractName)) {
          recordFailure(
            loaderPath,
            `loader must shape fixture data with satisfies ${contractName} to prove typed serializable page data`
          );
        }
      } else {
        recordFailure(
          loaderPath,
          "loader must be typed as LabRouteLoader<TPageData>"
        );
      }

      if (importedLoaderName) {
        const awaitMatches = [
          ...pageSource.matchAll(
            new RegExp(`await\\s+${importedLoaderName}\\s*\\(`, "g")
          ),
        ];

        if (awaitMatches.length !== 1) {
          recordFailure(
            pagePath,
            `page.tsx must await exactly one call to ${importedLoaderName}; found ${awaitMatches.length}`
          );
        }
      }
    } else {
      recordFailure(
        pagePath,
        `loader import ${loaderImportPath} does not resolve to a repo-owned loader file`
      );
    }
  }

  if (existsSync(componentsDir)) {
    const componentFiles = readdirSync(componentsDir).filter((entry) =>
      entry.endsWith(".tsx")
    );

    if (componentFiles.length === 0) {
      recordFailure(
        componentsDir,
        `active route ${route.href} must contain route-local panel files under _components`
      );
    }
  }

  if (route.actionSeam === "placeholder-only" && actionsDir) {
    const allowedActionEntries = new Set([".gitkeep"]);
    const unexpectedActionEntries = readdirSync(actionsDir).filter(
      (entry) => !allowedActionEntries.has(entry)
    );

    if (unexpectedActionEntries.length > 0) {
      recordFailure(
        actionsDir,
        `route policy marks _actions as placeholder-only for ${route.href}, but found runtime entries: ${unexpectedActionEntries.join(", ")}`
      );
    }
  }

  if (route.querySeam === "placeholder-only" && queriesDir) {
    const allowedQueryEntries = new Set([".gitkeep"]);
    const unexpectedQueryEntries = readdirSync(queriesDir).filter(
      (entry) => !allowedQueryEntries.has(entry)
    );

    if (unexpectedQueryEntries.length > 0) {
      recordFailure(
        queriesDir,
        `route policy marks _queries as placeholder-only for ${route.href}, but found runtime entries: ${unexpectedQueryEntries.join(", ")}`
      );
    }
  }
}

const layoutPath = path.join(appRoot, "(lab)", "layout.tsx");
const layoutSource = readFileSync(layoutPath, "utf8");

if (hasUseClientDirective(layoutSource)) {
  recordFailure(
    layoutPath,
    'layout.tsx must remain server-first and must not use "use client"'
  );
}

if (!layoutSource.includes('export const dynamic = "force-dynamic"')) {
  recordFailure(
    layoutPath,
    'active lab routes require export const dynamic = "force-dynamic" at the (lab) layout boundary'
  );
}

const appPageFiles = [];
const appLayoutFiles = [];
const labSegmentFiles = [];
const collectAppSegments = (directoryPath) => {
  for (const entry of readdirSync(directoryPath)) {
    const fullPath = path.join(directoryPath, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      collectAppSegments(fullPath);
      continue;
    }

    if (entry === "page.tsx") {
      appPageFiles.push(fullPath);
    }

    if (entry === "layout.tsx") {
      appLayoutFiles.push(fullPath);
    }
  }
};

const collectLabSegments = (directoryPath) => {
  for (const entry of readdirSync(directoryPath)) {
    const fullPath = path.join(directoryPath, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      collectLabSegments(fullPath);
      continue;
    }

    if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
      labSegmentFiles.push(fullPath);
    }
  }
};

collectAppSegments(appRoot);
collectLabSegments(path.join(appRoot, "(lab)"));

for (const pageFile of appPageFiles) {
  const pageSource = readFileSync(pageFile, "utf8");

  if (hasUseClientDirective(pageSource)) {
    recordFailure(
      pageFile,
      'page.tsx must remain server-first and must not use "use client"'
    );
  }

  for (const pattern of prohibitedImportPatterns) {
    if (pattern.test(pageSource)) {
      recordFailure(
        pageFile,
        `page.tsx imports a prohibited runtime authority matching ${pattern}`
      );
    }
  }
}

for (const layoutFile of appLayoutFiles) {
  const layoutFileSource = readFileSync(layoutFile, "utf8");

  if (hasUseClientDirective(layoutFileSource)) {
    recordFailure(
      layoutFile,
      'layout.tsx must remain server-first and must not use "use client"'
    );
  }

  for (const pattern of prohibitedImportPatterns) {
    if (pattern.test(layoutFileSource)) {
      recordFailure(
        layoutFile,
        `layout.tsx imports a prohibited runtime authority matching ${pattern}`
      );
    }
  }
}

for (const segmentFile of labSegmentFiles) {
  const segmentSource = readFileSync(segmentFile, "utf8");

  if (/\bgenerateStaticParams\b/.test(segmentSource)) {
    recordFailure(
      segmentFile,
      "generateStaticParams is prohibited anywhere under apps/developer/src/app/(lab)"
    );
  }
}

if (failures.length > 0) {
  console.error("Route-lab governance check failed.\n");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Route-lab governance check passed.");
for (const route of activeRoutes) {
  console.log(`- ${route.href}`);
}
