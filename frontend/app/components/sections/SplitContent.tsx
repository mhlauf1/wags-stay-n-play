import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from 'next-sanity'
import Image from '@/app/components/SanityImage'
import Button from '@/app/components/ui/Button'
import {stegaClean} from '@sanity/client/stega'
import {FadeIn} from '@/app/components/ui/FadeIn'

type SplitContentProps = {
  block: {
    heading?: string
    body?: PortableTextBlock[]
    link?: {label?: string; link?: any}
    badge?: {asset?: {_ref: string}; alt?: string}
    image?: {asset?: {_ref: string}; crop?: any; alt?: string}
    stickerImage?: {asset?: {_ref: string}; alt?: string}
    hours?: Array<{_key: string; label?: string; value?: string}>
    imagePosition?: 'left' | 'right'
    backgroundColor?: 'cream' | 'sand' | 'forest' | 'tan' | 'lavender' | 'dark'
  }
  index: number
  pageId: string
  pageType: string
}

const bgColors: Record<string, {classes: string; isDark: boolean}> = {
  cream: {classes: 'bg-cream text-forest', isDark: false},
  sand: {classes: 'bg-sand text-forest', isDark: false},
  forest: {classes: 'bg-forest text-cream', isDark: true},
  // Backward-compat aliases for existing Sanity data
  tan: {classes: 'bg-cream text-forest', isDark: false},
  lavender: {classes: 'bg-sand text-forest', isDark: false},
  dark: {classes: 'bg-forest text-cream', isDark: true},
}

export default function SplitContent({block}: SplitContentProps) {
  const {heading, body, link, badge, image, stickerImage, hours, imagePosition, backgroundColor} =
    block
  const validHours = (hours || []).filter((h) => h?.label && h?.value)
  const isImageLeft = stegaClean(imagePosition) === 'left'
  const {classes: bg, isDark} = bgColors[stegaClean(backgroundColor) || 'sand'] || bgColors.sand

  return (
    <section className={`${bg}`}>
      <div className="px-6 md:px-24 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text side */}
          <div className={isImageLeft ? 'lg:order-2' : 'lg:order-1'}>
            {heading && (
              <FadeIn>
                <h2 className="font-semibold text-[40px] md:text-[52px] lg:text-[68px] leading-[105%] tracking-tight max-w-[18ch] mb-6">
                  {heading}
                </h2>
              </FadeIn>
            )}

            {body && (
              <FadeIn delay={0.1}>
                <div
                  className={`font-sans text-[16px] lg:text-[20px]  leading-[150%] opacity-90 mb-6 prose prose-p:mb-3 ${isDark ? 'prose-invert' : ''}`}
                >
                  <PortableText value={body} />
                </div>
              </FadeIn>
            )}

            {validHours.length > 0 && (
              <FadeIn delay={0.15}>
                <div className="mb-6">
                  <h3 className="font-sans font-semibold text-base mb-3">Hours</h3>
                  <dl className="font-sans text-[16px] lg:text-[18px] leading-[160%] opacity-90 space-y-1">
                    {validHours.map((h) => (
                      <div key={h._key} className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold">{h.label}</dt>
                        <dd>{h.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </FadeIn>
            )}

            {link?.label && link?.link && (
              <FadeIn delay={0.2}>
                <div className="mb-6">
                  <Button link={link.link}>{link.label}</Button>
                </div>
              </FadeIn>
            )}

            {badge?.asset?._ref && (
              <FadeIn delay={0.2}>
                <Image
                  id={badge.asset._ref}
                  alt={badge.alt || 'Badge'}
                  width={80}
                  className="h-36 w-auto"
                />
              </FadeIn>
            )}
          </div>

          {/* Image side */}
          <div className={isImageLeft ? 'lg:order-1' : 'lg:order-2'}>
            {image?.asset?._ref && (
              <FadeIn delay={0.1} className="relative">
                <Image
                  id={image.asset._ref}
                  alt={image.alt || heading || 'Section image'}
                  width={600}
                  crop={image.crop}
                  className="rounded-lg aspect-[4/3] w-full object-cover"
                />
                {stickerImage?.asset?._ref && (
                  <div className="absolute bottom-4 left-4  lg:bottom-6 lg:left-6 bg-white rounded-full p-2.5 pointer-events-none z-10">
                    <Image
                      id={stickerImage.asset._ref}
                      alt={stickerImage.alt || ''}
                      width={200}
                      className="w-[50px] lg:w-[65px] aspect-square object-contain"
                    />
                  </div>
                )}
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
