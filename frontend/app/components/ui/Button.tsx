import Link from 'next/link'
import {linkResolver} from '@/sanity/lib/utils'
import {DereferencedLink} from '@/sanity/lib/types'

type ButtonProps = {
  variant?: 'primary' | 'outline'
  children: React.ReactNode
  link?: DereferencedLink
  href?: string
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}

const variants = {
  primary:
    'bg-terracotta-dark text-white border-[1.5px] border-terracotta-dark hover:brightness-90 transition-all',
  outline:
    'bg-transparent text-forest border-[1.5px] border-forest hover:bg-forest/5 transition-all',
}

export default function Button({
  variant = 'primary',
  children,
  link,
  href,
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles = `inline-flex items-center justify-center whitespace-nowrap font-sans font-medium text-[14px] md:text-[16px] tracking-[0.02em] w-full md:w-auto px-8 py-4 rounded-lg ${variants[variant]} ${className}`

  const resolvedHref = link ? linkResolver(link) : href

  if (resolvedHref) {
    return (
      <Link
        href={resolvedHref}
        target={link?.openInNewTab ? '_blank' : undefined}
        rel={link?.openInNewTab ? 'noopener noreferrer' : undefined}
        className={baseStyles}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={baseStyles}>
      {children}
    </button>
  )
}
