'use client'

import {useState} from 'react'
import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from 'next-sanity'
import {toPlainText} from 'next-sanity'
import {FadeIn} from '@/app/components/ui/FadeIn'
import Badge from '../ui/Badge'

type FaqAccordionProps = {
  block: {
    eyebrow?: string
    heading?: string
    faqs?: Array<{
      _key: string
      question?: string
      answer?: PortableTextBlock[]
    }>
  }
  index: number
  pageId: string
  pageType: string
}

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: {_key: string; question?: string; answer?: PortableTextBlock[]}
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`rounded-xl border transition-colors duration-200 ${isOpen ? 'bg-white border-sand shadow-sm' : 'bg-white/60 border-border-light hover:border-sand'}`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-sans text-[17px] md:text-[19px] font-medium text-forest pr-4">
          {faq.question}
        </span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${isOpen ? 'bg-terracotta text-white' : 'bg-sand/60 text-forest'}`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
            )}
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
      >
        {faq.answer && (
          <div className="px-6 font-sans text-[15px] md:text-[16px] leading-[170%] text-charcoal/75 prose prose-p:mb-3">
            <PortableText value={faq.answer} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function FaqAccordion({block}: FaqAccordionProps) {
  const {eyebrow, heading, faqs} = block
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqJsonLd =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs
            .filter((faq) => faq.question && faq.answer)
            .map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: toPlainText(faq.answer!),
              },
            })),
        }
      : null

  return (
    <section className="bg-cream">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd)}}
        />
      )}
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="max-w-3xl md:mb-4 flex items-start md:items-center flex-col mx-auto">
            {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-forest mb-10">
                {heading}
              </h2>
            )}
          </div>
        </FadeIn>

        {faqs && faqs.length > 0 && (
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FadeIn key={faq._key} delay={0.05 * i}>
                <AccordionItem
                  faq={faq}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
