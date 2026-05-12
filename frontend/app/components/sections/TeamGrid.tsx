import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import Badge from '../ui/Badge'

type TeamGridProps = {
  block: {
    eyebrow?: string
    heading?: string
    members?: Array<{
      _key: string
      name?: string
      role?: string
      bio?: string
      certifications?: string
      image?: {asset?: {_ref: string}; crop?: any; hotspot?: any}
    }>
  }
  index: number
  pageId: string
  pageType: string
}

export default function TeamGrid({block}: TeamGridProps) {
  const {eyebrow, heading, members} = block

  return (
    <section className="bg-cream">
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-forest mb-4">
                {heading}
              </h2>
            )}
          </div>
        </FadeIn>

        {members && members.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {members.map((member, i) => (
              <FadeIn key={member._key} delay={0.1 * i}>
                <div className="text-center">
                  {member.image?.asset?._ref && (
                    <div className="mb-4">
                      <Image
                        id={member.image.asset._ref}
                        alt={member.name || 'Team member'}
                        width={400}
                        crop={member.image.crop}
                        hotspot={member.image.hotspot}
                        className="rounded-lg aspect-square w-full object-cover"
                      />
                    </div>
                  )}
                  {member.name && (
                    <h3 className="font-sans text-[20px] md:text-[24px] font-semibold text-forest mb-1">
                      {member.name}
                    </h3>
                  )}
                  {member.role && (
                    <p className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-1">
                      {member.role}
                    </p>
                  )}
                  {member.certifications && (
                    <p className="font-sans text-[13px] text-sage italic mb-3">
                      {member.certifications}
                    </p>
                  )}
                  {member.bio && (
                    <p className="font-sans text-[14px] md:text-[16px] leading-[150%] text-charcoal/70">
                      {member.bio}
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
