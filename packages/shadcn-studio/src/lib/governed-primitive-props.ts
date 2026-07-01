/**
 * Afenda primitive adapter — consumer props must not override governed `data-slot`.
 * Compile-time only; erases at runtime.
 */
export type WithoutGovernedDataSlot<T extends object> = Omit<T, "data-slot">;

/** Consumer layout override — string only; stateful className functions belong in the contract. */
export type WithStringClassNameOnly<T extends object> = Omit<T, "className"> & {
  className?: string;
};

export type GovernedPrimitiveProps<T extends object> = WithStringClassNameOnly<
  WithoutGovernedDataSlot<T>
>;
