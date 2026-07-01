import type { Metadata } from "next";

import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";

export const metadata: Metadata = {
  title: "403 · Forbidden",
};

export default function ForbiddenPage() {
  return <ErpErrorPage variant="403" />;
}
