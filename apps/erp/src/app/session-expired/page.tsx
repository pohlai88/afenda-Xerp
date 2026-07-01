import type { Metadata } from "next";

import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";

export const metadata: Metadata = {
  title: "Session expired",
};

export default function SessionExpiredPage() {
  return <ErpErrorPage variant="session-expired" />;
}
