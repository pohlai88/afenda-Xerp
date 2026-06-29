"use client";

import "./globals.css";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <main className="erp-route-error-page">
          <div className="erp-route-error__panel">
            <h1 className="erp-route-error__title">Application error</h1>
            <p className="erp-route-error__description">
              A critical error occurred while loading the application. Please
              try again.
            </p>
            {process.env.NODE_ENV === "development" && error.message ? (
              <p className="erp-route-error__description">{error.message}</p>
            ) : null}
            <div className="erp-route-error__actions">
              <button
                className="erp-system-admin-audit-table__page-btn"
                onClick={reset}
                type="button"
              >
                Try again
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
