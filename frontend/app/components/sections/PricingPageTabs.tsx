'use client'

import {useState, useEffect} from 'react'
import {FadeIn} from '@/app/components/ui/FadeIn'
import Badge from '@/app/components/ui/Badge'
import ServiceToggle from '@/app/components/pricing/ServiceToggle'
import PricingTierCards from '@/app/components/pricing/PricingTierCards'
import PricingMatrixDisplay from '@/app/components/pricing/PricingMatrixDisplay'
import DaycareCalculator from '@/app/components/pricing/DaycareCalculator'
import BoardingCalculator from '@/app/components/pricing/BoardingCalculator'
import GroomingCalculator from '@/app/components/pricing/GroomingCalculator'
import type {DereferencedLink} from '@/sanity/lib/types'

type ServiceType = 'daycare' | 'boarding' | 'grooming'

type ServiceTab = {
  _key: string
  serviceKey?: ServiceType
  pricingDisplay?: 'table' | 'matrix'
  tableData?: {
    categories?: Array<{
      _key: string
      categoryName?: string
      tiers?: Array<{
        _key: string
        name?: string
        price?: string
        description?: string
        features?: string[]
        highlighted?: boolean
      }>
    }>
    description?: string
  }
  matrixData?: {
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
  }
  showCalculator?: boolean
}

type PricingPageTabsProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    defaultTab?: ServiceType
    services?: ServiceTab[]
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

export default function PricingPageTabs({block}: PricingPageTabsProps) {
  const {eyebrow, heading, description, defaultTab, services, ctaText, ctaLink, taxNote} = block

  const [activeTab, setActiveTab] = useState<ServiceType>(defaultTab || 'daycare')

  // Support URL hash deep linking
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as ServiceType
    if (hash && ['daycare', 'boarding', 'grooming'].includes(hash)) {
      setActiveTab(hash)
    }
  }, [])

  // Update hash on tab change
  const handleTabChange = (service: ServiceType) => {
    setActiveTab(service)
    window.history.replaceState(null, '', `#${service}`)
  }

  const activeService = services?.find((s) => s.serviceKey === activeTab)
  const Calculator = activeTab ? calculators[activeTab] : null

  const resolvedCtaLink = ctaLink
    ? {...ctaLink, queryString: serviceQueryStrings[activeTab]}
    : undefined

  return (
    <section className="bg-cream">
      <div className="px-6 md:px-24 py-16 pt-8 lg:py-24">
        {/* Header */}
        <FadeIn immediate>
          <div className="text-center  pt-20 max-w-4xl mx-auto mb-8 lg:mb-10">
            {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[36px] md:text-[58px] lg:text-[70px] font-semibold tracking-tight leading-[105%] text-forest mb-4">
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

        {/* Service Toggle */}
        <FadeIn delay={0.05}>
          <div className="flex justify-center mb-10 lg:mb-14">
            <ServiceToggle activeService={activeTab} onChange={handleTabChange} />
          </div>
        </FadeIn>

        {/* Pricing Display */}
        <FadeIn delay={0.15} key={activeTab} immediate>
          <div className="mb-12">
            {activeService?.pricingDisplay === 'matrix' && activeService.matrixData ? (
              <>
                {activeService.matrixData.description && (
                  <p className="font-sans text-[14px] md:text-[16px] leading-[150%] text-charcoal/80 text-center max-w-2xl mx-auto mb-10">
                    {activeService.matrixData.description}
                  </p>
                )}
                <PricingMatrixDisplay
                  tables={activeService.matrixData.tables}
                  footnotes={activeService.matrixData.footnotes}
                />
              </>
            ) : activeService?.tableData ? (
              <>
                {activeService.tableData.description && (
                  <p className="font-sans text-[14px] md:text-[16px] leading-[150%] text-charcoal/80 text-center max-w-2xl mx-auto mb-10">
                    {activeService.tableData.description}
                  </p>
                )}
                <PricingTierCards categories={activeService.tableData.categories} />
              </>
            ) : null}
          </div>
        </FadeIn>

        {/* Calculator */}
        {activeService?.showCalculator !== false && Calculator && (
          <div className="bg-forest text-cream rounded-[48px] -mx-3 md:-mx-6 lg:-mx-12">
            <div className="px-6 md:px-16 lg:px-24 py-14 lg:py-20">
              <FadeIn>
                <div className="max-w-2xl mb-8 lg:mb-10">
                  <Badge className="mb-3 !bg-forest-card !text-cream/80 !border-border-dark">
                    Pricing Calculator
                  </Badge>
                  <h3 className="text-[36px] md:text-[48px] font-semibold tracking-tight leading-[105%] text-cream mb-4">
                    Estimate Your Cost
                  </h3>
                </div>
              </FadeIn>
              <FadeIn delay={0.1} key={`calc-${activeTab}`}>
                <Calculator ctaText={ctaText} ctaLink={resolvedCtaLink} taxNote={taxNote} />
              </FadeIn>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
