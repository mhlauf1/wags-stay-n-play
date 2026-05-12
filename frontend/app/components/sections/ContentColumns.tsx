import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from 'next-sanity'
import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type ContentColumnsProps = {
  block: {
    eyebrow?: string
    heading?: string
    columns?: Array<{
      _key: string
      image?: {asset?: {_ref: string}; crop?: any; hotspot?: any}
      heading?: string
      body?: PortableTextBlock[]
      cta?: {buttonText?: string; link?: any}
    }>
    layout?: number
    backgroundColor?: 'cream' | 'sand'
  }
  index: number
  pageId: string
  pageType: string
}

const layoutClasses: Record<number, string> = {
  2: 'grid-cols-1 lg:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream',
  sand: 'bg-sand',
}

export default function ContentColumns({block}: ContentColumnsProps) {
  const {eyebrow, heading, columns, layout, backgroundColor} = block
  const cols = stegaClean(layout) || 2
  const gridClass = layoutClasses[cols] || layoutClasses[2]
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        {(eyebrow || heading) && (
          <FadeIn>
            <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
              {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
              {heading && (
                <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-forest">
                  {heading}
                </h2>
              )}
            </div>
          </FadeIn>
        )}

        {columns && columns.length > 0 && (
          <div className={`grid ${gridClass} gap-8 lg:gap-12`}>
            {columns.map((col, i) => (
              <FadeIn key={col._key} delay={0.05 * i}>
                <div>
                  {col.image?.asset?._ref && (
                    <Image
                      id={col.image.asset._ref}
                      alt={col.heading || ''}
                      width={500}
                      crop={col.image.crop}
                      hotspot={col.image.hotspot}
                      className="rounded-lg aspect-[4/3] w-full object-cover mb-6"
                    />
                  )}
                  {col.heading && (
                    <h3 className="text-[24px] md:text-[28px] leading-[120%] text-forest mb-3">
                      {col.heading}
                    </h3>
                  )}
                  {col.body && (
                    <div className="font-sans text-[16px] lg:text-[18px] leading-[150%] text-text-muted mb-4 prose prose-p:mb-3">
                      <PortableText value={col.body} />
                    </div>
                  )}
                  {col.cta?.buttonText && (
                    <Button variant="outline" link={col.cta.link}>
                      {col.cta.buttonText}
                    </Button>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
