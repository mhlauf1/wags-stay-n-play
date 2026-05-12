type DecorativeCurveProps = {
  color?: 'white' | 'terracotta' | 'cream'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  className?: string
}

const colorMap = {
  white: '#FFFFFF',
  terracotta: '#DB1A1A',
  cream: '#FFF6F6',
}

export default function DecorativeCurve({
  color = 'white',
  position = 'top-right',
  className = '',
}: DecorativeCurveProps) {
  const positionStyles: Record<string, string> = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }

  return (
    <div
      className={`absolute pointer-events-none opacity-20 ${positionStyles[position]} ${className}`}
      aria-hidden="true"
    >
      <svg width="400" height="300" viewBox="0 0 400 300" fill="none">
        <path
          d="M0 300C0 300 100 250 200 200C300 150 350 50 400 0"
          stroke={colorMap[color]}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M0 280C0 280 120 230 220 180C320 130 370 30 400 0"
          stroke={colorMap[color]}
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  )
}
