'use client'

type ServiceType = 'daycare' | 'boarding' | 'grooming'

const services: {value: ServiceType; label: string}[] = [
  {value: 'daycare', label: 'Daycare'},
  {value: 'boarding', label: 'Boarding'},
  {value: 'grooming', label: 'Grooming'},
]

type ServiceToggleProps = {
  activeService: ServiceType
  onChange: (service: ServiceType) => void
}

export default function ServiceToggle({activeService, onChange}: ServiceToggleProps) {
  return (
    <div className="bg-forest-card rounded-full p-1 flex max-w-md">
      {services.map((service) => (
        <button
          key={service.value}
          type="button"
          onClick={() => onChange(service.value)}
          className={`flex-1 font-sans text-[14px] font-medium px-4 py-2.5 rounded-full transition-all ${
            activeService === service.value
              ? 'bg-terracotta text-white'
              : 'text-cream/70 hover:text-cream'
          }`}
        >
          {service.label}
        </button>
      ))}
    </div>
  )
}
