import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'
import {SITE_URL} from '@/app/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPages = await sanityFetch({
    query: sitemapData,
    perspective: 'published',
    stega: false,
  })
  const sitemap: MetadataRoute.Sitemap = []
  sitemap.push({
    url: SITE_URL,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'monthly',
  })

  if (allPages != null && allPages.data.length != 0) {
    for (const p of allPages.data) {
      if (p.noIndex) continue
      if (p.slug === 'homepage') continue

      const prefix = p._type === 'service' ? '/services' : ''
      sitemap.push({
        url: `${SITE_URL}${prefix}/${p.slug}`,
        lastModified: p._updatedAt || new Date(),
        priority: p._type === 'service' ? 0.7 : 0.8,
        changeFrequency: 'monthly',
      })
    }
  }

  return sitemap
}
