// ─── Daycare ────────────────────────────────────────────────
export type DayType = 'full' | 'half' | 'cat'
export type DaycarePackage = 'single' | '10-day' | '20-day' | '30-day' | '90-day'

export type PackageMeta = {
  days: number | null
  fullRate: number
  halfRate: number
  catRate: number
  fullTotal?: number
  halfTotal?: number
  label: string
  badge?: string
  validity?: string
  note?: string
}

export const assessmentDayFee = 20

export const daycarePackages: Record<DaycarePackage, PackageMeta> = {
  single: {
    days: null,
    fullRate: 29,
    halfRate: 19,
    catRate: 18,
    label: 'Single Day',
  },
  '10-day': {
    days: 10,
    fullRate: 26.5,
    halfRate: 17.42,
    catRate: 18,
    fullTotal: 265,
    label: '10-Day Punch Card',
    badge: 'Save $25',
  },
  '20-day': {
    days: 20,
    fullRate: 23.75,
    halfRate: 15.63,
    catRate: 18,
    fullTotal: 475,
    label: '20-Day Punch Card',
    badge: 'Save $105',
  },
  '30-day': {
    days: 30,
    fullRate: 21.33,
    halfRate: 14.03,
    catRate: 18,
    fullTotal: 640,
    label: '30-Day Punch Card',
    badge: 'Save $230',
  },
  '90-day': {
    days: null,
    fullRate: 0,
    halfRate: 0,
    catRate: 18,
    fullTotal: 1350,
    label: '90-Day Unlimited',
    badge: 'Unlimited',
    validity: '90 days',
    note: 'Unlimited daycare for 90 days from purchase',
  },
}

export type DaycareDogConfig = {
  id: string
  dayType: DayType
  pkg: DaycarePackage
  days: number
}

export type LineItem = {label: string; amount: number}

export type DaycareResult = {
  total: number
  lineItems: LineItem[]
  savings: number | null
  perVisitRate: number
}

export function calculateDaycarePerDog(input: {dogs: DaycareDogConfig[]}): DaycareResult {
  const {dogs} = input
  const lineItems: LineItem[] = []
  let total = 0
  let totalSavings = 0
  let hasSavings = false

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const meta = daycarePackages[dog.pkg]

    if (dog.dayType === 'cat') {
      const cost = meta.catRate * (meta.days ?? dog.days)
      const dogLabel = dogs.length > 1 ? `Cat ${i + 1}` : 'Your cat'
      lineItems.push({
        label: `${dogLabel} — Cat Daycare (${meta.days ?? dog.days} day${(meta.days ?? dog.days) > 1 ? 's' : ''} @ $${meta.catRate})`,
        amount: cost,
      })
      total += cost
      continue
    }

    if (dog.pkg === '90-day') {
      const dogLabel = dogs.length > 1 ? `Dog ${i + 1}` : 'Your dog'
      lineItems.push({
        label: `${dogLabel} — 90-Day Unlimited Daycare`,
        amount: 1350,
      })
      total += 1350
      const singleRate = daycarePackages.single.fullRate
      totalSavings += singleRate * 90 - 1350
      hasSavings = true
      continue
    }

    const rate = dog.dayType === 'full' ? meta.fullRate : meta.halfRate
    const numDays = meta.days ?? dog.days

    const marketedTotal = dog.dayType === 'full' ? meta.fullTotal : meta.halfTotal
    const cost = marketedTotal ?? rate * numDays

    const pkgLabel = dog.pkg === 'single' ? '' : ` — ${meta.label}`
    const dayTypeLabel = dog.dayType === 'full' ? 'Full Day' : 'Half Day'
    const dogLabel = dogs.length > 1 ? `Dog ${i + 1}` : 'Your dog'
    lineItems.push({
      label: `${dogLabel} — ${dayTypeLabel}${pkgLabel} (${numDays} day${numDays > 1 ? 's' : ''} @ $${rate})`,
      amount: cost,
    })

    total += cost

    if (dog.pkg !== 'single') {
      const singleRate = dog.dayType === 'full' ? daycarePackages.single.fullRate : daycarePackages.single.halfRate
      totalSavings += singleRate * numDays - cost
      hasSavings = true
    }
  }

  const firstDog = dogs[0]
  const firstMeta = daycarePackages[firstDog.pkg]
  let perVisitRate: number
  if (firstDog.dayType === 'cat') {
    perVisitRate = firstMeta.catRate
  } else if (firstDog.pkg === '90-day') {
    perVisitRate = 15
  } else {
    perVisitRate = firstDog.dayType === 'full' ? firstMeta.fullRate : firstMeta.halfRate
  }

  return {total, lineItems, savings: hasSavings ? totalSavings : null, perVisitRate}
}

// ─── Boarding ───────────────────────────────────────────────
export type RoomType = 'standard' | 'junior' | 'queen' | 'master'

export type RoomMeta = {
  label: string
  rate: number
  description: string
  note?: string
}

export const boardingRooms: Record<RoomType, RoomMeta> = {
  standard: {
    label: 'Standard',
    rate: 44,
    description: 'Comfortable kennel boarding',
  },
  junior: {
    label: 'Junior Suite',
    rate: 48,
    description: 'A step up in space and comfort',
  },
  queen: {
    label: 'Queen Suite',
    rate: 52,
    description: 'More room to stretch out',
  },
  master: {
    label: 'Master Suite',
    rate: 57,
    description: 'Our largest and most spacious option',
  },
}

export const boardingAdditionalPetDiscount = 5
export const catBoardingRate = 28

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
    const rate = isAdditional ? room.rate - boardingAdditionalPetDiscount : room.rate
    const cost = rate * dog.nights

    const dogLabel = dogs.length > 1 ? `Dog ${i + 1}` : 'Your dog'
    const rateLabel = isAdditional
      ? `${room.label} (shared) — ${dog.nights} night${dog.nights > 1 ? 's' : ''} @ $${rate}/night`
      : `${room.label} — ${dog.nights} night${dog.nights > 1 ? 's' : ''} @ $${rate}/night`
    lineItems.push({
      label: `${dogLabel} — ${rateLabel}`,
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
  xl: 150,
}

export const exitBathRates: Record<DogSize, number> = {
  s: 18,
  m: 23,
  l: 28,
  xl: 37,
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
]

export const exitBathAddOns: AlaCarteItem[] = [
  {id: 'nailTrim', label: 'Nail Trim', price: 5},
  {id: 'teethBrushing', label: 'Teeth Brushing', price: 5},
  {id: 'earCleaning', label: 'Ear Cleaning', price: 5},
  {id: 'analGland', label: 'Anal Gland Expression', price: 5},
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

  const addOnItems = service === 'exitBath' ? exitBathAddOns : alaCarteItems
  for (const itemId of alaCarte) {
    const item = addOnItems.find((a) => a.id === itemId)
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
