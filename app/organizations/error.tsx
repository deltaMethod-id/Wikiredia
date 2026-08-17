"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-container">
      <div className="error-state">
        <h1>Something went wrong</h1>

        <p>
          We couldn't load your organizations.
        </p>

        <button
          type="button"
          className="button"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
