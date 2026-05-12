'use client'

import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import Lightbox from '@/app/components/ui/Lightbox'
import {useLightbox} from '@/app/hooks/useLightbox'
import {sanityImageUrlWithDimensions} from '@/sanity/lib/image'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type GalleryImage = {
  _key: string
  alt?: string
  caption?: string
  asset?: {_ref: string}
  crop?: any
  hotspot?: any
}

type GalleryShowcaseProps = {
  block: {
    eyebrow?: string
    heading?: string
    subheading?: string
    images?: GalleryImage[]
    backgroundColor?: string
  }
  index: number
  pageId: string
  pageType: string
}

const bgClasses: Record<string, string> = {
  cream: 'bg-cream',
  sand: 'bg-sand',
}

export default function GalleryShowcase({block}: GalleryShowcaseProps) {
  const {eyebrow, heading, subheading, images, backgroundColor} = block
  const {isOpen, currentIndex, openLightbox, closeLightbox} = useLightbox()

  const validImages = (images || []).filter((img) => img.asset?._ref)
  const bgColor = stegaClean(backgroundColor) || 'cream'

  const heroImage = validImages[0]
  const thumbnails = validImages.slice(1)

  const lightboxSlides = validImages.map((img) =>
    sanityImageUrlWithDimensions(img.asset!._ref, 1600),
  )

  return (
    <section className={bgClasses[bgColor] || 'bg-cream'}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        {(eyebrow || heading || subheading) && (
          <FadeIn>
            <div className="mb-10 lg:mb-14 max-w-3xl">
              {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
              {heading && (
                <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-forest">
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className="mt-4 text-[16px] md:text-[18px] leading-[160%] text-forest/70">
                  {subheading}
                </p>
              )}
            </div>
          </FadeIn>
        )}

        {validImages.length > 0 && (
          <div className="space-y-4">
            {/* Hero image */}
            {heroImage && (
              <FadeIn>
                <button
                  type="button"
                  onClick={() => openLightbox(0)}
                  className="w-full cursor-zoom-in group"
                  aria-label={heroImage.alt || 'View image in lightbox'}
                >
                  <Image
                    id={heroImage.asset!._ref}
                    alt={heroImage.alt || 'Gallery image'}
                    width={1200}
                    crop={heroImage.crop}
                    hotspot={heroImage.hotspot}
                    className="rounded-lg aspect-[16/9] w-full object-cover transition-opacity group-hover:opacity-90"
                  />
                </button>
              </FadeIn>
            )}

            {/* Thumbnail grid */}
            {thumbnails.length > 0 && (
              <div
                className={`grid gap-4 ${
                  thumbnails.length === 1
                    ? 'grid-cols-1'
                    : thumbnails.length === 2
                      ? 'grid-cols-2'
                      : thumbnails.length === 3
                        ? 'grid-cols-3'
                        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {thumbnails.map((image, i) => (
                  <FadeIn key={image._key} delay={0.05 * i}>
                    <button
                      type="button"
                      onClick={() => openLightbox(i + 1)}
                      className="w-full cursor-zoom-in group"
                      aria-label={image.alt || 'View image in lightbox'}
                    >
                      <Image
                        id={image.asset!._ref}
                        alt={image.alt || 'Gallery image'}
                        width={400}
                        crop={image.crop}
                        hotspot={image.hotspot}
                        className="rounded-lg aspect-[4/3] w-full object-cover transition-opacity group-hover:opacity-90"
                      />
                    </button>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Lightbox
        images={lightboxSlides}
        open={isOpen}
        index={currentIndex}
        onClose={closeLightbox}
      />
    </section>
  )
}
