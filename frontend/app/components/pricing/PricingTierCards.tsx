import {FadeIn} from '@/app/components/ui/FadeIn'

type PricingTierCardsProps = {
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
}

export default function PricingTierCards({categories}: PricingTierCardsProps) {
  if (!categories) return null

  return (
    <>
      {categories.map((category) => (
        <div key={category._key} className="mb-12 last:mb-0">
          {category.categoryName && (
            <FadeIn>
              <h3 className="text-[24px] md:text-[32px] leading-[120%] text-forest mb-6 lg:mb-8 text-center">
                {category.categoryName}
              </h3>
            </FadeIn>
          )}

          {category.tiers && category.tiers.length > 0 && (
            <div
              className={
                category.tiers.length === 1
                  ? 'max-w-md mx-auto'
                  : category.tiers.length === 2
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto'
                    : 'flex flex-wrap justify-center gap-4'
              }
            >
              {category.tiers.map((tier, i) => (
                <div
                  key={tier._key}
                  className={
                    category.tiers && category.tiers.length === 4
                      ? 'w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]'
                      : category.tiers && category.tiers.length >= 3
                        ? 'w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]'
                        : ''
                  }
                >
                <FadeIn delay={0.1 * i}>
                  <div
                    className={`rounded-lg p-6 md:p-8 h-full flex flex-col ${
                      tier.highlighted
                        ? 'bg-forest text-cream ring-2 ring-terracotta'
                        : 'bg-sand/50 text-forest'
                    }`}
                  >
                    {tier.name && (
                      <h4 className="font-sans text-[20px] md:text-[24px] font-medium mb-2">
                        {tier.name}
                      </h4>
                    )}
                    {tier.price && (
                      <p
                        className={`text-[22px] md:text-[26px] font-medium mb-3 ${tier.highlighted ? 'text-terracotta-light' : 'text-terracotta'}`}
                      >
                        {tier.price}
                      </p>
                    )}
                    {tier.description && (
                      <p
                        className={`font-sans text-[14px] md:text-[16px] leading-[150%] mb-4 ${tier.highlighted ? 'text-cream/80' : 'text-charcoal/70'}`}
                      >
                        {tier.description}
                      </p>
                    )}
                    {tier.features && tier.features.length > 0 && (
                      <ul className="mb-6 flex-1 space-y-2">
                        {tier.features.map((feature, fi) => (
                          <li
                            key={fi}
                            className={`font-sans text-[14px] md:text-[16px] flex items-start gap-2 ${tier.highlighted ? 'text-cream/90' : 'text-charcoal/80'}`}
                          >
                            <svg
                              className={`h-5 w-5 shrink-0 mt-0.5 ${tier.highlighted ? 'text-terracotta-light' : 'text-terracotta'}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FadeIn>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
