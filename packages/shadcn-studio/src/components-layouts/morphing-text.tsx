"use client";

import { useCallback, useEffect, useId, useRef } from "react";

import { cn } from "@/lib/utils";

const MORPH_TIME_SECONDS = 1.5;
const COOLDOWN_TIME_SECONDS = 0.5;

type MorphingTextProps = {
  className?: string;
  texts: readonly string[];
};

function useMorphingText(texts: readonly string[]) {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const current1 = text1Ref.current;
      const current2 = text2Ref.current;

      if (!(current1 && current2) || texts.length === 0) {
        return;
      }

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${fraction ** 0.4 * 100}%`;

      const invertedFraction = 1 - fraction;

      current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      current1.style.opacity = `${invertedFraction ** 0.4 * 100}%`;

      current1.textContent = texts[textIndexRef.current % texts.length] ?? "";
      current2.textContent =
        texts[(textIndexRef.current + 1) % texts.length] ?? "";
    },
    [texts]
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / MORPH_TIME_SECONDS;

    if (fraction > 1) {
      cooldownRef.current = COOLDOWN_TIME_SECONDS;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current += 1;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const current1 = text1Ref.current;
    const current2 = text2Ref.current;

    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    if (texts.length === 0) {
      return;
    }

    let animationFrameId = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;

      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) {
        doMorph();
      } else {
        doCooldown();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown, texts.length]);

  return { text1Ref, text2Ref };
}

function MorphingTextLayers({ texts }: Pick<MorphingTextProps, "texts">) {
  const { text1Ref, text2Ref } = useMorphingText(texts);

  return (
    <>
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text2Ref}
      />
    </>
  );
}

function MorphingTextSvgFilter({ filterId }: { filterId: string }) {
  return (
    <svg
      aria-hidden
      className="fixed h-0 w-0"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id={filterId}>
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
          />
        </filter>
      </defs>
    </svg>
  );
}

function MorphingText({ texts, className }: MorphingTextProps) {
  const filterId = useId().replace(/:/g, "");

  if (texts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative mx-auto h-16 w-full max-w-3xl text-center font-bold font-sans text-[40pt] leading-none md:h-24 lg:text-[6rem]",
        `filter-[url(#${filterId})_blur(0.6px)]`,
        className
      )}
      data-testid="morphing-text"
    >
      <MorphingTextLayers texts={texts} />
      <MorphingTextSvgFilter filterId={filterId} />
    </div>
  );
}

export type { MorphingTextProps };
export { MorphingText };
