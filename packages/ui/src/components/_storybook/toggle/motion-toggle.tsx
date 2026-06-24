"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { Children, useCallback, useMemo, useState } from "react";
import { Toggle, type ToggleProps } from "../../toggle";

const PARTICLE_COUNT = 8;

interface ParticleConfig {
  readonly delay: number;
  readonly duration: number;
  readonly id: number;
  readonly size: number;
  readonly x: number;
  readonly y: number;
}

function generateParticles(): ParticleConfig[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const angle = (index / PARTICLE_COUNT) * (2 * Math.PI);
    const radius = 16 + Math.random() * 10;

    return {
      id: index,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.75,
      size: 3 + Math.random() * 2.5,
      duration: 0.5 + Math.random() * 0.2,
      delay: index * 0.035,
    };
  });
}

interface ParticleBurstProps {
  readonly color: string;
  readonly particles: readonly ParticleConfig[];
}

function ParticleBurst({ particles, color }: ParticleBurstProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div aria-hidden="true" className="afenda-storybook-toggle__burst">
      <motion.div
        animate={{ scale: [0.5, 1.8, 1.6], opacity: [0, 0.3, 0] }}
        className="afenda-storybook-toggle__burst-glow"
        initial={{ scale: 0.5, opacity: 0 }}
        style={{ backgroundColor: color }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {particles.map((particle) => (
        <motion.div
          animate={{
            scale: [0, 1.1, 0],
            opacity: [0.6, 0.9, 0],
            x: [0, particle.x],
            y: [0, particle.y],
          }}
          className="afenda-storybook-toggle__burst-particle"
          initial={{ scale: 0, opacity: 0.6, x: 0, y: 0 }}
          key={particle.id}
          style={{
            backgroundColor: color,
            width: particle.size,
            height: particle.size,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export interface MotionToggleProps extends Omit<ToggleProps, "className"> {
  readonly particleColor?: string;
}

/**
 * Storybook-only motion toggle — particle burst wrapper around governed Toggle.
 * Not exported from @afenda/ui public API.
 */
export function MotionToggle({
  variant = "default",
  size = "default",
  onPressedChange,
  children,
  particleColor = "var(--foreground)",
  ...props
}: MotionToggleProps): ReactNode {
  const [burstCount, setBurstCount] = useState(0);
  const particles = useMemo(() => generateParticles(), []);

  const handlePressedChange = useCallback(
    (pressed: boolean) => {
      if (pressed) {
        setBurstCount((count) => count + 1);
      }
      onPressedChange?.(pressed);
    },
    [onPressedChange]
  );

  const childArray = Children.toArray(children);
  const firstChild = childArray[0];
  const restChildren = childArray.slice(1);

  return (
    <Toggle
      onPressedChange={handlePressedChange}
      size={size}
      variant={variant}
      {...props}
    >
      <span className="afenda-storybook-toggle__icon-shell">
        {firstChild}
        {burstCount > 0 ? (
          <ParticleBurst
            color={particleColor}
            key={burstCount}
            particles={particles}
          />
        ) : null}
      </span>
      {restChildren}
    </Toggle>
  );
}
