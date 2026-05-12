import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Bricolage_Grotesque, Geist} from 'next/font/google'

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})
import {draftMode} from 'next/headers'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery, servicesNavQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage, urlForImage} from '@/sanity/lib/utils'
import Script from 'next/script'
import {handleError} from '@/app/client-utils'

const SITE_URL = 'https://wagsstaynplay.com'

function buildLocalBusinessJsonLd(settings: any) {
  const lb = settings?.localBusiness
  if (!lb?.businessName) return null

  const sameAs = [
    settings?.socialLinks?.facebook,
    settings?.socialLinks?.instagram,
    settings?.socialLinks?.google,
  ].filter(Boolean)

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': lb.businessType || 'LocalBusiness',
    name: lb.businessName,
    telephone: lb.phone,
    priceRange: lb.priceRange,
    ...(sameAs.length > 0 && {sameAs}),
  }

  if (lb.address) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      streetAddress: lb.address.street,
      addressLocality: lb.address.city,
      addressRegion: lb.address.state,
      postalCode: lb.address.zip,
      addressCountry: lb.address.country || 'US',
    }
  }

  if (lb.geoCoordinates?.latitude && lb.geoCoordinates?.longitude) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: lb.geoCoordinates.latitude,
      longitude: lb.geoCoordinates.longitude,
    }
  }

  if (lb.businessHours?.length) {
    jsonLd.openingHoursSpecification = lb.businessHours.map(
      (h: {days?: string; open?: string; close?: string}) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days,
        opens: h.open,
        closes: h.close,
      }),
    )
  }

  if (settings?.logo?.asset?._ref) {
    try {
      jsonLd.image = urlForImage(settings.logo).width(600).url()
    } catch {}
  }

  return jsonLd
}

export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })
  const title = settings?.title || 'Wags Stay N Play'
  const description = settings?.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : new URL(SITE_URL)
  } catch {
    metadataBase = new URL(SITE_URL)
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: description ? toPlainText(description) : '',
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
    ...(settings?.faviconUrl && {
      icons: {
        icon: settings.faviconUrl,
        apple: settings.faviconUrl,
      },
    }),
    ...(settings?.googleSiteVerification && {
      verification: {
        google: settings.googleSiteVerification,
      },
    }),
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()
  const [{data: settings}, {data: services}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: servicesNavQuery}),
  ])

  const localBusinessJsonLd = buildLocalBusinessJsonLd(settings)
  const ga4Id = settings?.ga4MeasurementId
  const gtmId = settings?.gtmContainerId
  let logoUrl: string | undefined
  try {
    if (settings?.logo?.asset?._ref) logoUrl = urlForImage(settings.logo).width(600).url()
  } catch {}

  // Inject services as dropdown children into the "Services" nav item
  const navItems = settings?.navItems?.map((item: any) => {
    if (item.label === 'Services' && services && services.length > 0) {
      return {
        ...item,
        children: services.map((service: any) => ({
          _key: service._id,
          label: service.title,
          link: {linkType: 'href', href: `/services/${service.slug}`},
        })),
      }
    }
    return item
  })

  return (
    <html lang="en" className={`${bricolage.variable} ${geist.variable} bg-cream text-forest`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://api.iconify.design" />
        <link rel="dns-prefetch" href="https://api.iconify.design" />
        {localBusinessJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessJsonLd)}}
          />
        )}
        {settings?.title && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: settings.title,
                url: settings?.ogImage?.metadataBase || SITE_URL,
                ...(logoUrl && {logo: logoUrl}),
                sameAs: [
                  settings?.socialLinks?.facebook,
                  settings?.socialLinks?.instagram,
                  settings?.socialLinks?.google,
                ].filter(Boolean),
              }),
            }}
          />
        )}
        {settings?.title && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: settings.title,
                url: settings?.ogImage?.metadataBase || SITE_URL,
              }),
            }}
          />
        )}
        {gtmId && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}
        {ga4Id && !gtmId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
            </Script>
          </>
        )}
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{display: 'none', visibility: 'hidden'}}
            />
          </noscript>
        )}
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            <VisualEditing />
          </>
        )}
        <SanityLive onError={handleError} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-terracotta focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <Header navItems={navItems as any} ctaButton={settings?.ctaButton as any} logo={settings?.logo as any} />
        <main id="main-content">{children}</main>
        <Footer
          tagline={settings?.footerTagline ?? undefined}
          columns={settings?.footerColumns as any}
          contactInfo={settings?.contactInfo as any}
          footerText={settings?.footerText ?? undefined}
          footerTextLink={settings?.footerTextLink as any}
          bottomLinks={settings?.footerBottomLinks as any}
          logo={settings?.logo as any}
          socialLinks={settings?.socialLinks as any}
          footerSticker={settings?.footerSticker as any}
        />
        <SpeedInsights />
      </body>
    </html>
  )
}
