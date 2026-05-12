'use client'

import {useAnimatedNumber} from '@/app/hooks/useAnimatedNumber'
import Button from '@/app/components/ui/Button'
import type {DereferencedLink} from '@/sanity/lib/types'
import type {LineItem} from '@/app/data/pricingData'

type PriceOutputCardProps = {
  total: number
  lineItems: LineItem[]
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
  disabled?: boolean
  disabledMessage?: string | null
  savings?: number | null
  savingsLabel?: string
  includes?: string[]
  timeEstimate?: string
  badge?: string | null
  emptyMessage?: string
}

function formatPrice(amount: number): string {
  if (amount >= 1000) {
    return amount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})
  }
  return String(Math.round(amount))
}

export default function PriceOutputCard({
  total,
  lineItems,
  ctaText = 'Book Now',
  ctaLink,
  taxNote,
  disabled,
  disabledMessage,
  savings,
  savingsLabel = 'Package savings',
  includes,
  timeEstimate,
  badge,
  emptyMessage,
}: PriceOutputCardProps) {
  const animatedTotal = useAnimatedNumber(total)

  return (
    <div className="bg-cream rounded-2xl p-6 md:p-8 lg:sticky lg:top-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-sans text-[13px] md:text-[14px] uppercase tracking-wider text-terracotta">
          Estimated Cost
        </span>
        {badge && (
          <span className="text-[12px] font-sans  bg-sage/20  text-forest px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Price */}
      {disabled ? (
        <div className="my-4">
          <p className="font-sans text-[16px] text-charcoal/70">{disabledMessage}</p>
        </div>
      ) : emptyMessage && total === 0 ? (
        <>
          <p
            className="text-[48px] md:text-[56px] font-semibold tracking-tight text-forest/30 leading-tight mb-2"
            aria-live="polite"
            aria-atomic="true"
          >
            $0
          </p>
          <p className="font-sans text-[14px] text-charcoal/50 mb-4">{emptyMessage}</p>
        </>
      ) : (
        <p
          className="text-[48px] md:text-[56px] font-semibold tracking-tight text-forest leading-tight mb-4"
          aria-live="polite"
          aria-atomic="true"
        >
          ${formatPrice(animatedTotal)}
        </p>
      )}

      {/* Line Items */}
      {!disabled && lineItems.length > 0 && (
        <div className="border-t border-forest/10 pt-4 mb-4 space-y-2">
          {lineItems.map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-4">
              <span className="font-sans text-[14px] md:text-[16px] text-charcoal/70">
                {item.label}
              </span>
              <span className="font-sans text-[14px] md:text-[16px]  text-forest tabular-nums shrink-0">
                ${formatPrice(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Savings */}
      {!disabled && savings !== null && savings !== undefined && savings > 0 && (
        <div className="bg-sage/15 rounded-lg px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-forest shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="font-sans text-[14px]  text-forest">
              {savingsLabel}: ${formatPrice(savings)}
            </span>
          </div>
        </div>
      )}

      {/* Includes */}
      {!disabled && includes && includes.length > 0 && (
        <div className="border-t border-forest/10 pt-4 mb-4">
          <span className="font-sans text-[13px] md:text-[14px]  uppercase tracking-wider text-charcoal/70 mb-2 block">
            Included
          </span>
          <ul className="space-y-1.5">
            {includes.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-sage shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="font-sans text-[14px] md:text-[15px] text-charcoal/70">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Time Estimate */}
      {!disabled && timeEstimate && (
        <div className="flex items-center gap-2 mb-4 text-charcoal/60">
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-sans text-[13px]">Estimated time: {timeEstimate}</span>
        </div>
      )}

      {/* Tax Note */}
      {taxNote && <p className="font-sans text-[12px] italic text-charcoal/50 mb-4">{taxNote}</p>}

      {/* CTA */}
      <Button
        variant="primary"
        link={ctaLink}
        className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {ctaText}
      </Button>
    </div>
  )
}
