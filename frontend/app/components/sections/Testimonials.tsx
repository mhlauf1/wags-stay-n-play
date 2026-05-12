'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'

type Review = {
  _id: string
  quote?: string
  authorName?: string
  authorLabel?: string
  rating?: number
}

type TestimonialsProps = {
  block: {
    icon?: {asset?: {_ref: string}; alt?: string}
    heading?: string
    reviews?: Review[]
    googleRating?: string
    googleReviewCount?: number
  }
  index: number
  pageId: string
  pageType: string
}

export default function Testimonials({block}: TestimonialsProps) {
  const {icon, heading, reviews, googleRating} = block
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePage, setActivePage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const totalReviews = reviews?.length ?? 0

  // Calculate how many cards fit in view and derive page count
  const getCarouselInfo = useCallback(() => {
    const el = scrollRef.current
    if (!el || totalReviews === 0) return {cardWidth: 400, gap: 24, visibleCount: 3, pages: 1}
    const cardEl = el.querySelector<HTMLElement>('[data-card]')
    const cardWidth = cardEl?.offsetWidth ?? 400
    const gap = 24
    const visibleCount = Math.max(1, Math.floor((el.clientWidth + gap) / (cardWidth + gap)))
    const pages = Math.max(1, totalReviews - visibleCount + 1)
    return {cardWidth, gap, visibleCount, pages}
  }, [totalReviews])

  // Recalculate pages on mount and resize
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

    // Map scroll position proportionally to page index
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
    <section className="relative bg-forest text-cream rounded-t-[48px] -mt-12 z-10 overflow-hidden">
      <div className="relative z-10 py-[80px] lg:py-[120px]">
        {icon?.asset?._ref && (
          <FadeIn>
            <div className="flex justify-center mb-6">
              <Image
                id={icon.asset._ref}
                alt={icon.alt || ''}
                width={120}
                className="w-[100px] lg:w-[120px] h-auto"
              />
            </div>
          </FadeIn>
        )}

        {heading && (
          <FadeIn delay={0.1}>
            <h2 className="text-[40px] md:text-[52px] lg:text-[64px] leading-[105%] tracking-tight font-semibold text-cream text-center mb-12 lg:mb-16">
              {heading}
            </h2>
          </FadeIn>
        )}

        {/* Carousel */}
        {reviews && reviews.length > 0 && (
          <FadeIn delay={0.2}>
            <div className=" px-6 sm:px-10 lg:px-16">
              {/* Cards row with navigation */}
              <div className="relative">
                {/* Prev button */}
                <button
                  onClick={() => scrollBy('prev')}
                  className="hidden sm:flex absolute -left-5 lg:-left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-cream/10 hover:bg-cream/20 backdrop-blur-sm border border-cream/20 items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="Previous testimonials"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="text-cream"
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
                  className="flex gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide scroll-smooth px-1"
                >
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      data-card
                      className="flex-shrink-0 w-[300px] sm:w-[360px] lg:w-[400px] bg-cream text-forest rounded-xl p-7 lg:p-8 snap-start flex flex-col"
                    >
                      {/* Star rating */}
                      <div className="flex gap-1 mb-5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill={star <= (review.rating ?? 5) ? '#C4704B' : 'none'}
                            stroke="#C4704B"
                            strokeWidth="1"
                          >
                            <path d="M9 1.5l2.47 4.95 5.53.8-4 3.85.95 5.4L9 13.77 4.05 16.5l.95-5.4-4-3.85 5.53-.8L9 1.5z" />
                          </svg>
                        ))}
                      </div>

                      {review.quote && (
                        <p className="font-sans text-[16px] md:text-[18px] leading-[160%] text-forest/90 mb-6 flex-1">
                          &ldquo;{review.quote}&rdquo;
                        </p>
                      )}

                      <div className="font-sans text-[14px] pt-4 border-t border-forest/10">
                        {review.authorName && (
                          <span className="font-semibold text-forest">{review.authorName}</span>
                        )}
                        {review.authorLabel && (
                          <span className="text-forest/60">, {review.authorLabel}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={() => scrollBy('next')}
                  className="hidden sm:flex absolute -right-5 lg:-right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-cream/10 hover:bg-cream/20 backdrop-blur-sm border border-cream/20 items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="Next testimonials"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="text-cream"
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
                          : 'w-2.5 h-2.5 bg-cream/30 hover:bg-cream/50'
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* Google rating badge */}
        {googleRating && (
          <FadeIn delay={0.3}>
            <div className="flex justify-center mt-10">
              <div className="inline-flex items-center gap-2 bg-forest-card border border-border-dark rounded-full px-5 py-2.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = Number(googleRating)
                    const isFull = star <= Math.floor(rating)
                    const isPartial = !isFull && star === Math.ceil(rating) && rating % 1 !== 0
                    const fraction = rating % 1
                    const clipWidth = fraction * 16
                    return (
                      <svg
                        key={star}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        stroke="#FAF7F2"
                        strokeWidth="1"
                      >
                        {isPartial ? (
                          <>
                            <defs>
                              <clipPath id={`partial-star-${star}`}>
                                <rect x="0" y="0" width={clipWidth} height="16" />
                              </clipPath>
                            </defs>
                            <path
                              d="M8 1l2.2 4.4L15 6.2l-3.5 3.4.8 4.8L8 12.1 3.7 14.4l.8-4.8L1 6.2l4.8-.8L8 1z"
                              fill="none"
                            />
                            <path
                              d="M8 1l2.2 4.4L15 6.2l-3.5 3.4.8 4.8L8 12.1 3.7 14.4l.8-4.8L1 6.2l4.8-.8L8 1z"
                              fill="#FAF7F2"
                              clipPath={`url(#partial-star-${star})`}
                            />
                          </>
                        ) : (
                          <path
                            d="M8 1l2.2 4.4L15 6.2l-3.5 3.4.8 4.8L8 12.1 3.7 14.4l.8-4.8L1 6.2l4.8-.8L8 1z"
                            fill={isFull ? '#FAF7F2' : 'none'}
                          />
                        )}
                      </svg>
                    )
                  })}
                </div>
                <span className="font-sans text-[14px] text-cream">
                  {googleRating} On Facebook Reviews
                </span>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
