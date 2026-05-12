import {stegaClean} from '@sanity/client/stega'
import Image from '@/app/components/SanityImage'
import Button from '@/app/components/ui/Button'
import Badge from '@/app/components/ui/Badge'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {DereferencedLink} from '@/sanity/lib/types'

type ExpandingCardsRowProps = {
  block: {
    eyebrow?: string
    heading?: string
    subheading?: string
    cards?: Array<{
      _key: string
      image?: {asset?: {_ref: string}; crop?: any; hotspot?: any}
      title?: string
      subtext?: string
      link?: {buttonText?: string; link?: DereferencedLink}
    }>
    backgroundColor?: 'cream' | 'sand'
  }
  index: number
  pageId: string
  pageType: string
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream',
  sand: 'bg-sand',
}

export default function ExpandingCardsRow({block}: ExpandingCardsRowProps) {
  const {eyebrow, heading, subheading, cards, backgroundColor} = block
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
            {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-forest mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="font-sans text-[16px] lg:text-[18px] leading-[150%] text-text-muted">
                {subheading}
              </p>
            )}
          </div>
        </FadeIn>

        {cards && cards.length > 0 && (
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-4">
              {cards.map((card, i) => (
                <div
                  key={card._key}
                  className="relative overflow-hidden rounded-lg h-[420px] md:h-[520px] md:flex-1 group"
                >
                  {card.image?.asset?._ref && (
                    <Image
                      id={card.image.asset._ref}
                      alt={card.title || ''}
                      width={1200}
                      crop={card.image.crop}
                      hotspot={card.image.hotspot}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

                  <div className="absolute top-5 left-5 w-9 h-9 rounded-full border border-white/80 text-white flex items-center justify-center font-sans font-medium text-[14px] backdrop-blur-sm bg-black/10">
                    {i + 1}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white flex flex-col gap-1">
                    {card.title && (
                      <h3 className="text-[24px] md:text-[28px] font-semibold leading-[110%]">
                        {card.title}
                      </h3>
                    )}
                    {card.subtext && (
                      <p className="font-sans text-[14px] md:text-[15px] leading-[150%] opacity-85 line-clamp-4">
                        {card.subtext}
                      </p>
                    )}
                    {card.link?.buttonText && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          link={card.link.link}
                          className="!w-auto !px-5 !py-2.5 !border !border-white/70 !text-white hover:!bg-white hover:!text-forest whitespace-nowrap !text-[12px]   font-medium"
                        >
                          {card.link.buttonText}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
