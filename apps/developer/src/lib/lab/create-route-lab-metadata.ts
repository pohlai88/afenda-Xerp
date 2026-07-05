import type { Metadata } from "next";
import type { LabRoutePreviewImage } from "./contracts";

interface CreateRouteLabMetadataOptions {
  readonly canonicalHref: string;
  readonly description: string;
  readonly previewImage: LabRoutePreviewImage;
  readonly title: string;
}

export function createRouteLabMetadata({
  canonicalHref,
  description,
  previewImage,
  title,
}: CreateRouteLabMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: canonicalHref,
    },
    openGraph: {
      description,
      images: [
        {
          alt: previewImage.alt,
          height: previewImage.height,
          url: previewImage.src,
          width: previewImage.width,
        },
      ],
      title,
      type: "website",
    },
    robots: {
      follow: false,
      index: false,
    },
    twitter: {
      card: "summary_large_image",
      description,
      images: [previewImage.src],
      title,
    },
  };
}
