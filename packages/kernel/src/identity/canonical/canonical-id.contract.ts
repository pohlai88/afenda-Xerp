import type { Brand } from "../brand/index.js";
import type { EnterpriseIdFamily } from "../registry/id-family.registry.js";

export type CanonicalId<TFamily extends EnterpriseIdFamily> = Brand<
  string,
  `CanonicalId:${TFamily}`
>;

/** Alias aligned with ADR-0021 / PAS §4.1 naming. */
export type CanonicalEnterpriseId<TFamily extends EnterpriseIdFamily> =
  CanonicalId<TFamily>;
