/**
 * Governance script: verify no deep imports from @afenda/design-system
 * appear in example source strings.
 *
 * Exit code 0 = pass, exit code 1 = fail.
 */
import { AFENDA_EXAMPLE_REGISTRY } from "../registries/example.registry";
import { publicExportContract } from "../policies/export-surface";

const errors: string[] = [];

const forbiddenPatterns = publicExportContract.internalFolders.map(
  (folder) => `@afenda/design-system/${folder}`
);

for (const example of AFENDA_EXAMPLE_REGISTRY) {
  for (const pattern of forbiddenPatterns) {
    if (example.source.includes(pattern)) {
      errors.push(
        `  ✗ Example "${example.name}" deep-imports from "${pattern}" — only the root "@afenda/design-system" is allowed`
      );
    }
  }

  if (!example.source.includes('from "@afenda/design-system"')) {
    errors.push(
      `  ✗ Example "${example.name}" does not import from "@afenda/design-system"`
    );
  }

  if (!example.imitationOnly) {
    errors.push(
      `  ✗ Example "${example.name}" must have imitationOnly: true`
    );
  }
}

if (errors.length > 0) {
  process.stderr.write(
    `check:no-deep-imports FAILED — ${errors.length} violation(s):\n${errors.join("\n")}\n`
  );
  process.exit(1);
} else {
  process.stdout.write(
    `check:no-deep-imports PASSED — all ${AFENDA_EXAMPLE_REGISTRY.length} examples use only the public root entry.\n`
  );
}
