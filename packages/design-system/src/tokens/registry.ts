/**
 * @deprecated Import from `../registries/token.registry` instead.
 * This re-export shim exists only to avoid breaking the build script
 * and any existing deep imports during the TIP-004A migration.
 */
export {
  AFENDA_CSS_VARIABLES,
  AFENDA_TOKEN_NAMES,
  AFENDA_TOKEN_REGISTRY,
  tokenRegistry,
} from "../registries/token.registry";

// AfendaTokenName is the canonical type; re-export for backward compat.
export type { AfendaTokenName } from "../contracts/token.contract";
