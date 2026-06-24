/** Compile-time assignability checks for contract ↔ runtime re-export alignment. */
export type AssertMutuallyAssignable<A, B> = A extends B
  ? B extends A
    ? true
    : false
  : false;

export type AssertAssignableToContract<Runtime, Contract> =
  Runtime extends Contract ? true : false;
