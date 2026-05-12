import NextImage from 'next/image'
import Link from 'next/link'
import Image from '@/app/components/SanityImage'

type FooterLink = {
  _key: string
  label?: string
  link?: any
}

type FooterColumn = {
  _key: string
  title?: string
  links?: FooterLink[]
}

type FooterBottomLink = {
  _key: string
  label?: string
  link?: any
}

type FooterProps = {
  tagline?: string
  columns?: FooterColumn[]
  contactInfo?: {address?: string; phone?: string; email?: string}
  footerText?: string
  footerTextLink?: {label?: string; href?: string}
  bottomLinks?: FooterBottomLink[]
  logo?: {asset?: {_ref: string}; alt?: string}
  socialLinks?: {facebook?: string; instagram?: string; google?: string}
  footerSticker?: {asset?: {_ref: string}; alt?: string}
}

export default function Footer({
  tagline,
  columns,
  contactInfo,
  footerText,
  footerTextLink,
  bottomLinks,
  logo,
  socialLinks,
  footerSticker,
}: FooterProps) {
  return (
    <footer className="bg-cream relative">
      {/* Sand accent line */}
      <div className="h-1.5 bg-sand" />

      <div className="px-6 md:px-20 py-12 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <NextImage
                  src="/images/wags-logo.png"
                  alt="Wags Stay N Play"
                  width={160}
                  height={80}
                  className="w-[140px] h-auto"
                />
              </div>
              {tagline && (
                <p className="font-sans text-[15px] md:max-w-[34ch] text-text-muted leading-relaxed">
                  {tagline}
                </p>
              )}
              {(socialLinks?.facebook || socialLinks?.instagram || socialLinks?.google) && (
                <div className="flex gap-4 mt-4">
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="text-forest/50 hover:text-forest transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="text-forest/50 hover:text-forest transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.google && (
                    <a
                      href={socialLinks.google}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Google"
                      className="text-forest/50 hover:text-forest transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
            {footerSticker?.asset?._ref && (
              <Image
                id={footerSticker.asset._ref}
                alt={footerSticker.alt || ''}
                width={80}
                className="w-[56px] md:w-[72px] h-auto mt-6 hidden lg:block"
              />
            )}
          </div>

          {/* Dynamic columns */}
          {columns?.map((col) => (
            <div key={col._key}>
              <p className="font-sans text-[16px] font-medium mb-4">{col.title}</p>
              <ul className="space-y-3">
                {col.links?.map((item) => (
                  <li key={item._key}>
                    <Link
                      href={resolveFooterLink(item.link) || '#'}
                      className="font-sans text-[15px] text-text-muted hover:text-forest transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          {contactInfo && (
            <div>
              <p className="font-sans text-[16px] font-medium mb-4">Contact</p>
              <div className="space-y-3 font-sans text-[15px] text-text-muted">
                {contactInfo.address && (
                  <p className="whitespace-pre-line">{contactInfo.address}</p>
                )}
                {contactInfo.phone && <p>{contactInfo.phone}</p>}
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="block hover:text-forest transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-light">
        <div className="px-6 md:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col  items-start">
            <p className="font-sans text-[14px] text-text-muted">
              {footerText
                ? footerTextLink?.label && footerTextLink?.href
                  ? renderFooterTextWithLink(footerText, footerTextLink.label, footerTextLink.href)
                  : footerText
                : `\u00A9 ${new Date().getFullYear()} Wags Stay N Play. All rights reserved.`}
            </p>
            <p className="font-sans text-[14px] text-text-muted">
              Designed and developed by{' '}
              <Link href="https://www.lauf.co/" target="_blank" className="font-semibold">
                Lauf.
              </Link>{' '}
            </p>
          </div>

          {bottomLinks && bottomLinks.length > 0 && (
            <div className="flex w-full md:w-auto mt-2 md:mt-0 items-start md:items-center gap-6">
              {bottomLinks.map((item) => (
                <Link
                  key={item._key}
                  href={resolveFooterLink(item.link) || '#'}
                  className="font-sans text-[14px] text-text-muted hover:text-forest transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

function resolveFooterLink(link: any): string | null {
  if (!link) return null
  if (link.linkType === 'href' && link.href) return link.href
  if (link.linkType === 'page' && link.page) {
    if (link.pageType === 'service') return `/services/${link.page}`
    return `/${link.page}`
  }
  if (link.href) return link.href
  return null
}

function renderFooterTextWithLink(text: string, linkLabel: string, href: string) {
  const idx = text.indexOf(linkLabel)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-forest transition-colors"
      >
        {linkLabel}
      </a>
      {text.slice(idx + linkLabel.length)}
    </>
  )
}
