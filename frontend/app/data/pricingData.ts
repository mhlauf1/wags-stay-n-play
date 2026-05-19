// ─── Daycare ────────────────────────────────────────────────
export type DayType = 'full' | 'half' | 'cat'

export const daycareRates: Record<DayType, number> = {
  full: 33,
  half: 23,
  cat: 22,
}

export type DaycarePackage = {
  days: number
  price: number
  expiration: string
}

export const daycarePackages: DaycarePackage[] = [
  {days: 10, price: 300, expiration: '2 months'},
  {days: 20, price: 575, expiration: '4 months'},
  {days: 30, price: 795, expiration: '6 months'},
]

export type DaycareDogConfig = {
  id: string
  dayType: DayType
  days: number
}

export type LineItem = {label: string; amount: number}

export type DaycareResult = {
  total: number
  lineItems: LineItem[]
  perVisitRate: number
}

export function calculateDaycarePerDog(input: {dogs: DaycareDogConfig[]}): DaycareResult {
  const {dogs} = input
  const lineItems: LineItem[] = []
  let total = 0

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const rate = daycareRates[dog.dayType]
    const cost = rate * dog.days

    const isCat = dog.dayType === 'cat'
    const dayTypeLabel = isCat ? 'Cat Daycare' : dog.dayType === 'full' ? 'Full Day' : 'Half Day'
    const petLabel =
      dogs.length > 1 ? (isCat ? `Cat ${i + 1}` : `Dog ${i + 1}`) : isCat ? 'Your cat' : 'Your dog'

    lineItems.push({
      label: `${petLabel} — ${dayTypeLabel} (${dog.days} day${dog.days > 1 ? 's' : ''} @ $${rate})`,
      amount: cost,
    })
    total += cost
  }

  return {total, lineItems, perVisitRate: daycareRates[dogs[0].dayType]}
}

// ─── Boarding ───────────────────────────────────────────────
export type RoomType = 'standard' | 'junior' | 'queen' | 'master' | 'catCondo'

export type RoomMeta = {
  label: string
  rate: number
  description: string
  maxPets: number
}

export const boardingRooms: Record<RoomType, RoomMeta> = {
  standard: {
    label: 'Standard Suite',
    rate: 48,
    description: 'Up to 35 lbs · Single dog only',
    maxPets: 1,
  },
  junior: {
    label: 'Junior Suite',
    rate: 52,
    description: 'Up to 65 lbs · A step up in space and comfort',
    maxPets: 2,
  },
  queen: {
    label: 'Queen Suite',
    rate: 56,
    description: 'More room to stretch out',
    maxPets: 2,
  },
  master: {
    label: 'Master Suite',
    rate: 63,
    description: 'Our largest and most spacious option',
    maxPets: 4,
  },
  catCondo: {
    label: 'Cat Condo',
    rate: 32,
    description: 'Private room for cats',
    maxPets: 2,
  },
}

export type BoardingDogConfig = {
  id: string
  nights: number
  roomType: RoomType
}

export type BoardingResult = {
  total: number
  lineItems: LineItem[]
  nightlyRate: number
  includes: string[]
}

export function calculateBoardingPerDog(input: {dogs: BoardingDogConfig[]}): BoardingResult {
  const {dogs} = input
  const lineItems: LineItem[] = []
  let total = 0

  const room = boardingRooms[dogs[0].roomType]

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const isAdditional = i > 0
    const discountRate =
      dogs[0].roomType === 'catCondo' ? 0.5 : 0.65
    const rate = isAdditional ? Math.round(room.rate * discountRate * 100) / 100 : room.rate
    const cost = rate * dog.nights

    const petLabel =
      dogs.length > 1
        ? dogs[0].roomType === 'catCondo'
          ? `Cat ${i + 1}`
          : `Dog ${i + 1}`
        : dogs[0].roomType === 'catCondo'
          ? 'Your cat'
          : 'Your dog'
    const rateLabel = isAdditional
      ? `${room.label} (shared) — ${dog.nights} night${dog.nights > 1 ? 's' : ''} @ $${rate}/night`
      : `${room.label} — ${dog.nights} night${dog.nights > 1 ? 's' : ''} @ $${rate}/night`
    lineItems.push({
      label: `${petLabel} — ${rateLabel}`,
      amount: cost,
    })
    total += cost
  }

  return {
    total,
    lineItems,
    nightlyRate: room.rate,
    includes: ['Daycare participation', 'Meal administration', 'Medicine administration'],
  }
}

// ─── Boarding & Daycare Add-Ons ─────────────────────────────
export type AddOnItem = {
  id: string
  label: string
  price: number
  category?: 'operational' | 'treat'
}

export const boardingAddOns: AddOnItem[] = [
  {id: 'frozenKong', label: 'Frozen Kong', price: 3, category: 'treat'},
  {id: 'breakawayCollarSmall', label: 'Breakaway Collar (≤40 lbs)', price: 21},
  {id: 'breakawayCollarLarge', label: 'Breakaway Collar (40+ lbs)', price: 26},
  {id: 'rentalCollar', label: 'Paper Rental Collar', price: 1, category: 'operational'},
  {id: 'medicationFee', label: 'Medication Fee', price: 5, category: 'operational'},
]

// ─── Grooming ───────────────────────────────────────────────
export type GroomingService = 'fullGroom' | 'bathWorks' | 'exitBath'
export type DogSize = 's' | 'm' | 'l' | 'xl'

export const fullGroomRates: Record<DogSize, number> = {
  s: 65,
  m: 70,
  l: 90,
  xl: 130,
}

export const bathWorksRates: Record<DogSize, number> = {
  s: 55,
  m: 60,
  l: 100,
  xl: 120,
}

export const exitBathRates: Record<DogSize, number> = {
  s: 18,
  m: 23,
  l: 28,
  xl: 32,
}

export const groomingRates: Record<GroomingService, Record<DogSize, number>> = {
  fullGroom: fullGroomRates,
  bathWorks: bathWorksRates,
  exitBath: exitBathRates,
}

export type AlaCarteItem = {
  id: string
  label: string
  price: number
}

export const alaCarteItems: AlaCarteItem[] = [
  {id: 'nailTrim', label: 'Nail Trim', price: 8},
  {id: 'earCleaning', label: 'Ear Cleaning', price: 8},
  {id: 'analGland', label: 'Anal Gland Expression', price: 8},
  {id: 'teethBrushing', label: 'Teeth Brushing', price: 8},
  {id: 'nailTrimFile', label: 'Nail Trim & File', price: 20},
  {id: 'blueberryFacial', label: 'Blueberry Facial', price: 8},
  {id: 'trimsBrushOut', label: 'Trims & Brush Out', price: 25},
  {id: 'catNailTrim', label: 'Cat Nail Trim', price: 5},
]

export const sizeLabels: Record<DogSize, string> = {
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'X-Large',
}

export const shortSizeLabels: Record<DogSize, string> = {
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'XL',
}

export const serviceLabels: Record<GroomingService, string> = {
  fullGroom: 'Full Groom',
  bathWorks: 'Bath & Works',
  exitBath: 'Exit Bath',
}

export const serviceDescriptions: Record<GroomingService, string> = {
  fullGroom: 'Nail trim, ear cleaning, glands, bath, blow dry, brush out, full hair trim',
  bathWorks: 'Nail trim, ear cleaning, glands, bath, blow dry, brush out',
  exitBath: 'Bath with shampoo/conditioner, blow dry',
}

export type DogConfig = {id: string; size: DogSize}

export type GroomingResult = {
  total: number
  lineItems: LineItem[]
  isStartingAt: boolean
}

export function calculateGrooming(input: {
  service: GroomingService
  dogs: DogConfig[]
  alaCarte: string[]
}): GroomingResult {
  const {service, dogs, alaCarte} = input
  const lineItems: LineItem[] = []
  let total = 0

  const rates = groomingRates[service]

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const price = rates[dog.size]
    total += price

    const dogLabel = dogs.length > 1 ? `Dog ${i + 1} (${shortSizeLabels[dog.size]})` : shortSizeLabels[dog.size]
    lineItems.push({
      label: `${dogLabel} — ${serviceLabels[service]}`,
      amount: price,
    })
  }

  for (const itemId of alaCarte) {
    const item = alaCarteItems.find((a) => a.id === itemId)
    if (item) {
      const itemTotal = item.price * dogs.length
      total += itemTotal
      lineItems.push({
        label: `${item.label} (${dogs.length} dog${dogs.length > 1 ? 's' : ''})`,
        amount: itemTotal,
      })
    }
  }

  return {
    total,
    lineItems,
    isStartingAt: service !== 'exitBath',
  }
}
