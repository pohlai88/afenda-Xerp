import type { Metadata } from "next";

import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";

export const metadata: Metadata = {
  title: "401 · Unauthorized",
};

export default function UnauthorizedPage() {
  return <ErpErrorPage variant="401" />;
}
