/**
 * Compile-time contract alignment checks — imported by drift guard tests.
 * A failed assignability check surfaces as a type error in this module.
 */
import type {
  ApplicationShellIdentity,
  ApplicationShellOperatingContext,
} from "../context.contract.js";
import type { ManifestModuleId } from "../navigation.contract.js";
import type {
  AssertAssignableToContract,
  AssertMutuallyAssignable,
} from "./type-assignability.js";

export type { AssertAssignableToContract, AssertMutuallyAssignable };

/** Runtime-facing types must match frozen contract definitions exactly. */
export type AssertContractAligned<Runtime, Contract> = AssertMutuallyAssignable<
  Runtime,
  Contract
>;

/** Runtime registries must be assignable to contract readonly arrays. */
export type AssertRegistryAssignable<
  Runtime extends readonly Contract[],
  Contract,
> = AssertAssignableToContract<Runtime, readonly Contract[]>;

export type OperatingContextContract = ApplicationShellOperatingContext;
export type IdentityContract = ApplicationShellIdentity;
export type ManifestModuleIdContract = ManifestModuleId;
