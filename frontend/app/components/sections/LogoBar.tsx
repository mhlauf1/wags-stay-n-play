'use client'

import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'

type LogoBarProps = {
  block: {
    heading?: string
    logos?: Array<{
      _key: string
      image?: {asset?: {_ref: string}}
      alt?: string
      url?: string
    }>
    displayMode?: 'grid' | 'marquee'
    backgroundColor?: 'cream' | 'sand' | 'white'
  }
  index: number
  pageId: string
  pageType: string
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream',
  sand: 'bg-sand',
  white: 'bg-white',
}

export default function LogoBar({block}: LogoBarProps) {
  const {heading, logos, displayMode, backgroundColor} = block
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isMarquee = stegaClean(displayMode) === 'marquee'

  if (!logos || logos.length === 0) return null

  const renderLogo = (logo: (typeof logos)[0], index: number) => {
    const img = logo.image?.asset?._ref ? (
      <Image
        id={logo.image.asset._ref}
        alt={logo.alt || ''}
        width={160}
        className="h-8 lg:h-10 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
      />
    ) : null

    if (!img) return null

    if (logo.url) {
      return (
        <a
          key={`${logo._key}-${index}`}
          href={logo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          {img}
        </a>
      )
    }

    return (
      <div key={`${logo._key}-${index}`} className="shrink-0">
        {img}
      </div>
    )
  }

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-12 lg:py-16">
        {heading && (
          <FadeIn>
            <p className="font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-charcoal/50 text-center mb-8">
              {heading}
            </p>
          </FadeIn>
        )}

        {isMarquee ? (
          <div className="overflow-hidden">
            <div className="flex animate-marquee">
              <div className="flex items-center gap-8 lg:gap-12 shrink-0 pr-8 lg:pr-12">
                {logos.map((logo, i) => renderLogo(logo, i))}
              </div>
              <div className="flex items-center gap-8 lg:gap-12 shrink-0 pr-8 lg:pr-12">
                {logos.map((logo, i) => renderLogo(logo, i + logos.length))}
              </div>
            </div>
          </div>
        ) : (
          <FadeIn>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {logos.map((logo, i) => renderLogo(logo, i))}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
