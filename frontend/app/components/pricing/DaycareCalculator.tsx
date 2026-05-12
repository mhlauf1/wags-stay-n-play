'use client'

import {useState, useMemo, useCallback} from 'react'
import {NumberStepper, RadioGroup, AddDogButton, ContactNotice} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {calculateDaycarePerDog, daycarePackages} from '@/app/data/pricingData'
import type {DayType, DaycarePackage, DaycareDogConfig} from '@/app/data/pricingData'
import type {DereferencedLink} from '@/sanity/lib/types'

type DaycareCalculatorProps = {
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
}

let dogIdCounter = 1

function createDog(): DaycareDogConfig {
  return {id: String(dogIdCounter++), dayType: 'full', pkg: 'single', days: 1}
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
          ctaLink={{_type: 'link', linkType: 'href', href: 'tel:3146316738'}}
          taxNote={taxNote}
          disabled
          disabledMessage="Please call for custom pricing for 4+ dogs."
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
      {/* Inputs */}
      <div className="space-y-6">
        <div className="space-y-3">
          <span className="block text-cream/70 font-sans text-[13px] font-medium uppercase tracking-wider">
            {dogs.length > 1 ? 'Your Dogs' : 'Your Dog'}
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
        savings={result.savings}
        savingsLabel="Package savings"
      />
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
  const meta = daycarePackages[dog.pkg]

  return (
    <div className="bg-forest-card border border-border-dark rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[14px] font-medium text-cream">
          {total > 1 ? `Dog ${index + 1}` : 'Your Dog'}
        </span>
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="font-sans text-[12px] text-cream/40 hover:text-terracotta-light transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <RadioGroup
        label="Day Type"
        options={[
          {label: 'Full Day', value: 'full'},
          {label: 'Half Day', value: 'half'},
        ]}
        value={dog.dayType}
        onChange={(v) => onUpdate({dayType: v as DayType})}
      />

      <RadioGroup
        label="Package"
        options={Object.entries(daycarePackages).map(([value, pkg]) => ({
          label: pkg.label,
          value,
          description: pkg.badge ? `${pkg.badge}${pkg.validity ? ` · Valid ${pkg.validity}` : ''}` : pkg.validity ? `Valid ${pkg.validity}` : undefined,
        }))}
        value={dog.pkg}
        onChange={(v) => onUpdate({pkg: v as DaycarePackage})}
      />

      {dog.pkg === 'single' && (
        <NumberStepper
          label="Number of Days"
          value={dog.days}
          min={1}
          max={30}
          onChange={(v) => onUpdate({days: v})}
        />
      )}

      {meta.note && (
        <p className="font-sans text-[12px] text-cream/50 italic">{meta.note}</p>
      )}
    </div>
  )
}
