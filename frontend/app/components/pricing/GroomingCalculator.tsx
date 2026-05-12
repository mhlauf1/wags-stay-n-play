'use client'

import {useState, useMemo, useCallback} from 'react'
import {AddDogButton, CheckboxGroup, RadioGroup} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {calculateGrooming, sizeLabels, serviceLabels, hairLengthLabels, alaCarteItems} from '@/app/data/pricingData'
import type {GroomingService, DogSize, HairLength, DogConfig} from '@/app/data/pricingData'
import type {DereferencedLink} from '@/sanity/lib/types'

type GroomingCalculatorProps = {
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
}

const availableSizes: DogSize[] = ['s', 'm', 'l', 'xl']

let dogIdCounter = 1

function createDog(size: DogSize = 'm'): DogConfig {
  return {id: String(dogIdCounter++), size, hairLength: 'short', isDoodle: false}
}

export default function GroomingCalculator({ctaText, ctaLink, taxNote}: GroomingCalculatorProps) {
  const [dogs, setDogs] = useState<DogConfig[]>(() => [createDog()])
  const [service, setService] = useState<GroomingService>('bath')
  const [alaCarte, setAlaCarte] = useState<string[]>([])
  const [addTeethCleaning, setAddTeethCleaning] = useState(false)

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
    const newService = v as GroomingService
    setService(newService)
    if (newService === 'bath') {
      setAddTeethCleaning(false)
    }
  }, [])

  const result = useMemo(
    () => calculateGrooming({service, dogs, alaCarte, addTeethCleaning}),
    [service, dogs, alaCarte, addTeethCleaning],
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
      {/* Inputs */}
      <div className="space-y-6">
        <RadioGroup
          label="Service Type"
          options={Object.entries(serviceLabels).map(([value, label]) => ({label, value}))}
          value={service}
          onChange={handleServiceChange}
        />

        {/* Dog Cards */}
        <div className="space-y-3">
          <span className="block text-cream/70 font-sans text-[13px] font-medium uppercase tracking-wider">
            {dogs.length > 1 ? 'Your Dogs' : 'Your Dog'}
          </span>
          {dogs.map((dog, i) => (
            <GroomingDogCard
              key={dog.id}
              dog={dog}
              index={i}
              total={dogs.length}
              service={service}
              availableSizes={availableSizes}
              onUpdate={(updates) => handleUpdateDog(i, updates)}
              onRemove={() => handleRemoveDog(i)}
            />
          ))}
          {dogs.length < 3 && <AddDogButton onClick={handleAddDog} />}
        </div>

        {/* À la carte add-ons */}
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

        {/* Teeth cleaning add-on for full groom */}
        {service === 'fullGroom' && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={addTeethCleaning}
              onChange={(e) => setAddTeethCleaning(e.target.checked)}
              className="w-4 h-4 rounded border-border-dark bg-forest-card text-terracotta focus:ring-terracotta/50"
            />
            <span className="font-sans text-[13px] text-cream/70 group-hover:text-cream transition-colors">
              Add Teeth Cleaning to groom — $10/dog
            </span>
          </label>
        )}

        {result.isStartingAt && (
          <p className="font-sans text-[12px] text-cream/50 italic">
            Final pricing determined by behavior, coat density, coat condition, and grooming time.
          </p>
        )}
      </div>

      {/* Output */}
      <PriceOutputCard
        total={result.total}
        lineItems={result.lineItems}
        ctaText={ctaText}
        ctaLink={ctaLink}
        taxNote={taxNote}
        includes={result.includes.length > 0 ? result.includes : undefined}
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
  service: GroomingService
  availableSizes: DogSize[]
  onUpdate: (updates: Partial<DogConfig>) => void
  onRemove: () => void
}

function GroomingDogCard({dog, index, total, service, availableSizes: sizes, onUpdate, onRemove}: GroomingDogCardProps) {
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

      {/* Size */}
      <div>
        <span className="block text-cream/70 font-sans text-[12px] font-medium uppercase tracking-wider mb-1.5">
          Size
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onUpdate({size: s})}
              className={`font-sans text-[13px] font-medium px-3 py-1.5 rounded-full border transition-all ${
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

      {/* Hair Length — only for bath */}
      {service === 'bath' && (
        <div>
          <span className="block text-cream/70 font-sans text-[12px] font-medium uppercase tracking-wider mb-1.5">
            Hair Length
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(['short', 'long'] as HairLength[]).map((hl) => (
              <button
                key={hl}
                type="button"
                onClick={() => onUpdate({hairLength: hl})}
                className={`font-sans text-[13px] font-medium px-3 py-1.5 rounded-full border transition-all ${
                  dog.hairLength === hl
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'bg-transparent text-cream/70 border-border-dark hover:border-cream/40 hover:text-cream'
                }`}
              >
                {hairLengthLabels[hl]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Doodle/Specialty toggle — only for full groom */}
      {service === 'fullGroom' && (
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={dog.isDoodle}
            onChange={(e) => onUpdate({isDoodle: e.target.checked})}
            className="w-4 h-4 rounded border-border-dark bg-forest-card text-terracotta focus:ring-terracotta/50"
          />
          <span className="font-sans text-[13px] text-cream/70 group-hover:text-cream transition-colors">
            Doodle / Specialty Breed (+$10)
          </span>
        </label>
      )}
    </div>
  )
}
