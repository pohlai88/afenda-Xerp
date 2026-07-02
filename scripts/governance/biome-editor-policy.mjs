/**
 * Biome editor / Husky / CLI ownership policy.
 *
 * Keeps in sync:
 * - biome.jsonc (CI, type-aware)
 * - biome.lsp.jsonc (editor LSP, no type-aware)
 * - biome.project.jsonc (shared excludes)
 * - .vscode/settings.json (formatter + biome.enabled per language)
 * - .cursor/settings.json (Cursor overlay — biome.configurationPath must not drift)
 * - _reference/.vscode/settings.json (Biome-excluded reference templates)
 * - package.json lint-staged + prettier.config.mjs
 *
 * @see scripts/governance/check-biome-editor-sync.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** VS Code settings placeholder — built without a literal ${…} string for Biome. */
const VSCODE_WORKSPACE_FOLDER = ["$", "{", "workspaceFolder", "}"].join("");

/** @typedef {{ ok: true } | { ok: false; violations: string[] }} BiomeEditorSyncResult */

export const BIOME_EDITOR_POLICY = {
  lspConfigPath: "biome.lsp.jsonc",
  ciConfigPath: "biome.jsonc",
  sharedConfigPath: "biome.project.jsonc",
  vscodeSettingsPath: ".vscode/settings.json",
  cursorSettingsPath: ".cursor/settings.json",
  referenceVscodeSettingsPath: "_reference/.vscode/settings.json",
  prettierConfigPath: "prettier.config.mjs",
  typeAwarePreset: "ultracite/biome/type-aware",
  biomeCliExcludedGlobs: [
    "!!**/docs",
    "!!**/*.md",
    "!!**/*.mdx",
    "!!**/*.mdc",
    "!!**/*.css",
    "!!**/.cursor",
  ],
  vscode: {
    configurationPath: `${VSCODE_WORKSPACE_FOLDER}/biome.lsp.jsonc`,
    lspBinByPlatform: {
      "darwin-arm64": `${VSCODE_WORKSPACE_FOLDER}/node_modules/@biomejs/cli-darwin-arm64/biome`,
      "darwin-x64": `${VSCODE_WORKSPACE_FOLDER}/node_modules/@biomejs/cli-darwin-x64/biome`,
      "linux-arm64": `${VSCODE_WORKSPACE_FOLDER}/node_modules/@biomejs/cli-linux-arm64/biome`,
      "linux-x64": `${VSCODE_WORKSPACE_FOLDER}/node_modules/@biomejs/cli-linux-x64/biome`,
      "win32-arm64": `${VSCODE_WORKSPACE_FOLDER}/node_modules/@biomejs/cli-win32-arm64/biome.exe`,
      "win32-x64": `${VSCODE_WORKSPACE_FOLDER}/node_modules/@biomejs/cli-win32-x64/biome.exe`,
    },
    biomeEnabledDefault: true,
    biomeFormatterLanguages: [
      "typescript",
      "typescriptreact",
      "javascript",
      "javascriptreact",
    ],
    lspWatcherKind: "none",
    requireConfiguration: true,
    watcherExclude: ["**/docs/**", "**/.cursor/**"],
    languageScopes: {
      markdown: {
        biomeEnabled: false,
        defaultFormatter: "yzhang.markdown-all-in-one",
        biomeFixAll: "never",
      },
      mdx: {
        biomeEnabled: false,
        defaultFormatter: "esbenp.prettier-vscode",
        biomeFixAll: "never",
      },
      jsonc: {
        biomeEnabled: false,
        defaultFormatter: "vscode.json-language-features",
        biomeFixAll: "never",
      },
      css: {
        biomeEnabled: false,
        defaultFormatter: "esbenp.prettier-vscode",
        biomeFixAll: "never",
      },
    },
  },
  referenceVscode: {
    biomeEnabledDefault: false,
    requireConfiguration: false,
    formatterLanguages: [
      "typescript",
      "typescriptreact",
      "javascript",
      "javascriptreact",
    ],
    defaultFormatter: "vscode.typescript-language-features",
  },
  lintStaged: {
    ultraciteGlob: "*.{js,jsx,ts,tsx,mjs,cjs,json,jsonc}",
    ultraciteCommand: "ultracite fix",
    prettierMdxGlob: "*.mdx",
    prettierMdxCommand: "prettier --write",
    prettierCssGlob: "*.css",
    prettierCssCommand: "prettier --write",
    biomeEditorSyncCommand:
      "node scripts/governance/check-biome-editor-sync.mjs",
    biomeEditorSyncPaths: [
      "biome.jsonc",
      "biome.lsp.jsonc",
      "biome.project.jsonc",
      ".vscode/settings.json",
      ".cursor/settings.json",
      "_reference/.vscode/settings.json",
      "scripts/governance/biome-editor-policy.mjs",
    ],
  },
  prettierDocumentSelectors: ["**/*.mdx", "**/*.css"],
  huskyPreCommitPath: ".husky/pre-commit",
  precommitScript:
    "node scripts/governance/check-biome-editor-sync.mjs && lint-staged",
};

/**
 * @param {unknown} value
 * @param {string} path
 */
function expectObject(value, path) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }

  return /** @type {Record<string, unknown>} */ (value);
}

/**
 * @param {Record<string, unknown>} scope
 * @param {string} label
 * @param {{ biomeEnabled: boolean; defaultFormatter: string; biomeFixAll: string }} expected
 * @param {string[]} violations
 */
function checkLanguageScope(scope, label, expected, violations) {
  if (scope["biome.enabled"] !== expected.biomeEnabled) {
    violations.push(
      `[${label}] biome.enabled must be ${expected.biomeEnabled} (Biome CLI excludes these; LSP must not attach)`
    );
  }

  if (scope["editor.defaultFormatter"] !== expected.defaultFormatter) {
    violations.push(
      `[${label}] editor.defaultFormatter must be "${expected.defaultFormatter}" (not biomejs.biome)`
    );
  }

  const codeActions = expectObject(
    scope["editor.codeActionsOnSave"] ?? {},
    `[${label}].editor.codeActionsOnSave`
  );

  if (codeActions["source.fixAll.biome"] !== expected.biomeFixAll) {
    violations.push(
      `[${label}] source.fixAll.biome must be "${expected.biomeFixAll}"`
    );
  }
}

/**
 * @param {string} raw
 * @returns {string[]}
 */
function readJsoncExtends(raw) {
  const match = raw.match(/"extends"\s*:\s*\[([\s\S]*?)\]/);

  if (!match) {
    return [];
  }

  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

/**
 * @param {string} repoRoot
 * @returns {BiomeEditorSyncResult}
 */
export function checkBiomeEditorSync(repoRoot) {
  const violations = [];
  const policy = BIOME_EDITOR_POLICY;

  const ciConfig = readFileSync(join(repoRoot, policy.ciConfigPath), "utf8");
  const lspConfig = readFileSync(join(repoRoot, policy.lspConfigPath), "utf8");
  const sharedConfig = readFileSync(
    join(repoRoot, policy.sharedConfigPath),
    "utf8"
  );
  const vscodeSettings = JSON.parse(
    readFileSync(join(repoRoot, policy.vscodeSettingsPath), "utf8")
  );
  const packageJson = JSON.parse(
    readFileSync(join(repoRoot, "package.json"), "utf8")
  );
  const prettierConfig = readFileSync(
    join(repoRoot, policy.prettierConfigPath),
    "utf8"
  );

  const ciExtends = readJsoncExtends(ciConfig);
  const lspExtends = readJsoncExtends(lspConfig);

  if (!ciExtends.includes(policy.typeAwarePreset)) {
    violations.push(
      `${policy.ciConfigPath} must extend "${policy.typeAwarePreset}" for CI/typecheck lint`
    );
  }

  if (lspExtends.includes(policy.typeAwarePreset)) {
    violations.push(
      `${policy.lspConfigPath} must NOT extend "${policy.typeAwarePreset}" (crashes Biome LSP on large monorepo graph)`
    );
  }

  if (!lspExtends.includes(`./${policy.sharedConfigPath}`)) {
    violations.push(
      `${policy.lspConfigPath} must extend "./${policy.sharedConfigPath}"`
    );
  }

  if (!ciExtends.includes(`./${policy.sharedConfigPath}`)) {
    violations.push(
      `${policy.ciConfigPath} must extend "./${policy.sharedConfigPath}"`
    );
  }

  for (const glob of policy.biomeCliExcludedGlobs) {
    if (!sharedConfig.includes(glob)) {
      violations.push(
        `${policy.sharedConfigPath} files.includes must contain ${glob}`
      );
    }
  }

  if (
    vscodeSettings["biome.configurationPath"] !==
    policy.vscode.configurationPath
  ) {
    violations.push(
      `.vscode/settings.json biome.configurationPath must be "${policy.vscode.configurationPath}" (Biome 2.4+ LSP requires workspaceFolder-absolute path)`
    );
  }

  const lspBin = expectObject(
    vscodeSettings["biome.lsp.bin"] ?? {},
    "biome.lsp.bin"
  );

  for (const [platform, expectedPath] of Object.entries(
    policy.vscode.lspBinByPlatform
  )) {
    if (lspBin[platform] !== expectedPath) {
      violations.push(
        `.vscode/settings.json biome.lsp.bin["${platform}"] must be "${expectedPath}"`
      );
    }
  }

  if (vscodeSettings["biome.enabled"] !== policy.vscode.biomeEnabledDefault) {
    violations.push(
      `.vscode/settings.json biome.enabled must be ${policy.vscode.biomeEnabledDefault}`
    );
  }

  for (const languageId of policy.vscode.biomeFormatterLanguages) {
    const scope = expectObject(
      vscodeSettings[`[${languageId}]`] ?? {},
      `[${languageId}]`
    );

    if (scope["biome.enabled"] !== true) {
      violations.push(
        `[${languageId}] biome.enabled must be true (Biome must register as formatter for ${languageId})`
      );
    }

    if (scope["editor.defaultFormatter"] !== "biomejs.biome") {
      violations.push(
        `[${languageId}] editor.defaultFormatter must be "biomejs.biome"`
      );
    }
  }

  if (
    vscodeSettings["biome.lsp.watcher.kind"] !== policy.vscode.lspWatcherKind
  ) {
    violations.push(
      `.vscode/settings.json biome.lsp.watcher.kind must be "${policy.vscode.lspWatcherKind}"`
    );
  }

  if (
    vscodeSettings["biome.requireConfiguration"] !==
    policy.vscode.requireConfiguration
  ) {
    violations.push(
      `.vscode/settings.json biome.requireConfiguration must be ${policy.vscode.requireConfiguration}`
    );
  }

  const watcherExclude = expectObject(
    vscodeSettings["files.watcherExclude"] ?? {},
    "files.watcherExclude"
  );

  for (const pattern of policy.vscode.watcherExclude) {
    if (watcherExclude[pattern] !== true) {
      violations.push(
        `.vscode/settings.json files.watcherExclude["${pattern}"] must be true`
      );
    }
  }

  for (const [languageId, expected] of Object.entries(
    policy.vscode.languageScopes
  )) {
    checkLanguageScope(
      expectObject(vscodeSettings[`[${languageId}]`] ?? {}, `[${languageId}]`),
      `[${languageId}]`,
      expected,
      violations
    );
  }

  const cursorSettingsPath = join(repoRoot, policy.cursorSettingsPath);

  try {
    const cursorSettings = JSON.parse(readFileSync(cursorSettingsPath, "utf8"));

    if (
      Object.hasOwn(cursorSettings, "biome.configurationPath") &&
      cursorSettings["biome.configurationPath"] !==
        policy.vscode.configurationPath
    ) {
      violations.push(
        `${policy.cursorSettingsPath} biome.configurationPath must be "${policy.vscode.configurationPath}" or omitted (relative paths break Biome 2.4+ LSP in Cursor)`
      );
    }
  } catch {
    violations.push(
      `${policy.cursorSettingsPath} must exist and be valid JSON (Cursor Biome overlay)`
    );
  }

  const lintStaged = expectObject(
    packageJson["lint-staged"] ?? {},
    "lint-staged"
  );
  const ultraciteCommand = lintStaged[policy.lintStaged.ultraciteGlob];

  if (ultraciteCommand !== policy.lintStaged.ultraciteCommand) {
    violations.push(
      `lint-staged["${policy.lintStaged.ultraciteGlob}"] must be "${policy.lintStaged.ultraciteCommand}"`
    );
  }

  const prettierMdxCommand = lintStaged[policy.lintStaged.prettierMdxGlob];

  if (prettierMdxCommand !== policy.lintStaged.prettierMdxCommand) {
    violations.push(
      `lint-staged["${policy.lintStaged.prettierMdxGlob}"] must be "${policy.lintStaged.prettierMdxCommand}"`
    );
  }

  const prettierCssCommand = lintStaged[policy.lintStaged.prettierCssGlob];

  if (prettierCssCommand !== policy.lintStaged.prettierCssCommand) {
    violations.push(
      `lint-staged["${policy.lintStaged.prettierCssGlob}"] must be "${policy.lintStaged.prettierCssCommand}"`
    );
  }

  if (lintStaged["*.md"] || lintStaged["**/*.md"]) {
    violations.push(
      "lint-staged must not format *.md (docs are Biome-excluded; use dedicated doc tooling)"
    );
  }

  for (const stagedPath of policy.lintStaged.biomeEditorSyncPaths) {
    const command = lintStaged[stagedPath];

    if (command !== policy.lintStaged.biomeEditorSyncCommand) {
      violations.push(
        `lint-staged["${stagedPath}"] must be "${policy.lintStaged.biomeEditorSyncCommand}"`
      );
    }
  }

  const referenceSettingsPath = join(
    repoRoot,
    policy.referenceVscodeSettingsPath
  );

  let referenceSettings;

  try {
    referenceSettings = JSON.parse(readFileSync(referenceSettingsPath, "utf8"));
  } catch {
    violations.push(
      `${policy.referenceVscodeSettingsPath} must exist (Biome-excluded _reference editor scope)`
    );
    referenceSettings = null;
  }

  if (referenceSettings !== null) {
    const referencePolicy = policy.referenceVscode;

    if (
      referenceSettings["biome.enabled"] !== referencePolicy.biomeEnabledDefault
    ) {
      violations.push(
        `${policy.referenceVscodeSettingsPath} biome.enabled must be ${referencePolicy.biomeEnabledDefault}`
      );
    }

    if (
      referenceSettings["biome.requireConfiguration"] !==
      referencePolicy.requireConfiguration
    ) {
      violations.push(
        `${policy.referenceVscodeSettingsPath} biome.requireConfiguration must be ${referencePolicy.requireConfiguration}`
      );
    }

    for (const languageId of referencePolicy.formatterLanguages) {
      const scope = expectObject(
        referenceSettings[`[${languageId}]`] ?? {},
        `[${languageId}]`
      );

      if (scope["biome.enabled"] !== false) {
        violations.push(
          `${policy.referenceVscodeSettingsPath} [${languageId}] biome.enabled must be false`
        );
      }

      if (
        scope["editor.defaultFormatter"] !== referencePolicy.defaultFormatter
      ) {
        violations.push(
          `${policy.referenceVscodeSettingsPath} [${languageId}] editor.defaultFormatter must be "${referencePolicy.defaultFormatter}"`
        );
      }
    }
  }

  for (const selector of policy.prettierDocumentSelectors) {
    if (!prettierConfig.includes(selector)) {
      violations.push(
        `${policy.prettierConfigPath} must include Prettier scope ${selector}`
      );
    }
  }

  if (/files:\s*\[\s*"[^"]+\.md"/.test(prettierConfig)) {
    violations.push(
      `${policy.prettierConfigPath} must not claim ownership of markdown beyond MDX`
    );
  }

  const precommitScript = packageJson.scripts?.precommit;

  if (precommitScript !== policy.precommitScript) {
    violations.push(
      `package.json scripts.precommit must be "${policy.precommitScript}"`
    );
  }

  const huskyPreCommit = readFileSync(
    join(repoRoot, policy.huskyPreCommitPath),
    "utf8"
  ).trim();

  if (huskyPreCommit !== "pnpm precommit") {
    violations.push(
      `${policy.huskyPreCommitPath} must contain exactly "pnpm precommit" (found: ${JSON.stringify(huskyPreCommit)})`
    );
  }

  if (violations.length > 0) {
    return { ok: false, violations };
  }

  return { ok: true };
}
