import type { Brand } from "../brand/brand.contract.js";
import type { IdFamily } from "../registry/id-family.registry.js";

export type CanonicalId<TFamily extends IdFamily> = Brand<
  string,
  `CanonicalId:${TFamily}`
>;

/** Alias aligned with ADR-0021 / PAS §4.1 naming. */
export type CanonicalEnterpriseId<TFamily extends IdFamily> =
  CanonicalId<TFamily>;
