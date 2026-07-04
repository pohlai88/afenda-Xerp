"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "../utils/utils.js";
import {
  AUTH_SHELL_PIXEL_IMAGE_SOURCES,
  type AuthShellMotionVariant,
} from "./auth-shell-motion.contract.js";

interface AuthShellMotionSceneProps {
  readonly className?: string | undefined;
  readonly imageSources?: readonly string[];
  readonly variant: AuthShellMotionVariant;
}

type AuthShellMotionPhase = "intro" | "settling" | "ready";

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
const INTRO_SESSION_KEY = "afenda_auth_shell_intro_seen";
const INTRO_DURATION_MS = 3400;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(value: number): number {
  return 1 - (1 - value) ** 3;
}

function resolveIntroPreference() {
  if (typeof window === "undefined") {
    return { shouldSkip: false };
  }

  const params = new URLSearchParams(window.location.search);
  const forceSkip = params.get("intro") === "0";
  const forceReplay = params.get("intro") === "1";
  const seenThisSession =
    !forceReplay && window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  return {
    shouldSkip: forceSkip || seenThisSession || reducedMotion.matches,
  };
}

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
    const image = await new Promise<HTMLImageElement | null>((resolve) => {
      const nextImage = new Image();
      nextImage.decoding = "async";
      nextImage.crossOrigin = "anonymous";
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => resolve(null);
      nextImage.src = source;
    });

    if (image !== null) {
      return image;
    }
  }

  return null;
}

export function AuthShellMotionScene({
  className,
  imageSources = AUTH_SHELL_PIXEL_IMAGE_SOURCES,
  variant,
}: AuthShellMotionSceneProps) {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const atmosphereCanvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<AuthShellMotionPhase>("intro");
  const [renderMode, setRenderMode] = useState<AuthShellMotionRenderMode>({
    animate: true,
    particleSource: "fallback",
  });

  useEffect(() => {
    const particleCanvas = particleCanvasRef.current;
    const atmosphereCanvas = atmosphereCanvasRef.current;

    if (particleCanvas === null || atmosphereCanvas === null) {
      return;
    }

    const particleContext = particleCanvas.getContext("2d");
    const atmosphereContext = atmosphereCanvas.getContext("2d");

    if (particleContext === null || atmosphereContext === null) {
      return;
    }

    const introPreference = resolveIntroPreference();
    const shouldPlayIntro = !introPreference.shouldSkip;

    setPhase(shouldPlayIntro ? "intro" : "ready");

    const palette = resolveAuthShellMotionPalette(variant);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;
    let particles = buildFallbackParticles(
      particleCanvas.clientWidth || 1440,
      particleCanvas.clientHeight || 900
    );
    let animationFrameId = 0;
    let isDisposed = false;
    let hasLoadedSceneImage = false;
    let sceneImage: HTMLImageElement | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    const startTime = performance.now();
    let hasSettled = !shouldPlayIntro;
    let hasMarkedReady = !shouldPlayIntro;
    let activeRenderMode: AuthShellMotionRenderMode = {
      animate: !prefersReducedMotion,
      particleSource: "fallback",
    };

    const sceneImagePromise = loadSceneImage(imageSources).then((image) => {
      sceneImage = image;
      hasLoadedSceneImage = image !== null;
      return image;
    });

    const resize = async () => {
      const rect = particleCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      particleCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
      particleCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
      atmosphereCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
      atmosphereCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
      particleContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      atmosphereContext.setTransform(dpr, 0, 0, dpr, 0, 0);

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
      const rect = particleCanvas.getBoundingClientRect();

      targetPointerX =
        (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      targetPointerY =
        (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    };

    const handlePointerLeave = () => {
      targetPointerX = 0;
      targetPointerY = 0;
    };

    const renderAtmosphere = ({
      timeline,
      width,
      height,
    }: {
      timeline: number;
      width: number;
      height: number;
    }) => {
      atmosphereContext.clearRect(0, 0, width, height);

      const atmosphericStrength = 0.15 + timeline * 0.2;
      const haze = atmosphereContext.createRadialGradient(
        width * 0.55,
        height * 0.48,
        width * 0.08,
        width * 0.55,
        height * 0.48,
        width * 0.56
      );
      haze.addColorStop(0, `rgba(179, 225, 255, ${atmosphericStrength})`);
      haze.addColorStop(0.45, `rgba(96, 153, 193, ${0.1 + timeline * 0.1})`);
      haze.addColorStop(1, "rgba(0, 0, 0, 0)");

      atmosphereContext.fillStyle = haze;
      atmosphereContext.fillRect(0, 0, width, height);
      atmosphereContext.globalCompositeOperation = "lighter";
      atmosphereContext.lineCap = "round";

      const streakCount = 20;
      for (let index = 0; index < streakCount; index += 1) {
        const lane = index / streakCount;
        const x = width * (0.08 + ((lane * 1.9 + timeline * 0.25) % 1) * 0.84);
        const y =
          height * (0.24 + ((lane * 2.4 + timeline * 0.12 + lane) % 1) * 0.46);
        const length = width * (0.016 + (index % 4) * 0.008);

        atmosphereContext.globalAlpha = 0.04 + timeline * 0.07;
        atmosphereContext.strokeStyle = "rgb(177 222 255)";
        atmosphereContext.lineWidth = 0.6;
        atmosphereContext.beginPath();
        atmosphereContext.moveTo(x - length, y);
        atmosphereContext.lineTo(x + length, y);
        atmosphereContext.stroke();
      }

      atmosphereContext.globalCompositeOperation = "source-over";
      atmosphereContext.globalAlpha = 1;
    };

    const drawScene = (timestamp: number) => {
      const width = particleCanvas.clientWidth;
      const height = particleCanvas.clientHeight;
      const nextRenderMode = resolveAuthShellMotionRenderMode({
        imageLoaded: hasLoadedSceneImage,
        prefersReducedMotion,
      });

      if (
        nextRenderMode.animate !== activeRenderMode.animate ||
        nextRenderMode.particleSource !== activeRenderMode.particleSource
      ) {
        activeRenderMode = nextRenderMode;
        setRenderMode(nextRenderMode);
      }

      const elapsed = timestamp - startTime;
      const introTimeline = shouldPlayIntro
        ? clamp01(elapsed / INTRO_DURATION_MS)
        : 1;
      const revealTimeline = easeOutCubic(introTimeline);

      if (shouldPlayIntro && introTimeline > 0.62 && !hasSettled) {
        hasSettled = true;
        setPhase("settling");
      }

      if (shouldPlayIntro && introTimeline >= 1 && !hasMarkedReady) {
        hasMarkedReady = true;
        setPhase("ready");
        window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      }

      renderAtmosphere({
        timeline: revealTimeline,
        width,
        height,
      });

      particleContext.clearRect(0, 0, width, height);
      particleContext.fillStyle = shouldPlayIntro
        ? `rgba(2, 6, 12, ${0.96 - revealTimeline * 0.2})`
        : "rgba(2, 6, 12, 0.76)";
      particleContext.fillRect(0, 0, width, height);

      pointerX += (targetPointerX - pointerX) * 0.05;
      pointerY += (targetPointerY - pointerY) * 0.05;

      const time = timestamp * 0.001;

      for (const particle of particles) {
        const pointerOffsetX = activeRenderMode.animate
          ? pointerX * palette.pointerWeight * particle.depth
          : 0;
        const pointerOffsetY = activeRenderMode.animate
          ? pointerY * palette.pointerWeight * 0.6 * particle.depth
          : 0;
        const driftX = activeRenderMode.animate
          ? Math.sin(time * 0.72 + particle.phase) *
            palette.driftAmplitude *
            particle.depth *
            particle.drift
          : 0;
        const driftY = activeRenderMode.animate
          ? Math.cos(time * 0.54 + particle.phase) *
            (palette.driftAmplitude * 0.34) *
            particle.depth
          : 0;
        const x = particle.x + driftX + pointerOffsetX;
        const y = particle.y + driftY + pointerOffsetY;
        const alpha =
          (palette.ambientAlpha + particle.alpha * palette.accentAlpha) *
          (0.3 + revealTimeline * 0.7);

        particleContext.globalAlpha = alpha;
        particleContext.shadowBlur = activeRenderMode.animate
          ? palette.glowBlur * particle.depth
          : 0;
        particleContext.shadowColor =
          activeRenderMode.particleSource === "image"
            ? "rgba(214, 235, 255, 0.75)"
            : "rgba(160, 196, 255, 0.35)";
        particleContext.fillStyle =
          activeRenderMode.particleSource === "image"
            ? "rgba(236, 244, 255, 1)"
            : "rgba(196, 214, 255, 0.9)";
        particleContext.fillRect(
          x,
          y,
          particle.size * palette.baseScale,
          particle.size * palette.baseScale
        );
      }

      particleContext.globalAlpha = 1;
      particleContext.shadowBlur = 0;

      const vignette = particleContext.createRadialGradient(
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

      particleContext.fillStyle = vignette;
      particleContext.fillRect(0, 0, width, height);

      animationFrameId = activeRenderMode.animate
        ? requestAnimationFrame(drawScene)
        : 0;
    };

    const resizeObserver = new ResizeObserver(() => {
      void resize();
    });

    resizeObserver.observe(particleCanvas);
    mediaQuery.addEventListener("change", handleMotionChange);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    void resize().then(() => {
      if (prefersReducedMotion) {
        drawScene(0);
        setPhase("ready");
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
    <div
      className={cn("absolute inset-0", className)}
      data-auth-shell-motion-animate={renderMode.animate ? "true" : "false"}
      data-auth-shell-motion-phase={phase}
      data-auth-shell-motion-source={renderMode.particleSource}
    >
      <canvas
        className="absolute inset-0 h-full w-full"
        ref={atmosphereCanvasRef}
      />
      <canvas
        className="absolute inset-0 h-full w-full"
        ref={particleCanvasRef}
      />
    </div>
  );
}
