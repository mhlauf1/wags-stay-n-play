'use client'

import {usePathname, useSearchParams} from 'next/navigation'
import {useEffect, useRef} from 'react'

declare global {
  interface Window {
    __ctm?: {main?: {runNow?: (changedElement?: Element) => unknown}}
    dataLayer?: Array<Record<string, unknown>>
  }
}

export default function TrackingRouteEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousUrl = useRef<string | null>(null)
  const route = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ''}`

  useEffect(() => {
    const currentUrl = window.location.href

    if (previousUrl.current !== null) {
      window.dataLayer = window.dataLayer ?? []
      window.dataLayer.push({
        event: 'virtual_page_view',
        page_location: currentUrl,
        page_path: route,
        page_referrer: previousUrl.current,
        page_title: document.title,
      })

      requestAnimationFrame(() => {
        window.__ctm?.main?.runNow?.(document.body)
      })
    }

    previousUrl.current = currentUrl
  }, [route])

  return null
}
