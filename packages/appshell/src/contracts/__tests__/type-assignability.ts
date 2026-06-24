/** Minimal compile-time helpers for contract ↔ runtime alignment tests. */
export type AssertMutuallyAssignable<A, B> = A extends B
  ? B extends A
    ? true
    : false
  : false;

export type AssertAssignableToContract<Runtime, Contract> =
  Runtime extends Contract ? true : false;
