'use client'

import {Icon} from '@iconify/react'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Image from '@/app/components/SanityImage'
import Badge from '../ui/Badge'
import type {ReactNode} from 'react'

function linkifyLine(line: string): ReactNode {
  const trimmed = line.trim()
  if (!trimmed) return null

  // Email: entire line is an email address
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return <a href={`mailto:${trimmed}`}>{trimmed}</a>
  }

  // Phone: line is primarily digits/dashes/parens/spaces/dots, 7+ digits
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (/^[\d\s\-().+]+$/.test(trimmed) && digitsOnly.length >= 7) {
    return <a href={`tel:+1${digitsOnly.slice(-10)}`}>{trimmed}</a>
  }

  // Address: contains a US state abbreviation + zip code pattern
  if (/\b[A-Z]{2}\s+\d{5}/.test(trimmed)) {
    const query = encodeURIComponent(trimmed)
    return (
      <a
        href={`https://www.google.com/maps/search/${query}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {trimmed}
      </a>
    )
  }

  return trimmed
}

function RichDescription({description, isDark}: {description: string; isDark: boolean}) {
  const cleaned = stegaClean(description)
  const lines = cleaned.split('\n').filter((l) => l.trim())

  const linkClass =
    'underline decoration-current/30 hover:text-terracotta hover:decoration-terracotta transition-colors'

  return (
    <div
      className={`font-sans text-[15px]  leading-[150%] space-y-1 ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
    >
      {lines.map((line, i) => {
        const node = linkifyLine(line)
        return (
          <div key={i}>
            {typeof node === 'string' ? node : <span className={linkClass}>{node}</span>}
          </div>
        )
      })}
    </div>
  )
}

type IconGridProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    items?: Array<{
      _key: string
      icon?: string
      title?: string
      description?: string
    }>
    columns?: number
    accentImage?: {asset?: {_ref: string}; alt?: string}
    backgroundColor?: 'cream' | 'sand' | 'forest'
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

const bgColors: Record<string, string> = {
  cream: 'bg-cream text-forest',
  sand: 'bg-sand text-forest',
  forest: 'bg-forest text-cream',
}

export default function IconGrid({block}: IconGridProps) {
  const {eyebrow, heading, description, items, columns, accentImage, backgroundColor} = block
  const cols = stegaClean(columns) || 3
  const gridClass = columnClasses[cols] || columnClasses[3]
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isDark = stegaClean(backgroundColor) === 'forest'

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="mb-10 lg:mb-14">
            {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[36px] font-semibold tracking-tight md:text-[48px] lg:text-[56px] leading-[105%] mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p
                className={`font-sans text-[16px] lg:text-[18px] leading-[150%] max-w-2xl ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
              >
                {description}
              </p>
            )}
          </div>
        </FadeIn>

        {items && items.length > 0 && (
          <div className={`grid ${gridClass} gap-4`}>
            {items.map((item, i) => (
              <FadeIn key={item._key} delay={0.05 * i}>
                <div
                  className={`rounded-md p-6 h-full ${
                    isDark
                      ? 'bg-forest-card border border-border-dark'
                      : 'bg-white/60 border border-border-light'
                  }`}
                >
                  {item.icon && (
                    <div
                      className={`w-12 h-12 rounded-md flex items-center justify-center mb-4 ${
                        isDark
                          ? 'bg-terracotta/20 text-terracotta'
                          : 'bg-terracotta/10 text-terracotta'
                      }`}
                    >
                      <Icon icon={item.icon} width={28} height={28} />
                    </div>
                  )}
                  {item.title && (
                    <h3
                      className={`text-[18px] md:text-[20px] leading-[120%] mb-2 ${isDark ? 'text-sand' : 'text-forest'}`}
                    >
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <RichDescription description={item.description} isDark={isDark} />
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
                className="w-[50px] lg:w-[60px] aspect-square object-contain"
              />
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
