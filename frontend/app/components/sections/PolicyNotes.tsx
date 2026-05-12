'use client'

import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type PolicyNotesProps = {
  block: {
    eyebrow?: string
    heading?: string
    categories?: Array<{
      _key: string
      categoryName?: string
      policies?: string[]
    }>
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

export default function PolicyNotes({block}: PolicyNotesProps) {
  const {eyebrow, heading, categories, backgroundColor} = block
  const bg = bgColors[stegaClean(backgroundColor) || 'sand'] || bgColors.sand
  const isDark = stegaClean(backgroundColor) === 'forest'

  const colsClass =
    (categories?.length ?? 0) >= 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : (categories?.length ?? 0) === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1'

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            {eyebrow && <Badge className="mb-3 md:text-[14px]">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[40px] md:text-[54px] lg:text-[68px] font-semibold tracking-tight leading-[105%] mb-4">
                {heading}
              </h2>
            )}
          </div>
        </FadeIn>

        {categories && categories.length > 0 && (
          <div className={`grid ${colsClass} gap-6`}>
            {categories.map((cat, ci) => (
              <FadeIn key={cat._key} delay={0.1 * ci}>
                <div
                  className={`rounded-lg p-6 md:p-8 h-full ${isDark ? 'bg-cream/10' : 'bg-sand/50'}`}
                >
                  {cat.categoryName && (
                    <h3
                      className={`font-sans text-[24px] md:text-[28px] font-medium mb-4 ${isDark ? 'text-cream' : 'text-forest'}`}
                    >
                      {cat.categoryName}
                    </h3>
                  )}
                  {cat.policies && cat.policies.length > 0 && (
                    <ul className="space-y-3">
                      {cat.policies.map((policy, pi) => (
                        <li key={pi} className="flex items-start gap-2.5">
                          <svg
                            className={`h-4 w-4 shrink-0 mt-1 ${isDark ? 'text-terracotta-light' : 'text-terracotta'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                            />
                          </svg>
                          <span
                            className={`font-sans text-[16px] md:text-[18px] leading-[150%] ${isDark ? 'text-cream/80' : 'text-charcoal/80'}`}
                          >
                            {policy}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
