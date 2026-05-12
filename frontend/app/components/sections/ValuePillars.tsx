'use client'

import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Image from '@/app/components/SanityImage'
import Badge from '../ui/Badge'

type ValuePillarsProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    pillars?: Array<{
      _key: string
      metric?: string
      title?: string
      description?: string
    }>
    columns?: number
    accentImage?: {asset?: {_ref: string}; alt?: string}
    backgroundColor?: 'cream' | 'sand' | 'forest'
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

const sectionColors: Record<
  string,
  {section: string; card: string; heading: string; muted: string; eyebrow: string; metric: string}
> = {
  cream: {
    section: 'bg-cream text-forest',
    card: 'bg-white border border-border-light',
    heading: 'text-forest',
    muted: 'text-text-muted',
    eyebrow: 'text-terracotta',
    metric: 'text-terracotta',
  },
  sand: {
    section: 'bg-sand text-forest',
    card: 'bg-cream border border-border-light',
    heading: 'text-forest',
    muted: 'text-text-muted',
    eyebrow: 'text-terracotta',
    metric: 'text-terracotta',
  },
  forest: {
    section: 'bg-forest text-cream',
    card: 'bg-forest-card border border-border-dark',
    heading: 'text-sand',
    muted: 'text-text-muted-dark',
    eyebrow: 'text-terracotta-light',
    metric: 'text-terracotta-light',
  },
}

export default function ValuePillars({block}: ValuePillarsProps) {
  const {eyebrow, heading, description, pillars, columns, accentImage, backgroundColor} = block
  const cols = stegaClean(columns) || 4
  const gridClass = columnClasses[cols] || columnClasses[4]
  const colors = sectionColors[stegaClean(backgroundColor) || 'sand'] || sectionColors.sand

  return (
    <section className={`${colors.section}`}>
      <div className="px-6 md:px-16 lg:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="text-center flex flex-col items-center mb-10 lg:mb-18 max-w-3xl mx-auto">
            {eyebrow && (
              <FadeIn>
                <Badge className="mb-3">{eyebrow}</Badge>
              </FadeIn>
            )}
            {heading && (
              <h2
                className={`text-[36px] md:text-[48px] lg:text-[56px] max-w-[16ch] font-semibold tracking-tight leading-[105%] ${colors.heading}`}
              >
                {heading}
              </h2>
            )}
            {description && (
              <p
                className={`font-sans text-[16px] lg:text-[18px]  leading-[150%] ${colors.muted} mt-4 md:mt-6`}
              >
                {description}
              </p>
            )}
          </div>
        </FadeIn>

        {pillars && pillars.length > 0 && (
          <div className={`grid ${gridClass} gap-4`}>
            {pillars.map((pillar, i) => (
              <FadeIn key={pillar._key} delay={0.05 * i}>
                <div
                  className={`${colors.card} rounded-md p-6 md:p-8 h-full flex flex-col items-center text-center`}
                >
                  {pillar.metric && (
                    <p
                      className={`font-heading text-[40px] md:text-[48px] lg:text-[56px]  tracking-tight font-semibold leading-[100%] ${colors.metric} mb-3`}
                    >
                      {pillar.metric}
                    </p>
                  )}
                  {pillar.title && (
                    <h3
                      className={`text-[18px] md:text-[20px] leading-[120%] ${colors.heading} mb-2`}
                    >
                      {pillar.title}
                    </h3>
                  )}
                  {pillar.description && (
                    <p
                      className={`font-sans text-[14px] md:text-[16px]  leading-[150%] ${colors.muted}`}
                    >
                      {pillar.description}
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {accentImage?.asset?._ref && (
          <FadeIn>
            <div className="flex justify-center mt-8 lg:mt-12">
              <Image
                id={accentImage.asset._ref}
                alt={accentImage.alt || ''}
                width={200}
                className="w-[50px] lg:w-[60px]"
              />
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
