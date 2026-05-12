import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-h2 font-heading mb-4 font-semibold tracking-tight">
        Page Not Found
      </h1>
      <p className="text-body text-text-muted mb-8 max-w-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or
        no longer exists.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-[--radius-xl] bg-terracotta px-8 py-3 text-button font-medium text-white transition-colors hover:bg-terracotta-dark"
      >
        Back to Home
      </Link>
    </section>
  )
}
