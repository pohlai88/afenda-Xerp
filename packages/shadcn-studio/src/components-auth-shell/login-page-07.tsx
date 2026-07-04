import AuthShellSurfaceV1 from "./prelogin-bundle-01.js";
import { blockSlotDomMarkerProps } from "../meta-contracts/block-slot-dom-marker.contract.js";
import { AuthShellStage } from "./auth-shell-stage.js";

const LYNX_IMAGE_SRC = "/afenda-brand/pixel/afenda-lynx-pixel.png";
const LYNX_IMAGE_STORYBOOK_SRC =
  "/studio-assets/afenda-brand/pixel/afenda-lynx-pixel.png";

export default function LoginPage07() {
  return (
    <AuthShellStage
      {...blockSlotDomMarkerProps("login-page-07.content")}
      variant="access"
    >
      <div className="relative min-h-[calc(100dvh-2rem)] w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#020506] shadow-2xl shadow-black/35">
        <div className="pointer-events-none absolute inset-0">
          <img
            alt=""
            className="h-full w-full object-cover object-[54%_41%] opacity-100"
            onError={(event) => {
              const image = event.currentTarget;

              if (image.dataset["lynxFallbackApplied"] === "1") {
                return;
              }

              image.dataset["lynxFallbackApplied"] = "1";
              image.src = LYNX_IMAGE_STORYBOOK_SRC;
            }}
            src={LYNX_IMAGE_SRC}
          />
        </div>

        <div className="relative z-10 grid min-h-[calc(100dvh-2rem)] grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,67svh)_minmax(9.5rem,1fr)] items-center justify-items-center gap-[clamp(1.75rem,3svh,2.5rem)] px-0 pb-[clamp(2rem,4svh,3rem)]">
          <div />

          <div className="flex w-[min(calc(100%-2.5rem),58rem)] -translate-x-[1px] translate-y-[clamp(1.35rem,3.35svh,2.3rem)] flex-col items-center gap-[clamp(0.55rem,1.1svh,0.82rem)] text-center">
            <h1
              {...blockSlotDomMarkerProps("login-page-07.title")}
              className="translate-y-[4px] font-semibold text-[clamp(2.25rem,4.65vw,4.6875rem)] text-white leading-[0.92] lowercase tracking-normal drop-shadow-[0_10px_42px_rgba(0,0,0,0.58)]"
            >
              acknowledge truth.
            </h1>

            <div {...blockSlotDomMarkerProps("login-page-07.cta")}>
              <AuthShellSurfaceV1
                mode="drawer"
                triggerClassName="-translate-y-[2px] h-[clamp(2.78rem,5.25svh,3.52rem)] min-w-[127.6px] rounded-full bg-[#f8faf9] px-[clamp(1.62rem,2.7vw,2.1rem)] font-semibold text-[#030607] text-[clamp(0.94rem,1.15vw,1.19rem)] lowercase tracking-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_52px_rgba(0,0,0,0.34)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_20px_64px_rgba(0,0,0,0.42)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#b1deffb8]"
                triggerLabel="sign in"
              />
            </div>
          </div>
        </div>
      </div>
    </AuthShellStage>
  );
}
