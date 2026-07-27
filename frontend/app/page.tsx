import type {Metadata} from 'next'

import PageBuilder from '@/app/components/PageBuilder'
import {homepageQuery, settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [{data: page}, {data: settings}] = await Promise.all([
    sanityFetch({query: homepageQuery, stega: false}),
    sanityFetch({query: settingsQuery, stega: false}),
  ])

  const seo = page?.seo
  const siteTitle = settings?.title || 'Wags Stay N Play'
  // The root layout's title.template only applies to child segments, so the
  // brand suffix must be appended here explicitly
  const ogImage = resolveOpenGraphImage(seo?.ogImage) || resolveOpenGraphImage(settings?.ogImage)

  return {
    ...(seo?.metaTitle && {title: `${seo.metaTitle} | ${siteTitle}`}),
    ...(seo?.metaDescription && {description: seo.metaDescription}),
    openGraph: {
      url: '/',
      ...(ogImage && {images: [ogImage]}),
    },
    ...(seo?.noIndex && {robots: {index: false, follow: true}}),
    alternates: {canonical: '/'},
  }
}

export default async function Page() {
  const {data: page} = await sanityFetch({
    query: homepageQuery,
  })

  if (!page) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-[36px] mb-4">Welcome to Wags Stay N Play</h1>
        <p className="font-sans text-text-muted text-[18px]">
          No homepage has been created yet. Create a page in Sanity Studio with slug
          &ldquo;homepage&rdquo; and add sections to the page builder.
        </p>
      </div>
    )
  }

  return <PageBuilder page={page} />
}
