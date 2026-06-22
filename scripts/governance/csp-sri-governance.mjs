#!/usr/bin/env node
/**
 * Hybrid CSP / SRI governance for apps/erp.
 * Shared by CI gate and Cursor preToolUse hook.
 */

/** App Router trees that receive SRI CSP in hybrid mode (no nonce). */
export const CSP_SRI_SURFACE_PATH_PATTERNS = [
  /apps[/\\]erp[/\\]src[/\\]app[/\\]\(auth\)[/\\]/iu,
  /apps[/\\]erp[/\\]src[/\\]app[/\\]\(dev\)[/\\]governance-integration[/\\]/iu,
  /apps[/\\]erp[/\\]src[/\\]app[/\\]\(dev\)[/\\]appshell-demo[/\\]/iu,
  /apps[/\\]erp[/\\]src[/\\]app[/\\]\(dev\)[/\\]appshell-canvas[/\\]/iu,
];

const NEXT_SCRIPT_IMPORT =
  /from\s+["']next\/script["']|from\s+["']@next\/third-parties/u;
const SCRIPT_JSX = /<Script\b/u;
const SCRIPT_OPEN_TAG = /<script\b[^>]*>/giu;
const PRELOAD_SCRIPT_TAG = /<link\b[^>]*\bas=["']script["'][^>]*>/giu;

/** Minimum share of `/_next/static/` script tags that must carry SRI integrity. */
export const CSP_SRI_MIN_STATIC_SCRIPT_COVERAGE = 0.25;

/**
 * @param {string} relativePath
 * @returns {boolean}
 */
export function isCspSriSurfacePath(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  return CSP_SRI_SURFACE_PATH_PATTERNS.some((pattern) =>
    pattern.test(normalized)
  );
}

/**
 * @param {string} content
 * @param {string} [relativePath]
 * @returns {string[]}
 */
export function checkCspSriSurfaceGovernance(content, relativePath = "") {
  const violations = [];

  if (!isCspSriSurfacePath(relativePath)) {
    return violations;
  }

  if (NEXT_SCRIPT_IMPORT.test(content) || SCRIPT_JSX.test(content)) {
    violations.push(
      "next/script and third-party Script components are forbidden on SRI (public) route surfaces. Add integrations only under protected routes with getCspNonce()."
    );
  }

  return violations;
}

/**
 * @param {string} html
 * @returns {{
 *   integrityCount: number;
 *   staticScriptCount: number;
 *   staticScriptWithIntegrityCount: number;
 *   preloadScriptCount: number;
 *   preloadScriptWithIntegrityCount: number;
 * }}
 */
export function analyzeSriHtmlIntegrity(html) {
  let staticScriptCount = 0;
  let staticScriptWithIntegrityCount = 0;
  let preloadScriptCount = 0;
  let preloadScriptWithIntegrityCount = 0;

  for (const match of html.matchAll(SCRIPT_OPEN_TAG)) {
    const tag = match[0];

    if (!/\bsrc=["']\/_next\/static\//iu.test(tag)) {
      continue;
    }

    staticScriptCount += 1;

    if (/\bintegrity=["']sha256-/iu.test(tag)) {
      staticScriptWithIntegrityCount += 1;
    }
  }

  for (const match of html.matchAll(PRELOAD_SCRIPT_TAG)) {
    const tag = match[0];
    preloadScriptCount += 1;

    if (/\bintegrity=["']sha256-/iu.test(tag)) {
      preloadScriptWithIntegrityCount += 1;
    }
  }

  const integrityCount = (html.match(/integrity=["']sha256-/giu) ?? []).length;

  return {
    integrityCount,
    staticScriptCount,
    staticScriptWithIntegrityCount,
    preloadScriptCount,
    preloadScriptWithIntegrityCount,
  };
}

/**
 * @param {string} html
 * @param {{ minStaticScriptCoverage?: number }} [options]
 * @returns {string[]}
 */
export function checkCspSriBuildHtml(html, options = {}) {
  const minStaticScriptCoverage =
    options.minStaticScriptCoverage ?? CSP_SRI_MIN_STATIC_SCRIPT_COVERAGE;
  const violations = [];
  const stats = analyzeSriHtmlIntegrity(html);

  if (stats.integrityCount === 0) {
    violations.push(
      "Expected at least one sha256 integrity attribute in static sign-in HTML."
    );
  }

  if (
    stats.preloadScriptCount > 0 &&
    stats.preloadScriptWithIntegrityCount < stats.preloadScriptCount
  ) {
    violations.push(
      `Expected all script preload links to include integrity (found ${stats.preloadScriptWithIntegrityCount}/${stats.preloadScriptCount}).`
    );
  }

  if (stats.staticScriptCount > 0) {
    const coverage =
      stats.staticScriptWithIntegrityCount / stats.staticScriptCount;

    if (coverage < minStaticScriptCoverage) {
      violations.push(
        `Static script SRI coverage ${Math.round(coverage * 100)}% is below minimum ${Math.round(minStaticScriptCoverage * 100)}% (${stats.staticScriptWithIntegrityCount}/${stats.staticScriptCount} /_next/static/ script tags).`
      );
    }
  }

  return violations;
}
