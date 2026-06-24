#!/usr/bin/env tsx
/**
 * Foundation disposition registry gate (ADR-0014).
 *
 * Validates the machine-readable package disposition registry consumed by subagents.
 */

import { validateFoundationDisposition } from "../../packages/architecture-authority/src/validators/validate-foundation-disposition.ts";

function parseArgs(argv: readonly string[]) {
  let agentId: string | undefined;
  let entryId: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--agent") {
      agentId = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--entry") {
      entryId = argv[index + 1];
      index += 1;
    }
  }

  return { agentId, entryId };
}

function main() {
  const { agentId, entryId } = parseArgs(process.argv.slice(2));
  const result = validateFoundationDisposition({ agentId, entryId });

  if (result.ok) {
    console.log("Foundation disposition registry: PASS");
    return;
  }

  console.error("Foundation disposition registry: FAIL");
  for (const violation of result.violations) {
    console.error(`- [${violation.gate}] ${violation.message}`);
  }

  process.exitCode = 1;
}

main();
