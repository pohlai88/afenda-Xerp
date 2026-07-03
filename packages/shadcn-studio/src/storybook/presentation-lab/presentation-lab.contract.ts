export const PRESENTATION_LAB_THEME_CLASS =
  "theme-afenda-verdant-milk-noir" as const;

export const presentationLabShellClassName =
  "verdant-canvas bg-background text-foreground" as const;

/** Auth Login Lab — viewport-locked shell (laptop-fit, no document scroll). */
export const presentationLabLoginShellClassName =
  "verdant-canvas verdant-login-viewport bg-background text-foreground" as const;

export const presentationLabLoginContainerClassName =
  "relative z-10 mx-auto grid h-full min-h-0 w-full max-w-[1480px] grid-rows-[auto_minmax(0,1fr)_auto] px-6 py-5 sm:px-10 lg:px-12" as const;

export const presentationLabLoginTopbarClassName =
  "grid shrink-0 grid-cols-[1fr_auto] items-center gap-6 border-b border-border pb-4" as const;

export const presentationLabLoginMainClassName =
  "relative grid min-h-0 grid-rows-[auto_minmax(0,auto)] items-center gap-8 overflow-hidden py-6 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,34rem)] lg:grid-rows-none lg:gap-12 lg:py-8" as const;

export const presentationLabLoginHeroStackClassName =
  "relative z-10 flex min-w-0 flex-col gap-4 overflow-hidden lg:gap-6" as const;

export const presentationLabLoginKickerClassName = "lab-kicker" as const;

export const presentationLabLoginTitleClassName =
  "font-display pointer-events-none select-none overflow-hidden text-pretty break-words text-[clamp(3.25rem,7.5vw,11.5rem)] uppercase leading-[0.78] tracking-[-0.095em]" as const;

export const presentationLabLoginFooterClassName =
  "hidden shrink-0 border-t border-border pt-4 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-6" as const;

export const presentationLabGridClassName = "verdant-grid" as const;

export const presentationLabVignetteClassName = "verdant-vignette" as const;

export const presentationLabContainerClassName =
  "relative z-10 mx-auto grid min-h-dvh w-full max-w-[1480px] grid-rows-[auto_1fr_auto] px-6 py-7 sm:px-10 lg:px-14" as const;

export const presentationLabTopbarClassName =
  "grid grid-cols-[1fr_auto] items-center gap-6 border-b border-border pb-5" as const;

export const presentationLabSystemTextClassName =
  "font-lab-mono text-[0.62rem] uppercase leading-none tracking-[0.32em] text-muted-foreground" as const;

export const presentationLabAuthorityPillClassName =
  "inline-flex items-center gap-2 rounded-full border border-afenda-hairline bg-card/40 px-3 py-1.5 font-lab-mono text-[0.58rem] uppercase tracking-[0.22em] text-milk-muted shadow-sm" as const;

export const presentationLabAuthorityDotClassName =
  "size-1.5 rounded-full bg-afenda-gold" as const;

export const presentationLabMainClassName =
  "relative grid items-center py-14 sm:py-[4.5rem] lg:grid-cols-[minmax(0,1fr)_minmax(28rem,34rem)] lg:gap-16" as const;

export const presentationLabHeroClassName =
  "relative z-10 min-w-0 overflow-hidden" as const;

export const presentationLabKickerClassName = "lab-kicker mb-8" as const;

export const presentationLabTitleClassName =
  "font-display pointer-events-none select-none text-[clamp(5.25rem,15vw,15.5rem)] uppercase leading-[0.78] tracking-[-0.095em]" as const;

export const presentationLabTitleGhostClassName = "block hero-ghost" as const;

export const presentationLabTitleMilkClassName = "block text-milk" as const;

export const presentationLabSubtitleClassName =
  "mt-10 max-w-3xl font-editorial text-[clamp(1.35rem,2.2vw,2.35rem)] leading-[1.25] text-milk-muted" as const;

export const presentationLabProofStripClassName =
  "mt-12 grid max-w-4xl grid-cols-3 border-y border-afenda-hairline" as const;

export const presentationLabProofItemClassName =
  "border-r border-afenda-hairline py-5 pr-5 last:border-r-0" as const;

export const presentationLabProofValueClassName =
  "font-display text-5xl leading-none tracking-[-0.07em] text-afenda-gold sm:text-6xl" as const;

export const presentationLabProofLabelClassName =
  "mt-2 font-lab-mono text-[0.58rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const presentationLabFloatBoxClassName =
  "float-focus relative z-20 rounded-[2rem] p-7 sm:p-8 lg:p-9" as const;

export const presentationLabFloatBoxHairlineClassName = "gold-hairline mt-6" as const;

export const presentationLabJewelPanelLabelClassName =
  "font-lab-mono text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const presentationLabJewelHairlineClassName = "gold-hairline mt-4" as const;

export const presentationLabFloatBoxTitleClassName =
  "mt-8 font-editorial text-[clamp(2.5rem,4vw,4.4rem)] leading-[0.96] text-milk" as const;

export const presentationLabFloatBoxTextClassName =
  "mt-6 max-w-md text-base leading-8 text-milk-muted" as const;

export const presentationLabCommandListClassName = "mt-9 grid gap-3" as const;

export const presentationLabCommandItemClassName =
  "grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-afenda-hairline bg-background/28 p-4" as const;

export const presentationLabCommandIndexClassName =
  "font-lab-mono text-[0.58rem] text-afenda-gold" as const;

export const presentationLabCommandTextClassName =
  "font-lab-mono text-xs leading-6 text-milk-muted" as const;

export const presentationLabFooterClassName =
  "grid grid-cols-[1fr_auto] items-end gap-6 border-t border-border pt-5" as const;

export const presentationLabFooterTextClassName =
  "font-lab-mono text-[0.58rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const presentationLabVerticalMarkClassName =
  "pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] font-lab-mono text-[0.58rem] uppercase tracking-[0.34em] text-muted-foreground/45 lg:block" as const;

/** Portal vault card (V3 right column) — not side jewel. */
export const presentationLabPortalCardClassName =
  "float-focus relative z-10 min-w-0 w-full rounded-[2rem] p-6 sm:p-7 lg:p-8" as const;

export const presentationLabPortalCardTitleClassName =
  "mt-6 font-editorial text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.05] text-milk text-pretty" as const;

export const presentationLabPortalFormClassName = "mt-8 grid gap-4" as const;
