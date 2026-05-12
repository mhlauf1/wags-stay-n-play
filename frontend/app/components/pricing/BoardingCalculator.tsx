'use client'

import {useState, useMemo, useCallback} from 'react'
import {NumberStepper, RadioGroup, AddDogButton, ContactNotice} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {
  calculateBoardingPerDog,
  boardingRooms,
  boardingAdditionalPetDiscount,
  catBoardingRate,
} from '@/app/data/pricingData'
import type {RoomType, BoardingDogConfig} from '@/app/data/pricingData'
import type {DereferencedLink} from '@/sanity/lib/types'

type BoardingCalculatorProps = {
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
}

let dogIdCounter = 1

function createDog(): BoardingDogConfig {
  return {id: String(dogIdCounter++), nights: 1, roomType: 'standard'}
}

export default function BoardingCalculator({ctaText, ctaLink, taxNote}: BoardingCalculatorProps) {
  const [dogs, setDogs] = useState<BoardingDogConfig[]>(() => [createDog()])

  const handleUpdateDog = useCallback((index: number, updates: Partial<BoardingDogConfig>) => {
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

  const result = useMemo(() => calculateBoardingPerDog({dogs}), [dogs])

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
          <span className="block text-cream/70 font-sans text-[14px] md:text-[16px] font-medium uppercase tracking-wider">
            {dogs.length > 1 ? 'Your Dogs' : 'Your Dog'}
          </span>
          {dogs.map((dog, i) => (
            <BoardingDogCard
              key={dog.id}
              dog={dog}
              index={i}
              total={dogs.length}
              isAdditional={i > 0}
              onUpdate={(updates) => handleUpdateDog(i, updates)}
              onRemove={() => handleRemoveDog(i)}
            />
          ))}
          {dogs.length < 3 && <AddDogButton onClick={handleAddDog} />}
        </div>

        {/* Cat boarding info */}
        <div className="border border-border-dark rounded-md px-3 py-2 space-y-1">
          <p className="font-sans text-[13px] text-cream/60">
            Cat boarding: ${catBoardingRate}/night. No assessment required.
          </p>
          <p className="font-sans text-[12px] text-cream/40">
            Call us at (218) 287-2000 to book cat boarding.
          </p>
        </div>

        {/* Punch card info */}
        <div className="border border-border-dark rounded-md px-3 py-2 space-y-1">
          <p className="font-sans text-[13px] font-medium text-cream/70">Punch Card Deals</p>
          <ul className="font-sans text-[12px] text-cream/50 space-y-0.5">
            <li>10-Pack: Buy 9, get 1 free</li>
            <li>20-Pack: Buy 17, get 3 free</li>
            <li>30-Pack: Buy 24, get 6 free</li>
          </ul>
        </div>
      </div>

      {/* Output */}
      <PriceOutputCard
        total={result.total}
        lineItems={result.lineItems}
        ctaText={ctaText}
        ctaLink={ctaLink}
        taxNote={taxNote}
        includes={result.includes}
      />
    </div>
  )
}

// ─── Boarding Dog Card ──────────────────────────────────────
type BoardingDogCardProps = {
  dog: BoardingDogConfig
  index: number
  total: number
  isAdditional: boolean
  onUpdate: (updates: Partial<BoardingDogConfig>) => void
  onRemove: () => void
}

function BoardingDogCard({
  dog,
  index,
  total,
  isAdditional,
  onUpdate,
  onRemove,
}: BoardingDogCardProps) {
  return (
    <div className="bg-forest-card border border-border-dark rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[14px] md:text-[16px] font-medium text-cream">
          {total > 1 ? `Dog ${index + 1}` : 'Your Dog'}
          {isAdditional && (
            <span className="text-cream/50 text-[14px] md:text-[16px] ml-2">
              ($${boardingAdditionalPetDiscount} off/night)
            </span>
          )}
        </span>
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="font-sans text-[12px] md:text-[14px] text-cream/40 hover:text-terracotta-light transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {!isAdditional && (
        <RadioGroup
          label="Room Type"
          options={Object.entries(boardingRooms).map(([value, meta]) => ({
            label: `${meta.label} — $${meta.rate}/night`,
            value,
            description: meta.description,
          }))}
          value={dog.roomType}
          onChange={(v) => onUpdate({roomType: v as RoomType})}
        />
      )}

      <NumberStepper
        label="Nights"
        value={dog.nights}
        min={1}
        max={30}
        onChange={(v) => onUpdate({nights: v})}
      />
    </div>
  )
}
