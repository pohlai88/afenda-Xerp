/**
 * Paths excluded from governance / typecheck gates.
 *
 * `packages/ui/src/components/shadcn-studio` is raw MCP install output — not
 * @afenda/ui public API. Governed copies live in `packages/appshell/src/shadcn-studio`.
 */

export const UI_SHADCN_STUDIO_INSTALL_REL =
  "packages/ui/src/components/shadcn-studio";

function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

/** True when `dirPath` is `…/packages/ui/src/components` and `entry` is the install folder. */
export function isUiShadcnStudioInstallDir(dirPath, entry) {
  return (
    entry === "shadcn-studio" &&
    normalizePath(dirPath).endsWith("packages/ui/src/components")
  );
}

/** True for any file under the UI shadcn-studio install tree. */
export function isUiShadcnStudioInstallFile(filePath) {
  return normalizePath(filePath).includes(UI_SHADCN_STUDIO_INSTALL_REL);
}
