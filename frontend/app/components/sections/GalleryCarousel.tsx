'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
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

type GalleryCarouselProps = {
  block: {
    eyebrow?: string
    heading?: string
    images?: GalleryImage[]
    enableLightbox?: boolean
    backgroundColor?: string
  }
  index: number
  pageId: string
  pageType: string
}

const bgClasses: Record<string, string> = {
  cream: 'bg-cream',
  sand: 'bg-sand',
  forest: 'bg-forest',
}

export default function GalleryCarousel({block}: GalleryCarouselProps) {
  const {eyebrow, heading, images, enableLightbox, backgroundColor} = block
  const {isOpen, currentIndex, openLightbox, closeLightbox} = useLightbox()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePage, setActivePage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const validImages = (images || []).filter((img) => img.asset?._ref)
  const totalImages = validImages.length
  const bgColor = stegaClean(backgroundColor) || 'cream'
  const isDark = bgColor === 'forest'
  const lightboxEnabled = enableLightbox !== false

  const lightboxSlides = validImages.map((img) =>
    sanityImageUrlWithDimensions(img.asset!._ref, 1600),
  )

  const getCarouselInfo = useCallback(() => {
    const el = scrollRef.current
    if (!el || totalImages === 0) return {cardWidth: 400, gap: 24, visibleCount: 3, pages: 1}
    const cardEl = el.querySelector<HTMLElement>('[data-card]')
    const cardWidth = cardEl?.offsetWidth ?? 400
    const gap = 24
    const visibleCount = Math.max(1, Math.floor((el.clientWidth + gap) / (cardWidth + gap)))
    const pages = Math.max(1, totalImages - visibleCount + 1)
    return {cardWidth, gap, visibleCount, pages}
  }, [totalImages])

  useEffect(() => {
    const update = () => setTotalPages(getCarouselInfo().pages)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [getCarouselInfo])

  const updateActivePage = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const scrollLeft = el.scrollLeft
    const maxScroll = el.scrollWidth - el.clientWidth
    const {pages} = getCarouselInfo()
    if (maxScroll <= 0) {
      setActivePage(0)
      return
    }
    const progress = scrollLeft / maxScroll
    const page = Math.round(progress * (pages - 1))
    setActivePage(Math.min(page, pages - 1))
  }, [getCarouselInfo])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateActivePage, {passive: true})
    return () => el.removeEventListener('scroll', updateActivePage)
  }, [updateActivePage])

  const scrollToPage = (page: number) => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const {pages} = getCarouselInfo()
    if (pages <= 1) return
    const target = (page / (pages - 1)) * maxScroll
    el.scrollTo({left: target, behavior: 'smooth'})
  }

  const scrollBy = (direction: 'prev' | 'next') => {
    const nextPage =
      direction === 'next' ? Math.min(activePage + 1, totalPages - 1) : Math.max(activePage - 1, 0)
    scrollToPage(nextPage)
  }

  return (
    <section className={bgClasses[bgColor] || 'bg-cream'}>
      <div className="py-20 mb-4 md:mb-0 lg:py-24">
        {(eyebrow || heading) && (
          <FadeIn>
            <div className="px-6 md:px-24 mb-10 lg:mb-14">
              {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
              {heading && (
                <h2
                  className={`text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] ${isDark ? 'text-cream' : 'text-forest'}`}
                >
                  {heading}
                </h2>
              )}
            </div>
          </FadeIn>
        )}

        {validImages.length > 0 && (
          <FadeIn delay={0.2}>
            <div className=" sm:px-10 lg:px-16">
              <div className="relative">
                {/* Prev button */}
                <button
                  onClick={() => scrollBy('prev')}
                  className={`hidden sm:flex absolute -left-5 lg:-left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full backdrop-blur-sm border items-center justify-center transition-all duration-200 hover:scale-105 ${
                    isDark
                      ? 'bg-cream/10 hover:bg-cream/20 border-cream/20'
                      : 'bg-forest/10 hover:bg-forest/20 border-forest/20'
                  }`}
                  aria-label="Previous images"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className={isDark ? 'text-cream' : 'text-forest'}
                  >
                    <path
                      d="M11 4L6 9L11 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Scrollable cards */}
                <div
                  ref={scrollRef}
                  className="flex gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide scroll-smooth"
                >
                  {/* Spacer for initial left inset on mobile — images scroll past it for full bleed */}
                  <div className="flex-shrink-0 w-4 sm:hidden" aria-hidden="true" />
                  {validImages.map((image, i) => (
                    <div
                      key={image._key}
                      data-card
                      className="flex-shrink-0 w-[250px] sm:w-[360px] lg:w-[501px] snap-start"
                    >
                      {lightboxEnabled ? (
                        <button
                          type="button"
                          onClick={() => openLightbox(i)}
                          className="w-full cursor-zoom-in group"
                          aria-label={image.alt || 'View image in lightbox'}
                        >
                          <Image
                            id={image.asset!._ref}
                            alt={image.alt || 'Gallery image'}
                            width={500}
                            crop={image.crop}
                            hotspot={image.hotspot}
                            sizes="(max-width: 768px) 80vw, 300px"
                            className="rounded-lg aspect-[3/4] w-full object-cover transition-opacity group-hover:opacity-90"
                          />
                        </button>
                      ) : (
                        <Image
                          id={image.asset!._ref}
                          alt={image.alt || 'Gallery image'}
                          width={500}
                          crop={image.crop}
                          hotspot={image.hotspot}
                          className="rounded-lg aspect-[4/3] w-full object-cover"
                        />
                      )}
                      {image.caption && (
                        <p
                          className={`mt-2 text-[13px] text-center ${isDark ? 'text-cream/60' : 'text-forest/60'}`}
                        >
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="flex-shrink-0 w-4 sm:hidden" aria-hidden="true" />
                </div>

                {/* Next button */}
                <button
                  onClick={() => scrollBy('next')}
                  className={`hidden sm:flex absolute -right-5 lg:-right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full backdrop-blur-sm border items-center justify-center transition-all duration-200 hover:scale-105 ${
                    isDark
                      ? 'bg-cream/10 hover:bg-cream/20 border-cream/20'
                      : 'bg-forest/10 hover:bg-forest/20 border-forest/20'
                  }`}
                  aria-label="Next images"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className={isDark ? 'text-cream' : 'text-forest'}
                  >
                    <path
                      d="M7 4L12 9L7 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Page indicators */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2.5 mt-8">
                  {Array.from({length: totalPages}).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToPage(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === activePage
                          ? 'w-8 h-2.5 bg-terracotta'
                          : `w-2.5 h-2.5 ${isDark ? 'bg-cream/30 hover:bg-cream/50' : 'bg-forest/20 hover:bg-forest/40'}`
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>
              )}
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
