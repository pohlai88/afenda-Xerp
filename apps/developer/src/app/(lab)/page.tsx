import type { Metadata } from "next";

import {
  buildLabHomePageMetadata,
  loadLabHomePage,
} from "@/lib/lab/load-home-page.server";

import { HomeDeveloperPage } from "./_components/home-developer-page";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await loadLabHomePage();

  return buildLabHomePageMetadata(pageData);
}

export default async function LabIndexPage() {
  const pageData = await loadLabHomePage();

  return <HomeDeveloperPage pageData={pageData} />;
}
