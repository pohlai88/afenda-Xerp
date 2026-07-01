/**
 * Afenda primitive adapter — consumer props must not override governed `data-slot`.
 * Compile-time only; erases at runtime.
 */
export type WithoutGovernedDataSlot<T extends object> = Omit<T, "data-slot">;
