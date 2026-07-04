import {
  createAuthIngressMetadata,
  redirectAuthenticatedAuthIngress,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/sign-in");

type SignInPageProps = {
  readonly searchParams: Promise<{
    readonly error?: string;
    readonly next?: string;
    readonly notice?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  await redirectAuthenticatedAuthIngress(searchParams);
  const { next } = await searchParams;
  return renderAuthIngressPage(
    "/sign-in",
    next === undefined ? undefined : { next }
  );
}
