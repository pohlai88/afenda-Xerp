import { LoginPage04 } from "@afenda/shadcn-studio";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  createDeveloperAuthMetadata,
  resolveDeveloperAuthFixtureByPath,
} from "@/lib/auth/auth-fixtures";

const SIGN_IN_PATH = "/sign-in" as const;

export function generateMetadata(): Metadata {
  const fixture = resolveDeveloperAuthFixtureByPath(SIGN_IN_PATH);

  if (fixture === undefined) {
    notFound();
  }

  return createDeveloperAuthMetadata(fixture);
}

export default function SignInPage() {
  const fixture = resolveDeveloperAuthFixtureByPath(SIGN_IN_PATH);

  if (fixture === undefined) {
    notFound();
  }

  return (
    <div
      data-auth-ingress-lane={fixture.lane}
      data-auth-ingress-path={fixture.path}
      data-auth-ingress-state="ready"
      data-auth-ingress-surface={fixture.surfaceId}
    >
      <LoginPage04 />
    </div>
  );
}
