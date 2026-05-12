import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type ServiceCardsProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    cards?: Array<{
      _key: string
      image?: {asset?: {_ref: string}; crop?: any; hotspot?: any}
      title?: string
      description?: string
      cta?: {buttonText?: string; link?: any}
    }>
    variant?: 'white' | 'imageOverlay'
    columns?: number
    backgroundColor?: 'cream' | 'sand'
  }
  index: number
  pageId: string
  pageType: string
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream',
  sand: 'bg-sand',
}

export default function ServiceCards({block}: ServiceCardsProps) {
  const {eyebrow, heading, description, cards, variant, columns, backgroundColor} = block
  const cols = stegaClean(columns) || 3
  const gridClass = columnClasses[cols] || columnClasses[3]
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isOverlay = stegaClean(variant) === 'imageOverlay'

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="text-center mb-10 lg:mb-14 max-w-3xl mx-auto">
            {eyebrow && <Badge className="md:text-[14px] mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[40px] md:text-[52px] lg:text-[68px] font-semibold tracking-tight leading-[105%] text-forest mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p className="font-sans text-[16px] lg:text-[20px] leading-[150%] text-text-muted">
                {description}
              </p>
            )}
          </div>
        </FadeIn>

        {cards && cards.length > 0 && !isOverlay && (
          <div className={`grid ${gridClass} gap-6`}>
            {cards.map((card, i) => (
              <FadeIn key={card._key} delay={0.05 * i}>
                <div className="bg-white rounded-lg overflow-hidden border border-border-light h-full flex flex-col hover:shadow-card-hover transition-shadow">
                  {card.image?.asset?._ref && (
                    <Image
                      id={card.image.asset._ref}
                      alt={card.title || ''}
                      width={400}
                      crop={card.image.crop}
                      hotspot={card.image.hotspot}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {card.title && (
                      <h3 className="text-[20px] md:text-[24px] leading-[120%] text-forest mb-2">
                        {card.title}
                      </h3>
                    )}
                    {card.description && (
                      <p className="font-sans text-[16px] md:text-[18px] leading-[150%] text-text-muted mb-4 flex-1">
                        {card.description}
                      </p>
                    )}
                    {card.cta?.buttonText && (
                      <Button
                        variant="outline"
                        link={card.cta.link}
                        className="!px-0 !py-0 !border-0 !justify-start text-terracotta hover:!bg-transparent hover:opacity-70"
                      >
                        {card.cta.buttonText} &rarr;
                      </Button>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {cards && cards.length > 0 && isOverlay && (
          <div className={`grid ${gridClass} gap-4`}>
            {cards.map((card, i) => (
              <FadeIn key={card._key} delay={0.05 * i}>
                <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] h-full bg-forest">
                  {card.image?.asset?._ref && (
                    <Image
                      id={card.image.asset._ref}
                      alt={card.title || ''}
                      width={600}
                      crop={card.image.crop}
                      hotspot={card.image.hotspot}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {/* Gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                  {/* Numbered badge */}
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center font-sans text-sm font-semibold text-forest">
                    {i + 1}
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-7 text-cream">
                    {card.title && (
                      <h3 className="text-[24px] md:text-[28px] lg:text-[30px] leading-[110%] font-semibold mb-2">
                        {card.title}
                      </h3>
                    )}
                    {card.description && (
                      <p className="font-sans text-[16px] lg:text-[18px] leading-[150%] text-cream/90 mb-4 line-clamp-4">
                        {card.description}
                      </p>
                    )}
                    {card.cta?.buttonText && (
                      <div>
                        <Button
                          variant="primary"
                          link={card.cta.link}
                          className="!px-4 !py-2 !text-sm"
                        >
                          {card.cta.buttonText}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
