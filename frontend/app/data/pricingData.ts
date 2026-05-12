// ─── Daycare ────────────────────────────────────────────────
export type DayType = 'full' | 'half'
export type DaycarePackage = 'single' | '10-day' | '20-day' | '30-day'

export type PackageMeta = {
  days: number | null
  fullRate: number
  halfRate: number
  fullTotal?: number
  halfTotal?: number
  label: string
  badge?: string
  validity?: string
  note?: string
}

export const daycarePackages: Record<DaycarePackage, PackageMeta> = {
  single: {
    days: null,
    fullRate: 36,
    halfRate: 24,
    label: 'Single Day',
  },
  '10-day': {
    days: 10,
    fullRate: 32.5,
    halfRate: 21.67,
    fullTotal: 325,
    label: '10-Day Package',
    badge: 'Save 10%',
    validity: '2 months',
  },
  '20-day': {
    days: 20,
    fullRate: 30.75,
    halfRate: 20.5,
    fullTotal: 615,
    label: '20-Day Package',
    badge: 'Save 15%',
    validity: '4 months',
  },
  '30-day': {
    days: 30,
    fullRate: 28.83,
    halfRate: 19.22,
    fullTotal: 865,
    label: '30-Day Package',
    badge: 'Save 20%',
    validity: '6 months',
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
  const perVisitRate = firstDog.dayType === 'full' ? firstMeta.fullRate : firstMeta.halfRate

  return {total, lineItems, savings: hasSavings ? totalSavings : null, perVisitRate}
}

// ─── Boarding ───────────────────────────────────────────────
export type RoomType = 'standard' | 'vip'

export type RoomMeta = {
  label: string
  rate: number
  description: string
  note?: string
}

export const boardingRooms: Record<RoomType, RoomMeta> = {
  standard: {
    label: 'Standard Room',
    rate: 64,
    description: 'Cage-free, all-inclusive group boarding',
  },
  vip: {
    label: 'VIP Luxury Cottage Suite',
    rate: 125,
    description: 'Premium suite for 1–4 dogs',
    note: 'All-inclusive experience and daycare participation included',
  },
}

export const boardingAdditionalDogRate = 55

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
    const rate = isAdditional ? boardingAdditionalDogRate : room.rate
    const cost = rate * dog.nights

    const dogLabel = dogs.length > 1 ? `Dog ${i + 1}` : 'Your dog'
    const rateLabel = isAdditional
      ? `Additional dog — ${dog.nights} night${dog.nights > 1 ? 's' : ''} @ $${rate}/night`
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
export type GroomingService = 'bath' | 'fullGroom'
export type DogSize = 's' | 'm' | 'l' | 'xl'
export type HairLength = 'short' | 'long'

export const bathRates: Record<DogSize, Record<HairLength, number>> = {
  s: {short: 39, long: 55},
  m: {short: 49, long: 65},
  l: {short: 59, long: 75},
  xl: {short: 69, long: 85},
}

export const fullGroomRates: Record<DogSize, number> = {
  s: 89,
  m: 99,
  l: 109,
  xl: 129,
}

export const doodleSurcharge = 10

export type AlaCarteItem = {
  id: string
  label: string
  price: number
}

export const alaCarteItems: AlaCarteItem[] = [
  {id: 'earCleaning', label: 'Ear Cleaning', price: 8},
  {id: 'glandExpression', label: 'Gland Expression', price: 12},
  {id: 'nailTrimGrind', label: 'Nail Trim & Grind', price: 18},
  {id: 'spotTrim', label: 'Spot Trim', price: 15},
  {id: 'faceFeetSanitary', label: 'Face, Feet & Sanitary', price: 30},
  {id: 'teethBrushing', label: 'Teeth Brushing', price: 15},
]

export const teethCleaningAddOnPrice = 10

export const sizeLabels: Record<DogSize, string> = {
  s: 'Small (under 25 lbs)',
  m: 'Medium (26–40 lbs)',
  l: 'Large (41–80 lbs)',
  xl: 'X-Large (81+ lbs)',
}

export const shortSizeLabels: Record<DogSize, string> = {
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'XL',
}

export const hairLengthLabels: Record<HairLength, string> = {
  short: 'Short Hair',
  long: 'Long Hair',
}

export const serviceLabels: Record<GroomingService, string> = {
  bath: 'Bath',
  fullGroom: 'Full Groom',
}

export const serviceIncludes: Record<GroomingService, string[]> = {
  bath: ['Two premium shampoos', 'High quality conditioner'],
  fullGroom: [],
}

export type DogConfig = {id: string; size: DogSize; hairLength: HairLength; isDoodle: boolean}

export type GroomingResult = {
  total: number
  lineItems: LineItem[]
  includes: string[]
  isStartingAt: boolean
}

export function calculateGrooming(input: {
  service: GroomingService
  dogs: DogConfig[]
  alaCarte: string[]
  addTeethCleaning: boolean
}): GroomingResult {
  const {service, dogs, alaCarte, addTeethCleaning} = input
  const lineItems: LineItem[] = []
  let total = 0

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    let price: number

    if (service === 'bath') {
      price = bathRates[dog.size][dog.hairLength]
    } else {
      price = fullGroomRates[dog.size]
      if (dog.isDoodle) {
        price += doodleSurcharge
      }
    }

    total += price

    const dogLabel = dogs.length > 1 ? `Dog ${i + 1} (${shortSizeLabels[dog.size]})` : shortSizeLabels[dog.size]
    const doodleNote = service === 'fullGroom' && dog.isDoodle ? ' + Doodle/Specialty' : ''
    const hairNote = service === 'bath' ? `, ${hairLengthLabels[dog.hairLength]}` : ''
    lineItems.push({
      label: `${dogLabel}${hairNote} — ${serviceLabels[service]}${doodleNote}`,
      amount: price,
    })
  }

  if (service === 'fullGroom' && addTeethCleaning) {
    const teethTotal = teethCleaningAddOnPrice * dogs.length
    total += teethTotal
    lineItems.push({
      label: `Teeth Cleaning (${dogs.length} dog${dogs.length > 1 ? 's' : ''})`,
      amount: teethTotal,
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
    includes: serviceIncludes[service],
    isStartingAt: service === 'fullGroom',
  }
}
