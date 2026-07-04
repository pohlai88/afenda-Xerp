import type { LabHomePageData } from "@/lib/lab/load-home-page.server";

import { HomeFinalCta } from "./home-final-cta";
import { HomeHero } from "./home-hero";
import { HomeSection1 } from "./home-section1";
import { HomeSection2 } from "./home-section2";
import { HomeSection3 } from "./home-section3";
import { HomeSection4 } from "./home-section4";

interface HomeDeveloperPageProps {
  readonly pageData: LabHomePageData;
}

export function HomeDeveloperPage({ pageData }: HomeDeveloperPageProps) {
  return (
    <div
      className="dark bg-[#030303] text-neutral-200 selection:bg-violet-950/50 selection:text-neutral-50"
      data-home-surface="developer-landing"
    >
      <HomeHero proofImageAlt={pageData.proofImageAlt} />
      <HomeSection1 />
      <HomeSection2 />
      <HomeSection3 />
      <HomeSection4 />
      <HomeFinalCta />
    </div>
  );
}
