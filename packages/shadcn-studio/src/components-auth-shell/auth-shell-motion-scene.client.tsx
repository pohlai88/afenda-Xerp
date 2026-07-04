"use client";

import { useEffect, useRef } from "react";

import { cn } from "../utils/utils.js";
import {
  AUTH_SHELL_PIXEL_IMAGE_SOURCES,
  type AuthShellMotionVariant,
} from "./auth-shell-motion.contract.js";

interface AuthShellMotionSceneProps {
  readonly className?: string;
  readonly imageSources?: readonly string[];
  readonly variant: AuthShellMotionVariant;
}

interface PixelParticle {
  readonly alpha: number;
  readonly depth: number;
  readonly drift: number;
  readonly phase: number;
  readonly size: number;
  readonly x: number;
  readonly y: number;
}

export type AuthShellMotionRenderMode = {
  readonly animate: boolean;
  readonly particleSource: "fallback" | "image";
};

type ScenePalette = {
  readonly accentAlpha: number;
  readonly ambientAlpha: number;
  readonly baseScale: number;
  readonly driftAmplitude: number;
  readonly glowBlur: number;
  readonly overlayAlpha: number;
  readonly pointerWeight: number;
};

const SCENE_PALETTE_BY_VARIANT: Record<AuthShellMotionVariant, ScenePalette> = {
  access: {
    ambientAlpha: 0.1,
    accentAlpha: 0.92,
    baseScale: 1,
    driftAmplitude: 7,
    glowBlur: 18,
    overlayAlpha: 0.46,
    pointerWeight: 20,
  },
  recover: {
    ambientAlpha: 0.07,
    accentAlpha: 0.68,
    baseScale: 0.88,
    driftAmplitude: 4.5,
    glowBlur: 10,
    overlayAlpha: 0.58,
    pointerWeight: 12,
  },
  verify: {
    ambientAlpha: 0.08,
    accentAlpha: 0.74,
    baseScale: 0.9,
    driftAmplitude: 5,
    glowBlur: 11,
    overlayAlpha: 0.55,
    pointerWeight: 12,
  },
  invite: {
    ambientAlpha: 0.08,
    accentAlpha: 0.78,
    baseScale: 0.92,
    driftAmplitude: 5.2,
    glowBlur: 12,
    overlayAlpha: 0.53,
    pointerWeight: 13,
  },
  security: {
    ambientAlpha: 0.08,
    accentAlpha: 0.62,
    baseScale: 0.84,
    driftAmplitude: 4,
    glowBlur: 9,
    overlayAlpha: 0.62,
    pointerWeight: 10,
  },
  error: {
    ambientAlpha: 0.05,
    accentAlpha: 0.52,
    baseScale: 0.8,
    driftAmplitude: 3.2,
    glowBlur: 7,
    overlayAlpha: 0.68,
    pointerWeight: 8,
  },
};

export function resolveAuthShellMotionPalette(
  variant: AuthShellMotionVariant
): ScenePalette {
  return SCENE_PALETTE_BY_VARIANT[variant];
}

export function resolveAuthShellMotionRenderMode({
  imageLoaded,
  prefersReducedMotion,
}: {
  readonly imageLoaded: boolean;
  readonly prefersReducedMotion: boolean;
}): AuthShellMotionRenderMode {
  return {
    animate: !prefersReducedMotion,
    particleSource: imageLoaded ? "image" : "fallback",
  };
}

const MAX_PARTICLES = 4200;
const SAMPLE_STEP = 4;
const PARTICLE_THRESHOLD = 54;

function buildFallbackParticles(
  width: number,
  height: number
): PixelParticle[] {
  const particles: PixelParticle[] = [];
  const centerX = width * 0.56;
  const centerY = height * 0.48;
  const maxRadius = Math.min(width, height) * 0.28;

  for (let index = 0; index < MAX_PARTICLES / 4; index += 1) {
    const ratio = index / (MAX_PARTICLES / 4);
    const radius = maxRadius * Math.sqrt(ratio);
    const angle = ratio * Math.PI * 18;

    particles.push({
      alpha: 0.4 + (1 - ratio) * 0.35,
      depth: 0.4 + (1 - ratio) * 0.6,
      drift: 0.7 + ratio * 0.9,
      phase: ratio * Math.PI * 8,
      size: 0.8 + (1 - ratio) * 1.3,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }

  return particles;
}

function buildImageParticles(
  image: HTMLImageElement,
  width: number,
  height: number
): PixelParticle[] {
  const sampleCanvas = document.createElement("canvas");
  const sampleContext = sampleCanvas.getContext("2d");

  if (sampleContext === null) {
    return buildFallbackParticles(width, height);
  }

  const maxSampleWidth = Math.min(300, Math.floor(width * 0.58));
  const sampleWidth = Math.max(180, maxSampleWidth);
  const sampleHeight = Math.max(
    120,
    Math.floor((sampleWidth / image.width) * image.height)
  );

  sampleCanvas.width = sampleWidth;
  sampleCanvas.height = sampleHeight;
  sampleContext.drawImage(image, 0, 0, sampleWidth, sampleHeight);

  const data = sampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data;
  const particles: PixelParticle[] = [];
  const offsetX = width * 0.5 - sampleWidth * 0.5;
  const offsetY = height * 0.48 - sampleHeight * 0.48;

  for (let y = 0; y < sampleHeight; y += SAMPLE_STEP) {
    for (let x = 0; x < sampleWidth; x += SAMPLE_STEP) {
      const index = (y * sampleWidth + x) * 4;
      const alpha = data[index + 3] ?? 0;

      if (alpha < 24) {
        continue;
      }

      const red = data[index] ?? 0;
      const green = data[index + 1] ?? 0;
      const blue = data[index + 2] ?? 0;
      const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;

      if (luminance < PARTICLE_THRESHOLD) {
        continue;
      }

      const intensity = luminance / 255;
      const normalizedX = x / sampleWidth;
      const normalizedY = y / sampleHeight;
      const breakupBias =
        normalizedX < 0.34 ? 1.45 : normalizedX > 0.72 ? 1.18 : 0.96;

      particles.push({
        alpha: 0.25 + intensity * 0.75,
        depth: 0.36 + intensity * 0.64,
        drift: breakupBias,
        phase: normalizedX * Math.PI * 8 + normalizedY * Math.PI * 5,
        size: 0.55 + intensity * 1.65,
        x: offsetX + x,
        y: offsetY + y,
      });

      if (particles.length >= MAX_PARTICLES) {
        return particles;
      }
    }
  }

  return particles.length > 0
    ? particles
    : buildFallbackParticles(width, height);
}

async function loadSceneImage(
  imageSources: readonly string[]
): Promise<HTMLImageElement | null> {
  for (const source of imageSources) {
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const nextImage = new Image();
        nextImage.decoding = "async";
        nextImage.crossOrigin = "anonymous";
        nextImage.onload = () => resolve(nextImage);
        nextImage.onerror = () =>
          reject(new Error(`Failed to load auth scene image: ${source}`));
        nextImage.src = source;
      });

      return image;
    } catch {}
  }

  return null;
}

export function AuthShellMotionScene({
  className,
  imageSources = AUTH_SHELL_PIXEL_IMAGE_SOURCES,
  variant,
}: AuthShellMotionSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const context = canvas.getContext("2d");

    if (context === null) {
      return;
    }

    const palette = resolveAuthShellMotionPalette(variant);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;
    let particles = buildFallbackParticles(
      canvas.clientWidth || 1440,
      canvas.clientHeight || 900
    );
    let animationFrameId = 0;
    let isDisposed = false;
    let hasLoadedSceneImage = false;
    let sceneImage: HTMLImageElement | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;

    const sceneImagePromise = loadSceneImage(imageSources).then((image) => {
      sceneImage = image;
      hasLoadedSceneImage = image !== null;
      return image;
    });

    const resize = async () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const image = sceneImage ?? (await sceneImagePromise);

      if (isDisposed) {
        return;
      }

      particles = image
        ? buildImageParticles(image, rect.width, rect.height)
        : buildFallbackParticles(rect.width, rect.height);
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();

      targetPointerX =
        (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      targetPointerY =
        (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    };

    const handlePointerLeave = () => {
      targetPointerX = 0;
      targetPointerY = 0;
    };

    const drawScene = (timestamp: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const renderMode = resolveAuthShellMotionRenderMode({
        imageLoaded: hasLoadedSceneImage,
        prefersReducedMotion,
      });

      context.clearRect(0, 0, width, height);

      context.fillStyle = "rgba(2, 6, 12, 0.92)";
      context.fillRect(0, 0, width, height);

      pointerX += (targetPointerX - pointerX) * 0.05;
      pointerY += (targetPointerY - pointerY) * 0.05;

      const time = timestamp * 0.001;

      for (const particle of particles) {
        const pointerOffsetX = renderMode.animate
          ? pointerX * palette.pointerWeight * particle.depth
          : 0;
        const pointerOffsetY = renderMode.animate
          ? pointerY * palette.pointerWeight * 0.6 * particle.depth
          : 0;
        const driftX = renderMode.animate
          ? Math.sin(time * 0.72 + particle.phase) *
            palette.driftAmplitude *
            particle.depth *
            particle.drift
          : 0;
        const driftY = renderMode.animate
          ? Math.cos(time * 0.54 + particle.phase) *
            (palette.driftAmplitude * 0.34) *
            particle.depth
          : 0;
        const x = particle.x + driftX + pointerOffsetX;
        const y = particle.y + driftY + pointerOffsetY;
        const alpha =
          palette.ambientAlpha + particle.alpha * palette.accentAlpha;

        context.globalAlpha = alpha;
        context.shadowBlur = renderMode.animate
          ? palette.glowBlur * particle.depth
          : 0;
        context.shadowColor =
          renderMode.particleSource === "image"
            ? "rgba(214, 235, 255, 0.75)"
            : "rgba(160, 196, 255, 0.35)";
        context.fillStyle =
          renderMode.particleSource === "image"
            ? "rgba(236, 244, 255, 1)"
            : "rgba(196, 214, 255, 0.9)";
        context.fillRect(
          x,
          y,
          particle.size * palette.baseScale,
          particle.size * palette.baseScale
        );
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;

      const vignette = context.createRadialGradient(
        width * 0.54,
        height * 0.44,
        Math.min(width, height) * 0.08,
        width * 0.54,
        height * 0.5,
        Math.max(width, height) * 0.72
      );
      vignette.addColorStop(0, "rgba(3, 7, 12, 0)");
      vignette.addColorStop(0.6, `rgba(3, 7, 12, ${palette.overlayAlpha})`);
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.96)");

      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);

      animationFrameId = renderMode.animate
        ? requestAnimationFrame(drawScene)
        : 0;
    };

    const resizeObserver = new ResizeObserver(() => {
      void resize();
    });

    resizeObserver.observe(canvas);
    mediaQuery.addEventListener("change", handleMotionChange);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    void resize().then(() => {
      if (prefersReducedMotion) {
        drawScene(0);
        return;
      }

      animationFrameId = requestAnimationFrame(drawScene);
    });

    return () => {
      isDisposed = true;
      if (animationFrameId !== 0) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [imageSources, variant]);

  return (
    <canvas
      className={cn("absolute inset-0 h-full w-full", className)}
      ref={canvasRef}
    />
  );
}
