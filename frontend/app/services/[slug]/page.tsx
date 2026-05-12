import type {Metadata} from 'next'

import PageBuilderPage from '@/app/components/PageBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {getServiceQuery, serviceSlugs} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: serviceSlugs,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {data: service} = await sanityFetch({
    query: getServiceQuery,
    params,
    stega: false,
  })

  const seo = service?.seo
  const ogImage = resolveOpenGraphImage(seo?.ogImage)

  return {
    title: seo?.metaTitle || service?.title,
    description: seo?.metaDescription || service?.heading || service?.shortDescription,
    ...(ogImage && {openGraph: {images: [ogImage]}}),
    ...(seo?.noIndex && {robots: {index: false, follow: true}}),
    alternates: {canonical: `/services/${params.slug}`},
  } satisfies Metadata
}

export default async function ServicePage(props: Props) {
  const params = await props.params
  const [{data: service}] = await Promise.all([sanityFetch({query: getServiceQuery, params})])

  if (!service?._id) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-[36px] mb-4">Service not found</h1>
        <p className="font-sans text-text-muted">This service doesn&apos;t exist yet.</p>
      </div>
    )
  }

  return <PageBuilderPage page={service} />
}
