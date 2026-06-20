export const FORBIDDEN_AI_PACKAGE_PATTERNS = [
  /-v\d+$/u,
  /-new$/u,
  /-temp$/u,
  /-modern$/u,
  /-refactor$/u,
  /-rewrite$/u,
  /-next$/u,
  /^legacy-/u,
] as const;

export const FORBIDDEN_BROAD_SCOPE_GLOBS = [
  "**/*",
  "packages/**",
  "apps/**",
  ".github/**",
] as const;

export const BUSINESS_LOGIC_FORBIDDEN_LAYERS = [
  "Platform",
  "Design",
  "Metadata",
] as const;
