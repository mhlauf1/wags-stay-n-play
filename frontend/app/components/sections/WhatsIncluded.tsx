'use client'

import {Icon} from '@iconify/react'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'
import TextLogo from '@/app/components/TextLogo'

type WhatsIncludedProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    items?: Array<{
      _key: string
      icon?: string
      title?: string
      description?: string
    }>
    layout?: 'card' | 'inline'
    columns?: number
    backgroundColor?: 'cream' | 'sand' | 'forest'
    iconColor?: 'terracotta' | 'forest' | 'muted'
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
  {section: string; card: string; heading: string; muted: string; eyebrow: string}
> = {
  cream: {
    section: 'bg-cream text-forest',
    card: 'bg-white border border-border-light',
    heading: 'text-forest',
    muted: 'text-text-muted',
    eyebrow: 'text-terracotta',
  },
  sand: {
    section: 'bg-sand text-forest',
    card: 'bg-cream border border-border-light',
    heading: 'text-forest',
    muted: 'text-text-muted',
    eyebrow: 'text-terracotta',
  },
  forest: {
    section: 'bg-forest text-cream',
    card: 'bg-forest-card border border-border-dark',
    heading: 'text-sand',
    muted: 'text-text-muted-dark',
    eyebrow: 'text-terracotta-light',
  },
}

const iconStyles: Record<string, string> = {
  terracotta: 'bg-terracotta-light/30 text-forest',
  forest: 'bg-sage/30 text-forest',
  muted: 'bg-charcoal/10 text-text-muted',
}

export default function WhatsIncluded({block}: WhatsIncludedProps) {
  const {eyebrow, heading, description, items, layout, columns, backgroundColor, iconColor} = block
  const cleanLayout = stegaClean(layout) || 'card'
  const cols = stegaClean(columns) || 3
  const gridClass = columnClasses[cols] || columnClasses[3]
  const colors = sectionColors[stegaClean(backgroundColor) || 'cream'] || sectionColors.cream
  const iconStyle = iconStyles[stegaClean(iconColor) || 'terracotta'] || iconStyles.terracotta

  return (
    <section className={`${colors.section} ]`}>
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
                className={`text-[40px] md:text-[54px] lg:text-[68px] leading-[105%] font-semibold tracking-tight  md:max-w-[18ch] text-center ${colors.heading}`}
              >
                {heading}
              </h2>
            )}
            {description && (
              <p
                className={`font-sans text-[16px] lg:text-[20px]  leading-[150%] ${colors.muted} mt-4 md:mt-6`}
              >
                {description}
              </p>
            )}
          </div>
        </FadeIn>

        {items && items.length > 0 && (
          <div className={`grid ${gridClass} gap-4`}>
            {items.map((item, i) => (
              <FadeIn key={item._key} delay={0.05 * i}>
                {cleanLayout === 'card' ? (
                  <div
                    className={`${colors.card} rounded-md p-6 md:p-8 h-full flex flex-col items-center text-center`}
                  >
                    {item.icon && (
                      <div
                        className={`w-12 h-12 rounded-md flex items-center justify-center mb-4 ${iconStyle}`}
                      >
                        <Icon icon={item.icon} width={28} height={28} />
                      </div>
                    )}
                    {item.title && (
                      <h3
                        className={`text-[20px] md:text-[24px] leading-[120%] ${colors.heading} mb-2`}
                      >
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p
                        className={`font-sans text-[16px] md:text-[18px]  leading-[150%] ${colors.muted}`}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-4 h-full">
                    {item.icon && (
                      <div
                        className={`w-12 h-12 rounded-md flex items-center justify-center shrink-0 ${iconStyle}`}
                      >
                        <Icon icon={item.icon} width={28} height={28} />
                      </div>
                    )}
                    <div>
                      {item.title && (
                        <h3
                          className={`text-[18px] md:text-[20px] leading-[120%] ${colors.heading} mb-1`}
                        >
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p
                          className={`font-sans text-[14px] md:text-[16px]  leading-[150%] ${colors.muted}`}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </FadeIn>
            ))}
          </div>
        )}

        <FadeIn>
          <div className="flex justify-center mt-12 lg:mt-16">
            <TextLogo />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
