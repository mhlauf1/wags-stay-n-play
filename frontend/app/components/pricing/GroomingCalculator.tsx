'use client'

import {useState, useMemo, useCallback} from 'react'
import {AddDogButton, CheckboxGroup, RadioGroup} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {calculateGrooming, sizeLabels, serviceLabels, serviceDescriptions, alaCarteItems} from '@/app/data/pricingData'
import type {GroomingService, DogSize, DogConfig} from '@/app/data/pricingData'
import type {DereferencedLink} from '@/sanity/lib/types'

type GroomingCalculatorProps = {
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
}

const availableSizes: DogSize[] = ['s', 'm', 'l', 'xl']

let dogIdCounter = 1

function createDog(size: DogSize = 'm'): DogConfig {
  return {id: String(dogIdCounter++), size}
}

export default function GroomingCalculator({ctaText, ctaLink, taxNote}: GroomingCalculatorProps) {
  const [dogs, setDogs] = useState<DogConfig[]>(() => [createDog()])
  const [service, setService] = useState<GroomingService>('fullGroom')
  const [alaCarte, setAlaCarte] = useState<string[]>([])

  const handleUpdateDog = useCallback((index: number, updates: Partial<DogConfig>) => {
    setDogs((prev) => prev.map((d, i) => (i === index ? {...d, ...updates} : d)))
  }, [])

  const handleRemoveDog = useCallback((index: number) => {
    setDogs((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleAddDog = useCallback(() => {
    setDogs((prev) => {
      if (prev.length >= 3) return prev
      const last = prev[prev.length - 1]
      return [...prev, createDog(last.size)]
    })
  }, [])

  const handleServiceChange = useCallback((v: string) => {
    setService(v as GroomingService)
    setAlaCarte([])
  }, [])

  const result = useMemo(
    () => calculateGrooming({service, dogs, alaCarte}),
    [service, dogs, alaCarte],
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
      {/* Inputs */}
      <div className="space-y-6">
        <RadioGroup
          label="Service Type"
          options={Object.entries(serviceLabels).map(([value, label]) => ({
            label,
            value,
            description: serviceDescriptions[value as GroomingService],
          }))}
          value={service}
          onChange={handleServiceChange}
        />

        {/* Dog Cards */}
        <div className="space-y-3">
          <span className="block text-cream/70 font-sans text-[14px] font-medium uppercase tracking-wider">
            {dogs.length > 1 ? 'Your Dogs' : 'Your Dog'}
          </span>
          {dogs.map((dog, i) => (
            <GroomingDogCard
              key={dog.id}
              dog={dog}
              index={i}
              total={dogs.length}
              availableSizes={availableSizes}
              onUpdate={(updates) => handleUpdateDog(i, updates)}
              onRemove={() => handleRemoveDog(i)}
            />
          ))}
          {dogs.length < 3 && <AddDogButton onClick={handleAddDog} />}
        </div>

        {/* Add-ons */}
        <CheckboxGroup
          label="À La Carte Add-Ons"
          options={alaCarteItems.map((item) => ({
            id: item.id,
            label: item.label,
            detail: `$${item.price}`,
          }))}
          selected={alaCarte}
          onChange={setAlaCarte}
        />

        {result.isStartingAt && (
          <p className="font-sans text-[14px] text-cream/50 italic">
            Prices may vary depending on size, hair length, matting, or additional services.
          </p>
        )}

        {/* Cat grooming info */}
        <div className="border border-border-dark rounded-md px-5 py-4 space-y-2">
          <p className="font-sans text-[16px] font-medium text-cream/80">Cat Grooming</p>
          <ul className="font-sans text-[15px] text-cream/60 space-y-1">
            <li>Lion Cut — $80</li>
            <li>Lion Cut (no bath) — $70</li>
            <li>Cat Bath & Works — $70</li>
            <li>Foam Bath — $15</li>
          </ul>
          <p className="font-sans text-[14px] text-cream/50">
            Add nail trim or teeth brushing for $5 each.
          </p>
        </div>
      </div>

      {/* Output */}
      <PriceOutputCard
        total={result.total}
        lineItems={result.lineItems}
        ctaText={ctaText}
        ctaLink={ctaLink}
        taxNote={taxNote}
        badge={result.isStartingAt ? 'Starting at' : null}
      />
    </div>
  )
}

// ─── Grooming Dog Card ──────────────────────────────────────
type GroomingDogCardProps = {
  dog: DogConfig
  index: number
  total: number
  availableSizes: DogSize[]
  onUpdate: (updates: Partial<DogConfig>) => void
  onRemove: () => void
}

function GroomingDogCard({dog, index, total, availableSizes: sizes, onUpdate, onRemove}: GroomingDogCardProps) {
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
            className="font-sans text-[14px] text-cream/40 hover:text-terracotta-light transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {/* Size */}
      <div>
        <span className="block text-cream/70 font-sans text-[14px] font-medium uppercase tracking-wider mb-1.5">
          Size
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onUpdate({size: s})}
              className={`font-sans text-[14px] font-medium px-3 py-1.5 rounded-full border transition-all ${
                dog.size === s
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'bg-transparent text-cream/70 border-border-dark hover:border-cream/40 hover:text-cream'
              }`}
            >
              {sizeLabels[s]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
