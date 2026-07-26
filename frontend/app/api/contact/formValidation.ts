import {z} from 'zod'

export const MAX_CONTACT_BODY_BYTES = 32 * 1024
export const RECAPTCHA_ACTION = 'contact_form'
const WAGS_VERCEL_HOSTNAME_PATTERN =
  /^wags-stay-n-play-frontend(?:-[a-z0-9-]+)?-mhlauf1s-projects\.vercel\.app$/

const optionalShortText = z.string().trim().max(100).optional().default('')

function containsControlCharacters(value: string): boolean {
  return Array.from(value).some((character) => {
    const codePoint = character.codePointAt(0) ?? 0
    return codePoint <= 31 || (codePoint >= 127 && codePoint <= 159)
  })
}

export const contactFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .refine((value) => !containsControlCharacters(value), 'Enter a valid name'),
    email: z.string().trim().max(254).pipe(z.email()),
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

  const reader = request.body?.getReader()
  if (!reader) return {status: 'invalid'}

  const chunks: Uint8Array[] = []
  let receivedBytes = 0

  for (;;) {
    const {done, value} = await reader.read()
    if (done) break

    receivedBytes += value.byteLength
    if (receivedBytes > MAX_CONTACT_BODY_BYTES) {
      await reader.cancel()
      return {status: 'too-large'}
    }
    chunks.push(value)
  }

  const bodyBytes = new Uint8Array(receivedBytes)
  let offset = 0
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    const rawBody = new TextDecoder('utf-8', {fatal: true}).decode(bodyBytes)
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
  if (environment.vercelEnv === 'preview' && WAGS_VERCEL_HOSTNAME_PATTERN.test(normalizedHostname)) {
    return true
  }

  return (
    environment.nodeEnv !== 'production' && ['localhost', '127.0.0.1'].includes(normalizedHostname)
  )
}
