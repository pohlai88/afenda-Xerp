import type { CSSProperties, ImgHTMLAttributes } from "react";

/** Minimal StaticImageData stand-in for Vitest / Storybook. */
export interface StaticImageData {
  readonly blurDataURL?: string;
  readonly height: number;
  readonly src: string;
  readonly width: number;
}

export type ImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height"
> & {
  readonly alt: string;
  readonly blurDataURL?: string;
  readonly fill?: boolean;
  readonly height?: number;
  readonly loader?: (...args: readonly unknown[]) => string;
  readonly placeholder?: "blur" | "empty";
  readonly priority?: boolean;
  readonly quality?: number;
  readonly sizes?: string;
  readonly src: string | StaticImageData;
  readonly unoptimized?: boolean;
  readonly width?: number;
};

function resolveImageSrc(src: ImageProps["src"]): string {
  if (typeof src === "string") {
    return src;
  }

  return src.src;
}

function resolveFillStyle(
  fill: boolean | undefined
): CSSProperties | undefined {
  if (!fill) {
    return;
  }

  return {
    height: "100%",
    inset: 0,
    objectFit: "cover",
    position: "absolute",
    width: "100%",
  };
}

/** Vitest / Storybook stand-in for `next/image` — renders a plain `<img>`. */
export default function NextImageMock({
  alt,
  blurDataURL: _blurDataURL,
  fill,
  height,
  loader: _loader,
  placeholder: _placeholder,
  priority: _priority,
  quality: _quality,
  sizes: _sizes,
  src,
  style,
  unoptimized: _unoptimized,
  width,
  ...props
}: ImageProps) {
  return (
    <img
      alt={alt}
      height={fill ? undefined : height}
      src={resolveImageSrc(src)}
      style={{ ...resolveFillStyle(fill), ...style }}
      width={fill ? undefined : width}
      {...props}
    />
  );
}
