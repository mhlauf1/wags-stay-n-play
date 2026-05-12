'use client'

import NextImage from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState, useEffect, useRef, useCallback} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import Button from '@/app/components/ui/Button'

type NavChild = {
  _key: string
  label?: string
  link?: any
}

type NavItem = {
  _key: string
  label?: string
  link?: any
  children?: NavChild[]
}

type HeaderProps = {
  navItems?: NavItem[]
  ctaButton?: {buttonText?: string; link?: any}
  logo?: {asset?: {_ref: string}}
}

export default function Header({navItems, ctaButton, logo}: HeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<Set<string>>(new Set())

  const mobilePanelRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMobileSection = (key: string) => {
    setMobileExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, {passive: true})
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setMobileExpanded(new Set())
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Focus trap for mobile menu
  useEffect(() => {
    if (!mobileOpen || !mobilePanelRef.current) return

    const panel = mobilePanelRef.current
    const focusableSelector = 'a[href], button, [tabindex]:not([tabindex="-1"])'
    const focusableElements = () => panel.querySelectorAll<HTMLElement>(focusableSelector)

    const elements = focusableElements()
    if (elements.length > 0) elements[0].focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        return
      }
      if (e.key !== 'Tab') return

      const els = focusableElements()
      if (els.length === 0) return

      const first = els[0]
      const last = els[els.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  // Keyboard navigation for desktop dropdown
  const handleDropdownKeyDown = useCallback(
    (e: React.KeyboardEvent, item: NavItem) => {
      if (!item.children || item.children.length === 0) return

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setDropdownOpen(dropdownOpen === item._key ? null : item._key)
      } else if (e.key === 'Escape') {
        setDropdownOpen(null)
      } else if (e.key === 'ArrowDown' && dropdownOpen === item._key) {
        e.preventDefault()
        const container = dropdownRef.current
        if (container) {
          const firstLink = container.querySelector<HTMLElement>('a')
          firstLink?.focus()
        }
      }
    },
    [dropdownOpen],
  )

  const handleDropdownItemKeyDown = useCallback((e: React.KeyboardEvent, _item: NavItem) => {
    if (e.key === 'Escape') {
      setDropdownOpen(null)
      return
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

    e.preventDefault()
    const container = dropdownRef.current
    if (!container) return

    const links = container.querySelectorAll<HTMLElement>('a')
    const currentIndex = Array.from(links).indexOf(e.currentTarget as HTMLElement)

    if (e.key === 'ArrowDown' && currentIndex < links.length - 1) {
      links[currentIndex + 1].focus()
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      links[currentIndex - 1].focus()
    }
  }, [])

  const isLinkActive = (link: any, children?: NavChild[]) => {
    const href = resolveNavLink(link)
    if (href && pathname === href) return true
    if (children?.some((c) => resolveNavLink(c.link) === pathname)) return true
    return false
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className="px-2 lg:px-12">
        <div className="flex lg:grid lg:grid-cols-3 border bg-cream/95 backdrop-blur-sm border-forest/20 rounded-md mt-2 md:mt-4 pl-4 md:pl-12 pr-2 md:pr-6 items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-start">
            <NextImage
              src="/images/kingdom-logo.png"
              alt="Kingdom Canine"
              width={150}
              height={75}
              className="w-[120px] lg:w-[150px] h-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center justify-center gap-7">
            {navItems?.map((item) => {
              const active = isLinkActive(item.link, item.children)

              return (
                <div
                  key={item._key}
                  className="relative"
                  onMouseEnter={() =>
                    item.children && item.children.length > 0
                      ? setDropdownOpen(item._key)
                      : undefined
                  }
                  onMouseLeave={() =>
                    item.children && item.children.length > 0 ? setDropdownOpen(null) : undefined
                  }
                >
                  {item.children && item.children.length > 0 ? (
                    <button
                      type="button"
                      aria-expanded={dropdownOpen === item._key}
                      aria-haspopup="true"
                      onKeyDown={(e) => handleDropdownKeyDown(e, item)}
                      className={`relative flex items-center gap-1 font-sans text-[14px] transition-colors cursor-default whitespace-nowrap pb-1 ${
                        active
                          ? 'text-terracotta font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-terracotta after:rounded-full'
                          : 'text-forest hover:text-forest/70'
                      }`}
                    >
                      {item.label}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="mt-0.5"
                      >
                        <path
                          d="M3 5L6 8L9 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={resolveNavLink(item.link) || '#'}
                      className={`relative font-sans cursor-pointer text-[14px] transition-colors whitespace-nowrap pb-1 ${
                        active
                          ? 'text-terracotta font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-terracotta after:rounded-full'
                          : 'text-forest hover:text-forest/70'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {item.children && item.children.length > 0 && dropdownOpen === item._key && (
                    <div className="absolute top-full left-0 pt-2" ref={dropdownRef}>
                      <div
                        className="bg-white rounded-md shadow-card-hover py-2 min-w-[160px] border border-border-light"
                        role="menu"
                      >
                        {item.children.map((child) => {
                          const childActive = resolveNavLink(child.link) === pathname
                          return (
                            <Link
                              key={child._key}
                              href={resolveNavLink(child.link) || '#'}
                              role="menuitem"
                              onKeyDown={(e) => handleDropdownItemKeyDown(e, item)}
                              className={`block px-4 py-2 cursor-pointer text-[14px] font-sans transition-colors ${
                                childActive
                                  ? 'text-terracotta font-medium bg-sand/20'
                                  : 'text-forest hover:bg-sand/30'
                              }`}
                            >
                              {child.label}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center justify-end gap-6 shrink-0">
            <a
              href="tel:3146316738"
              className="font-sans text-[14px] text-forest/80 hover:text-terracotta transition-colors whitespace-nowrap"
            >
              (314) 631-6738
            </a>
            {ctaButton?.buttonText && (
              <Button variant="primary" link={ctaButton.link}>
                {ctaButton.buttonText}
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block w-6 h-[2px] bg-forest transition-transform ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`}
            />
            <span
              className={`block w-6 h-[2px] bg-forest transition-opacity ${mobileOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-[2px] bg-forest transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu slide-in */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.3}}
              className="fixed inset-0 bg-forest/40 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              ref={mobilePanelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{x: '100%'}}
              animate={{x: 0}}
              exit={{x: '100%'}}
              transition={{type: 'spring', damping: 30, stiffness: 300}}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[360px] bg-cream z-50 lg:hidden flex flex-col shadow-xl"
            >
              {/* Close button */}
              <div className="flex justify-end p-5">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2"
                  aria-label="Close menu"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-8 overflow-y-auto">
                {navItems?.map((item, i) => {
                  const active = isLinkActive(item.link, item.children)

                  return (
                    <motion.div
                      key={item._key}
                      initial={{opacity: 0, x: 20}}
                      animate={{opacity: 1, x: 0}}
                      transition={{delay: 0.1 + i * 0.05, duration: 0.3}}
                    >
                      {item.children && item.children.length > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleMobileSection(item._key)}
                            aria-expanded={mobileExpanded.has(item._key)}
                            aria-controls={`mobile-section-${item._key}`}
                            className={`w-full flex items-center justify-between font-heading text-[22px] tracking-tight py-3 border-b border-border-light ${
                              active ? 'text-terracotta' : 'text-forest'
                            }`}
                          >
                            <span>{item.label}</span>
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 12 12"
                              fill="none"
                              className={`transition-transform duration-200 ${
                                mobileExpanded.has(item._key) ? 'rotate-180' : ''
                              }`}
                              aria-hidden="true"
                            >
                              <path
                                d="M3 5L6 8L9 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <AnimatePresence initial={false}>
                            {mobileExpanded.has(item._key) && (
                              <motion.div
                                id={`mobile-section-${item._key}`}
                                initial={{height: 0, opacity: 0}}
                                animate={{height: 'auto', opacity: 1}}
                                exit={{height: 0, opacity: 0}}
                                transition={{duration: 0.2, ease: 'easeOut'}}
                                className="overflow-hidden"
                              >
                                <div className="py-2">
                                  {item.children?.map((child) => {
                                    const childActive = resolveNavLink(child.link) === pathname
                                    return (
                                      <Link
                                        key={child._key}
                                        href={resolveNavLink(child.link) || '#'}
                                        className={`block font-sans text-[16px] pl-4 py-2 ${
                                          childActive
                                            ? 'text-terracotta border-l-2 border-l-terracotta pl-3'
                                            : 'text-text-muted'
                                        }`}
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        {child.label}
                                      </Link>
                                    )
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={resolveNavLink(item.link) || '#'}
                          className={`block font-heading text-[22px] tracking-tight py-3 border-b border-border-light ${
                            active
                              ? 'text-terracotta border-l-2 border-l-terracotta pl-3'
                              : 'text-forest'
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  )
                })}
              </nav>

              {/* CTA at bottom */}
              <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3, duration: 0.3}}
                className="p-8 pt-4 space-y-3"
                onClick={() => setMobileOpen(false)}
              >
                <a
                  href="tel:3146316738"
                  className="flex items-center justify-center gap-2 font-sans text-[16px] text-forest hover:text-terracotta transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  (314) 631-6738
                </a>
                {ctaButton?.buttonText && (
                  <Button variant="primary" link={ctaButton.link} className="w-full">
                    {ctaButton.buttonText}
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

function resolveNavLink(link: any): string | null {
  if (!link) return null
  if (link.linkType === 'href' && link.href) return link.href
  if (link.linkType === 'page' && link.page) {
    if (link.pageType === 'service') return `/services/${link.page}`
    return `/${link.page}`
  }
  if (link.href) return link.href
  return null
}
