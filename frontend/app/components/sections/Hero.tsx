import Badge from '@/app/components/ui/Badge'
import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'

type HeroProps = {
  block: {
    eyebrow?: string
    heading?: string
    subtext?: string
    primaryCta?: {buttonText?: string; link?: any}
    secondaryCta?: {buttonText?: string; link?: any}
    reviewRating?: number
    reviewText?: string
    trustLine?: string
    heroImage?: {asset?: {_ref: string}; crop?: any; hotspot?: any}
    carouselImages?: Array<{
      _key: string
      asset?: {_ref: string}
      crop?: any
      hotspot?: any
      alt?: string
    }>
  }
  index: number
  pageId: string
  pageType: string
}

export default function Hero({block, index}: HeroProps) {
  const {
    eyebrow,
    heading,
    subtext,
    primaryCta,
    secondaryCta,
    reviewRating,
    reviewText,
    trustLine,
    heroImage,
    carouselImages,
  } = block

  const validCarouselImages = (carouselImages || []).filter((img) => img?.asset?._ref)

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
    <section className="relative pb-8 md:pb-0 pt-18 bg-cream overflow-x-clip">
      {/* Left dog illustration */}
      <img
        src="/illustrations/hero-left-dog.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute left-1/12 top-1/3 w-[80px] lg:w-section-lg pointer-events-none hidden lg:block"
      />

      {/* Right dog illustration */}
      <img
        src="/illustrations/hero-right-image.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute right-1/8 bottom-[60%] w-15 lg:w-[80px] pointer-events-none hidden lg:block"
      />

      <div className="container relative z-10 pt-20 pb-4 lg:pt-[12vh] lg:pb-12">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {eyebrow && (
            <Wrap>
              <Badge className="mb-5 md:text-[14px] md:mb-6">{eyebrow}</Badge>
            </Wrap>
          )}

          {heading && (
            <Wrap delay={0.1}>
              <h1 className="text-[42px] md:text-[60px] lg:text-[84px] leading-[104%]  tracking-tight font-medium mb-5">
                {heading}
              </h1>
            </Wrap>
          )}

          {subtext && (
            <Wrap delay={0.2}>
              <p className="font-sans text-base md:text-lg lg:text-xl text-text-muted leading-[150%] max-w-3xl mb-6">
                {subtext}
              </p>
            </Wrap>
          )}

          <Wrap className="w-full md:w-auto" delay={0.35}>
            <div className="flex flex-col w-full md:flex-row items-center gap-2 md:gap-3 mb-3 md:mb-4">
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

          {reviewRating && (
            <Wrap delay={0.35}>
              <div className="flex flex-col mt-3 items-center gap-1">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({length: 5}).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < reviewRating ? 'text-terracotta' : 'text-terracotta/25'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {reviewText && <p className="font-sans text-sm text-text-muted">{reviewText}</p>}
                </div>
                {trustLine && <p className="font-sans text-xs text-text-muted">{trustLine}</p>}
              </div>
            </Wrap>
          )}
        </div>

        {!validCarouselImages.length &&
          heroImage?.asset?._ref &&
          (isFirst ? (
            <div className="mt-10 lg:mt-16 max-w-4xl mx-auto">
              <Image
                id={heroImage.asset._ref}
                alt="Hero image"
                width={960}
                crop={heroImage.crop}
                className="rounded-xl w-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 960px"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          ) : (
            <FadeIn delay={0.5}>
              <div className="mt-10 lg:mt-16 max-w-4xl mx-auto">
                <Image
                  id={heroImage.asset._ref}
                  alt="Hero image"
                  width={960}
                  crop={heroImage.crop}
                  className="rounded-xl w-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 960px"
                />
              </div>
            </FadeIn>
          ))}
      </div>

      {validCarouselImages.length > 0 && (
        <FadeIn delay={isFirst ? 0 : 0.5}>
          <div className="mt-10 lg:mt-16 overflow-hidden" aria-label="Facility photos">
            <div className="flex w-max gap-2 md:gap-4 pb-4 animate-marquee">
              {[...validCarouselImages, ...validCarouselImages].map((img, i) => (
                <div
                  key={`${img._key}-${i}`}
                  aria-hidden={i >= validCarouselImages.length || undefined}
                  className="shrink-0 w-[320px] md:w-[440px] lg:w-[520px] h-[400px] md:h-[520px] lg:h-[600px] rounded-2xl overflow-hidden"
                >
                  <Image
                    id={img.asset!._ref}
                    alt={img.alt || ''}
                    width={520}
                    crop={img.crop}
                    hotspot={img.hotspot}
                    sizes="(max-width: 768px) 320px, (max-width: 1024px) 440px, 520px"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </section>
  )
}
