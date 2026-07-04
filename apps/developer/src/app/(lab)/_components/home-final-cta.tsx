import Image from "next/image";
import { HomeGridBackdrop } from "./home-grid-backdrop";

export function HomeFinalCta() {
  return (
    <section className="relative overflow-hidden border-neutral-900 border-t bg-[#020202] px-5 py-24 sm:px-8 lg:px-12">
      <HomeGridBackdrop />
      <div className="group relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center">
        <div className="absolute inset-0 -z-10 bg-violet-900/20 opacity-40 blur-[120px]" />
        <div className="relative aspect-square w-full overflow-hidden border border-neutral-900 bg-[#020202] shadow-2xl md:aspect-[21/9]">
          <Image
            alt="Final verification archive"
            className="object-cover opacity-40 mix-blend-luminosity transition-all duration-[2000ms] group-hover:scale-100 group-hover:opacity-60"
            fill
            sizes="100vw"
            src="/afenda-reference/image-11.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_100%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-8 flex items-center gap-3 font-mono text-[0.5rem] text-violet-500/50 uppercase tracking-[0.6em]">
              <span className="h-3 w-3 rounded-full border border-violet-500/40" />
              <span>Archive Sealed</span>
            </div>
            <h2 className="mb-12 font-medium text-5xl text-white leading-[0.9] tracking-[-0.06em] md:text-8xl">
              Acknowledge
              <br />
              Truth.
            </h2>
            <a
              aria-label="Open sign in"
              className="relative inline-flex items-center gap-8 overflow-hidden rounded-sm border border-neutral-800 bg-black/50 px-12 py-5 font-mono text-[0.62rem] text-neutral-300 uppercase tracking-[0.4em] backdrop-blur-md transition-colors duration-300 hover:border-violet-500/30 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              href="/sign-in"
            >
              <div className="absolute top-0 left-0 h-full w-[200%] bg-gradient-to-r from-transparent via-violet-500/10 to-transparent" />
              <span>Sign In</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700 text-[0.7rem] text-neutral-500">
                +
              </span>
            </a>
          </div>
          <div className="absolute bottom-4 left-4 font-mono text-[0.4rem] text-neutral-600 uppercase tracking-[0.5em]">
            END OP.04
          </div>
          <div className="absolute right-4 bottom-4 flex items-center gap-2 font-mono text-[0.4rem] text-neutral-600 uppercase tracking-[0.5em]">
            <span className="h-1 w-1 rounded-full bg-green-900" />
            SYS.SECURE
          </div>
          <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-neutral-900/50" />
          <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-neutral-900/50" />
        </div>
        <div className="mt-2 h-48 w-px bg-gradient-to-b from-neutral-800 to-transparent" />
        <div className="mt-4 font-mono text-[0.44rem] text-neutral-700 uppercase tracking-[0.8em]">
          Transmission Terminated
        </div>
      </div>
    </section>
  );
}
