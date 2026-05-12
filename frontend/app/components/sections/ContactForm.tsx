'use client'

import {useState, useEffect} from 'react'
import {useSearchParams} from 'next/navigation'
import {PortableText} from '@portabletext/react'

import Image from '@/app/components/SanityImage'
import Button from '@/app/components/ui/Button'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

type ContactFormProps = {
  block: ExtractPageBuilderType<'contactForm'>
  index: number
  pageId: string
  pageType: string
}

export default function ContactForm({block}: ContactFormProps) {
  const {
    eyebrow,
    heading,
    description,
    formFields,
    submitButtonText,
    successMessage,
    showMap,
    mapEmbedUrl,
    image,
    address,
    phone,
    email,
    nextSteps,
    hours,
  } = block as typeof block & {
    nextSteps?: Array<{_key?: string; title?: string; description?: string}>
    hours?: Array<{_key?: string; label?: string; value?: string}>
  }

  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const serviceParam = searchParams.get('service')
    if (serviceParam && formFields?.some((f) => stegaClean(f.fieldName) === 'service')) {
      setFormData((prev) => ({...prev, service: serviceParam}))
    }
  }, [searchParams, formFields])

  const handleChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({...prev, [fieldName]: value}))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setFormData({})
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const validHours = (hours || []).filter((h) => h?.label && h?.value)
  const hasContactInfo =
    image?.asset?._ref || address || phone || email || validHours.length > 0 || (stegaClean(showMap) && mapEmbedUrl)

  return (
    <section className="bg-cream pt-8">
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn immediate>
          <div className="mb-10 lg:mb-14">
            {eyebrow && (
              <FadeIn>
                <Badge className="mb-3">{eyebrow}</Badge>
              </FadeIn>
            )}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-forest mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <div className="font-sans text-[16px] md:text-[18px] leading-[150%] text-charcoal/80 max-w-2xl prose prose-p:mb-3">
                <PortableText value={description} />
              </div>
            )}
          </div>
        </FadeIn>

        <div
          className={`grid grid-cols-1 ${hasContactInfo ? 'lg:grid-cols-2' : ''} gap-10 lg:gap-16`}
        >
          {/* Form */}
          <FadeIn immediate>
            {status === 'success' ? (
              <div className="bg-forest/5 rounded-lg p-8 text-center">
                <svg
                  className="h-12 w-12 text-forest mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-sans text-[18px] md:text-[20px] text-forest font-medium">
                  {successMessage || "Thank you! We'll be in touch soon."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {formFields &&
                  formFields.map((field) => {
                    const fieldName = stegaClean(field.fieldName) || ''
                    const fieldType = stegaClean(field.type) || 'text'

                    return (
                      <div key={field._key}>
                        {field.label && (
                          <label className="block font-sans text-[14px] font-medium text-forest mb-1.5">
                            {field.label}
                            {field.required && <span className="text-terracotta ml-1">*</span>}
                          </label>
                        )}
                        {fieldType === 'textarea' ? (
                          <textarea
                            name={fieldName}
                            required={field.required || false}
                            rows={4}
                            value={formData[fieldName] || ''}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                            className="w-full rounded-md border border-sand bg-white px-4 py-3 font-sans text-[16px] text-forest placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors"
                          />
                        ) : fieldType === 'select' ? (
                          <select
                            name={fieldName}
                            required={field.required || false}
                            value={formData[fieldName] || ''}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                            className="w-full rounded-md border border-sand bg-white px-4 py-3 font-sans text-[16px] text-forest focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors"
                          >
                            <option value="">Select an option...</option>
                            {field.options?.map((opt, oi) => (
                              <option key={oi} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={fieldType}
                            name={fieldName}
                            required={field.required || false}
                            value={formData[fieldName] || ''}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                            className="w-full rounded-md border border-sand bg-white px-4 py-3 font-sans text-[16px] text-forest placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors"
                          />
                        )}
                      </div>
                    )
                  })}

                {status === 'error' && (
                  <p className="font-sans text-[14px] text-red-600">{errorMessage}</p>
                )}

                <Button type="submit" variant="primary">
                  {status === 'submitting' ? 'Sending...' : submitButtonText || 'Send Message'}
                </Button>
              </form>
            )}
          </FadeIn>

          {/* Next steps */}
          {nextSteps && nextSteps.length > 0 && !hasContactInfo && (
            <FadeIn delay={0.1} immediate>
              <div className="space-y-4">
                <h3 className="font-heading text-[24px] font-semibold text-forest mb-2">
                  What happens next?
                </h3>
                {nextSteps.map((step, i) => (
                  <div key={step._key || i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terracotta/10 text-terracotta font-semibold text-[14px] flex items-center justify-center">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-sans text-[16px] font-medium text-forest">{step.title}</p>
                      {step.description && (
                        <p className="font-sans text-[14px] text-text-muted mt-0.5">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}

          {/* Contact info + map */}
          {hasContactInfo && (
            <FadeIn delay={0.1} immediate>
              <div className="space-y-6">
                {image?.asset?._ref && (
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      id={image.asset._ref}
                      alt={(image as any).alt || heading || 'Contact'}
                      width={700}
                      crop={image.crop}
                      hotspot={image.hotspot}
                      className="w-full max-h-[500px] object-cover  rounded-lg"
                    />
                  </div>
                )}

                {stegaClean(showMap) && mapEmbedUrl && (
                  <div className="rounded-lg overflow-hidden aspect-video">
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{border: 0}}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Map"
                    />
                  </div>
                )}

                <div className={`grid ${validHours.length > 0 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                  <div className="space-y-4">
                    {address && (
                      <div>
                        <h4 className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-1">
                          Address
                        </h4>
                        <p className="font-sans text-[16px] text-charcoal/80 whitespace-pre-line">
                          {address}
                        </p>
                      </div>
                    )}
                    {phone && (
                      <div>
                        <h4 className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-1">
                          Phone
                        </h4>
                        <a
                          href={`tel:${phone.replace(/\D/g, '')}`}
                          className="font-sans text-[16px] text-forest hover:text-terracotta transition-colors"
                        >
                          {phone}
                        </a>
                      </div>
                    )}
                    {email && (
                      <div>
                        <h4 className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-1">
                          Email
                        </h4>
                        <a
                          href={`mailto:${email}`}
                          className="font-sans text-[16px] text-forest hover:text-terracotta transition-colors"
                        >
                          {email}
                        </a>
                      </div>
                    )}
                  </div>
                  {validHours.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-1">
                        Hours
                      </h4>
                      {validHours.map((h) => (
                        <div key={h._key}>
                          <p className="font-sans text-[16px] font-medium text-forest">{h.label}</p>
                          <p className="font-sans text-[15px] text-charcoal/80">{h.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {nextSteps && nextSteps.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h3 className="font-heading text-[20px] font-semibold text-forest">
                      What happens next?
                    </h3>
                    {nextSteps.map((step, i) => (
                      <div key={step._key || i} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terracotta/10 text-terracotta font-semibold text-[14px] flex items-center justify-center">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-sans text-[16px] font-medium text-forest">
                            {step.title}
                          </p>
                          {step.description && (
                            <p className="font-sans text-[14px] text-text-muted mt-0.5">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}
