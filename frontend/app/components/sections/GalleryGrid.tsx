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

type GalleryGridProps = {
  block: {
    eyebrow?: string
    heading?: string
    images?: GalleryImage[]
    columns?: number
    displayStyle?: string
    enableLightbox?: boolean
    accentImage?: {asset?: {_ref: string}; alt?: string}
    backgroundColor?: string
  }
  index: number
  pageId: string
  pageType: string
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const bgClasses: Record<string, string> = {
  cream: 'bg-cream',
  sand: 'bg-sand',
  forest: 'bg-forest',
}

export default function GalleryGrid({block}: GalleryGridProps) {
  const {
    eyebrow,
    heading,
    images,
    columns,
    displayStyle,
    enableLightbox,
    accentImage,
    backgroundColor,
  } = block
  const {isOpen, currentIndex, openLightbox, closeLightbox} = useLightbox()

  const cols = stegaClean(columns) || 3
  const gridClass = columnClasses[cols] || columnClasses[3]
  const bgColor = stegaClean(backgroundColor) || 'cream'
  const isDark = bgColor === 'forest'
  const isCircles = stegaClean(displayStyle) === 'circles'
  const lightboxEnabled = !isCircles && enableLightbox !== false

  const validImages = (images || []).filter((img) => img.asset?._ref)

  const lightboxSlides = validImages.map((img) =>
    sanityImageUrlWithDimensions(img.asset!._ref, 1600),
  )

  return (
    <section className={bgClasses[bgColor] || 'bg-cream'}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className={`mb-8 lg:mb-10 ${isCircles ? 'text-center' : ''}`}>
            {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2
                className={`text-4xl md:text-5xl lg:text-6xl leading-[105%] tracking-tight font-semibold ${isDark ? 'text-cream' : 'text-forest'}`}
              >
                {heading}
              </h2>
            )}
          </div>
        </FadeIn>

        {validImages.length > 0 && (
          <div
            className={`grid ${gridClass} mb-8 md:mb-12 gap-4 ${isCircles ? 'justify-items-center gap-8 md:gap-12' : ''}`}
          >
            {validImages.map((image, i) => (
              <FadeIn key={image._key} delay={0.05 * i}>
                <div className={isCircles ? 'flex flex-col items-center' : ''}>
                  {isCircles ? (
                    <Image
                      id={image.asset!._ref}
                      alt={image.alt || 'Gallery image'}
                      crop={image.crop}
                      hotspot={image.hotspot}
                      className="rounded-full aspect-square w-full object-cover"
                    />
                  ) : lightboxEnabled ? (
                    <button
                      type="button"
                      onClick={() => openLightbox(i)}
                      className="w-full cursor-zoom-in group"
                      aria-label={image.alt || 'View image in lightbox'}
                    >
                      <Image
                        id={image.asset!._ref}
                        alt={image.alt || 'Gallery image'}
                        width={600}
                        crop={image.crop}
                        hotspot={image.hotspot}
                        className="rounded-lg aspect-[3/4] w-full object-cover transition-opacity group-hover:opacity-90"
                      />
                    </button>
                  ) : (
                    <Image
                      id={image.asset!._ref}
                      alt={image.alt || 'Gallery image'}
                      width={600}
                      crop={image.crop}
                      hotspot={image.hotspot}
                      className="rounded-lg aspect-[4/3] w-full object-cover"
                    />
                  )}
                  {image.caption && (
                    <p
                      className={`mt-2 text-[14px] text-center ${isDark ? 'text-cream/60' : 'text-forest/60'}`}
                    >
                      {image.caption}
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {accentImage?.asset?._ref && (
          <FadeIn>
            <div className="flex justify-center mt-8 lg:mt-12">
              <Image
                id={accentImage.asset._ref}
                alt={accentImage.alt || ''}
                width={200}
                className="w-[50px] lg:w-[60px]"
              />
            </div>
          </FadeIn>
        )}
      </div>

      {lightboxEnabled && (
        <Lightbox
          images={lightboxSlides}
          open={isOpen}
          index={currentIndex}
          onClose={closeLightbox}
        />
      )}
    </section>
  )
}
