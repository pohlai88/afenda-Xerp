"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUSINESS_LOGIC_FORBIDDEN_LAYERS = exports.FORBIDDEN_BROAD_SCOPE_GLOBS = exports.FORBIDDEN_AI_PACKAGE_PATTERNS = void 0;
exports.FORBIDDEN_AI_PACKAGE_PATTERNS = [
    /-v\d+$/u,
    /-new$/u,
    /-temp$/u,
    /-modern$/u,
    /-refactor$/u,
    /-rewrite$/u,
    /-next$/u,
    /^legacy-/u,
];
exports.FORBIDDEN_BROAD_SCOPE_GLOBS = [
    "**/*",
    "packages/**",
    "apps/**",
    ".github/**",
];
exports.BUSINESS_LOGIC_FORBIDDEN_LAYERS = [
    "Platform",
    "Design",
    "Metadata",
];
