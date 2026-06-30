/**
 * Afenda primitive adapter — consumer props must not override governed `data-slot`.
 */
export type WithoutGovernedDataSlot<T extends object> = Omit<T, "data-slot">;
