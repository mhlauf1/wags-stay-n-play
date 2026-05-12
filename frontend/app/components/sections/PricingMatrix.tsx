'use client'

import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'
import PricingMatrixDisplay from '@/app/components/pricing/PricingMatrixDisplay'

type PricingMatrixProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    tables?: Array<{
      _key: string
      tableName?: string
      tableDescription?: string
      columnHeaders?: string[]
      rows?: Array<{
        _key: string
        rowLabel?: string
        cells?: Array<{
          _key: string
          value?: string
          note?: string
        }>
      }>
    }>
    footnotes?: string[]
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

export default function PricingMatrix({block}: PricingMatrixProps) {
  const {eyebrow, heading, description, tables, footnotes, backgroundColor} = block
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream

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

        <PricingMatrixDisplay tables={tables} footnotes={footnotes} />
      </div>
    </section>
  )
}
