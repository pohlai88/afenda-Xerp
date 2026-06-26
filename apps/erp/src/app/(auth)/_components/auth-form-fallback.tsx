import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import {
  AUTH_ROUTE_REGISTRY,
  type AuthRouteId,
} from "@/lib/auth/auth-route.registry";

export function AuthFormFallback({ route }: { readonly route: AuthRouteId }) {
  return <AuthForm.Skeleton label={AUTH_ROUTE_REGISTRY[route].skeletonLabel} />;
}
