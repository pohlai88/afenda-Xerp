import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicHomeShell } from "./_components/public-home-shell";
import type { PublicHomeContent } from "./public-home-content";

interface HomeProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const CONTENT: PublicHomeContent = {
  title: "Acknowledge truth.",
  description: "Afenda operator ingress pixel reveal surface.",
  signInLabel: "sign in",
  signInHref: "/sign-in",
};

export const metadata: Metadata = {
  title: CONTENT.title,
  description: CONTENT.description,
};

const Home = async ({ searchParams }: HomeProps) => (
  <Suspense fallback={<PublicHomeShell content={CONTENT} />}>
    <HomeContent content={CONTENT} searchParams={searchParams} />
  </Suspense>
);

async function HomeContent({
  content,
  searchParams,
}: {
  content: PublicHomeContent;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialSkip = resolvedSearchParams["intro"] === "0";

  return <PublicHomeShell content={content} initialSkip={initialSkip} />;
}

export default Home;
