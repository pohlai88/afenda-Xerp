import { AuthV2Form } from "@/app/(auth-v2)/_components/auth-v2-form.compound";
import {
  AUTH_V2_ROUTE_REGISTRY,
  type AuthV2RouteId,
} from "@/lib/auth-v2/auth-v2-route.registry";

export function AuthV2FormFallback({
  route,
}: {
  readonly route: AuthV2RouteId;
}) {
  return (
    <AuthV2Form.Skeleton label={AUTH_V2_ROUTE_REGISTRY[route].skeletonLabel} />
  );
}
