/**
 * PAS-004A §4.7 — Knowledge Reasoning contract.
 *
 * Replaces the flat `reasoning: string` prose field with a structured argument
 * whose premises, inference, rules, and conclusion are individually recoverable.
 * PAS-004 First Principle 2: "reasoning must be recoverable."
 * Backward-compat string field remains on KnowledgeAtom.reasoning until B29.
 */

export interface KnowledgeReasoning {
  /** Alternative conclusions considered but rejected, with reasons. */
  readonly alternatives?: readonly string[];
  /** The accepted meaning that results from applying the rules to the premises. */
  readonly conclusion: string;
  /** How the premises lead to the conclusion. */
  readonly inference: string;
  /** Stated facts on which the argument rests. */
  readonly premises: readonly string[];
  /** Constitutional or domain rules applied, e.g. "IFRS 10 §4", "PAS-001 §3". */
  readonly rules: readonly string[];
}
