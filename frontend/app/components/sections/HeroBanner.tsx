import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type HeroBannerProps = {
  block: {
    eyebrow?: string
    heading?: string
    subtext?: string
    primaryCta?: {buttonText?: string; link?: any}
    backgroundImage?: {asset?: {_ref: string}; crop?: any; hotspot?: any}
    overlayOpacity?: 'light' | 'medium' | 'heavy'
    minHeight?: 'standard' | 'tall' | 'fullscreen'
    backgroundColor?: 'cream' | 'sand' | 'forest'
  }
  index: number
  pageId: string
  pageType: string
}

const overlayClasses: Record<string, string> = {
  light: 'from-black/30 to-black/10',
  medium: 'from-black/50 to-black/20',
  heavy: 'from-black/70 to-black/40',
}

const bgColors: Record<string, { bg: string; text: string; subtext: string }> = {
  cream: { bg: 'bg-cream', text: 'text-forest', subtext: 'text-text-muted' },
  sand: { bg: 'bg-sand', text: 'text-forest', subtext: 'text-text-muted' },
  forest: { bg: 'bg-forest', text: 'text-cream', subtext: 'text-cream/80' },
}

const heightClasses: Record<string, string> = {
  standard: 'min-h-[60vh]',
  tall: 'min-h-[80vh]',
  fullscreen: 'min-h-screen',
}

export default function HeroBanner({block, index}: HeroBannerProps) {
  const {eyebrow, heading, subtext, primaryCta, backgroundImage, overlayOpacity, minHeight, backgroundColor} = block
  const overlay = overlayClasses[stegaClean(overlayOpacity) || 'medium'] || overlayClasses.medium
  const height = heightClasses[stegaClean(minHeight) || 'standard'] || heightClasses.standard
  const hasImage = !!backgroundImage?.asset?._ref
  const colorKey = stegaClean(backgroundColor) || 'cream'
  const colors = bgColors[colorKey] || bgColors.cream
  const isFirst = index === 0
  const Wrap = isFirst
    ? ({children, className}: {children: React.ReactNode; className?: string; delay?: number}) => <div className={className}>{children}</div>
    : FadeIn


  return (
    <section
      className={`relative  pt-18 ${height} flex items-center justify-center overflow-hidden ${!hasImage ? colors.bg : ''}`}
    >
      {/* Background image */}
      {hasImage && (
        <div className="absolute inset-0">
          <Image
            id={backgroundImage.asset!._ref}
            alt=""
            width={1400}
            crop={backgroundImage!.crop}
            hotspot={backgroundImage!.hotspot}
            mode="cover"
            className="w-full h-full object-cover"
            sizes="100vw"
            {...(isFirst && {loading: 'eager' as const, fetchPriority: 'high' as const})}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${overlay}`} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-16 lg:py-24 max-w-4xl mx-auto">
        {eyebrow && (
          <Wrap>
            <Badge className="mb-3">{eyebrow}</Badge>
          </Wrap>
        )}
        {heading && (
          <Wrap delay={0.1}>
            <h1 className={`text-[48px] tracking-tight font-semibold md:text-[56px] lg:text-[80px] leading-[104%] mb-6 ${hasImage ? 'text-white' : colors.text}`}>
              {heading}
            </h1>
          </Wrap>
        )}
        {subtext && (
          <Wrap delay={0.2}>
            <p className={`font-sans text-[16px] lg:text-[18px]  leading-[150%] mb-8 max-w-2xl mx-auto ${hasImage ? 'text-white/80' : colors.subtext}`}>
              {subtext}
            </p>
          </Wrap>
        )}
        {primaryCta?.buttonText && (
          <Wrap delay={0.3}>
            <Button variant="primary" link={primaryCta.link}>
              {primaryCta.buttonText}
            </Button>
          </Wrap>
        )}
      </div>
    </section>
  )
}
