import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  createDeveloperAuthMetadata,
  resolveDeveloperAuthFixture,
} from "@/lib/auth/auth-fixtures";
import { AuthIngressSurface } from "../_components/auth-ingress-surface";

interface DeveloperAuthPageProps {
  readonly params: Promise<{
    readonly authRoute?: string[];
  }>;
}

export async function generateMetadata({
  params,
}: DeveloperAuthPageProps): Promise<Metadata> {
  const { authRoute } = await params;
  const fixture = resolveDeveloperAuthFixture(authRoute);

  if (fixture === undefined) {
    notFound();
  }

  return createDeveloperAuthMetadata(fixture);
}

export default async function DeveloperAuthPage({
  params,
}: DeveloperAuthPageProps) {
  const { authRoute } = await params;
  const fixture = resolveDeveloperAuthFixture(authRoute);

  if (fixture === undefined) {
    notFound();
  }

  return <AuthIngressSurface data={fixture} />;
}
