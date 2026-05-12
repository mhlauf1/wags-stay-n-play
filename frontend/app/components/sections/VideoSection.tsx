'use client'

import {useState} from 'react'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type VideoSectionProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
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
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`

  return null
}

export default function VideoSection({block}: VideoSectionProps) {
  const {eyebrow, heading, description, videoUrl, thumbnail, layout, backgroundColor} = block
  const [isPlaying, setIsPlaying] = useState(false)
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isDark = stegaClean(backgroundColor) === 'forest'
  const isSplit = stegaClean(layout) === 'split'
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null

  const videoPlayer = (
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
              width={960}
              crop={thumbnail.crop}
              hotspot={thumbnail.hotspot}
              mode="cover"
              className="w-full h-full object-cover"
            />
          )}
          {/* Play button overlay */}
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
                  <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] mb-4">
                    {heading}
                  </h2>
                </FadeIn>
              )}
              {description && (
                <FadeIn delay={0.1}>
                  <p
                    className={`font-sans text-[16px] lg:text-[18px]  leading-[150%] ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
                  >
                    {description}
                  </p>
                </FadeIn>
              )}
            </div>
            <FadeIn delay={0.1}>{videoPlayer}</FadeIn>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        {(eyebrow || heading || description) && (
          <FadeIn>
            <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
              {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
              {heading && (
                <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] mb-4">
                  {heading}
                </h2>
              )}
              {description && (
                <p
                  className={`font-sans text-[16px] lg:text-[18px]  leading-[150%] ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
                >
                  {description}
                </p>
              )}
            </div>
          </FadeIn>
        )}
        <FadeIn delay={0.1}>
          <div className="max-w-5xl mx-auto">{videoPlayer}</div>
        </FadeIn>
      </div>
    </section>
  )
}
