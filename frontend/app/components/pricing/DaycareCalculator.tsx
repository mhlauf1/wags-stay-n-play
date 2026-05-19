'use client'

import {useState, useMemo, useCallback} from 'react'
import {NumberStepper, RadioGroup, AddDogButton, ContactNotice} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {calculateDaycarePerDog, daycareRates, daycarePackages} from '@/app/data/pricingData'
import type {DayType, DaycareDogConfig} from '@/app/data/pricingData'
import type {DereferencedLink} from '@/sanity/lib/types'

type DaycareCalculatorProps = {
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
}

let dogIdCounter = 1

function createDog(): DaycareDogConfig {
  return {id: String(dogIdCounter++), dayType: 'full', days: 1}
}

export default function DaycareCalculator({ctaText, ctaLink, taxNote}: DaycareCalculatorProps) {
  const [dogs, setDogs] = useState<DaycareDogConfig[]>(() => [createDog()])

  const handleUpdateDog = useCallback((index: number, updates: Partial<DaycareDogConfig>) => {
    setDogs((prev) => prev.map((d, i) => (i === index ? {...d, ...updates} : d)))
  }, [])

  const handleRemoveDog = useCallback((index: number) => {
    setDogs((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleAddDog = useCallback(() => {
    setDogs((prev) => {
      if (prev.length >= 3) return prev
      return [...prev, createDog()]
    })
  }, [])

  const result = useMemo(
    () => calculateDaycarePerDog({dogs}),
    [dogs],
  )

  if (dogs.length > 3) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        <div className="space-y-6">
          <ContactNotice />
        </div>
        <PriceOutputCard
          total={0}
          lineItems={[]}
          ctaText="Call Us"
          ctaLink={{_type: 'link', linkType: 'href', href: 'tel:2182872000'}}
          taxNote={taxNote}
          disabled
          disabledMessage="Please call for custom pricing for 4+ pets."
        />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="block text-cream/70 font-sans text-[14px] font-medium uppercase tracking-wider">
              {dogs.length > 1 ? 'Your Pets' : 'Your Pet'}
            </span>
            {dogs.map((dog, i) => (
              <DaycareDogCard
                key={dog.id}
                dog={dog}
                index={i}
                total={dogs.length}
                onUpdate={(updates) => handleUpdateDog(i, updates)}
                onRemove={() => handleRemoveDog(i)}
              />
            ))}
            {dogs.length < 3 && <AddDogButton onClick={handleAddDog} />}
          </div>
        </div>

        {/* Output */}
        <PriceOutputCard
          total={result.total}
          lineItems={result.lineItems}
          ctaText={ctaText}
          ctaLink={ctaLink}
          taxNote={taxNote}
        />
      </div>

      {/* Daycare Packages */}
      <div>
        <span className="block text-cream/70 font-sans text-[14px] font-medium uppercase tracking-wider mb-3">
          Daycare Packages
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {daycarePackages.map((pkg) => (
            <div
              key={pkg.days}
              className="bg-forest-card border border-border-dark rounded-lg px-5 py-5 text-center"
            >
              <span className="block text-cream font-semibold text-[20px] md:text-[24px] mb-1">
                {pkg.days}-Day Pack
              </span>
              <span className="block text-sand text-[28px] md:text-[32px] font-semibold tracking-tight">
                ${pkg.price}
              </span>
              <span className="block text-cream/50 font-sans text-[14px] mt-1">
                Expires in {pkg.expiration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Daycare Dog Card ───────────────────────────────────────
type DaycareDogCardProps = {
  dog: DaycareDogConfig
  index: number
  total: number
  onUpdate: (updates: Partial<DaycareDogConfig>) => void
  onRemove: () => void
}

function DaycareDogCard({dog, index, total, onUpdate, onRemove}: DaycareDogCardProps) {
  const isCat = dog.dayType === 'cat'

  return (
    <div className="bg-forest-card border border-border-dark rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[14px] font-medium text-cream">
          {total > 1 ? (isCat ? `Cat ${index + 1}` : `Dog ${index + 1}`) : isCat ? 'Your Cat' : 'Your Dog'}
        </span>
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="font-sans text-[14px] text-cream/40 hover:text-terracotta-light transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <RadioGroup
        label="Day Type"
        options={[
          {label: 'Full Day', value: 'full', description: `$${daycareRates.full}`},
          {label: 'Half Day', value: 'half', description: `$${daycareRates.half} · 5hrs or less`},
          {label: 'Cat Daycare', value: 'cat', description: `$${daycareRates.cat}`},
        ]}
        value={dog.dayType}
        onChange={(v) => onUpdate({dayType: v as DayType})}
      />

      <NumberStepper
        label="Number of Days"
        value={dog.days}
        min={1}
        max={30}
        onChange={(v) => onUpdate({days: v})}
      />
    </div>
  )
}
