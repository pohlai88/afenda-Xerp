import Image from "next/image";
import { HomeGridBackdrop } from "./home-grid-backdrop";

const featureRow = {
  description:
    "The architecture of verification observes the artifact as a rigid coordinate mapped within a larger, unseen system.",
  kicker: "Phase // 02",
  title: "Structural Integrity.",
} as const;

export function HomeSection1() {
  return (
    <section
      className="relative overflow-hidden border-neutral-900 border-t bg-[#030303] px-5 py-24 sm:px-8 lg:px-12"
      id="phase-02"
    >
      <HomeGridBackdrop />
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-24">
        <div className="relative flex flex-col items-center justify-center gap-16 md:flex-row md:gap-24">
          <div className="absolute top-1/2 left-0 hidden h-px w-full -translate-y-1/2 bg-neutral-900/40 md:block" />
          <div className="relative z-10 flex w-full max-w-md flex-col items-start gap-8">
            <div className="flex items-center gap-4 text-[0.5rem] text-neutral-600 uppercase tracking-[0.5em]">
              <span className="h-px w-4 bg-neutral-800" />
              {featureRow.kicker}
            </div>
            <h2 className="max-w-sm font-serif text-4xl text-neutral-100 leading-[1.05] tracking-tight md:text-6xl">
              {featureRow.title}
            </h2>
            <p className="max-w-sm border-neutral-800/80 border-l pl-6 text-[0.68rem] text-neutral-500 uppercase leading-6 tracking-[0.18em]">
              {featureRow.description}
            </p>
          </div>

          <div className="relative flex w-full justify-center">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(23,23,23,0.9)_0,rgba(3,3,3,0.4)_48%,transparent_72%)] blur-2xl" />
            <div className="relative aspect-[4/3] w-full max-w-[420px] bg-black shadow-[0_20px_60px_-15px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 border border-neutral-800/40" />
              <div className="absolute -top-px -left-px h-4 w-4 border-neutral-500 border-t border-l" />
              <div className="absolute -top-px -right-px h-4 w-4 border-neutral-500 border-t border-r" />
              <div className="absolute -bottom-px -left-px h-4 w-4 border-neutral-500 border-b border-l" />
              <div className="absolute -right-px -bottom-px h-4 w-4 border-neutral-500 border-r border-b" />
              <div className="group relative h-full border border-neutral-900/60 bg-[#050505] p-4">
                <div className="relative h-full overflow-hidden border border-neutral-800/50">
                  <Image
                    alt="Structural integrity proof mapping"
                    className="object-cover object-center opacity-55 grayscale transition-all duration-1000 group-hover:scale-100 group-hover:opacity-90 group-hover:grayscale-0"
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    src="/afenda-reference/image-1.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent opacity-80" />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 mix-blend-overlay [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]"
                  />
                  <div className="absolute top-1/3 left-1/3 h-px w-full bg-violet-500/20" />
                  <div className="absolute top-0 left-1/3 h-full w-px bg-violet-500/20" />
                  <div className="absolute top-1/3 left-1/3 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <div className="h-6 w-6 rounded-full border border-violet-500/40" />
                    <div className="absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(139,92,246,1)]" />
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-end gap-3">
                    <span className="text-[0.4rem] text-violet-400 uppercase tracking-[0.4em]">
                      Vector
                    </span>
                    <div className="h-px w-16 bg-neutral-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
