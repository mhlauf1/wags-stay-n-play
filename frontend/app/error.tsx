'use client'

export default function Error({reset}: {error: Error & {digest?: string}; reset: () => void}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-h2 font-heading mb-4 font-semibold tracking-tight">
        Something Went Wrong
      </h1>
      <p className="text-body text-text-muted mb-8 max-w-md">
        We hit an unexpected error. Please try again, or head back to the homepage.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-[--radius-xl] bg-terracotta px-8 py-3 text-button font-medium text-white transition-colors hover:bg-terracotta-dark"
        >
          Try Again
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-[--radius-xl] border border-forest/20 px-8 py-3 text-button font-medium text-forest transition-colors hover:bg-forest/5"
        >
          Back to Home
        </a>
      </div>
    </section>
  )
}
