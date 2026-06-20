/** Shared development-mode gate for governance runtime assertions. */
type ViteImportMeta = ImportMeta & {
  env?: {
    DEV?: boolean;
    MODE?: string;
  };
};

export const isDevelopment = (() => {
  if (typeof process !== "undefined") {
    const nodeEnv = process.env["NODE_ENV"];
    if (nodeEnv !== undefined) {
      return nodeEnv !== "production";
    }
  }

  const viteEnv = (import.meta as ViteImportMeta).env;
  if (viteEnv) {
    return viteEnv.DEV === true || viteEnv.MODE !== "production";
  }

  return false;
})();
