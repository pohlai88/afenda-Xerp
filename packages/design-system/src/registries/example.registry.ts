import type { GovernedExample } from "../contracts/example.contract";
import { erpGovernedExamples } from "../examples/erp-patterns";

/**
 * All governed AI imitation examples.  Every entry has `imitationOnly: true`
 * and imports only from `@afenda/design-system`.
 */
export const AFENDA_EXAMPLE_REGISTRY = erpGovernedExamples satisfies readonly GovernedExample[];
