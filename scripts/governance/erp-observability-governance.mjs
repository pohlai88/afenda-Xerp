#!/usr/bin/env node
/**
 * ERP observability governance — pino edge safety, logger centralization,
 * correlation branding, and serializable metadata.
 */

export const ERP_SOURCE_PATH =
  /(?:^|[/\\])apps[/\\]erp[/\\]src[/\\].+\.(?:tsx?|jsx?)$/iu;

export const ERP_EDGE_RUNTIME_PATHS = [/apps[/\\]erp[/\\]src[/\\]proxy\.ts$/iu];

export const ERP_PINO_FACTORY_ALLOWLIST = [
  /apps[/\\]erp[/\\]src[/\\]lib[/\\]observability[/\\]create-erp-logger\.ts$/iu,
];

const NODE_ONLY_PATTERNS = [
  /from\s+["']pino["']/u,
  /\bcreatePinoLogger\b/u,
  /\bcreatePinoSink\b/u,
];

const RAW_ERROR_METADATA_PATTERN =
  /logger\.(?:debug|info|warn|error)\(\s*["'][^"']+["']\s*,\s*\{[^}]*\berror\s*:/u;

/**
 * @param {string} relativePath
 * @returns {boolean}
 */
function isErpEdgeRuntimePath(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  return ERP_EDGE_RUNTIME_PATHS.some((pattern) => pattern.test(normalized));
}

/**
 * @param {string} relativePath
 * @returns {boolean}
 */
function isPinoFactoryAllowlisted(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  return ERP_PINO_FACTORY_ALLOWLIST.some((pattern) => pattern.test(normalized));
}

/**
 * @param {string} content
 * @param {string} [relativePath]
 * @returns {string[]}
 */
export function checkErpObservabilityGovernance(content, relativePath = "") {
  const violations = [];

  if (!ERP_SOURCE_PATH.test(relativePath)) {
    return violations;
  }

  if (isErpEdgeRuntimePath(relativePath)) {
    for (const pattern of NODE_ONLY_PATTERNS) {
      if (pattern.test(content)) {
        violations.push(
          "Edge/proxy runtime files must not import Node-only pino APIs."
        );
        break;
      }
    }
  }

  if (
    !isPinoFactoryAllowlisted(relativePath) &&
    /\bcreatePinoLogger\b/u.test(content)
  ) {
    violations.push(
      "Use createErpLogger (or createRequestBoundErpLogger) instead of createPinoLogger outside lib/observability/create-erp-logger.ts."
    );
  }

  if (
    !isPinoFactoryAllowlisted(relativePath) &&
    /\bcreateErpLogger\s*\(/u.test(content) &&
    !/\b(?:toErpCorrelationId|createErpCorrelationId|createErpBackgroundLogger|createRequestBoundErpLogger|createApiHandlerLogger)\b/u.test(
      content
    )
  ) {
    violations.push(
      "createErpLogger callers must brand correlation IDs via toErpCorrelationId, createErpCorrelationId, or a request/background factory."
    );
  }

  if (RAW_ERROR_METADATA_PATTERN.test(content)) {
    violations.push(
      "Logger metadata must not include raw Error objects. Use reason, code, or message fields."
    );
  }

  return violations;
}
