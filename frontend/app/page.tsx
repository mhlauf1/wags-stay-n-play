import type {Metadata} from 'next'

import PageBuilder from '@/app/components/PageBuilder'
import {homepageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const {data: page} = await sanityFetch({
    query: homepageQuery,
    stega: false,
  })

  const seo = page?.seo
  if (!seo) return {}

  const ogImage = resolveOpenGraphImage(seo.ogImage)

  return {
    ...(seo.metaTitle && {title: seo.metaTitle}),
    ...(seo.metaDescription && {description: seo.metaDescription}),
    ...(ogImage && {openGraph: {images: [ogImage]}}),
    ...(seo.noIndex && {robots: {index: false, follow: true}}),
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
        <h1 className="font-heading text-[36px] mb-4">Welcome to Kingdom Canine</h1>
        <p className="font-sans text-text-muted text-[18px]">
          No homepage has been created yet. Create a page in Sanity Studio with slug
          &ldquo;homepage&rdquo; and add sections to the page builder.
        </p>
      </div>
    )
  }

  return <PageBuilder page={page} />
}
