import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'

type FullWidthMediaProps = {
  block: {
    heading?: string
    subtext?: string
    cta?: {buttonText?: string; link?: any}
    image?: {asset?: {_ref: string}; crop?: any; hotspot?: any}
    textAlignment?: 'left' | 'center' | 'right'
    overlayOpacity?: 'light' | 'medium' | 'heavy'
  }
  index: number
  pageId: string
  pageType: string
}

const overlayClasses: Record<string, string> = {
  light: 'from-black/30 to-transparent',
  medium: 'from-black/50 to-transparent',
  heavy: 'from-black/70 to-black/20',
}

const alignmentConfig: Record<string, {container: string; gradient: string; text: string}> = {
  left: {
    container: 'items-start text-left',
    gradient: 'bg-gradient-to-r',
    text: 'max-w-xl',
  },
  center: {
    container: 'items-center text-center',
    gradient: 'bg-gradient-to-t',
    text: 'max-w-2xl',
  },
  right: {
    container: 'items-end text-right',
    gradient: 'bg-gradient-to-l',
    text: 'max-w-xl ml-auto',
  },
}

export default function FullWidthMedia({block, index}: FullWidthMediaProps) {
  const {heading, subtext, cta, image, textAlignment, overlayOpacity} = block
  const alignment = alignmentConfig[stegaClean(textAlignment) || 'left'] || alignmentConfig.left
  const overlay = overlayClasses[stegaClean(overlayOpacity) || 'medium'] || overlayClasses.medium

  return (
    <section className="relative min-h-[50vh] lg:min-h-[70vh] flex items-center overflow-hidden">
      {/* Background image */}
      {image?.asset?._ref && (
        <div className="absolute inset-0">
          <Image
            id={image.asset._ref}
            alt=""
            width={1400}
            crop={image.crop}
            hotspot={image.hotspot}
            mode="cover"
            className="w-full h-full object-cover"
            {...(index === 0 && {loading: 'eager' as const, fetchPriority: 'high' as const})}
          />
          <div className={`absolute inset-0 ${alignment.gradient} ${overlay}`} />
        </div>
      )}

      {/* Fallback dark bg */}
      {!image?.asset?._ref && <div className="absolute inset-0 bg-forest" />}

      {/* Content */}
      <div
        className={`relative z-10 w-full px-6 md:px-24 py-16 lg:py-24 flex flex-col ${alignment.container}`}
      >
        <div className={alignment.text}>
          {heading && (
            <FadeIn>
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-white mb-4">
                {heading}
              </h2>
            </FadeIn>
          )}
          {subtext && (
            <FadeIn delay={0.1}>
              <p className="font-sans text-[16px] lg:text-[18px] leading-[150%] text-white/80 mb-8">
                {subtext}
              </p>
            </FadeIn>
          )}
          {cta?.buttonText && (
            <FadeIn delay={0.2}>
              <Button variant="primary" link={cta.link}>
                {cta.buttonText}
              </Button>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}
