import DecorativeCurve from '@/app/components/ui/DecorativeCurve'
import {FadeIn} from '@/app/components/ui/FadeIn'
import TextLogo from '@/app/components/TextLogo'

type StatsBarProps = {
  block: {
    stats?: Array<{
      _key: string
      value?: string
      label?: string
    }>
    showLogo?: boolean
  }
  index: number
  pageId: string
  pageType: string
}

export default function StatsBar({block}: StatsBarProps) {
  const {stats, showLogo} = block

  return (
    <section className="relative  border-y border-forest  bg-sand overflow-hidden">
      <div className="px-6 md:px-16 lg:px-24 lg:max-w-[80vw] mx-auto relative z-10 py-25 md:py-30">
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            {stats.map((stat, i) => (
              <FadeIn key={stat._key} delay={0.1 * i}>
                <div className="bg-white rounded-md p-6 md:p-8 flex flex-col justify-center text-center shadow-card border border-forest h-full">
                  <div className="text-5xl font-heading lg:text-7xl leading-[100%] tracking-tighter font-semibold text-forest mb-2">
                    {stat.value}
                  </div>
                  <div className="font-sans text-[16px] md:text-[18px]">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {showLogo && (
          <FadeIn>
            <TextLogo />
          </FadeIn>
        )}
      </div>
    </section>
  )
}
