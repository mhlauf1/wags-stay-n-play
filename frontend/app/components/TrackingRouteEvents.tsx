'use client'

import {usePathname, useSearchParams} from 'next/navigation'
import {useEffect, useRef} from 'react'

declare global {
  interface Window {
    __ctm?: {main?: {runNow?: (changedElement?: Element) => unknown}}
    dataLayer?: Array<Record<string, unknown>>
  }
}

// CTM loads afterInteractive, so it may not exist yet when a fast SPA
// navigation fires — retry briefly instead of silently skipping the rescan.
const CTM_RESCAN_RETRY_MS = 250
const CTM_RESCAN_MAX_ATTEMPTS = 12

function rescanCtmWhenReady(attempt = 0) {
  if (window.__ctm?.main?.runNow) {
    window.__ctm.main.runNow(document.body)
    return
  }
  if (attempt < CTM_RESCAN_MAX_ATTEMPTS) {
    window.setTimeout(() => rescanCtmWhenReady(attempt + 1), CTM_RESCAN_RETRY_MS)
  }
}

export default function TrackingRouteEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousUrl = useRef<string | null>(null)
  const route = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ''}`

  useEffect(() => {
    const currentUrl = window.location.href

    if (previousUrl.current === currentUrl) return

    if (previousUrl.current !== null) {
      window.dataLayer = window.dataLayer ?? []
      window.dataLayer.push({
        event: 'virtual_page_view',
        page_location: currentUrl,
        page_path: route,
        page_referrer: previousUrl.current,
        page_title: document.title,
      })

      requestAnimationFrame(() => rescanCtmWhenReady())
    }

    previousUrl.current = currentUrl
  }, [route])

  return null
}
