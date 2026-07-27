import {NextResponse} from 'next/server'
import nodemailer from 'nodemailer'
import {
  contactFormSchema,
  isAllowedRecaptchaHostname,
  isHoneypotFilled,
  readContactBody,
  RECAPTCHA_ACTION,
} from './formValidation'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const toEmail = process.env.CONTACT_FORM_TO_EMAIL || ''
const bccEmail = process.env.CONTACT_FORM_BCC_EMAIL || ''
const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || ''
const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || ''
const RECAPTCHA_MIN_SCORE = 0.5
const RECAPTCHA_TIMEOUT_MS = 3000
const RECAPTCHA_MAX_ATTEMPTS = 2

type RecaptchaVerification =
  | {status: 'verified'}
  | {status: 'rejected'}
  | {status: 'unavailable'}
  | {status: 'misconfigured'}
  | {status: 'skipped-development'}

async function verifyRecaptcha(token: string | undefined): Promise<RecaptchaVerification> {
  if (!recaptchaSecret) {
    return process.env.NODE_ENV === 'production'
      ? {status: 'misconfigured'}
      : {status: 'skipped-development'}
  }
  if (!token) return {status: 'rejected'}

  let lastError: unknown

  for (let attempt = 1; attempt <= RECAPTCHA_MAX_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({secret: recaptchaSecret, response: token}),
        signal: AbortSignal.timeout(RECAPTCHA_TIMEOUT_MS),
      })

      if (!res.ok) throw new Error(`reCAPTCHA verification returned HTTP ${res.status}`)

      const data = (await res.json()) as {
        success?: boolean
        score?: number
        action?: string
        hostname?: string
        'error-codes'?: string[]
      }

      if (
        attempt > 1 &&
        data.success !== true &&
        data['error-codes']?.includes('timeout-or-duplicate')
      ) {
        return {status: 'unavailable'}
      }

      const verified =
        data.success === true &&
        (data.score ?? 0) >= RECAPTCHA_MIN_SCORE &&
        data.action === RECAPTCHA_ACTION &&
        isAllowedRecaptchaHostname(data.hostname)

      return verified ? {status: 'verified'} : {status: 'rejected'}
    } catch (error) {
      lastError = error
    }
  }

  console.error('reCAPTCHA verification unavailable after retries:', lastError)
  return {status: 'unavailable'}
}

export async function POST(request: Request) {
  try {
    const bodyResult = await readContactBody(request)

    if (bodyResult.status === 'too-large') {
      return NextResponse.json({error: 'Request is too large'}, {status: 413})
    }

    if (bodyResult.status === 'invalid') {
      return NextResponse.json({error: 'Invalid request body'}, {status: 400})
    }

    const untrustedBody = bodyResult.value as Record<string, unknown>

    // Return the normal success response so the honeypot is not disclosed.
    if (isHoneypotFilled(untrustedBody.companyWebsite)) {
      console.warn('Contact form honeypot triggered; submission discarded', {
        email: typeof untrustedBody.email === 'string' ? untrustedBody.email : undefined,
      })
      return NextResponse.json({success: true})
    }

    const parsedBody = contactFormSchema.safeParse(untrustedBody)
    if (!parsedBody.success) {
      return NextResponse.json(
        {error: 'Please check the form fields and try again.'},
        {status: 400},
      )
    }

    const {recaptchaToken, companyWebsite: _companyWebsite, ...fields} = parsedBody.data
    void _companyWebsite
    const recaptchaVerification = await verifyRecaptcha(recaptchaToken)

    if (recaptchaVerification.status === 'misconfigured') {
      console.error('RECAPTCHA_SECRET_KEY is missing in a production environment')
      return NextResponse.json(
        {error: 'The contact form is temporarily unavailable. Please call us at (218) 287-2000.'},
        {status: 503},
      )
    }

    if (recaptchaVerification.status === 'rejected') {
      return NextResponse.json(
        {error: 'Verification failed. Please try again, or call us at (218) 287-2000.'},
        {status: 400},
      )
    }

    const recaptchaUnavailable = recaptchaVerification.status === 'unavailable'

    const fieldLabels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      service: 'Service',
      petName: 'Pet Name',
      message: 'Message',
    }

    const lines = Object.entries(fields)
      .filter(([key, value]) => !key.startsWith('_') && typeof value === 'string' && value.trim())
      .map(
        ([key, value]) =>
          `<p><strong>${escapeHtml(fieldLabels[key] || key)}:</strong> ${escapeHtml(value as string)}</p>`,
      )
      .join('\n')

    if (!lines) {
      return NextResponse.json({error: 'No form data provided'}, {status: 400})
    }

    if (!toEmail || !fromEmail) {
      console.error('Email environment variables are not configured')
      return NextResponse.json({error: 'Contact form is not configured'}, {status: 500})
    }

    const senderName = fields.name
    const senderEmail = fields.email

    await transporter.sendMail({
      from: `"Wags Stay N Play Website" <${fromEmail}>`,
      to: toEmail,
      bcc: bccEmail || undefined,
      replyTo: senderEmail,
      subject: `${recaptchaUnavailable ? '[reCAPTCHA unavailable] ' : ''}New Contact Form Submission from ${senderName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        ${
          recaptchaUnavailable
            ? '<p><strong>Security notice:</strong> Google reCAPTCHA could not be reached after two attempts. This submission was delivered to avoid losing a potentially legitimate lead.</p>'
            : ''
        }
        ${lines}
        <hr />
        <p style="color: #888; font-size: 12px;">Sent from the Wags Stay N Play website contact form.</p>
      `,
    })

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({error: 'Failed to send message'}, {status: 500})
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
