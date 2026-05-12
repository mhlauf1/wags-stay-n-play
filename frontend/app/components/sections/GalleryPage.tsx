'use client'

import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import Lightbox from '@/app/components/ui/Lightbox'
import {useLightbox} from '@/app/hooks/useLightbox'
import {sanityImageUrlWithDimensions} from '@/sanity/lib/image'
import {stegaClean} from '@sanity/client/stega'

type GalleryImage = {
  _key: string
  alt?: string
  caption?: string
  span?: number
  asset?: {_ref: string}
  crop?: any
  hotspot?: any
}

type GalleryPageProps = {
  block: {
    heading?: string
    subtext?: string
    images?: GalleryImage[]
    layout?: string
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

export default function GalleryPage({block}: GalleryPageProps) {
  const {heading, subtext, images, layout, backgroundColor} = block
  const {isOpen, currentIndex, openLightbox, closeLightbox} = useLightbox()

  const validImages = (images || []).filter((img) => img.asset?._ref)
  const activeLayout = stegaClean(layout) || 'grid'
  const bgColor = stegaClean(backgroundColor) || 'cream'

  const lightboxSlides = validImages.map((img) =>
    sanityImageUrlWithDimensions(img.asset!._ref, 1600),
  )

  return (
    <section className={bgClasses[bgColor] || 'bg-cream'}>
      <div className="px-6 mt-20 md:px-24 py-16 lg:py-24">
        {/* Header */}
        {(heading || subtext) && (
          <FadeIn>
            <div className="mb-10 lg:mb-14 max-w-3xl">
              {heading && (
                <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-forest">
                  {heading}
                </h2>
              )}
              {subtext && (
                <p className="mt-4 text-[16px] md:text-[18px] leading-[160%] text-forest/70">
                  {subtext}
                </p>
              )}
            </div>
          </FadeIn>
        )}

        {/* Grid layout */}
        {activeLayout === 'grid' && validImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {validImages.map((image, i) => {
              const isWide = image.span === 2
              return (
                <FadeIn
                  key={image._key}
                  delay={0.03 * Math.min(i, 12)}
                  className={isWide ? 'sm:col-span-2' : ''}
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => openLightbox(i)}
                      className="w-full cursor-zoom-in group"
                      aria-label={image.alt || 'View image in lightbox'}
                    >
                      <Image
                        id={image.asset!._ref}
                        alt={image.alt || 'Gallery image'}
                        width={isWide ? 800 : 500}
                        crop={image.crop}
                        hotspot={image.hotspot}
                        className={`rounded-lg w-full object-cover transition-opacity group-hover:opacity-90 ${isWide ? 'aspect-[3/2]' : 'aspect-[3/4]'}`}
                      />
                    </button>
                    {image.caption && (
                      <p className="mt-2 text-[14px] text-forest/60 text-center">
                        {image.caption}
                      </p>
                    )}
                  </div>
                </FadeIn>
              )
            })}
          </div>
        )}

        {/* Single column layout */}
        {activeLayout === 'single' && validImages.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-6">
            {validImages.map((image, i) => (
              <FadeIn key={image._key} delay={0.05 * Math.min(i, 8)}>
                <button
                  type="button"
                  onClick={() => openLightbox(i)}
                  className="w-full cursor-zoom-in group"
                  aria-label={image.alt || 'View image in lightbox'}
                >
                  <Image
                    id={image.asset!._ref}
                    alt={image.alt || 'Gallery image'}
                    width={1000}
                    crop={image.crop}
                    hotspot={image.hotspot}
                    className="rounded-lg aspect-[3/4] w-full object-cover transition-opacity group-hover:opacity-90"
                  />
                  {image.caption && (
                    <p className="mt-2 text-[14px] text-forest/60 text-center">{image.caption}</p>
                  )}
                </button>
              </FadeIn>
            ))}
          </div>
        )}

        {validImages.length === 0 && (
          <p className="text-center text-forest/50 py-12">No images to display.</p>
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
