import type { Metadata } from "next";

import { ErpErrorPage } from "@/components/presentation/erp-error-page.client";
import { ERROR_PAGE_NOT_FOUND_VARIANT } from "@/lib/presentation/error-page-surface.registry";

export const metadata: Metadata = {
  title: "404 · Not found",
};

export default function NotFound() {
  return <ErpErrorPage variant={ERROR_PAGE_NOT_FOUND_VARIANT} />;
}
