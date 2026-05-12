'use client'

import {useState} from 'react'
import {FadeIn} from '@/app/components/ui/FadeIn'
import Badge from '@/app/components/ui/Badge'
import DaycareCalculator from '@/app/components/pricing/DaycareCalculator'
import BoardingCalculator from '@/app/components/pricing/BoardingCalculator'
import GroomingCalculator from '@/app/components/pricing/GroomingCalculator'
import ServiceToggle from '@/app/components/pricing/ServiceToggle'
import type {DereferencedLink} from '@/sanity/lib/types'

type ServiceType = 'daycare' | 'boarding' | 'grooming'

type PricingCalculatorProps = {
  block: {
    eyebrow?: string
    heading?: string
    subheading?: string
    displayMode?: 'single' | 'tabbed'
    calculatorType?: ServiceType
    ctaText?: string
    ctaLink?: DereferencedLink
    taxNote?: string
  }
  index: number
  pageId: string
  pageType: string
}

const calculators = {
  daycare: DaycareCalculator,
  boarding: BoardingCalculator,
  grooming: GroomingCalculator,
} as const

const serviceQueryStrings: Record<ServiceType, string> = {
  daycare: '?service=Daycare',
  boarding: '?service=Boarding',
  grooming: '?service=Grooming',
}

export default function PricingCalculator({block}: PricingCalculatorProps) {
  const {eyebrow, heading, subheading, displayMode, calculatorType, ctaText, ctaLink, taxNote} =
    block
  const isTabbed = displayMode === 'tabbed'

  const [activeTab, setActiveTab] = useState<ServiceType>('daycare')

  // In single mode, use calculatorType; in tabbed mode, use activeTab
  const activeService = isTabbed ? activeTab : calculatorType
  const Calculator = activeService ? calculators[activeService] : null

  // In tabbed mode, override the ctaLink queryString per tab
  const resolvedCtaLink =
    isTabbed && ctaLink ? {...ctaLink, queryString: serviceQueryStrings[activeTab]} : ctaLink

  return (
    <section
      id="calculator"
      className="bg-forest mb-12 md:mb-20 text-cream rounded-[48px] mx-3 md:mx-6"
    >
      <div className="px-6 md:px-16 lg:px-24 py-14 lg:py-20">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 lg:mb-10">
            <div className="max-w-2xl">
              {eyebrow && (
                <Badge className="mb-3 md:text-[14px] !bg-forest-card !text-cream/80 !border-border-dark">
                  {eyebrow}
                </Badge>
              )}
              {heading && (
                <h2 className="text-[36px] md:text-[48px] lg:text-[68px] font-semibold tracking-tight leading-[105%] text-cream mb-4">
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className="font-sans text-[16px] md:text-[20px] leading-[150%] text-cream/90">
                  {subheading}
                </p>
              )}
            </div>
            {isTabbed && (
              <p className="font-sans text-[14px] md:text-[15px] text-cream/50 italic lg:text-right lg:shrink-0 flex items-center gap-2">
                View all daycare, boarding & grooming pricing details below
                <svg
                  className="w-4 h-4 shrink-0 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                  />
                </svg>
              </p>
            )}
          </div>
        </FadeIn>

        {/* Service Toggle (tabbed mode only) */}
        {isTabbed && (
          <FadeIn delay={0.05}>
            <div className="mb-8">
              <ServiceToggle activeService={activeTab} onChange={setActiveTab} />
            </div>
          </FadeIn>
        )}

        {/* Calculator */}
        <FadeIn delay={isTabbed ? 0.15 : 0.1} key={isTabbed ? activeTab : calculatorType}>
          {Calculator ? (
            <Calculator ctaText={ctaText} ctaLink={resolvedCtaLink} taxNote={taxNote} />
          ) : (
            <p className="font-sans text-cream/50">No calculator type selected.</p>
          )}
        </FadeIn>
      </div>
    </section>
  )
}
