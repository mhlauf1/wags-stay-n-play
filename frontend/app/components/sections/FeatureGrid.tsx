'use client'

import {Icon} from '@iconify/react'
import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'

type FeatureGridProps = {
  block: {
    heading?: string
    cta?: {buttonText?: string; link?: any}
    items?: Array<{
      _key: string
      image?: {asset?: {_ref: string}; hotspot?: any; crop?: any}
      icon?: string
      title?: string
      description?: string
    }>
    columns?: number
    backgroundColor?: 'cream' | 'sand' | 'forest' | 'black'
  }
  index: number
  pageId: string
  pageType: string
}

const columnClasses: Record<number, string> = {
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const colorMap: Record<
  string,
  {section: string; card: string; cardBorder: string; heading: string; muted: string}
> = {
  cream: {
    section: 'bg-cream text-forest',
    card: 'bg-white',
    cardBorder: 'border-border-light',
    heading: 'text-forest',
    muted: 'text-text-muted',
  },
  sand: {
    section: 'bg-sand text-forest',
    card: 'bg-cream',
    cardBorder: 'border-border-light',
    heading: 'text-forest',
    muted: 'text-text-muted',
  },
  forest: {
    section: 'bg-forest text-cream',
    card: 'bg-forest-card',
    cardBorder: 'border-border-dark',
    heading: 'text-sand',
    muted: 'text-text-muted-dark',
  },
  black: {
    section: 'bg-black text-cream',
    card: 'bg-black-card',
    cardBorder: 'border-border-black',
    heading: 'text-sand',
    muted: 'text-text-muted-dark',
  },
}

export default function FeatureGrid({block}: FeatureGridProps) {
  const {heading, cta, items, columns, backgroundColor} = block
  const cols = stegaClean(columns) || 3
  const gridClass = columnClasses[cols] || columnClasses[3]
  const colors = colorMap[stegaClean(backgroundColor) || 'cream'] || colorMap.cream

  return (
    <section className={`${colors.section} rounded-[48px]`}>
      <div className="px-6 md:px-16 lg:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-10 lg:mb-14">
            {heading && (
              <h2
                className={`text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] ${colors.heading}`}
              >
                {heading}
              </h2>
            )}
            {cta?.buttonText && (
              <div className="shrink-0">
                <Button variant="primary" link={cta.link}>
                  {cta.buttonText}
                </Button>
              </div>
            )}
          </div>
        </FadeIn>

        {items && items.length > 0 && (
          <div className={`grid ${gridClass} gap-3`}>
            {items.map((item, i) => (
              <FadeIn key={item._key} delay={0.05 * i}>
                <div
                  className={`${colors.card} border ${colors.cardBorder} rounded-md p-6 md:p-8 h-full flex flex-col items-center text-center`}
                >
                  {item.image?.asset?._ref ? (
                    <div className="mb-6 w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        id={item.image.asset._ref}
                        hotspot={item.image.hotspot}
                        crop={item.image.crop}
                        alt={item.title || ''}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : item.icon ? (
                    <div className={`mb-6 ${colors.muted}`}>
                      <Icon icon={item.icon} width={42} height={42} />
                    </div>
                  ) : null}
                  {item.title && (
                    <h3
                      className={`text-[18px] md:text-[20px] leading-[120%] ${colors.heading} mb-2`}
                    >
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p
                      className={`font-sans text-[14px] md:text-[16px] leading-[150%] ${colors.muted}`}
                    >
                      {item.description}
                    </p>
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
