import type { Metadata } from "next";
import type { ReactNode } from "react";

import { authMetadata } from "@/lib/metadata/site-metadata";

import "./auth.css";

export const metadata: Metadata = authMetadata;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="erp-auth-segment">{children}</div>;
}
