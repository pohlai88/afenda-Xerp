export interface GovernedExample {
  readonly demonstrates: readonly string[];
  readonly driftWarnings: readonly string[];
  readonly importsFrom: "@afenda/design-system";
  readonly name: string;
  readonly purpose: string;
  readonly source: string;
}
