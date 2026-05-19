'use client'

import {useState, useMemo, useCallback} from 'react'
import {NumberStepper, RadioGroup, AddDogButton, ContactNotice} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {calculateBoardingPerDog, boardingRooms} from '@/app/data/pricingData'
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

  const selectedRoom = boardingRooms[dogs[0].roomType]

  const handleUpdateDog = useCallback((index: number, updates: Partial<BoardingDogConfig>) => {
    setDogs((prev) => prev.map((d, i) => (i === index ? {...d, ...updates} : d)))
  }, [])

  const handleRemoveDog = useCallback((index: number) => {
    setDogs((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleAddDog = useCallback(() => {
    setDogs((prev) => {
      const room = boardingRooms[prev[0].roomType]
      if (prev.length >= room.maxPets) return prev
      return [...prev, createDog()]
    })
  }, [])

  const handleRoomChange = useCallback((roomType: RoomType) => {
    const newRoom = boardingRooms[roomType]
    setDogs((prev) => {
      const updated = prev.map((d) => ({...d, roomType}))
      if (updated.length > newRoom.maxPets) {
        return updated.slice(0, newRoom.maxPets)
      }
      return updated
    })
  }, [])

  const result = useMemo(() => calculateBoardingPerDog({dogs}), [dogs])

  if (dogs.length > selectedRoom.maxPets) {
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
          disabledMessage="Please call for custom pricing."
        />
      </div>
    )
  }

  const canAddPet = dogs.length < selectedRoom.maxPets

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
      {/* Inputs */}
      <div className="space-y-6">
        <div className="space-y-3">
          <span className="block text-cream/70 font-sans text-[14px] md:text-[16px] font-medium uppercase tracking-wider">
            {dogs.length > 1 ? (dogs[0].roomType === 'catCondo' ? 'Your Cats' : 'Your Dogs') : dogs[0].roomType === 'catCondo' ? 'Your Cat' : 'Your Dog'}
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
              onRoomChange={i === 0 ? handleRoomChange : undefined}
            />
          ))}
          {canAddPet && <AddDogButton onClick={handleAddDog} />}
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
  onRoomChange?: (roomType: RoomType) => void
}

function BoardingDogCard({
  dog,
  index,
  total,
  isAdditional,
  onUpdate,
  onRemove,
  onRoomChange,
}: BoardingDogCardProps) {
  const isCat = dog.roomType === 'catCondo'

  return (
    <div className="bg-forest-card border border-border-dark rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[14px] md:text-[16px] font-medium text-cream">
          {total > 1 ? (isCat ? `Cat ${index + 1}` : `Dog ${index + 1}`) : isCat ? 'Your Cat' : 'Your Dog'}
          {isAdditional && (
            <span className="text-cream/50 text-[14px] md:text-[16px] ml-2">
              ({dog.roomType === 'catCondo' ? '50' : '35'}% off)
            </span>
          )}
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

      {!isAdditional && onRoomChange && (
        <RadioGroup
          label="Room Type"
          options={Object.entries(boardingRooms).map(([value, meta]) => ({
            label: `${meta.label} — $${meta.rate}/night`,
            value,
            description: meta.description,
          }))}
          value={dog.roomType}
          onChange={(v) => onRoomChange(v as RoomType)}
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
