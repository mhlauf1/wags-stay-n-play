import {Icon} from '@iconify/react'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type HeroMinimalProps = {
  block: {
    eyebrow?: string
    rating?: string
    heading?: string
    headingAccent?: string
    subtext?: string
    backgroundColor?: 'cream' | 'sand' | 'forest'
  }
  index: number
  pageId: string
  pageType: string
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream text-forest',
  sand: 'bg-sand text-forest',
  forest: 'bg-forest text-cream',
}

export default function HeroMinimal({block}: HeroMinimalProps) {
  const {eyebrow, rating, heading, headingAccent, subtext, backgroundColor} = block
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isDark = stegaClean(backgroundColor) === 'forest'

  return (
    <section className={`${bg}  pt-18 min-h-[50vh] md:min-h-[50vh] flex items-end justify-center`}>
      <div className="px-6 md:px-24 pb-6 lg:pb-8 pt-24 text-center w-full">
        <div className="max-w-7xl mx-auto">
          {eyebrow && (
            <FadeIn>
              {rating ? (
                <div className="relative overflow-hidden max-w-[280px] border border-terracotta/20 bg-white rounded-full py-1.5 px-3 mb-3 mx-auto">
                  <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                  <div className="flex animate-ticker whitespace-nowrap w-max">
                    {[0, 1].map((copy) => (
                      <div key={copy} className="flex items-center shrink-0">
                        <span className="font-sans text-[12px] font-medium text-terracotta-dark px-3">
                          {eyebrow}
                        </span>
                        <span className="text-terracotta-dark/30">|</span>
                        <div className="flex items-center gap-1 px-3">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Icon key={i} icon="mdi:star" className="w-3 h-3 text-gold" />
                            ))}
                          </div>
                          <span className="font-sans text-[12px] font-medium text-terracotta-dark">
                            {rating} Stars
                          </span>
                        </div>
                        <span className="text-terracotta/30">|</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Badge className="mb-3">{eyebrow}</Badge>
              )}
            </FadeIn>
          )}
          {heading && (
            <FadeIn delay={0.05}>
              <h1 className="text-[48px] tracking-tight font-semibold md:text-[56px] lg:text-[72px] xl:text-[84px]  leading-[104%]">
                {heading}
              </h1>
            </FadeIn>
          )}
          {headingAccent && (
            <FadeIn delay={0.1}>
              <span
                className={`text-[48px] font-medium md:text-[56px] lg:text-[72px] xl:text-[84px] tracking-tighter  leading-[110%]  ${isDark ? 'text-terracotta-light' : 'text-terracotta'}`}
              >
                {headingAccent}
              </span>
            </FadeIn>
          )}
          {subtext && (
            <FadeIn delay={0.15}>
              <p
                className={`font-sans text-[16px] lg:text-[18px]  leading-[150%] mt-6 max-w-3xl mx-auto ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
              >
                {subtext}
              </p>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}
