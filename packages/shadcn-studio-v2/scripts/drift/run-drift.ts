import {
  checkCssTokenAuthority,
  checkForbiddenThemeFiles,
  checkForbiddenTokens,
} from "./css-token-rules.ts";
import {
  checkConsumerDeepImports,
  checkCssPackageBoundary,
  checkRedundantBiomeSuppressions,
  checkTailwindV4ShadcnBoundary,
  checkV2RuntimeImports,
} from "./export-boundary-rules.ts";
import {
  checkQuarantineGovernance,
  QUARANTINE_STALE_ADVISORY_DAYS,
} from "./quarantine-rules.ts";
import type { DriftViolation } from "./shared.ts";
import { checkHardcodedHex, checkLegacyFolders } from "./taxonomy-rules.ts";

const checks = [
  checkCssTokenAuthority,
  checkTailwindV4ShadcnBoundary,
  checkCssPackageBoundary,
  checkForbiddenTokens,
  checkForbiddenThemeFiles,
  checkV2RuntimeImports,
  checkConsumerDeepImports,
  checkLegacyFolders,
  checkHardcodedHex,
  checkRedundantBiomeSuppressions,
] satisfies ReadonlyArray<() => Promise<DriftViolation[]>>;

const main = async (): Promise<void> => {
  const quarantine = await checkQuarantineGovernance();
  const violations = [
    ...(await Promise.all(checks.map((check) => check()))).flat(),
    ...quarantine.violations,
  ];

  if (violations.length === 0) {
    console.log("Afenda Studio V2 design-system drift guard passed.");
    console.log(
      `Quarantine inventory: ${quarantine.summary.onDiskPaths.length} implementation file(s). Policy: src/components/quarantine/README.md`
    );

    if (quarantine.summary.advisoryCount > 0) {
      console.warn(
        `Quarantine stale advisory: ${quarantine.summary.advisoryCount} file(s) exceeded ${QUARANTINE_STALE_ADVISORY_DAYS} days without promotion decision.`
      );
    }

    return;
  }

  console.error("Afenda Studio V2 design-system drift guard failed.");

  for (const violation of violations) {
    console.error(
      `- [${violation.rule}] ${violation.file}: ${violation.detail}`
    );
  }

  process.exitCode = 1;
};

export async function runDesignSystemDriftGuard(): Promise<void> {
  await main();
}
