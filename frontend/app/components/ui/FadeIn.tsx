'use client'
import {useEffect, useRef} from 'react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  className?: string
  immediate?: boolean
}

const directionTransform = {
  up: 'translateY(24px)',
  down: 'translateY(-24px)',
  left: 'translateX(24px)',
  right: 'translateX(-24px)',
  none: 'none',
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className,
  immediate = false,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (immediate) {
      const timer = setTimeout(() => {
        el.style.transitionDelay = `${delay}s`
        el.style.opacity = '1'
        el.style.transform = 'translate(0, 0)'
      }, 10)
      return () => clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}s`
          el.style.opacity = '1'
          el.style.transform = 'translate(0, 0)'
          observer.unobserve(el)
        }
      },
      {rootMargin: '-50px'},
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, immediate])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: directionTransform[direction],
        transition: `opacity ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1), transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`,
      }}
    >
      {children}
    </div>
  )
}
