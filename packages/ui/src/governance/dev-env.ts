/** Shared development-mode gate for governance runtime assertions. */
type ViteImportMeta = ImportMeta & {
  env?: {
    DEV?: boolean;
    MODE?: string;
    VITEST_STORYBOOK?: boolean | string;
  };
};

export type GovernanceRuntimeMode = "strict" | "warn" | "off";

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

function readExplicitGovernanceRuntimeMode():
  | GovernanceRuntimeMode
  | undefined {
  if (typeof process === "undefined") {
    return;
  }

  const value = process.env["AFENDA_GOVERNANCE_RUNTIME"];
  if (value === "strict" || value === "warn" || value === "off") {
    return value;
  }

  return;
}

function isStorybookVitestContext(): boolean {
  const viteEnv = (import.meta as ViteImportMeta).env;
  if (
    viteEnv?.VITEST_STORYBOOK === true ||
    viteEnv?.VITEST_STORYBOOK === "true"
  ) {
    return true;
  }

  if (typeof process !== "undefined") {
    return process.env["VITEST_STORYBOOK"] === "true";
  }

  return false;
}

/** Resolves how Governed UI runtime checks behave in the current environment. */
export function getGovernanceRuntimeMode(): GovernanceRuntimeMode {
  const explicit = readExplicitGovernanceRuntimeMode();
  if (explicit !== undefined) {
    return explicit;
  }

  // Storybook Vitest renders full stories — static governance tests cover Foundation phase 04.
  if (isStorybookVitestContext()) {
    return "off";
  }

  return "strict";
}

/** Whether Governed UI should throw at runtime (dev/test only). */
export function shouldEnforceGovernanceRuntime(): boolean {
  return isDevelopment && getGovernanceRuntimeMode() === "strict";
}

/** Whether Governed UI should warn at runtime without failing render. */
export function shouldWarnGovernanceRuntime(): boolean {
  return isDevelopment && getGovernanceRuntimeMode() === "warn";
}

export function reportGovernanceRuntimeViolation(message: string): void {
  if (!isDevelopment) {
    return;
  }

  if (shouldEnforceGovernanceRuntime()) {
    throw new Error(message);
  }

  if (shouldWarnGovernanceRuntime()) {
    console.warn(message);
  }
}

/** Strict: throw. Storybook Vitest (off): return fallback so stories still render. */
export function enforceGovernanceOr<T>(message: string, fallback: T): T {
  reportGovernanceRuntimeViolation(message);
  return fallback;
}

/** Strict: throw. Storybook Vitest (off): no-op. */
export function enforceGovernance(message: string): void {
  reportGovernanceRuntimeViolation(message);
}
