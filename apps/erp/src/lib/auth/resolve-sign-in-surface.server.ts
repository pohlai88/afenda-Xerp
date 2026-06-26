import type { SignInProviderSurface } from "@afenda/auth";
import { resolveSignInProviderSurface } from "@afenda/auth";

/** Serializable sign-in provider flags for ERP auth entry pages. */
export function resolveSignInSurface(): SignInProviderSurface {
  return resolveSignInProviderSurface();
}
