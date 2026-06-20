/**
 * Governance script: verify every token name starts with `afenda.`
 * and every CSS variable starts with `--afenda-`.
 *
 * Exit code 0 = pass, exit code 1 = fail.
 */
import { AFENDA_CSS_VARIABLES, AFENDA_TOKEN_NAMES } from "../registries/token.registry";

const tokenErrors: string[] = [];

for (const name of AFENDA_TOKEN_NAMES) {
  if (!name.startsWith("afenda.")) {
    tokenErrors.push(`  ✗ Token name missing prefix: "${name}"`);
  }
}

const cssErrors: string[] = [];

for (const variable of AFENDA_CSS_VARIABLES) {
  if (!variable.startsWith("--afenda-")) {
    cssErrors.push(`  ✗ CSS variable missing prefix: "${variable}"`);
  }
}

const allErrors = [...tokenErrors, ...cssErrors];

if (allErrors.length > 0) {
  process.stderr.write(
    `check:token-prefix FAILED — ${allErrors.length} violation(s):\n${allErrors.join("\n")}\n`
  );
  process.exit(1);
} else {
  process.stdout.write(
    `check:token-prefix PASSED — all ${AFENDA_TOKEN_NAMES.length} token names and ${AFENDA_CSS_VARIABLES.length} CSS variables are correctly prefixed.\n`
  );
}
