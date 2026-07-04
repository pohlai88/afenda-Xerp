import Image from "next/image";
import { HomeGridBackdrop } from "./home-grid-backdrop";

const spectralArtifacts = [
  {
    accent: "cyan",
    id: "480",
    image: "/afenda-reference/image-2.png",
    label: "lambda=480nm",
    position: "md:translate-y-8",
    size: "max-w-[240px]",
  },
  {
    accent: "violet",
    id: "core",
    image: "/afenda-reference/image-3.png",
    label: "Core Nexus",
    position: "md:-translate-y-8",
    size: "max-w-[280px]",
  },
  {
    accent: "fuchsia",
    id: "680",
    image: "/afenda-reference/image-4.png",
    label: "lambda=680nm",
    position: "md:translate-y-12",
    size: "max-w-[240px]",
  },
] as const;

const getAccentGlowClass = (accent: "cyan" | "violet" | "fuchsia") => {
  if (accent === "cyan") {
    return "bg-cyan-500/6";
  }

  if (accent === "violet") {
    return "bg-violet-600/6";
  }

  return "bg-fuchsia-500/6";
};

export function HomeSection2() {
  return (
    <section className="relative overflow-hidden border-neutral-900 border-t bg-[#030303] px-5 py-24 sm:px-8 lg:px-12">
      <HomeGridBackdrop />
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-24">
        <div className="relative flex flex-col items-center gap-8 pb-4 text-center">
          <div className="flex items-center gap-4 text-[0.5rem] text-cyan-600/80 uppercase tracking-[0.5em]">
            <span className="h-px w-8 bg-cyan-900/50" />
            Phase 03
            <span className="h-px w-8 bg-cyan-900/50" />
          </div>
          <h2 className="font-serif text-3xl text-neutral-100 leading-[1.02] tracking-tight md:text-6xl">
            Spectral
            <br />
            Divergence.
          </h2>
          <p className="max-w-2xl text-[0.68rem] text-neutral-500 uppercase leading-6 tracking-[0.18em]">
            Three discrete coordinate points suspended in the void, quietly
            bound by an underlying chromatic frequency.
          </p>
        </div>

        <div className="group relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
          <div className="absolute top-1/2 left-0 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-500/20 via-violet-500/40 to-transparent md:block" />
          {spectralArtifacts.map((artifact) => (
            <div
              className={`relative flex w-full justify-center ${artifact.position}`}
              key={artifact.id}
            >
              <div
                aria-hidden="true"
                className={`absolute inset-0 -z-10 rounded-full blur-3xl ${getAccentGlowClass(
                  artifact.accent
                )}`}
              />
              <div
                className={`relative w-full ${artifact.size} ${
                  artifact.id === "core" ? "aspect-[3/4]" : "aspect-[4/5]"
                } bg-[#020202] p-1.5 shadow-2xl`}
              >
                <div className="group/image relative h-full overflow-hidden border border-neutral-800/50 bg-black">
                  <Image
                    alt={artifact.label}
                    className="object-cover opacity-65 grayscale transition-all duration-1000 group-hover/image:scale-105 group-hover/image:opacity-90 group-hover/image:grayscale-0"
                    fill
                    sizes="(min-width: 1024px) 280px, 80vw"
                    src={artifact.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  {artifact.id === "core" ? (
                    <>
                      <div className="absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-400/20">
                        <div className="h-px w-full bg-violet-400/10" />
                        <div className="absolute h-full w-px bg-violet-400/10" />
                      </div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.44rem] text-violet-400/50 uppercase tracking-[0.6em]">
                        {artifact.label}
                      </div>
                    </>
                  ) : (
                    <div
                      className={`absolute ${
                        artifact.accent === "fuchsia"
                          ? "right-3 bottom-3 text-right text-fuchsia-600"
                          : "bottom-3 left-3 text-cyan-600"
                      } text-[0.4rem] uppercase tracking-[0.4em]`}
                    >
                      {artifact.label}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
