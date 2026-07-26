import {z} from 'zod'

export const MAX_CONTACT_BODY_BYTES = 32 * 1024
export const RECAPTCHA_ACTION = 'contact_form'

const optionalShortText = z.string().trim().max(100).optional().default('')

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().max(254).email(),
    phone: z
      .string()
      .trim()
      .max(50)
      .refine(
        (value) => value === '' || /^[0-9+().\-\s]{7,50}$/.test(value),
        'Enter a valid phone number',
      )
      .optional()
      .default(''),
    service: z
      .enum(['Daycare', 'Boarding', 'Grooming', 'Assessment', 'Other'])
      .or(z.literal(''))
      .optional()
      .default(''),
    petName: optionalShortText,
    message: z.string().trim().min(1).max(5000),
    companyWebsite: z.string().max(200).optional().default(''),
    recaptchaToken: z.string().max(4096).optional(),
  })
  .strict()

export type ContactFormPayload = z.infer<typeof contactFormSchema>

type ReadContactBodyResult =
  | {status: 'valid'; value: unknown}
  | {status: 'invalid'}
  | {status: 'too-large'}

export async function readContactBody(request: Request): Promise<ReadContactBodyResult> {
  const contentType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
  if (contentType !== 'application/json') return {status: 'invalid'}

  const declaredLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > MAX_CONTACT_BODY_BYTES) {
    return {status: 'too-large'}
  }

  const rawBody = await request.text()
  if (new TextEncoder().encode(rawBody).byteLength > MAX_CONTACT_BODY_BYTES) {
    return {status: 'too-large'}
  }

  try {
    const value: unknown = JSON.parse(rawBody)
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {status: 'invalid'}
    return {status: 'valid', value}
  } catch {
    return {status: 'invalid'}
  }
}

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

export function isAllowedRecaptchaHostname(
  hostname: string | undefined,
  environment: {nodeEnv?: string; vercelEnv?: string} = {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  },
): boolean {
  if (!hostname) return false

  const normalizedHostname = hostname.toLowerCase()
  if (['wagsstaynplay.com', 'www.wagsstaynplay.com'].includes(normalizedHostname)) return true
  if (environment.vercelEnv === 'preview' && normalizedHostname.endsWith('.vercel.app')) return true

  return (
    environment.nodeEnv !== 'production' && ['localhost', '127.0.0.1'].includes(normalizedHostname)
  )
}
