"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_FILE_PATTERN = void 0;
exports.createNodeProject = createNodeProject;
exports.createDatabaseProject = createDatabaseProject;
exports.createUiProject = createUiProject;
exports.createReactProject = createReactProject;
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var plugin_react_1 = require("@vitejs/plugin-react");
var config_1 = require("vitest/config");
var MONOREPO_ROOT = (0, node_path_1.resolve)((0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(import.meta.url)));
exports.TEST_FILE_PATTERN = "src/**/__tests__/**/*.{test,spec}.{ts,tsx}";
var NODE_SETUP = (0, node_path_1.resolve)(MONOREPO_ROOT, "packages/testing/src/setup/node.ts");
var REACT_SETUP = (0, node_path_1.resolve)(MONOREPO_ROOT, "packages/testing/src/setup/react.ts");
var NEXT_LINK_MOCK = (0, node_path_1.resolve)(MONOREPO_ROOT, "packages/testing/src/mocks/next-link.tsx");
var WORKSPACE_DEPS = {
    inline: [/@afenda\//],
};
function coverageOptions(root) {
    return {
        provider: "v8",
        reporter: ["text", "html", "json", "json-summary"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
            "src/**/__tests__/**",
            "**/*.d.ts",
            "**/*.config.*",
            "**/index.ts",
            "**/__fixtures__/**",
            "**/__mocks__/**",
            "**/dist/**",
            "**/.next/**",
            "**/generated/**",
            "**/drizzle/**",
            "**/supabase/**",
        ],
        reportsDirectory: (0, node_path_1.resolve)(root, "coverage"),
    };
}
function sharedTestOptions(name, root) {
    return {
        name: name,
        globals: false,
        isolate: true,
        include: [exports.TEST_FILE_PATTERN],
        passWithNoTests: true,
        coverage: coverageOptions(root),
    };
}
function createNodeProject(importMetaUrl, name) {
    var root = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(importMetaUrl));
    return (0, config_1.defineProject)({
        root: root,
        server: {
            deps: WORKSPACE_DEPS,
        },
        test: __assign(__assign({}, sharedTestOptions(name, root)), { environment: "node", setupFiles: [NODE_SETUP] }),
    });
}
function createDatabaseProject(importMetaUrl, name) {
    var root = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(importMetaUrl));
    return (0, config_1.defineProject)({
        root: root,
        server: {
            deps: WORKSPACE_DEPS,
        },
        test: __assign(__assign({}, sharedTestOptions(name, root)), { environment: "node", setupFiles: [NODE_SETUP], pool: "forks", fileParallelism: false, testTimeout: 20000, hookTimeout: 20000 }),
    });
}
function createUiProject(importMetaUrl, name) {
    var root = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(importMetaUrl));
    return (0, config_1.defineProject)({
        root: root,
        plugins: [(0, plugin_react_1.default)()],
        server: {
            deps: WORKSPACE_DEPS,
        },
        test: __assign(__assign({}, sharedTestOptions(name, root)), { environment: "jsdom", setupFiles: [REACT_SETUP] }),
    });
}
function createReactProject(importMetaUrl, name, options) {
    if (options === void 0) { options = {}; }
    var root = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(importMetaUrl));
    return (0, config_1.defineProject)({
        root: root,
        plugins: [(0, plugin_react_1.default)()],
        resolve: {
            alias: __assign({ "next/link": NEXT_LINK_MOCK }, options.alias),
        },
        server: {
            deps: WORKSPACE_DEPS,
        },
        test: __assign(__assign({}, sharedTestOptions(name, root)), { environment: "jsdom", setupFiles: [REACT_SETUP] }),
    });
}
