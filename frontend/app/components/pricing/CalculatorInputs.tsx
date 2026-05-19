'use client'

// ─── Add Dog Button ─────────────────────────────────────────
type AddDogButtonProps = {
  onClick: () => void
  disabled?: boolean
}

export function AddDogButton({onClick, disabled}: AddDogButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full border-2 border-dashed border-cream/30 rounded-lg py-3 flex items-center justify-center gap-2 text-cream/50 hover:border-cream/50 hover:text-cream/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="font-sans text-[14px] font-medium">Add another dog</span>
    </button>
  )
}

// ─── Number Stepper ─────────────────────────────────────────
type NumberStepperProps = {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  badge?: string | null
}

export function NumberStepper({
  label,
  value,
  min = 1,
  max = 30,
  onChange,
  badge,
}: NumberStepperProps) {
  return (
    <div>
      <label className="block text-cream/70 font-sans text-[14px] md:text-[16px] font-medium uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-10 h-10 rounded-md bg-forest-card border border-border-dark text-cream flex items-center justify-center hover:bg-terracotta/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={`Decrease ${label}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <span className="font-sans text-[20px] md:text-[24px] font-medium text-cream w-8 text-center tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-10 h-10 rounded-md bg-forest-card border border-border-dark text-cream flex items-center justify-center hover:bg-terracotta/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={`Increase ${label}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {badge && (
          <span className="ml-2 text-[14px] font-sans font-medium bg-sage/20 text-sage px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Radio Group ────────────────────────────────────────────
type RadioOption = {
  label: string
  value: string
  description?: string
}

type RadioGroupProps = {
  label: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
}

export function RadioGroup({label, options, value, onChange}: RadioGroupProps) {
  return (
    <fieldset>
      <legend className="block text-cream/70 font-sans text-[14px] font-medium uppercase tracking-wider mb-2">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`font-sans text-[14px] md:text-[16px] font-medium px-5 py-2.5 rounded-full border transition-all ${
              value === option.value
                ? 'bg-terracotta text-white border-terracotta'
                : 'bg-transparent text-cream/70 border-border-dark hover:border-cream/40 hover:text-cream'
            }`}
            role="radio"
            aria-checked={value === option.value}
          >
            {option.label}
            {option.description && (
              <span className="block text-[14px] opacity-70 mt-0.5">
                {option.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

// ─── Checkbox Group ─────────────────────────────────────────
type CheckboxOption = {
  id: string
  label: string
  detail?: string
}

type CheckboxGroupProps = {
  label: string
  options: CheckboxOption[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function CheckboxGroup({label, options, selected, onChange}: CheckboxGroupProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <fieldset>
      <legend className="block text-cream/70 font-sans text-[14px] font-medium uppercase tracking-wider mb-2">
        {label}
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
            <span
              className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-all ${
                selected.includes(option.id)
                  ? 'bg-terracotta border-terracotta'
                  : 'bg-transparent border-border-dark group-hover:border-cream/40'
              }`}
            >
              {selected.includes(option.id) && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6l2.5 2.5 4.5-5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => toggle(option.id)}
              className="sr-only"
            />
            <span className="font-sans text-[14px] text-cream/90">
              {option.label}
              {option.detail && <span className="text-cream/50 ml-1">{option.detail}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

// ─── Contact Notice (4+ dogs) ───────────────────────────────
export function ContactNotice() {
  return (
    <div className="mt-6 p-4 rounded-lg bg-terracotta/10 border border-terracotta/30">
      <p className="font-sans text-[14px] text-cream">
        For 4 or more dogs, please contact us directly at{' '}
        <a href="tel:2182872000" className="text-terracotta-light underline font-medium">
          (218) 287-2000
        </a>{' '}
        for custom pricing.
      </p>
    </div>
  )
}
