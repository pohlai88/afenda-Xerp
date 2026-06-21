"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRepoPath = normalizeRepoPath;
exports.matchesGlob = matchesGlob;
exports.pathMatchesAnyGlob = pathMatchesAnyGlob;
/**
 * Normalizes repo-relative paths for deterministic glob matching.
 */
function normalizeRepoPath(path) {
    return path.replaceAll("\\", "/").replace(/^\.\//u, "");
}
/**
 * Matches a repo path against a scope glob.
 *
 * Supported syntax:
 * - `**` — at most once per pattern; splits into optional prefix and suffix anchors
 * - `*` — as a whole segment, matches zero or more path segments; within a segment,
 *   matches characters via regex
 *
 * Limitations (by design — scope manifests use simple patterns):
 * - Multiple `**` tokens are not supported; only the first split is evaluated
 * - `**` is not recursive globstar between segments; suffix matching starts at the
 *   remainder after the prefix, not at an arbitrary nested directory
 */
function matchesGlob(path, pattern) {
    var _a, _b, _c, _d;
    var normalizedPath = normalizeRepoPath(path);
    var normalizedPattern = normalizeRepoPath(pattern);
    if (normalizedPattern.includes("**")) {
        var parts = normalizedPattern.split("**");
        var prefix = (_b = (_a = parts[0]) === null || _a === void 0 ? void 0 : _a.replace(/\/$/u, "")) !== null && _b !== void 0 ? _b : "";
        var suffix = (_d = (_c = parts[1]) === null || _c === void 0 ? void 0 : _c.replace(/^\//u, "")) !== null && _d !== void 0 ? _d : "";
        if (prefix && !pathStartsWithPrefix(normalizedPath, prefix)) {
            return false;
        }
        if (!suffix) {
            return true;
        }
        var remainder = prefix
            ? normalizedPath.slice(prefix.length).replace(/^\//u, "")
            : normalizedPath;
        return matchGlobSegment(remainder, suffix);
    }
    return matchGlobSegment(normalizedPath, normalizedPattern);
}
function pathStartsWithPrefix(path, prefix) {
    return path === prefix || path.startsWith("".concat(prefix, "/"));
}
function matchGlobSegment(path, pattern) {
    var pathParts = path.split("/");
    var patternParts = pattern.split("/");
    return matchParts(pathParts, patternParts);
}
function matchParts(pathParts, patternParts) {
    if (patternParts.length === 0) {
        return pathParts.length === 0;
    }
    var patternHead = patternParts[0], patternTail = patternParts.slice(1);
    if (patternHead === "*") {
        for (var index = 0; index <= pathParts.length; index += 1) {
            if (matchParts(pathParts.slice(index), patternTail)) {
                return true;
            }
        }
        return false;
    }
    var pathHead = pathParts[0], pathTail = pathParts.slice(1);
    if (pathHead === undefined || patternHead === undefined) {
        return false;
    }
    if (!matchSingleSegment(pathHead, patternHead)) {
        return false;
    }
    return matchParts(pathTail, patternTail);
}
function matchSingleSegment(value, pattern) {
    if (!pattern.includes("*")) {
        return value === pattern;
    }
    var regex = new RegExp("^".concat(pattern.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&").replace(/\\\*/gu, ".*"), "$"), "u");
    return regex.test(value);
}
function pathMatchesAnyGlob(path, patterns) {
    return patterns.some(function (pattern) { return matchesGlob(path, pattern); });
}
