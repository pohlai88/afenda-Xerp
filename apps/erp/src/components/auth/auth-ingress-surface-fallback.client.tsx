import { AuthIngressChrome } from "./auth-ingress-chrome.client";

export type { AuthIngressChromeState } from "./auth-ingress-chrome.client";
export { AuthIngressChrome } from "./auth-ingress-chrome.client";

interface AuthIngressSurfaceFallbackProps {
  readonly message: string;
  readonly onRetry?: () => void;
  readonly state?: "error" | "missing-slot-hydration";
  readonly title: string;
}

/** @deprecated Use AuthIngressChrome — retained as thin alias for transitional imports. */
export function AuthIngressSurfaceFallback({
  message,
  onRetry,
  state = "error",
  title,
}: AuthIngressSurfaceFallbackProps) {
  return (
    <AuthIngressChrome
      message={message}
      {...(onRetry === undefined ? {} : { onRetry })}
      state={state}
      title={title}
    />
  );
}
