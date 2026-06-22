import type { Metadata } from "next";

function resolveMetadataBase(): URL {
  const configured = process.env["NEXT_PUBLIC_APP_URL"]?.trim();
  if (configured) {
    return new URL(configured);
  }

  return new URL("http://localhost:3000");
}

export const siteMetadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: "Afenda ERP",
    template: "%s · Afenda ERP",
  },
  description:
    "Afenda ERP operating platform for manufacturing and operations-heavy enterprises.",
  applicationName: "Afenda ERP",
};

/** Internal ERP workspace surfaces must not be indexed. */
export const internalErpMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/** Auth surfaces are functional, not marketing pages. */
export const authMetadata: Metadata = {
  title: "Sign in",
  ...internalErpMetadata,
};

/** Dev/integration harness routes remain non-indexable. */
export const devHarnessMetadata: Metadata = {
  title: "Integration harness",
  ...internalErpMetadata,
};
