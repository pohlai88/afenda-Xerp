/**
 * L2 theme-config inventory SSOT — flat `config.*` modules only.
 * Gate: vitest `theme-inventory.registry`
 */

export const THEME_INVENTORY_MARKER = "@afenda.theme-inventory" as const;

export const THEME_INVENTORY_SERIES = "flat-L2-theme-config" as const;

export const THEME_INVENTORY_REFACTORED = "2026-07-05" as const;

export const THEME_INVENTORY_GATE = "check:studio-theme-inventory" as const;

export type ThemeModuleEntry = {
  readonly file: string;
  readonly exports: readonly string[];
  readonly role: string;
  readonly serializable: boolean;
};

export const THEME_MODULE_REGISTRY = [
  {
    file: "config.preset.contract.ts",
    exports: [
      "ThemeStyleProps",
      "ThemeStyles",
      "ThemePreset",
      "NAMED_THEME_PRESET_SLUGS",
      "THEME_PRESET_SLUGS",
      "PRESET_CSS_VARS",
      "THEME_MODES",
      "THEME_RADII",
      "THEME_SCALES",
      "THEME_LAYOUTS",
      "THEME_SIDEBAR_VARIANTS",
      "THEME_SIDEBAR_COLLAPSIBLES",
      "THEME_FONTS",
      "RADIUS_VALUES",
      "assertThemePresetSlug",
      "isNamedThemePresetSlug",
      "isThemeFont",
      "isThemeLayout",
      "isThemeMode",
      "isThemePresetSlug",
      "isThemeRadius",
      "isThemeScale",
      "isThemeSidebarCollapsible",
      "isThemeSidebarVariant",
    ],
    role: "Typed preset + settings vocabulary and runtime guards",
    serializable: true,
  },
  {
    file: "config.presets.ts",
    exports: ["themePresets"],
    role: "Named preset token maps (JSON-serializable)",
    serializable: true,
  },
  {
    file: "config.defaults.ts",
    exports: ["themeConfig", "ThemeConfig"],
    role: "Product defaults and localStorage key",
    serializable: true,
  },
  {
    file: "config.settings.contract.ts",
    exports: ["Settings", "initialSettings"],
    role: "Settings shape SSOT",
    serializable: true,
  },
] as const satisfies readonly ThemeModuleEntry[];

export const THEME_MODULE_FILES = THEME_MODULE_REGISTRY.map(
  (entry) => entry.file
);

export const THEME_REGISTRY_EXCLUDED_FILES = [
  "config.inventory.registry.ts",
] as const;

export type ThemeModuleInventoryDiff = {
  readonly registeredCount: number;
  readonly discoveredCount: number;
  readonly missingOnDisk: readonly string[];
  readonly discoveredOnly: readonly string[];
};

export function diffThemeModuleRegistry(
  discoveredFiles: readonly string[]
): ThemeModuleInventoryDiff {
  const registered = THEME_MODULE_FILES;
  const registeredSet = new Set<string>(registered);
  const discoveredSet = new Set<string>(discoveredFiles);

  return {
    registeredCount: registered.length,
    discoveredCount: discoveredFiles.length,
    missingOnDisk: registered.filter((file) => !discoveredSet.has(file)),
    discoveredOnly: discoveredFiles.filter((file) => !registeredSet.has(file)),
  };
}

export function assertThemeModuleRegistryComplete(
  discoveredFiles: readonly string[]
): boolean {
  const diff = diffThemeModuleRegistry(discoveredFiles);

  return (
    diff.registeredCount === diff.discoveredCount &&
    diff.missingOnDisk.length === 0 &&
    diff.discoveredOnly.length === 0
  );
}

export function assertThemeModuleRegistryCompleteOrThrow(
  discoveredFiles: readonly string[]
): void {
  if (!assertThemeModuleRegistryComplete(discoveredFiles)) {
    throw new Error(
      `theme module registry incomplete: ${formatThemeModuleInventoryDiff(
        diffThemeModuleRegistry(discoveredFiles)
      )}`
    );
  }
}

export function formatThemeModuleInventoryDiff(
  diff: ThemeModuleInventoryDiff
): string {
  const lines = [
    `registered=${diff.registeredCount} discovered=${diff.discoveredCount}`,
  ];

  if (diff.missingOnDisk.length > 0) {
    lines.push(`missing on disk: ${diff.missingOnDisk.join(", ")}`);
  }

  if (diff.discoveredOnly.length > 0) {
    lines.push(
      `unregistered on disk: ${diff.discoveredOnly.join(", ")} — add to config.inventory.registry.ts`
    );
  }

  return lines.join(" · ");
}

export function listSerializableThemeModules(): readonly ThemeModuleEntry[] {
  return THEME_MODULE_REGISTRY.filter((entry) => entry.serializable);
}
