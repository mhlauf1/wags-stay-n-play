import {NextResponse} from 'next/server'
import nodemailer from 'nodemailer'

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
const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body || typeof body !== 'object') {
      return NextResponse.json({error: 'Invalid request body'}, {status: 400})
    }

    const fieldLabels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      service: 'Service',
      petName: 'Pet Name',
      message: 'Message',
    }

    const lines = Object.entries(body)
      .filter(([, value]) => typeof value === 'string' && value.trim())
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

    const senderName = (body.name as string) || 'Website Visitor'
    const senderEmail = (body.email as string) || undefined

    await transporter.sendMail({
      from: `"Wags Stay N Play Website" <${fromEmail}>`,
      to: toEmail,
      replyTo: senderEmail,
      subject: `New Contact Form Submission from ${senderName}`,
      html: `
        <h2>New Contact Form Submission</h2>
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
