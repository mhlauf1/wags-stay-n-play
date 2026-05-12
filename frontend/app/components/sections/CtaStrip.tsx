import Button from '@/app/components/ui/Button'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'

type CtaStripProps = {
  block: {
    heading?: string
    subtext?: string
    cta?: {buttonText?: string; link?: any}
    backgroundColor?: 'cream' | 'sand' | 'forest' | 'terracotta'
  }
  index: number
  pageId: string
  pageType: string
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream text-forest',
  sand: 'bg-sand text-forest',
  forest: 'bg-forest text-cream',
  terracotta: 'bg-terracotta text-white',
}

export default function CtaStrip({block}: CtaStripProps) {
  const {heading, subtext, cta, backgroundColor} = block
  const bg = bgColors[stegaClean(backgroundColor) || 'forest'] || bgColors.forest
  const cleanBg = stegaClean(backgroundColor) || 'forest'
  const isDark = cleanBg === 'forest' || cleanBg === 'terracotta'

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {heading && (
                <h2 className="text-[36px] md:text-[40px] lg:text-[48px] font-semibold tracking-tight leading-[110%]">
                  {heading}
                </h2>
              )}
              {subtext && (
                <p
                  className={`font-sans text-[14px] md:max-w-[84ch] leading-[160%] lg:text-[20px]  mt-2 md:mt-3 ${isDark ? 'opacity-90' : 'text-text-muted'}`}
                >
                  {subtext}
                </p>
              )}
            </div>
            {cta?.buttonText && (
              <Button
                variant={isDark ? 'outline' : 'primary'}
                link={cta.link}
                className={isDark ? '!border-white !text-white hover:!bg-white/10' : ''}
              >
                {cta.buttonText}
              </Button>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
