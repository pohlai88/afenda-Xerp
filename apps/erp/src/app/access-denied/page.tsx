import type { Metadata } from "next";

import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";

export const metadata: Metadata = {
  title: "Access denied",
};

export default function AccessDeniedPage() {
  return <ErpErrorPage variant="403" />;
}
