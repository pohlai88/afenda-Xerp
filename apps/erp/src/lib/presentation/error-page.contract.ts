export const ERROR_PAGE_SHELL_BLOCK_ID = "error-page-shell" as const;

export const ERROR_PAGE_VARIANTS = [
  "401",
  "403",
  "404",
  "500",
  "maintenance",
  "error-session-expired",
] as const;

export type ErrorPageVariant = (typeof ERROR_PAGE_VARIANTS)[number];

export type ErrorPageCopyWire = {
  readonly headline: string;
  readonly title: string;
  readonly description: string;
  readonly morphingTexts: readonly string[];
  readonly actionLabel: string;
  readonly actionHref: string;
};

export const ERROR_PAGE_COPY_REGISTRY = {
  "401": {
    headline: "401 - Unauthorized",
    title: "Authentication required",
    description: "Sign in to continue to Afenda ERP.",
    morphingTexts: ["401", "Sign In", "Session Required"],
    actionLabel: "Sign in",
    actionHref: "/sign-in",
  },
  "403": {
    headline: "403 - Forbidden",
    title: "Access denied",
    description: "You do not have permission to view this resource.",
    morphingTexts: ["403", "Access Denied", "Forbidden"],
    actionLabel: "Back to home",
    actionHref: "/",
  },
  "404": {
    headline: "404 - Whoops!",
    title: "Something went wrong",
    description:
      "The page you're looking for isn't found. We suggest you back to home.",
    morphingTexts: ["404", "Error Page", "Page Drifted"],
    actionLabel: "Back to home page",
    actionHref: "/",
  },
  "500": {
    headline: "500 - Server Error",
    title: "Something went wrong",
    description: "We could not complete your request. Please try again.",
    morphingTexts: ["500", "Server Error", "System Fault"],
    actionLabel: "Back to home",
    actionHref: "/",
  },
  maintenance: {
    headline: "Maintenance",
    title: "Under maintenance",
    description:
      "Afenda ERP is temporarily unavailable while we apply updates.",
    morphingTexts: ["Maintenance", "Please Wait", "Upgrading"],
    actionLabel: "Back to home",
    actionHref: "/",
  },
  "error-session-expired": {
    headline: "401 - Session expired",
    title: "Your session has ended",
    description: "Sign in again to continue working in Afenda ERP.",
    morphingTexts: ["Expired", "Session Ended", "Sign In Again"],
    actionLabel: "Sign in",
    actionHref: "/sign-in",
  },
} as const satisfies Record<ErrorPageVariant, ErrorPageCopyWire>;
