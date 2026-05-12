'use client'

import {useEffect, useRef, useState} from 'react'

export function useAnimatedNumber(target: number, duration = 400): number {
  const [display, setDisplay] = useState(target)
  const animationRef = useRef<number | null>(null)
  const startRef = useRef(display)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
    }

    startRef.current = display
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)

      const current = startRef.current + (target - startRef.current) * eased
      setDisplay(Math.round(current * 100) / 100)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(target)
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return display
}
