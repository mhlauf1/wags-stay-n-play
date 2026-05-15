'use client'

import {useState} from 'react'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

type VideoSectionProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    primaryCta?: {buttonText?: string; link?: any}
    secondaryCta?: {buttonText?: string; link?: any}
    videoUrl?: string
    thumbnail?: {asset?: {_ref: string}; crop?: any; hotspot?: any}
    layout?: 'full' | 'split'
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

function getEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`

  return null
}

export default function VideoSection({block}: VideoSectionProps) {
  const {
    eyebrow,
    heading,
    description,
    primaryCta,
    secondaryCta,
    videoUrl,
    thumbnail,
    layout,
    backgroundColor,
  } = block
  const [isPlaying, setIsPlaying] = useState(false)
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isDark = stegaClean(backgroundColor) === 'forest'
  const isSplit = stegaClean(layout) === 'split'
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null

  const clickToPlayVideo = (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-charcoal">
      {isPlaying && embedUrl ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 w-full h-full group cursor-pointer"
          aria-label="Play video"
        >
          {thumbnail?.asset?._ref && (
            <Image
              id={thumbnail.asset._ref}
              alt=""
              width={1920}
              crop={thumbnail.crop}
              hotspot={thumbnail.hotspot}
              mode="cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-terracotta text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  )

  const autoplayVideo = embedUrl ? (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-charcoal">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  ) : null

  if (isSplit) {
    return (
      <section className={bg}>
        <div className="px-6 md:px-24 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              {eyebrow && (
                <FadeIn>
                  <Badge className="mb-3">{eyebrow}</Badge>
                </FadeIn>
              )}
              {heading && (
                <FadeIn delay={0.05}>
                  <h1 className="text-[42px] md:text-[60px] lg:text-[84px] leading-[104%]  tracking-tight font-medium mb-5">
                    {heading}
                  </h1>
                </FadeIn>
              )}
              {description && (
                <FadeIn delay={0.1}>
                  <p
                    className={`font-sans text-[16px] lg:text-[18px] leading-[150%] ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
                  >
                    {description}
                  </p>
                </FadeIn>
              )}
            </div>
            <FadeIn delay={0.1}>{clickToPlayVideo}</FadeIn>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`relative pt-18 ${bg} overflow-x-clip`}>
      {/* Left dog illustration */}
      <img
        src="/illustrations/hero-left-dog.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute left-[6%] xl:left-[8%] top-[18%] w-[70px] lg:w-[90px] pointer-events-none hidden lg:block"
      />

      {/* Right dog illustration */}
      <img
        src="/illustrations/hero-right-image.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute right-[6%] xl:right-[8%] top-[14%] w-[70px] lg:w-[90px] pointer-events-none hidden lg:block"
      />

      <div className="container relative z-10 pt-16 md:pt-20 pb-4 lg:pt-[12vh] lg:pb-12">
        {(eyebrow || heading || description) && (
          <div className="flex flex-col items-center max-w-5xl text-center mx-auto">
            {eyebrow && (
              <FadeIn>
                <Badge className="mb-5 md:mb-6">{eyebrow}</Badge>
              </FadeIn>
            )}
            {heading && (
              <FadeIn delay={0.1}>
                <h1 className="text-[42px] md:text-[60px] lg:text-[84px] leading-[104%] max-w-[14ch] tracking-tight font-medium mb-5">
                  {heading}
                </h1>
              </FadeIn>
            )}
            {description && (
              <FadeIn delay={0.2}>
                <p
                  className={`font-sans md:text-[18px] lg:text-[20px] leading-[150%] max-w-4xl mb-6 ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
                >
                  {description}
                </p>
              </FadeIn>
            )}

            {(primaryCta?.buttonText || secondaryCta?.buttonText) && (
              <FadeIn className="w-full md:w-auto" delay={0.25}>
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
              </FadeIn>
            )}
          </div>
        )}
      </div>

      <FadeIn delay={0.3}>
        <div className="px-6 md:px-16 lg:px-24 pb-8 lg:pb-16">{autoplayVideo}</div>
      </FadeIn>
    </section>
  )
}
