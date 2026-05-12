type BadgeProps = {
  children: React.ReactNode
  className?: string
}

export default function Badge({children, className = ''}: BadgeProps) {
  return (
    <span
      className={`inline-block font-sans text-[12px] font-medium text-terracotta border border-terracotta/20 bg-white py-1.5 px-3 rounded-full ${className}`}
    >
      {children}
    </span>
  )
}
