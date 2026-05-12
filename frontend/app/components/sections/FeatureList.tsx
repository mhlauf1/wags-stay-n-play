import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from 'next-sanity'
import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type FeatureListProps = {
  block: {
    eyebrow?: string
    heading?: string
    features?: Array<{
      _key: string
      title?: string
      body?: PortableTextBlock[]
      image?: {asset?: {_ref: string}; crop?: any; hotspot?: any}
      cta?: {buttonText?: string; link?: any}
    }>
    showNumbers?: boolean
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

export default function FeatureList({block}: FeatureListProps) {
  const {eyebrow, heading, features, showNumbers, backgroundColor} = block
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const numbersVisible = stegaClean(showNumbers) !== false

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="mb-10 lg:mb-14">
            {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-forest">
                {heading}
              </h2>
            )}
          </div>
        </FadeIn>

        {features && features.length > 0 && (
          <div>
            {features.map((feature, i) => {
              const isEven = i % 2 === 0
              return (
                <div
                  key={feature._key}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center border-b border-border-light py-12 lg:py-16 last:border-b-0"
                >
                  {/* Text side */}
                  <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                    <FadeIn>
                      {numbersVisible && (
                        <p className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-3">
                          {String(i + 1).padStart(2, '0')}
                        </p>
                      )}
                      {feature.title && (
                        <h3 className="text-[28px] md:text-[36px] leading-[110%] text-forest mb-4">
                          {feature.title}
                        </h3>
                      )}
                      {feature.body && (
                        <div className="font-sans text-[16px] lg:text-[18px] leading-[150%] text-text-muted mb-6 prose prose-p:mb-3">
                          <PortableText value={feature.body} />
                        </div>
                      )}
                      {feature.cta?.buttonText && (
                        <Button variant="outline" link={feature.cta.link}>
                          {feature.cta.buttonText}
                        </Button>
                      )}
                    </FadeIn>
                  </div>

                  {/* Image side */}
                  <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                    {feature.image?.asset?._ref && (
                      <FadeIn delay={0.1}>
                        <Image
                          id={feature.image.asset._ref}
                          alt={feature.title || ''}
                          width={600}
                          crop={feature.image.crop}
                          hotspot={feature.image.hotspot}
                          className="rounded-lg aspect-[4/3] w-full object-cover"
                        />
                      </FadeIn>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
