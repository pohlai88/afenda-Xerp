import styles from "./app-shell.module.css";
import type {
  AppShellNavIcon,
  AppShellNavItemState,
  AppShellNavItemTone,
} from "./app-shell.types";

function requireCssClass(className: string | undefined, token: string): string {
  if (className) {
    return className;
  }

  if (process.env.NODE_ENV !== "production") {
    throw new Error(`Missing AppShell CSS class: ${token}`);
  }

  return "";
}

/** Typed CSS module lookup — avoids brittle dynamic `styles[\`navState_${state}\`]`. */
export const NAV_STATE_CLASS = {
  ready: requireCssClass(styles.navState_ready, "navState_ready"),
  disabled: requireCssClass(styles.navState_disabled, "navState_disabled"),
  "coming-soon": requireCssClass(
    styles.navState_comingSoon,
    "navState_comingSoon"
  ),
  hidden: requireCssClass(styles.navState_hidden, "navState_hidden"),
} as const satisfies Record<AppShellNavItemState, string>;

export const NAV_TONE_CLASS = {
  neutral: "",
  attention: requireCssClass(styles.navTone_attention, "navTone_attention"),
  warning: requireCssClass(styles.navTone_warning, "navTone_warning"),
  critical: requireCssClass(styles.navTone_critical, "navTone_critical"),
} as const satisfies Record<AppShellNavItemTone, string>;

/** Closed icon registry — maps contract icons to CSS module classes (TIP-006 swap point). */
export const NAV_ICON_CLASS = {
  nexus: requireCssClass(styles.navIconNexus, "navIconNexus"),
  factory: requireCssClass(styles.navIconFactory, "navIconFactory"),
  warehouse: requireCssClass(styles.navIconWarehouse, "navIconWarehouse"),
  sales: requireCssClass(styles.navIconSales, "navIconSales"),
  ledger: requireCssClass(styles.navIconLedger, "navIconLedger"),
  people: requireCssClass(styles.navIconPeople, "navIconPeople"),
  kanban: requireCssClass(styles.navIconKanban, "navIconKanban"),
  shield: requireCssClass(styles.navIconShield, "navIconShield"),
} as const satisfies Record<AppShellNavIcon, string>;
