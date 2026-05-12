import {FadeIn} from '@/app/components/ui/FadeIn'
import Badge from '../ui/Badge'
import PricingTierCards from '@/app/components/pricing/PricingTierCards'

type PricingTableProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
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
        cta?: {buttonText?: string; link?: any}
      }>
    }>
  }
  index: number
  pageId: string
  pageType: string
}

export default function PricingTable({block}: PricingTableProps) {
  const {eyebrow, heading, description, categories} = block

  return (
    <section className="bg-cream">
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

        <PricingTierCards categories={categories} />
      </div>
    </section>
  )
}
