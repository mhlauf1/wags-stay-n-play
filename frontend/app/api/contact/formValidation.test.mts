import assert from 'node:assert/strict'
import test from 'node:test'

import {formatUsPhoneNumber} from '../../lib/formatUsPhoneNumber.ts'
import {
  contactFormSchema,
  isAllowedRecaptchaHostname,
  isHoneypotFilled,
  MAX_CONTACT_BODY_BYTES,
  readContactBody,
} from './formValidation.ts'

const validPayload = {
  name: 'Taylor Smith',
  email: 'taylor@example.com',
  phone: '(218) 287-2000',
  service: 'Daycare',
  petName: 'Scout',
  message: 'I would like to schedule an assessment.',
  companyWebsite: '',
  recaptchaToken: 'token',
}

test('formats a ten-digit US phone number progressively', () => {
  assert.equal(formatUsPhoneNumber('218'), '218')
  assert.equal(formatUsPhoneNumber('218287'), '(218) 287')
  assert.equal(formatUsPhoneNumber('2182872000'), '(218) 287-2000')
  assert.equal(formatUsPhoneNumber('+1 (218) 287-2000'), '(218) 287-2000')
  assert.equal(formatUsPhoneNumber('(218) 287-2000 extra digits'), '(218) 287-2000')
})

test('accepts the published Wags form contract', () => {
  assert.equal(contactFormSchema.safeParse(validPayload).success, true)
})

test('rejects unknown fields and recipient manipulation', () => {
  assert.equal(
    contactFormSchema.safeParse({...validPayload, _recipientEmail: 'attacker@example.com'}).success,
    false,
  )
})

test('rejects invalid service choices and oversized messages', () => {
  assert.equal(
    contactFormSchema.safeParse({...validPayload, service: 'Not a real service'}).success,
    false,
  )
  assert.equal(
    contactFormSchema.safeParse({...validPayload, message: 'x'.repeat(5001)}).success,
    false,
  )
})

test('rejects invalid phone numbers and control characters in names', () => {
  assert.equal(contactFormSchema.safeParse({...validPayload, phone: 'not-a-phone'}).success, false)
  assert.equal(contactFormSchema.safeParse({...validPayload, name: 'Taylor\nBcc: test'}).success, false)
})

test('recognizes only non-empty honeypot values', () => {
  assert.equal(isHoneypotFilled('https://spam.example'), true)
  assert.equal(isHoneypotFilled('  '), false)
  assert.equal(isHoneypotFilled(undefined), false)
})

test('allows only the intended production, preview, and local hostnames', () => {
  assert.equal(isAllowedRecaptchaHostname('www.wagsstaynplay.com', {nodeEnv: 'production'}), true)
  assert.equal(isAllowedRecaptchaHostname('evil.example', {nodeEnv: 'production'}), false)
  assert.equal(
    isAllowedRecaptchaHostname('wags-preview.vercel.app', {
      nodeEnv: 'production',
      vercelEnv: 'preview',
    }),
    true,
  )
  assert.equal(isAllowedRecaptchaHostname('localhost', {nodeEnv: 'development'}), true)
})

test('rejects an oversized JSON body even when content-length is absent', async () => {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({message: 'x'.repeat(MAX_CONTACT_BODY_BYTES)}),
  })

  assert.equal(request.headers.get('content-length'), null)
  assert.deepEqual(await readContactBody(request), {status: 'too-large'})
})

test('rejects a non-JSON request body', async () => {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {'content-type': 'text/plain'},
    body: 'not json',
  })

  assert.deepEqual(await readContactBody(request), {status: 'invalid'})
})

test('reads a valid JSON request body', async () => {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {'content-type': 'application/json; charset=utf-8'},
    body: JSON.stringify(validPayload),
  })

  assert.deepEqual(await readContactBody(request), {status: 'valid', value: validPayload})
})
