import {
  createAuthIngressMetadata,
  redirectAuthenticatedAuthIngress,
  renderAuthIngressPage,
} from "@/lib/auth/auth-ingress-page.server";

export const metadata = createAuthIngressMetadata("/sign-up");

type SignUpPageProps = {
  readonly searchParams: Promise<{
    readonly next?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  await redirectAuthenticatedAuthIngress(searchParams);
  const { next } = await searchParams;
  return renderAuthIngressPage(
    "/sign-up",
    next === undefined ? undefined : { next }
  );
}
