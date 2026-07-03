/** Brand shell — semantics from docs/swiss-noir.css (per-story import). */
export const PRESENTATION_LAB_NOIR_BRAND_SHELL_CLASS =
  "dark theme-afenda-brand" as const;

export const labNoirShellClassName =
  "lab-noir-canvas bg-background text-foreground" as const;

/** Auth Login Lab — viewport-locked shell (laptop-fit, no document scroll). */
export const labNoirLoginShellClassName =
  "lab-noir-canvas lab-noir-login-viewport bg-background text-foreground" as const;

export const labNoirContainerClassName =
  "relative mx-auto grid min-h-dvh w-full max-w-[1440px] grid-rows-[auto_1fr_auto] px-6 py-7 sm:px-10 lg:px-14" as const;

export const labNoirLoginContainerClassName =
  "relative z-10 mx-auto grid h-full min-h-0 w-full max-w-[1440px] grid-rows-[auto_minmax(0,1fr)_auto] px-6 py-5 sm:px-10 lg:px-12" as const;

export const labNoirTopbarClassName =
  "grid grid-cols-[1fr_auto] items-center gap-6 border-b border-border/60 pb-5" as const;

export const labNoirLoginTopbarClassName =
  "grid shrink-0 grid-cols-[1fr_auto] items-center gap-6 border-b border-border/60 pb-4" as const;

export const labNoirSystemLineClassName =
  "lab-noir-mono text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const labNoirStatusClassName =
  "inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3 py-1.5 lab-noir-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground" as const;

export const labNoirStatusDotClassName =
  "size-1.5 rounded-full bg-primary" as const;

export const labNoirMainClassName =
  "relative grid items-center py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16" as const;

export const labNoirLoginMainClassName =
  "relative grid min-h-0 grid-rows-[auto_minmax(0,auto)] items-center gap-8 overflow-hidden py-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-none lg:gap-12 lg:py-8" as const;

export const labNoirHeroClassName = "relative z-10 min-w-0 max-w-5xl overflow-hidden" as const;

export const labNoirLoginHeroStackClassName =
  "relative z-10 flex min-w-0 max-w-5xl flex-col gap-4 overflow-hidden lg:gap-6" as const;

export const labNoirLoginKickerClassName =
  "lab-noir-mono text-[0.68rem] uppercase tracking-[0.36em] text-muted-foreground" as const;

export const labNoirLoginTitleClassName =
  "lab-noir-title overflow-hidden text-pretty break-words text-[clamp(3.25rem,7.5vw,11.5rem)] uppercase text-foreground" as const;

export const labNoirLoginFooterClassName =
  "hidden shrink-0 border-t border-border/60 pt-4 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-6" as const;

export const labNoirKickerClassName =
  "lab-noir-mono mb-8 text-[0.68rem] uppercase tracking-[0.36em] text-muted-foreground" as const;

export const labNoirTitleClassName =
  "lab-noir-title text-[clamp(5.5rem,15vw,15.5rem)] uppercase text-foreground" as const;

export const labNoirTitleMutedClassName =
  "block text-muted-foreground/35" as const;

export const labNoirTitlePrimaryClassName = "block text-foreground" as const;

export const labNoirSubtitleClassName =
  "mt-8 max-w-2xl lab-noir-serif text-xl leading-9 text-muted-foreground sm:text-2xl sm:leading-10" as const;

export const labNoirProofStripClassName =
  "mt-12 grid max-w-4xl grid-cols-3 border-y border-border/60" as const;

export const labNoirProofItemClassName =
  "border-r border-border/60 py-5 pr-5 last:border-r-0" as const;

export const labNoirProofValueClassName =
  "lab-noir-title text-5xl tracking-[-0.08em] text-primary sm:text-6xl" as const;

export const labNoirProofLabelClassName =
  "lab-noir-mono mt-2 text-[0.62rem] uppercase tracking-[0.26em] text-muted-foreground" as const;

export const labNoirSidePanelClassName =
  "lab-noir-panel relative z-10 mt-12 rounded-[2rem] p-6 lg:mt-0" as const;

export const labNoirLoginSidePanelClassName =
  "lab-noir-panel relative z-10 min-w-0 w-full rounded-[2rem] p-6 lg:p-7" as const;

export const labNoirPanelLabelClassName =
  "lab-noir-mono text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const labNoirPanelTitleClassName =
  "mt-8 lab-noir-serif text-3xl leading-tight text-foreground" as const;

export const labNoirPanelTextClassName =
  "mt-4 text-sm leading-7 text-muted-foreground" as const;

export const labNoirCommandListClassName = "mt-8 grid gap-3" as const;

export const labNoirCommandItemClassName =
  "grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-border/55 bg-background/35 p-4" as const;

export const labNoirCommandIndexClassName =
  "lab-noir-mono text-[0.62rem] text-primary" as const;

export const labNoirCommandTextClassName =
  "lab-noir-mono text-xs leading-6 text-muted-foreground" as const;

export const labNoirFooterClassName =
  "grid grid-cols-[1fr_auto] items-end gap-6 border-t border-border/60 pt-5" as const;

export const labNoirFooterMarkClassName =
  "lab-noir-mono text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const labNoirVerticalMarkClassName =
  "lab-noir-vertical-word pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 lab-noir-mono text-[0.62rem] uppercase tracking-[0.34em] text-muted-foreground/45 lg:block" as const;

/** Operator rail login (V4 / P4) — narrow credential rail + governance readout column. */
export const labNoirRailCanvasClassName =
  "lab-noir-canvas lab-noir-login-viewport relative bg-background text-foreground" as const;

export const labNoirRailGridClassName =
  "relative z-10 grid h-full min-h-0 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]" as const;

export const labNoirAccessRailClassName =
  "flex min-h-0 flex-col justify-center gap-6 border-border/60 border-r bg-card/15 px-8 py-12 lg:gap-8 lg:px-10" as const;

export const labNoirRailKickerClassName =
  "lab-noir-mono text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const labNoirRailHeroStackClassName = "flex flex-col gap-3" as const;

export const labNoirRailTitleClassName =
  "lab-noir-title text-[clamp(2.25rem,6vw,3.25rem)] uppercase leading-[0.88] tracking-[-0.06em]" as const;

export const labNoirRailTitleMutedClassName =
  "block text-muted-foreground/40" as const;

export const labNoirRailTitlePrimaryClassName = "block text-foreground" as const;

export const labNoirRailPanelTitleClassName =
  "lab-noir-serif text-2xl leading-tight text-foreground text-pretty" as const;

export const labNoirRailFormClassName = "grid gap-4" as const;

export const labNoirReadoutColumnClassName =
  "relative flex min-h-0 min-w-0 flex-col gap-6 overflow-hidden px-6 py-6 lg:px-10 lg:py-8" as const;

export const labNoirReadoutScanGridClassName = "lab-noir-readout-grid" as const;

export const labNoirReadoutHeaderClassName =
  "relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-4 border-border/60 border-b pb-4" as const;

export const labNoirReadoutHeaderCopyClassName = "flex min-w-0 flex-col gap-2" as const;

export const labNoirReadoutKickerClassName =
  "lab-noir-mono text-[0.62rem] uppercase tracking-[0.32em] text-primary/90" as const;

export const labNoirReadoutTitleClassName =
  "lab-noir-mono text-xl tracking-tight text-foreground text-pretty" as const;

export const labNoirReadoutStatusClassName =
  "inline-flex items-center gap-2 rounded border border-primary/30 bg-primary/10 px-3 py-1.5 lab-noir-mono text-[0.62rem] uppercase tracking-[0.2em] text-foreground" as const;

export const labNoirReadoutStatusDotClassName =
  "size-1.5 rounded-full bg-primary" as const;

export const labNoirGovernanceGridClassName =
  "relative z-10 grid gap-4 sm:grid-cols-2" as const;

export const labNoirGovernanceCardClassName =
  "flex min-w-0 flex-col gap-2 rounded border border-border/60 bg-background/35 p-4" as const;

export const labNoirGovernanceTermClassName =
  "lab-noir-mono text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground" as const;

export const labNoirGovernanceValueClassName =
  "break-words lab-noir-mono text-sm text-foreground/90" as const;

export const labNoirTelemetryPanelClassName =
  "relative z-10 flex shrink-0 flex-col gap-4 rounded border border-border/60 bg-background/25 p-4" as const;

export const labNoirTelemetryHeadingClassName =
  "lab-noir-mono text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground" as const;

export const labNoirTelemetryListClassName = "flex flex-col gap-3" as const;

export const labNoirTelemetryRowClassName =
  "flex min-w-0 items-center justify-between gap-4 border-border/50 border-b pb-3 last:border-0 last:pb-0" as const;

export const labNoirTelemetryMetricClassName =
  "lab-noir-mono text-muted-foreground" as const;

export const labNoirTelemetryReadingClassName =
  "flex items-center gap-3 lab-noir-mono text-foreground/90" as const;

export const labNoirTelemetryTickClassName =
  "lab-noir-readout-tick text-primary" as const;

export const labNoirTelemetryTickWatchClassName =
  "lab-noir-readout-tick lab-noir-readout-tick--watch text-amber-400/90" as const;
