type SectionWrapperProps = {
  background?: 'cream' | 'sand' | 'forest' | 'tan' | 'lavender' | 'dark'
  curvedTop?: boolean
  className?: string
  children: React.ReactNode
  id?: string
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream',
  sand: 'bg-sand',
  forest: 'bg-forest text-cream',
  // Backward-compat aliases for existing Sanity data
  tan: 'bg-cream',
  lavender: 'bg-sand',
  dark: 'bg-forest text-cream',
}

export default function SectionWrapper({
  background = 'tan',
  curvedTop = false,
  className = '',
  children,
  id,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${bgColors[background]} ${curvedTop ? 'rounded-t-[48px] -mt-12 relative z-10' : ''} ${className}`}
    >
      <div className="container py-[80px] lg:py-[120px]">{children}</div>
    </section>
  )
}
