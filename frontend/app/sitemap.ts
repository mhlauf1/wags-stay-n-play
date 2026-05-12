import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'
import {headers} from 'next/headers'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPages = await sanityFetch({
    query: sitemapData,
  })
  const headersList = await headers()
  const sitemap: MetadataRoute.Sitemap = []
  const host = headersList.get('host') as string
  const domain = host.startsWith('http') ? host : `https://${host}`
  sitemap.push({
    url: domain,
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
        url: `${domain}${prefix}/${p.slug}`,
        lastModified: p._updatedAt || new Date(),
        priority: p._type === 'service' ? 0.7 : 0.8,
        changeFrequency: 'monthly',
      })
    }
  }

  return sitemap
}
