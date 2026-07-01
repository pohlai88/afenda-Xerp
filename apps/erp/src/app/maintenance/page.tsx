import type { Metadata } from "next";

import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";
import { getErrorPageVariantForPath } from "@/lib/presentation/get-error-page-variant-for-path";

export const metadata: Metadata = {
  title: "Maintenance",
};

export default function MaintenancePage() {
  return <ErpErrorPage variant={getErrorPageVariantForPath("/maintenance")} />;
}
