export function formatUsPhoneNumber(value: string): string {
  const rawDigits = value.replace(/\D/g, '')
  const hasExplicitCountryCode = value.trim().startsWith('+1') || rawDigits.length === 11
  const digits = (
    hasExplicitCountryCode && rawDigits.startsWith('1') ? rawDigits.slice(1) : rawDigits
  ).slice(0, 10)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
