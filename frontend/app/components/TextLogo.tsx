type TextLogoProps = {
  className?: string
  align?: 'center' | 'left'
}

export default function TextLogo({className = '', align = 'center'}: TextLogoProps) {
  return (
    <div
      className={`flex flex-col ${align === 'left' ? 'items-start' : 'items-center'} ${className}`}
    >
      <span className="font-heading text-2xl md:text-3xl leading-tighter font-bold tracking-tight">
        Kingdom
      </span>
      <span className="font-sans text-[10px] md:text-[13px] font-semibold uppercase tracking-[0.2em] leading-tight">
        Canine
      </span>
    </div>
  )
}
