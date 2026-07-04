import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";

import { AuthShell } from "../../components-auth-shell/auth-shell.js";
import { AuthShellMotionScene } from "../../components-auth-shell/auth-shell-motion-scene.client.js";
import { AUTH_SHELL_PIXEL_IMAGE_SOURCES } from "../../components-auth-shell/auth-shell-motion.contract.js";
import { AUTH_SHELL_LANE_DEFAULT_PAGE_MAP } from "../../components-auth-shell/resolve-auth-shell.js";
import type { AuthShellFormLane } from "../../components-auth-shell/auth-shell-method-manifest.js";
import { agenticFullscreenMetaParameters } from "./agentic-story-parameters.js";

const authShellLaneOptions = [
  "access",
  "verify",
  "recover",
  "error",
] as const satisfies readonly AuthShellFormLane[];

const meta = {
  title: "Agentic/Auth Shell/Auth Shell",
  component: AuthShell,
  tags: ["autodocs", "ai-generated"],
  args: {
    lane: "access",
  },
  argTypes: {
    lane: {
      control: {
        type: "select",
      },
      options: authShellLaneOptions,
    },
  },
  parameters: {
    ...agenticFullscreenMetaParameters,
    docs: {
      ...agenticFullscreenMetaParameters.docs,
      description: {
        ...agenticFullscreenMetaParameters.docs.description,
        component:
          "Shell-level auth resolver preview. This story exercises the lane-to-page routing layer directly, while the page-level auth shell stories continue to show the concrete resolved pages.",
      },
    },
  },
} satisfies Meta<typeof AuthShell>;

export default meta;

type Story = StoryObj<typeof meta>;

function MotionSceneDiagnostics({
  imageSources,
  variant,
}: {
  readonly imageSources: readonly string[];
  readonly variant: "access" | "error";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState("-");
  const [source, setSource] = useState("-");
  const [animate, setAnimate] = useState("-");

  useEffect(() => {
    const container = containerRef.current;

    if (container === null) {
      return;
    }

    const update = () => {
      const scene = container.querySelector<HTMLElement>(
        "[data-auth-shell-motion-phase]"
      );

      setPhase(scene?.dataset["authShellMotionPhase"] ?? "-");
      setSource(scene?.dataset["authShellMotionSource"] ?? "-");
      setAnimate(scene?.dataset["authShellMotionAnimate"] ?? "-");
    };

    update();
    const intervalId = window.setInterval(update, 200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className="relative min-h-[760px] overflow-hidden rounded-3xl border bg-background"
      ref={containerRef}
    >
      <AuthShellMotionScene
        className="absolute inset-0"
        imageSources={imageSources}
        variant={variant}
      />
      <div className="pointer-events-none relative z-10 flex min-h-[760px] items-end p-8">
        <div className="max-w-lg rounded-2xl border border-white/10 bg-background/70 p-5 backdrop-blur-sm">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.18em]">
            Motion diagnostics
          </p>
          <h2 className="mt-2 font-semibold text-2xl text-foreground">
            Phase marker surface
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            phase: {phase} | source: {source} | animate: {animate}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive shell resolver preview with lane controls.
 *
 * @summary for switching between auth-shell routing lanes
 */
export const InteractiveLane: Story = {
  render: (args) => <AuthShell {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Switch the lane control to validate the shell resolver against the canonical lane map without leaving Storybook.",
      },
    },
  },
};

/**
 * Side-by-side catalog of every shell lane and its resolved page block.
 *
 * @summary for comparing lane resolution against the manifest map
 */
export const Overview: Story = {
  render: () => (
    <div className="space-y-10 bg-background px-4 py-6">
      {authShellLaneOptions.map((lane) => {
        const blockId = AUTH_SHELL_LANE_DEFAULT_PAGE_MAP[lane];

        return (
          <section className="space-y-4" key={lane}>
            <header className="space-y-1 px-1">
              <p className="font-medium text-muted-foreground text-sm uppercase tracking-[0.18em]">
                {lane}
              </p>
              <h2 className="font-semibold text-2xl text-foreground">
                {blockId}
              </h2>
              <p className="text-muted-foreground">
                Resolved by AUTH_SHELL_LANE_DEFAULT_PAGE_MAP and rendered
                through AuthShell.
              </p>
            </header>
            <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
              <AuthShell lane={lane} />
            </div>
          </section>
        );
      })}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Four-lane shell overview for validating the resolver against the metadata-driven default page map.",
      },
    },
  },
};

/**
 * Direct motion-scene canvas with the canonical pixel sources.
 *
 * @summary for visual regression of the animated auth backdrop
 */
export const MotionScenePreview: Story = {
  render: () => (
    <MotionSceneDiagnostics
      imageSources={AUTH_SHELL_PIXEL_IMAGE_SOURCES}
      variant="access"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Isolated motion-scene preview using canonical pixel sources with live diagnostics for phase/source/animate markers.",
      },
    },
  },
};

/**
 * Direct motion-scene canvas with no image sources to exercise fallback particles.
 *
 * @summary for fallback particle regression coverage
 */
export const MotionSceneFallback: Story = {
  render: () => <MotionSceneDiagnostics imageSources={[]} variant="error" />,
  parameters: {
    docs: {
      description: {
        story:
          "Fallback-only motion-scene preview with diagnostics for marker state when no image asset resolves.",
      },
    },
  },
};
