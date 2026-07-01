import type { Metadata } from "next";

import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";
import { getErrorPageVariantForPath } from "@/lib/presentation/get-error-page-variant-for-path";

export const metadata: Metadata = {
  title: "Session expired",
};

export default function SessionExpiredPage() {
  return (
    <ErpErrorPage variant={getErrorPageVariantForPath("/session-expired")} />
  );
}
