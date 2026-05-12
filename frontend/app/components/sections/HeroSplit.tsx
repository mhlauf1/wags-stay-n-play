import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type HeroSplitProps = {
  block: {
    eyebrow?: string
    heading?: string
    body?: string
    primaryCta?: {buttonText?: string; link?: any}
    secondaryCta?: {buttonText?: string; link?: any}
    image?: {asset?: {_ref: string}; crop?: any; hotspot?: any; alt?: string}
    stickerImage?: {asset?: {_ref: string}; alt?: string}
    imagePosition?: 'left' | 'right'
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

export default function HeroSplit({block, index}: HeroSplitProps) {
  const {
    eyebrow,
    heading,
    body,
    primaryCta,
    secondaryCta,
    image,
    stickerImage,
    imagePosition,
    backgroundColor,
  } = block
  const isImageLeft = stegaClean(imagePosition) === 'left'
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isDark = stegaClean(backgroundColor) === 'forest'
  const isFirst = index === 0
  const Wrap = isFirst
    ? ({
        children,
        className,
      }: {
        children: React.ReactNode
        className?: string
        delay?: number
        direction?: string
      }) => <div className={className}>{children}</div>
    : FadeIn

  return (
    <section className={` pt-18 ${bg}`}>
      <div className="px-6  md:px-24 py-16 lg:py-24">
        <div className="flex flex-col md:flex-row justify-between gap-8 lg:gap-16 items-center">
          {/* Text side */}
          <div className={`${isImageLeft ? 'lg:order-2' : 'lg:order-1'} flex-1`}>
            {eyebrow && (
              <Wrap>
                <Badge className="mb-3">{eyebrow}</Badge>
              </Wrap>
            )}
            {heading && (
              <Wrap delay={0.05}>
                <h1 className="text-[48px] tracking-tight md:text-[56px] md:max-w-[15ch] font-semibold lg:text-[84px] leading-[104%] mb-6">
                  {heading}
                </h1>
              </Wrap>
            )}
            {body && (
              <Wrap delay={0.1}>
                <p
                  className={`font-sans text-[16px] md:text-[18px] lg:text-[20px] md:max-w-[64ch]  leading-[150%] mb-8 ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
                >
                  {body}
                </p>
              </Wrap>
            )}
            <Wrap delay={0.15}>
              <div className="flex flex-row items-center gap-2 md:gap-3">
                {primaryCta?.buttonText && (
                  <Button variant="primary" link={primaryCta.link}>
                    {primaryCta.buttonText}
                  </Button>
                )}
                {secondaryCta?.buttonText && (
                  <Button variant="outline" link={secondaryCta.link}>
                    {secondaryCta.buttonText}
                  </Button>
                )}
              </div>
            </Wrap>
          </div>

          {/* Image side */}
          <div className={`${isImageLeft ? 'lg:order-1' : 'lg:order-2'} flex justify-end flex-1`}>
            {image?.asset?._ref && (
              <Wrap delay={0.1} className="relative">
                <Image
                  id={image.asset._ref}
                  alt={image.alt || heading || 'Hero image'}
                  width={600}
                  crop={image.crop}
                  hotspot={image.hotspot}
                  className="rounded-lg md:w-[600px] aspect-square w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                  {...(isFirst && {loading: 'eager' as const, fetchPriority: 'high' as const})}
                />
                {stickerImage?.asset?._ref && (
                  <div className="absolute top-4 left-4  lg:top-6 lg:left-6 bg-white rounded-full p-3 pointer-events-none z-10">
                    <Image
                      id={stickerImage.asset._ref}
                      alt={stickerImage.alt || ''}
                      width={200}
                      className="w-[40px] lg:w-[50px] aspect-square object-contain"
                    />
                  </div>
                )}
              </Wrap>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
