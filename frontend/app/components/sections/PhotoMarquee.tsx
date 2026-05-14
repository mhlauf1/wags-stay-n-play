import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'

type MarqueeImage = {
  _key: string
  asset?: {_ref: string}
  crop?: any
  hotspot?: any
  alt?: string
}

type PhotoMarqueeProps = {
  block: {
    marqueeImages?: MarqueeImage[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function PhotoMarquee({block, index}: PhotoMarqueeProps) {
  const {marqueeImages} = block
  const isFirst = index === 0
  const hasImages = marqueeImages && marqueeImages.length > 0

  if (!hasImages) return null

  return (
    <section className="bg-cream overflow-x-clip">
      <FadeIn delay={isFirst ? 0 : 0.5}>
        <div className="py-4 lg:py-12 overflow-hidden">
          <div
            className="marquee-track flex gap-3 md:gap-4"
            style={{
              width: 'max-content',
              animation: 'marquee 60s linear infinite',
              willChange: 'transform',
            }}
          >
            {[...marqueeImages, ...marqueeImages].map((img, i) =>
              img.asset?._ref ? (
                <div
                  key={`${img._key}-${i}`}
                  aria-hidden={i >= marqueeImages.length || undefined}
                  className="shrink-0 h-[400px] md:h-[540px] lg:h-[640px] w-[280px] md:w-[380px] lg:w-[440px] rounded-lg overflow-hidden"
                >
                  <Image
                    id={img.asset._ref}
                    alt={img.alt || "Wags Stay N' Play"}
                    width={880}
                    crop={img.crop}
                    hotspot={img.hotspot}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 380px, 440px"
                    loading={isFirst ? 'eager' : 'lazy'}
                  />
                </div>
              ) : null,
            )}
          </div>
        </div>
      </FadeIn>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-track {
              content-visibility: visible;
              animation-play-state: running !important;
            }
          `,
        }}
      />
    </section>
  )
}
