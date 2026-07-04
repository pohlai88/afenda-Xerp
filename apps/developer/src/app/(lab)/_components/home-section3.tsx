import Image from "next/image";
import { HomeGridBackdrop } from "./home-grid-backdrop";

const archiveMatrix = [
  {
    accent: "violet",
    id: "001",
    image: "/afenda-reference/image-5.png",
    span: "md:col-span-2 md:row-span-2",
    type: "Primary Source",
  },
  {
    accent: "cyan",
    id: "002",
    image: "/afenda-reference/image-6.png",
    span: "",
    type: "Extract Alpha",
  },
  {
    accent: "fuchsia",
    id: "003",
    image: "/afenda-reference/image-7.png",
    span: "md:row-span-2",
    type: "Core Node",
  },
  {
    accent: "violet",
    id: "004",
    image: "/afenda-reference/image-8.png",
    span: "",
    type: "Extract Beta",
  },
  {
    accent: "fuchsia",
    id: "005",
    image: "/afenda-reference/image-9.png",
    span: "md:col-span-2",
    type: "Extract Gamma",
  },
  {
    accent: "cyan",
    id: "006",
    image: null,
    span: "md:col-span-2",
    type: "Sys Telemetry",
  },
] as const;

const telemetryBars = [24, 38, 54, 72, 68, 80, 61, 44, 83, 57, 76, 48] as const;
const telemetryRows = [
  ["5A 89 2F 4C 99 10 A3", "0.19458213"],
  ["FF 21 00 8A 7B 44 9C", "0.77452198"],
  ["11 34 8F AA 22 56 01", "0.55387144"],
  ["SYS_CHK_OK", "ACTIVE"],
] as const;

const getAccentDotClass = (accent: "cyan" | "violet" | "fuchsia") => {
  if (accent === "cyan") {
    return "bg-cyan-500/50";
  }

  if (accent === "violet") {
    return "bg-violet-500/50";
  }

  return "bg-fuchsia-500/50";
};

export function HomeSection3() {
  return (
    <section className="relative overflow-hidden border-neutral-900 border-t bg-[#020202] px-5 py-24 sm:px-8 lg:px-12">
      <HomeGridBackdrop />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-4 text-[0.5rem] text-neutral-500 uppercase tracking-[0.5em]">
          <span className="h-px w-12 bg-neutral-800" />
          Phase 04
          <span className="h-px w-12 bg-neutral-800" />
        </div>
        <h2 className="font-serif text-4xl text-neutral-100 leading-[0.9] tracking-tight md:text-7xl">
          Archive
          <br />
          Matrix.
        </h2>
        <p className="max-w-xl border-neutral-900 border-t pt-6 text-[0.68rem] text-neutral-500 uppercase leading-6 tracking-[0.18em]">
          A definitive ledger of extracted artifacts. Visual density without
          decorative chatter.
        </p>
      </div>

      <div className="mx-auto mt-16 grid w-full max-w-6xl auto-rows-[160px] grid-cols-2 gap-2 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
        {archiveMatrix.map((item, index) => (
          <div
            className={`group relative overflow-hidden border border-neutral-900/60 bg-[#020202] ${item.span}`}
            key={item.id}
          >
            {item.image ? (
              <>
                <Image
                  alt={item.type}
                  className="object-cover opacity-45 grayscale transition-all duration-1000 group-hover:scale-105 group-hover:opacity-85 group-hover:grayscale-0"
                  fill
                  sizes="(min-width: 1024px) 320px, 50vw"
                  src={item.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex h-12 items-end gap-2 border-neutral-800 border-b pb-2">
                  {telemetryBars.map((bar) => (
                    <div
                      className="w-full bg-cyan-500/40"
                      key={bar}
                      style={{ height: `${bar}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 grid gap-2 font-mono text-[0.44rem] text-neutral-500 uppercase tracking-[0.25em]">
                  {telemetryRows.map(([left, right]) => (
                    <div className="flex justify-between gap-4" key={left}>
                      <span>{left}</span>
                      <span>{right}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${getAccentDotClass(
                      item.accent
                    )}`}
                  />
                  <span className="text-[0.44rem] text-white/40 uppercase tracking-[0.4em]">
                    {item.type}
                  </span>
                </div>
                <span className="font-serif text-[0.7rem] text-white/30">
                  {item.id}
                </span>
              </div>

              {index === 0 ? (
                <div className="absolute top-1/2 left-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/5">
                  <div className="h-1 w-1 rounded-full bg-white/50" />
                  <div className="absolute top-0 left-1/2 h-2 w-px -translate-x-1/2 bg-white/30" />
                  <div className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-white/30" />
                  <div className="absolute top-1/2 left-0 h-px w-2 -translate-y-1/2 bg-white/30" />
                  <div className="absolute top-1/2 right-0 h-px w-2 -translate-y-1/2 bg-white/30" />
                </div>
              ) : null}

              <div className="mt-auto flex items-end justify-between">
                <div className="flex flex-col gap-1">
                  <div className="mb-1 h-px w-12 bg-neutral-800" />
                  <span className="text-[0.4rem] text-neutral-600 uppercase tracking-[0.4em]">
                    Status
                  </span>
                  <span className="text-[0.44rem] text-white/50 uppercase tracking-[0.2em]">
                    Active
                  </span>
                </div>
                <div className="text-right">
                  <span className="mb-1 block text-[0.4rem] text-neutral-600 uppercase tracking-[0.4em]">
                    Coordinates
                  </span>
                  <span className="font-mono text-[0.44rem] text-white/30">
                    {item.id}.4421 N
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
