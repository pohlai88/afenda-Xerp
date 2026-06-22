#!/usr/bin/env node
/**
 * CSP third-party script governance for apps/erp.
 * Shared by Cursor preToolUse hook and CI gate.
 */
import {
  checkCspSriSurfaceGovernance,
  isCspSriSurfacePath,
} from "./csp-sri-governance.mjs";

export const CSP_ERP_SOURCE_PATH =
  /(?:^|[/\\])apps[/\\]erp[/\\]src[/\\].+\.(?:tsx?|jsx?)$/iu;

export const CSP_POLICY_FILE_PATH =
  /(?:^|[/\\])apps[/\\]erp[/\\]src[/\\]lib[/\\]security[/\\]csp(?:-allowlist)?\.ts$/iu;

const RAW_SCRIPT_TAG = /<script[\s>/]/u;
const DANGEROUS_HTML = /dangerouslySetInnerHTML/u;
const NEXT_SCRIPT_IMPORT =
  /from\s+["']next\/script["']|from\s+["']@next\/third-parties/u;
const SCRIPT_JSX = /<Script\b/u;
const NONCE_PROP = /\bnonce=\{/u;
const GET_CSP_NONCE_IMPORT =
  /from\s+["']@\/lib\/security\/nonce\.server["']|getCspNonce\s*\(/u;
const INLINE_SCRIPT_URL = /\bsrc=["']https?:\/\//u;

/**
 * @param {string} content
 * @param {string} [relativePath]
 * @returns {string[]}
 */
export function checkCspThirdPartyGovernance(content, relativePath = "") {
  const violations = [];

  if (!CSP_ERP_SOURCE_PATH.test(relativePath)) {
    return violations;
  }

  if (CSP_POLICY_FILE_PATH.test(relativePath)) {
    return violations;
  }

  violations.push(...checkCspSriSurfaceGovernance(content, relativePath));

  if (isCspSriSurfacePath(relativePath)) {
    return violations;
  }

  if (RAW_SCRIPT_TAG.test(content)) {
    violations.push(
      "Raw <script> tags are forbidden. Use next/script in a Server Component with getCspNonce()."
    );
  }

  if (DANGEROUS_HTML.test(content)) {
    violations.push(
      "dangerouslySetInnerHTML is forbidden in ERP app code unless explicitly approved."
    );
  }

  if (INLINE_SCRIPT_URL.test(content) && !NEXT_SCRIPT_IMPORT.test(content)) {
    violations.push(
      "External script URLs require next/script and CSP allowlist updates."
    );
  }

  if (NEXT_SCRIPT_IMPORT.test(content) && SCRIPT_JSX.test(content)) {
    if (!NONCE_PROP.test(content)) {
      violations.push(
        "next/script usage must pass nonce={nonce} from getCspNonce()."
      );
    }

    if (!GET_CSP_NONCE_IMPORT.test(content)) {
      violations.push(
        "Files using next/script must import getCspNonce from @/lib/security/nonce.server."
      );
    }
  }

  return violations;
}
