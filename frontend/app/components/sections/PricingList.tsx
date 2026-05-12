'use client'

import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type PricingListProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    items?: Array<{
      _key: string
      service?: string
      price?: string
      note?: string
    }>
    columns?: number
    backgroundColor?: 'cream' | 'sand'
  }
  index: number
  pageId: string
  pageType: string
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream text-forest',
  sand: 'bg-sand text-forest',
}

export default function PricingList({block}: PricingListProps) {
  const {eyebrow, heading, description, items, columns, backgroundColor} = block
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isTwoCol = stegaClean(columns) === 2

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-forest mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p className="font-sans text-[16px] md:text-[18px] leading-[150%] text-charcoal/80">
                {description}
              </p>
            )}
          </div>
        </FadeIn>

        {items && items.length > 0 && (
          <div
            className={`max-w-4xl mx-auto ${isTwoCol ? 'grid grid-cols-1 lg:grid-cols-2 gap-x-12' : ''}`}
          >
            {items.map((item, i) => (
              <FadeIn key={item._key} delay={0.03 * i}>
                <div className="flex flex-col border-b border-charcoal/10 py-3">
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="font-sans text-[15px] md:text-[17px] font-medium text-forest">
                      {item.service}
                    </span>
                    <span className="shrink-0 border-b border-dotted border-charcoal/20 flex-1 mx-2 mb-1" />
                    {item.price && (
                      <span className="font-sans text-[16px] md:text-[18px] font-medium text-terracotta shrink-0">
                        {item.price}
                      </span>
                    )}
                  </div>
                  {item.note && (
                    <p className="font-sans text-[13px] text-charcoal/50 mt-0.5">{item.note}</p>
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
