import Image from "next/image";
import { HomeGridBackdrop } from "./home-grid-backdrop";

export function HomeSection4() {
  return (
    <section className="relative overflow-hidden border-neutral-900 border-t bg-[#030303] px-5 py-24 sm:px-8 lg:px-12">
      <HomeGridBackdrop />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-4 text-[0.5rem] text-neutral-600 uppercase tracking-[0.5em]">
          <span className="h-px w-8 bg-neutral-800" />
          Phase 05
          <span className="h-px w-8 bg-neutral-800" />
        </div>
        <h2 className="font-serif text-4xl text-neutral-100 leading-[0.9] tracking-tight md:text-7xl">
          Terminal
          <br />
          Extraction.
        </h2>
        <p className="max-w-lg border-neutral-900/50 border-b pb-8 text-[0.68rem] text-neutral-500 uppercase leading-6 tracking-[0.18em]">
          The final coordinate. Stripped of the remaining noise, leaving only
          the structural absolute.
        </p>
      </div>

      <div className="group relative mx-auto mt-12 w-full max-w-7xl">
        <div className="absolute inset-0 -z-10 bg-violet-900/10 opacity-40 blur-[100px]" />
        <div className="relative aspect-[16/9] w-full border border-neutral-900 bg-black p-2 shadow-[0_30px_100px_-20px_rgba(0,0,0,1)] md:aspect-[21/9] md:p-3">
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-3 text-[0.44rem] text-neutral-500 uppercase tracking-[0.4em]">
              <div className="flex h-2 w-2 items-center justify-center rounded-full bg-red-900/50">
                <div className="h-1 w-1 rounded-full bg-red-500" />
              </div>
              Recording
            </div>
            <div className="flex gap-1">
              <div className="h-px w-8 bg-neutral-800" />
              <div className="h-px w-2 bg-neutral-800" />
              <div className="h-px w-1 bg-neutral-800" />
            </div>
          </div>

          <div className="relative h-[calc(100%-2rem)] overflow-hidden border border-neutral-800/60 bg-[#030303]">
            <Image
              alt="Terminal extraction"
              className="object-cover opacity-60 grayscale transition-all duration-[1500ms] group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
              fill
              sizes="100vw"
              src="/afenda-reference/image-10.png"
            />
            <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.95)]" />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-10 mix-blend-overlay [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]"
            />
            <div className="absolute top-1/2 left-1/2 flex h-[40vw] max-h-[400px] w-[40vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/5">
              <div className="absolute top-0 left-1/2 h-8 w-px -translate-x-1/2 bg-white/20" />
              <div className="absolute bottom-0 left-1/2 h-8 w-px -translate-x-1/2 bg-white/20" />
              <div className="absolute top-1/2 left-0 h-px w-8 -translate-y-1/2 bg-white/20" />
              <div className="absolute top-1/2 right-0 h-px w-8 -translate-y-1/2 bg-white/20" />
              <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/10">
                <div className="h-1 w-1 rounded-full bg-violet-400/50" />
              </div>
            </div>
            <div className="absolute top-6 left-6 font-mono text-[0.5rem] text-white/30 uppercase leading-loose tracking-[0.3em]">
              SYS.LOCK
              <br />
              ENG_OK
              <br />
              <span className="text-violet-400/50">V_SYNC</span>
            </div>
            <div className="absolute right-6 bottom-6 text-right font-mono text-[0.5rem] text-white/30 uppercase leading-loose tracking-[0.3em]">
              0.4421
              <br />
              0.8844
              <br />
              1.0048
              <br />
              <span className="text-neutral-500">ZOOM</span> 1.00x
            </div>
          </div>

          <div className="flex items-end justify-between px-2 pt-2">
            <div className="h-px w-1/3 bg-gradient-to-r from-neutral-800 to-transparent" />
            <div className="text-[0.4rem] text-neutral-600 uppercase tracking-[0.6em]">
              End of Transmission
            </div>
            <div className="h-px w-1/3 bg-gradient-to-l from-neutral-800 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
