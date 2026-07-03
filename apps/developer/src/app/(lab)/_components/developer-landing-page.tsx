import Image from "next/image";

const metadataRails = [
  { id: "left-top", position: "left", text: "SEC-04 // VOID" },
  { id: "left-bottom", position: "left", text: "REF: 884-A.92" },
  { id: "right-top", position: "right", text: "SYS.OP" },
  { id: "right-bottom", position: "right", text: "SEALED" },
] as const;

const apertureTicks = [
  {
    className: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    id: "north",
    label: "N",
  },
  {
    className: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
    id: "east",
    label: "E",
  },
  {
    className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    id: "south",
    label: "S",
  },
  {
    className: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
    id: "west",
    label: "W",
  },
] as const;

export function DeveloperLandingPage() {
  return (
    <section className="dark relative isolate min-h-dvh overflow-hidden bg-[#030303] text-neutral-200 selection:bg-violet-950/50 selection:text-neutral-50 lg:h-dvh">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 bg-[#030303]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.018] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_74%_48%,rgba(124,58,237,0.1)_0,rgba(124,58,237,0.045)_28%,transparent_54%),radial-gradient(ellipse_at_40%_42%,rgba(245,158,11,0.045)_0,transparent_38%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[5.2rem] left-[4vw] z-0 hidden select-none overflow-hidden font-black text-[clamp(8rem,16vw,15rem)] text-neutral-100/[0.13] leading-none tracking-normal [font-family:Arial_Black,Arial,Helvetica,sans-serif] md:block"
      >
        PRESENTATION
      </div>

      <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-[1480px] grid-rows-[auto_1fr_auto] px-5 py-5 sm:px-8 lg:h-dvh lg:px-12">
        <header className="grid grid-cols-[1fr_auto] items-start gap-6 border-neutral-800/70 border-b pb-5">
          <div className="grid gap-1.5">
            <div className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-violet-500 shadow-[0_0_16px_rgba(139,92,246,0.56)]" />
              <p className="font-medium text-[0.58rem] text-neutral-200 uppercase tracking-[0.26em]">
                Phantom Terminal
              </p>
            </div>
            <p className="ml-4 font-medium text-[0.5rem] text-neutral-600 uppercase tracking-[0.3em]">
              Afenda Proof Verification OS
            </p>
          </div>

          <div className="flex items-center gap-5 text-[0.5rem] text-neutral-600 uppercase tracking-[0.28em]">
            <span className="hidden sm:inline">Encrypted Connection</span>
            <span
              aria-hidden="true"
              className="hidden h-px w-12 bg-neutral-800 sm:block"
            />
            <a
              className="text-neutral-500 transition-colors duration-500 hover:text-neutral-100"
              href="#proof"
            >
              Enter
            </a>
          </div>
        </header>

        <div className="relative grid min-h-0 items-center gap-7 py-8 md:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)] lg:gap-12 lg:py-7">
          {metadataRails.map((rail) => (
            <p
              className={[
                "pointer-events-none absolute hidden text-[0.48rem] text-neutral-600 uppercase tracking-[0.36em] md:block",
                rail.position === "left"
                  ? "left-0 -translate-x-1/3"
                  : "right-0 translate-x-1/3 text-right",
                rail.id.endsWith("top") ? "top-[16%]" : "bottom-[14%]",
              ].join(" ")}
              key={rail.id}
            >
              {rail.text}
            </p>
          ))}

          <main className="max-w-[45rem] pt-2 md:pl-8">
            <p className="mb-8 font-medium text-[0.58rem] text-neutral-300/70 uppercase tracking-[0.48em]">
              Afenda Shadcn/Studio
            </p>

            <h1 className="font-black text-[#f3efe4] text-[clamp(5.6rem,11.4vw,11.2rem)] leading-[0.72] tracking-normal [font-family:Arial_Black,Arial,Helvetica,sans-serif]">
              LAB
            </h1>

            <p className="mt-7 max-w-md border-neutral-800/70 border-l pl-4 text-[0.62rem] text-neutral-600 uppercase leading-5 tracking-[0.22em]">
              Proof chamber sealed. ERP surface inspection only.
            </p>

            <a
              className="mt-8 inline-flex items-center gap-5 text-[0.52rem] text-neutral-500 uppercase tracking-[0.36em] transition-colors duration-500 hover:text-violet-200"
              href="#proof"
            >
              <span className="h-px w-12 bg-neutral-800 transition-colors duration-500" />
              Verify Chamber
              <span aria-hidden="true" className="text-neutral-500">
                /01
              </span>
            </a>
          </main>

          <aside
            className="relative mx-auto flex w-full max-w-[24rem] justify-center md:max-w-[28rem] md:-translate-x-7 md:-translate-y-3"
            id="proof"
          >
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[152%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/[0.045]"
            />
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[113%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/[0.04]"
            />
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-100/[0.07]"
            />
            {apertureTicks.map((tick) => (
              <span
                className={[
                  "absolute hidden size-7 place-items-center rounded-full border border-neutral-800/80 bg-black/30 text-[0.5rem] text-neutral-600 md:grid",
                  tick.className,
                ].join(" ")}
                key={tick.id}
              >
                {tick.label}
              </span>
            ))}

            <figure className="relative aspect-[3/4] w-[min(76vw,22rem)] bg-[#020202] p-2.5 shadow-[0_34px_90px_-35px_rgba(0,0,0,1),0_0_52px_-34px_rgba(139,92,246,0.72)] outline outline-1 outline-neutral-800/75">
              <div
                aria-hidden="true"
                className="absolute inset-x-5 top-5 h-px bg-neutral-800/75"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-5 bottom-5 h-px bg-neutral-800/75"
              />
              <span
                aria-hidden="true"
                className="absolute top-12 -left-1 h-14 w-1 bg-neutral-800 shadow-[0_0_18px_rgba(139,92,246,0.18)]"
              />
              <span
                aria-hidden="true"
                className="absolute right-[-0.25rem] bottom-14 h-20 w-1 bg-neutral-800 shadow-[0_0_18px_rgba(245,158,11,0.12)]"
              />

              <div className="group relative h-full overflow-hidden border border-neutral-800/55 bg-[#050505]">
                <Image
                  alt="Afenda sealed verification proof chamber"
                  className="object-cover opacity-72 brightness-[0.74] contrast-[0.92] saturate-[0.88] transition duration-1000 group-hover:opacity-[0.82] group-hover:brightness-[0.82] group-hover:saturate-100"
                  fill
                  priority
                  sizes="(min-width: 1024px) 340px, 76vw"
                  src="/afenda-reference/proof-chamber.png"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(0,0,0,0.01)_0,rgba(0,0,0,0.12)_32%,rgba(0,0,0,0.62)_80%)]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-violet-600/12 mix-blend-overlay"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#030303]/18 mix-blend-multiply"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_bottom,transparent_0,transparent_10px,rgba(255,255,255,0.8)_11px,transparent_12px)] [background-size:100%_18px]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 shadow-[inset_0_0_72px_rgba(0,0,0,0.92),inset_0_0_0_1px_rgba(255,255,255,0.035)]"
                />

                <figcaption className="absolute top-5 left-5 text-[0.48rem] text-neutral-300/38 uppercase tracking-[0.36em]">
                  Fig 1.0
                </figcaption>
                <p className="absolute right-5 bottom-5 text-[0.48rem] text-neutral-300/38 uppercase tracking-[0.36em]">
                  Sealed
                </p>

                <div
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 grid aspect-square w-44 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-violet-100/[0.11]"
                >
                  <span className="absolute h-px w-full bg-violet-100/[0.055]" />
                  <span className="absolute h-full w-px bg-violet-100/[0.05]" />
                  <span className="grid aspect-square w-[5.25rem] place-items-center rounded-full border border-violet-200/[0.18] bg-black/10 shadow-[0_0_36px_rgba(139,92,246,0.1)]">
                    <span className="aspect-square w-7 rounded-full border border-amber-100/28 bg-black/35 shadow-[0_0_24px_rgba(245,158,11,0.14)]" />
                  </span>
                </div>
              </div>
            </figure>
          </aside>
        </div>

        <footer className="grid grid-cols-[1fr_auto] items-end gap-6 border-neutral-800/70 border-t pt-5 text-[0.5rem] text-neutral-600 uppercase tracking-[0.28em]">
          <p>Luxury sci-fi noir / proof theatre</p>
          <p>Cam: fighting the bloat</p>
        </footer>
      </div>
    </section>
  );
}
