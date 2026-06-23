"use client";

import Image, { type ImageProps } from "next/image";

export type AppShellOptimizedImageProps = Omit<ImageProps, "alt"> & {
  readonly alt: string;
};

/**
 * next/image wrapper for appshell demo assets (avatars, flags, brand icons).
 * Demo CDN URLs use `unoptimized` until the host app whitelists the origin.
 */
export function AppShellOptimizedImage({
  alt,
  src,
  unoptimized,
  ...props
}: AppShellOptimizedImageProps) {
  const isRemoteDemoAsset =
    typeof src === "string" && src.startsWith("https://");

  return (
    <Image
      alt={alt}
      src={src}
      unoptimized={unoptimized ?? isRemoteDemoAsset}
      {...props}
    />
  );
}
