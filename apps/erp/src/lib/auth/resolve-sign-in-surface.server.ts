import type { SignInProviderSurface } from "@afenda/auth";
import { resolveSignInProviderSurface } from "@afenda/auth";

export async function resolveSignInSurface(): Promise<SignInProviderSurface> {
  return resolveSignInProviderSurface();
}
