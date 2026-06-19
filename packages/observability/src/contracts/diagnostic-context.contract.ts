import type { CorrelationContext } from "./correlation.contract.js";

export interface DiagnosticContext extends CorrelationContext {
  readonly environment: string;
  readonly module: string;
  readonly package: string;
  readonly service: string;
  readonly version: string;
}
