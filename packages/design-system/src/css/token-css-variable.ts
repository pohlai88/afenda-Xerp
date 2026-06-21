/**
 * Re-exports the canonical `tokenNameToCssVariable` helper and its types from
 * the token contract so that consumers always reach the single source of truth.
 *
 * The function and types live in `token.contract.ts` to co-locate them with
 * the type definitions that govern them.  This module exists purely to
 * preserve the existing import path used by the build script.
 */
export type {
  AfendaCssVariableName,
  AfendaTokenName,
} from "../contracts/token.contract";
export { tokenNameToCssVariable } from "../contracts/token.contract";

/**
 * @deprecated Use `AfendaCssVariableName` from `contracts/token.contract` instead.
 * Kept for backward-compatibility with existing imports.
 */
export type AfendaTokenCssVariable =
  import("../contracts/token.contract").AfendaCssVariableName;
