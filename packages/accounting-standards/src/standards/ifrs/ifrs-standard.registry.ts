import { ACCOUNTING_STANDARD_REGISTRY } from "../accounting-standard.registry.js";

export const IFRS_STANDARD_REGISTRY = ACCOUNTING_STANDARD_REGISTRY.filter(
  (entry) => entry.family === "IFRS"
);
