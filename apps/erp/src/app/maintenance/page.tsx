import type { Metadata } from "next";

import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";

export const metadata: Metadata = {
  title: "Maintenance",
};

export default function MaintenancePage() {
  return <ErpErrorPage variant="maintenance" />;
}
