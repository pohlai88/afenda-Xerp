import { useId } from "react";

import {
  PRESENTATION_LAB_NOIR_BRAND_SHELL_CLASS,
  labNoirContainerClassName,
  labNoirFooterMarkClassName,
  labNoirGovernanceCardClassName,
  labNoirGovernanceGridClassName,
  labNoirGovernanceTermClassName,
  labNoirGovernanceValueClassName,
  labNoirAccessRailClassName,
  labNoirLoginContainerClassName,
  labNoirLoginFooterClassName,
  labNoirLoginHeroStackClassName,
  labNoirLoginKickerClassName,
  labNoirLoginMainClassName,
  labNoirLoginShellClassName,
  labNoirLoginSidePanelClassName,
  labNoirLoginTitleClassName,
  labNoirLoginTopbarClassName,
  labNoirPanelLabelClassName,
  labNoirPanelTitleClassName,
  labNoirRailCanvasClassName,
  labNoirRailFormClassName,
  labNoirRailGridClassName,
  labNoirRailHeroStackClassName,
  labNoirRailKickerClassName,
  labNoirRailPanelTitleClassName,
  labNoirRailTitleClassName,
  labNoirRailTitleMutedClassName,
  labNoirRailTitlePrimaryClassName,
  labNoirReadoutColumnClassName,
  labNoirReadoutHeaderClassName,
  labNoirReadoutHeaderCopyClassName,
  labNoirReadoutKickerClassName,
  labNoirReadoutScanGridClassName,
  labNoirReadoutStatusClassName,
  labNoirReadoutStatusDotClassName,
  labNoirReadoutTitleClassName,
  labNoirStatusClassName,
  labNoirStatusDotClassName,
  labNoirSystemLineClassName,
  labNoirTelemetryHeadingClassName,
  labNoirTelemetryListClassName,
  labNoirTelemetryMetricClassName,
  labNoirTelemetryPanelClassName,
  labNoirTelemetryReadingClassName,
  labNoirTelemetryRowClassName,
  labNoirTelemetryTickClassName,
  labNoirTelemetryTickWatchClassName,
  labNoirTitleMutedClassName,
  labNoirTitlePrimaryClassName,
  labNoirVerticalMarkClassName,
} from "./presentation-lab.noir.contract.js";
import {
  PRESENTATION_LAB_THEME_CLASS,
  presentationLabAuthorityDotClassName,
  presentationLabAuthorityPillClassName,
  presentationLabFloatBoxClassName,
  presentationLabFloatBoxHairlineClassName,
  presentationLabFloatBoxTitleClassName,
  presentationLabFooterTextClassName,
  presentationLabGridClassName,
  presentationLabJewelHairlineClassName,
  presentationLabJewelPanelLabelClassName,
  presentationLabLoginContainerClassName,
  presentationLabLoginFooterClassName,
  presentationLabLoginHeroStackClassName,
  presentationLabLoginKickerClassName,
  presentationLabLoginMainClassName,
  presentationLabLoginShellClassName,
  presentationLabLoginTitleClassName,
  presentationLabLoginTopbarClassName,
  presentationLabPortalCardClassName,
  presentationLabPortalCardTitleClassName,
  presentationLabPortalFormClassName,
  presentationLabSystemTextClassName,
  presentationLabTitleGhostClassName,
  presentationLabTitleMilkClassName,
  presentationLabVerticalMarkClassName,
  presentationLabVignetteClassName,
} from "./presentation-lab.contract.js";
import {
  loginFieldClassName,
  loginFormClassName,
  presentationLoginCopy,
  swissLoginInputClassName,
  swissLoginLabelClassName,
  swissLoginRecoveryClassName,
  swissLoginSubmitClassName,
  verdantLoginInputClassName,
  verdantLoginLabelClassName,
  verdantLoginRecoveryClassName,
  verdantLoginSubmitClassName,
  type PresentationLoginCopy,
  type PresentationLoginPattern,
  type PresentationLoginTelemetryRow,
} from "./presentation-lab-login.contract.js";

export type AfendaPresentationLoginProps = {
  readonly pattern: PresentationLoginPattern;
};

export function AfendaPresentationLogin({
  pattern,
}: AfendaPresentationLoginProps) {
  if (pattern === "swiss-noir-operator-rail") {
    return <SwissNoirOperatorRailLogin />;
  }

  if (pattern === "verdant-portal-noir") {
    return <VerdantCenteredPortalLogin />;
  }

  if (pattern === "swiss-noir") {
    return <SwissNoirLogin />;
  }

  return <VerdantMilkNoirLogin />;
}

export function SwissNoirLogin() {
  const copy = presentationLoginCopy["swiss-noir"];

  return (
    <main className={`${PRESENTATION_LAB_NOIR_BRAND_SHELL_CLASS} ${labNoirLoginShellClassName}`}>
      <div aria-hidden className="lab-noir-orb" />

      <div className={labNoirLoginContainerClassName}>
        <span className={labNoirVerticalMarkClassName}>{copy.verticalMark}</span>

        <header className={labNoirLoginTopbarClassName}>
          <p className={labNoirSystemLineClassName}>{copy.systemLine}</p>
          <span className={labNoirStatusClassName}>
            <span className={labNoirStatusDotClassName} />
            {copy.statusLabel}
          </span>
        </header>

        <section className={labNoirLoginMainClassName}>
          <div className={labNoirLoginHeroStackClassName}>
            <p className={labNoirLoginKickerClassName}>{copy.eyebrow}</p>

            <h1 className={labNoirLoginTitleClassName}>
              <span className={labNoirTitleMutedClassName}>{copy.titleMuted}</span>
              <span className={labNoirTitlePrimaryClassName}>{copy.titlePrimary}</span>
            </h1>
          </div>

          <LoginJewel
            className={labNoirLoginSidePanelClassName}
            copy={copy}
            inputClassName={swissLoginInputClassName}
            labelClassName={swissLoginLabelClassName}
            panelLabelClassName={labNoirPanelLabelClassName}
            recoveryClassName={swissLoginRecoveryClassName}
            submitClassName={swissLoginSubmitClassName}
            titleClassName={labNoirPanelTitleClassName}
          />
        </section>

        {copy.footerMark ? (
          <footer className={labNoirLoginFooterClassName}>
            <p className={labNoirFooterMarkClassName}>{copy.footerMark}</p>
          </footer>
        ) : null}
      </div>
    </main>
  );
}

export function SwissNoirOperatorRailLogin() {
  const copy = presentationLoginCopy["swiss-noir-operator-rail"];
  const titleId = useId();

  return (
    <main
      className={`${PRESENTATION_LAB_NOIR_BRAND_SHELL_CLASS} ${labNoirRailCanvasClassName}`}
    >
      <div className={labNoirRailGridClassName}>
        <aside
          aria-labelledby={titleId}
          className={labNoirAccessRailClassName}
        >
          {copy.panelLabel ? (
            <p className={labNoirRailKickerClassName}>{copy.panelLabel}</p>
          ) : null}

          <div className={labNoirRailHeroStackClassName}>
            <p className={labNoirRailKickerClassName} translate="no">
              {copy.eyebrow}
            </p>

            <h1 className={labNoirRailTitleClassName} id={titleId}>
              <span className={labNoirRailTitleMutedClassName}>
                {copy.titleMuted}
              </span>
              <span className={labNoirRailTitlePrimaryClassName}>
                {copy.titlePrimary}
              </span>
            </h1>
          </div>

          <h2 className={labNoirRailPanelTitleClassName}>{copy.panelTitle}</h2>

          <LoginRailVault copy={copy} />
        </aside>

        <OperatorRailReadout copy={copy} />
      </div>
    </main>
  );
}

export function VerdantCenteredPortalLogin() {
  const copy = presentationLoginCopy["verdant-portal-noir"];
  const titleId = useId();

  return (
    <main className={`${PRESENTATION_LAB_THEME_CLASS} ${presentationLabLoginShellClassName}`}>
      <div aria-hidden className={presentationLabGridClassName} />
      <div aria-hidden className={presentationLabVignetteClassName} />

      <div className={presentationLabLoginContainerClassName}>
        <header className={presentationLabLoginTopbarClassName}>
          <p className={presentationLabSystemTextClassName}>{copy.systemLine}</p>
          <span className={presentationLabAuthorityPillClassName}>
            <span aria-hidden className={presentationLabAuthorityDotClassName} />
            {copy.statusLabel}
          </span>
        </header>

        <section aria-labelledby={titleId} className={presentationLabLoginMainClassName}>
          <div className={presentationLabLoginHeroStackClassName}>
            <p className={presentationLabLoginKickerClassName} translate="no">
              {copy.eyebrow}
            </p>

            <h1 className={presentationLabLoginTitleClassName} id={titleId}>
              <span className={presentationLabTitleGhostClassName}>
                {copy.titleMuted}
              </span>
              <span className={presentationLabTitleMilkClassName}>
                {copy.titlePrimary}
              </span>
            </h1>
          </div>

          <LoginPortalVault copy={copy} />
        </section>

        {copy.footerMark ? (
          <footer className={presentationLabLoginFooterClassName}>
            <p className={presentationLabFooterTextClassName}>{copy.footerMark}</p>
          </footer>
        ) : null}
      </div>
    </main>
  );
}

export function VerdantMilkNoirLogin() {
  const copy = presentationLoginCopy["verdant-milk-noir"];

  return (
    <main className={`${PRESENTATION_LAB_THEME_CLASS} ${presentationLabLoginShellClassName}`}>
      <div aria-hidden className={presentationLabGridClassName} />
      <div aria-hidden className={presentationLabVignetteClassName} />

      <div className={presentationLabLoginContainerClassName}>
        <span className={presentationLabVerticalMarkClassName}>
          {copy.verticalMark}
        </span>

        <header className={presentationLabLoginTopbarClassName}>
          <p className={presentationLabSystemTextClassName}>{copy.systemLine}</p>
          <span className={presentationLabAuthorityPillClassName}>
            <span aria-hidden className={presentationLabAuthorityDotClassName} />
            {copy.statusLabel}
          </span>
        </header>

        <section className={presentationLabLoginMainClassName}>
          <div className={presentationLabLoginHeroStackClassName}>
            <p className={presentationLabLoginKickerClassName} translate="no">
              {copy.eyebrow}
            </p>

            <h1 className={presentationLabLoginTitleClassName}>
              <span className={presentationLabTitleGhostClassName}>
                {copy.titleMuted}
              </span>
              <span className={presentationLabTitleMilkClassName}>
                {copy.titlePrimary}
              </span>
            </h1>
          </div>

          <LoginJewel
            className={presentationLabFloatBoxClassName}
            copy={copy}
            hairlineClassName={presentationLabJewelHairlineClassName}
            inputClassName={verdantLoginInputClassName}
            labelClassName={verdantLoginLabelClassName}
            panelLabelClassName={presentationLabJewelPanelLabelClassName}
            recoveryClassName={verdantLoginRecoveryClassName}
            submitClassName={verdantLoginSubmitClassName}
            titleClassName={presentationLabFloatBoxTitleClassName}
            withHairline
          />
        </section>

        {copy.footerMark ? (
          <footer className={presentationLabLoginFooterClassName}>
            <p className={presentationLabFooterTextClassName}>{copy.footerMark}</p>
          </footer>
        ) : null}
      </div>
    </main>
  );
}

function LoginRailVault({ copy }: { readonly copy: PresentationLoginCopy }) {
  const formId = useId();
  const emailFieldId = `${formId}-email`;
  const passwordFieldId = `${formId}-password`;

  return (
    <form
      className={labNoirRailFormClassName}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className={loginFieldClassName}>
        <label className={swissLoginLabelClassName} htmlFor={emailFieldId}>
          {copy.emailLabel}
        </label>
        <input
          autoComplete="email"
          className={swissLoginInputClassName}
          id={emailFieldId}
          name="email"
          placeholder={copy.emailPlaceholder}
          spellCheck={false}
          type="email"
        />
      </div>

      <div className={loginFieldClassName}>
        <label className={swissLoginLabelClassName} htmlFor={passwordFieldId}>
          {copy.passwordLabel}
        </label>
        <input
          autoComplete="current-password"
          className={swissLoginInputClassName}
          id={passwordFieldId}
          name="password"
          placeholder={copy.passwordPlaceholder}
          type="password"
        />
      </div>

      <button className={swissLoginSubmitClassName} type="submit">
        {copy.submitLabel}
      </button>

      <a className={swissLoginRecoveryClassName} href="#">
        {copy.recoveryLabel}
      </a>
    </form>
  );
}

function OperatorRailReadout({ copy }: { readonly copy: PresentationLoginCopy }) {
  const readoutTitleId = useId();

  return (
    <section
      aria-labelledby={readoutTitleId}
      className={labNoirReadoutColumnClassName}
    >
      <div aria-hidden className={labNoirReadoutScanGridClassName} />

      <header className={labNoirReadoutHeaderClassName}>
        <div className={labNoirReadoutHeaderCopyClassName}>
          {copy.readoutLabel ? (
            <p className={labNoirReadoutKickerClassName}>{copy.readoutLabel}</p>
          ) : null}
          {copy.readoutTitle ? (
            <h2 className={labNoirReadoutTitleClassName} id={readoutTitleId}>
              {copy.readoutTitle}
            </h2>
          ) : null}
        </div>

        {copy.readoutStatusLabel ? (
          <span className={labNoirReadoutStatusClassName}>
            <span
              aria-hidden
              className={labNoirReadoutStatusDotClassName}
            />
            {copy.readoutStatusLabel}
          </span>
        ) : null}
      </header>

      {copy.governanceLines ? (
        <dl className={labNoirGovernanceGridClassName}>
          {copy.governanceLines.map((line) => (
            <div className={labNoirGovernanceCardClassName} key={line.key}>
              <dt className={labNoirGovernanceTermClassName}>{line.label}</dt>
              <dd className={labNoirGovernanceValueClassName}>{line.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {copy.telemetryRows ? (
        <div className={labNoirTelemetryPanelClassName}>
          <p className={labNoirTelemetryHeadingClassName}>Live telemetry</p>
          <ul className={labNoirTelemetryListClassName}>
            {copy.telemetryRows.map((row) => (
              <OperatorRailTelemetryRow key={row.key} row={row} />
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function OperatorRailTelemetryRow({
  row,
}: {
  readonly row: PresentationLoginTelemetryRow;
}) {
  const tickClassName =
    row.status === "watch"
      ? labNoirTelemetryTickWatchClassName
      : labNoirTelemetryTickClassName;

  return (
    <li className={labNoirTelemetryRowClassName}>
      <span className={labNoirTelemetryMetricClassName}>{row.metric}</span>
      <span className={labNoirTelemetryReadingClassName}>
        <span>{row.reading}</span>
        <span aria-hidden className={tickClassName}>
          ●
        </span>
      </span>
    </li>
  );
}

function LoginPortalVault({ copy }: { readonly copy: PresentationLoginCopy }) {
  const formId = useId();
  const emailFieldId = `${formId}-email`;
  const passwordFieldId = `${formId}-password`;
  const panelTitleId = `${formId}-panel-title`;

  return (
    <aside aria-labelledby={panelTitleId} className={presentationLabPortalCardClassName}>
      <div aria-hidden className={presentationLabJewelHairlineClassName} />

      {copy.panelLabel ? (
        <p className={presentationLabJewelPanelLabelClassName}>{copy.panelLabel}</p>
      ) : null}

      <h2 className={presentationLabPortalCardTitleClassName} id={panelTitleId}>
        {copy.panelTitle}
      </h2>

      <form
        className={presentationLabPortalFormClassName}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className={loginFieldClassName}>
          <label className={verdantLoginLabelClassName} htmlFor={emailFieldId}>
            {copy.emailLabel}
          </label>
          <input
            autoComplete="email"
            className={verdantLoginInputClassName}
            id={emailFieldId}
            name="email"
            placeholder={copy.emailPlaceholder}
            spellCheck={false}
            type="email"
          />
        </div>

        <div className={loginFieldClassName}>
          <label className={verdantLoginLabelClassName} htmlFor={passwordFieldId}>
            {copy.passwordLabel}
          </label>
          <input
            autoComplete="current-password"
            className={verdantLoginInputClassName}
            id={passwordFieldId}
            name="password"
            placeholder={copy.passwordPlaceholder}
            type="password"
          />
        </div>

        <button className={verdantLoginSubmitClassName} type="submit">
          {copy.submitLabel}
        </button>

        <button className={verdantLoginRecoveryClassName} type="button">
          {copy.recoveryLabel}
        </button>
      </form>
    </aside>
  );
}

function LoginJewel({
  className,
  copy,
  hairlineClassName = presentationLabFloatBoxHairlineClassName,
  inputClassName,
  labelClassName,
  panelLabelClassName,
  recoveryClassName,
  submitClassName,
  titleClassName,
  withHairline = false,
}: {
  readonly className: string;
  readonly copy: PresentationLoginCopy;
  readonly hairlineClassName?: string;
  readonly inputClassName: string;
  readonly labelClassName: string;
  readonly panelLabelClassName?: string;
  readonly recoveryClassName: string;
  readonly submitClassName: string;
  readonly titleClassName: string;
  readonly withHairline?: boolean;
}) {
  const formId = useId();
  const emailFieldId = `${formId}-email`;
  const passwordFieldId = `${formId}-password`;

  return (
    <aside className={className}>
      {copy.panelLabel && panelLabelClassName ? (
        <p className={panelLabelClassName}>{copy.panelLabel}</p>
      ) : null}

      {withHairline ? <div className={hairlineClassName} /> : null}

      <h2 className={titleClassName}>{copy.panelTitle}</h2>

      <form className={loginFormClassName} onSubmit={(event) => event.preventDefault()}>
        <div className={loginFieldClassName}>
          <label className={labelClassName} htmlFor={emailFieldId}>
            {copy.emailLabel}
          </label>
          <input
            autoComplete="email"
            className={inputClassName}
            id={emailFieldId}
            name="email"
            placeholder={copy.emailPlaceholder}
            type="email"
          />
        </div>

        <div className={loginFieldClassName}>
          <label className={labelClassName} htmlFor={passwordFieldId}>
            {copy.passwordLabel}
          </label>
          <input
            autoComplete="current-password"
            className={inputClassName}
            id={passwordFieldId}
            name="password"
            placeholder={copy.passwordPlaceholder}
            type="password"
          />
        </div>

        <button className={submitClassName} type="submit">
          {copy.submitLabel}
        </button>

        <button className={recoveryClassName} type="button">
          {copy.recoveryLabel}
        </button>
      </form>
    </aside>
  );
}
