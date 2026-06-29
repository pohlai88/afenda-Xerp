"use client";

interface RootErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <main className="erp-route-error-page">
      <div className="erp-route-error__panel">
        <h1 className="erp-route-error__title">Something went wrong</h1>
        <p className="erp-route-error__description">
          We could not complete your request. Please try again.
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
  );
}
