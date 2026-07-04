import type { Metadata } from "next";

export interface LabHomePageData {
  readonly description: string;
  readonly proofImageAlt: string;
  readonly title: string;
}

const LAB_HOME_PAGE_DATA: LabHomePageData = {
  title: "Afenda Developer Route Lab",
  description:
    "Single-screen proof theatre for Afenda route-lab presentation verification.",
  proofImageAlt: "Afenda sealed verification proof chamber",
};

export function loadLabHomePage(): LabHomePageData {
  return LAB_HOME_PAGE_DATA;
}

export function buildLabHomePageMetadata(pageData: LabHomePageData): Metadata {
  return {
    title: pageData.title,
    description: pageData.description,
  };
}
