import type { Metadata } from "next";

import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";

export const metadata: Metadata = {
  title: "500 · Server Error",
};

export default function ServerErrorPage() {
  return <ErpErrorPage variant="500" />;
}
