import Image from '@/app/components/SanityImage'
import ResolvedLink from '@/app/components/ResolvedLink'
import {stegaClean} from '@sanity/client/stega'
import {FadeIn} from '@/app/components/ui/FadeIn'
import Badge from '../ui/Badge'

type RequirementsListProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    items?: {_key: string; text?: string}[]
    link?: {label?: string; link?: any}
    image?: {asset?: {_ref: string}; crop?: any; alt?: string}
    imagePosition?: 'left' | 'right'
    backgroundColor?: 'cream' | 'sand'
  }
  index: number
  pageId: string
  pageType: string
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream text-forest',
  sand: 'bg-sand text-forest',
}

export default function RequirementsList({block}: RequirementsListProps) {
  const {eyebrow, heading, description, items, link, image, imagePosition, backgroundColor} = block
  const isImageLeft = stegaClean(imagePosition) === 'left'
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text side */}
          <div className={isImageLeft ? 'lg:order-2' : 'lg:order-1'}>
            {eyebrow && (
              <FadeIn immediate>
                <Badge className="mb-3">{eyebrow}</Badge>
              </FadeIn>
            )}

            {heading && (
              <FadeIn delay={0.05} immediate>
                <h2 className="md:text-5xl text-4xl lg:text-text-6xl leading-[110%] font-semibold tracking-tight mb-4">
                  {heading}
                </h2>
              </FadeIn>
            )}

            {description && (
              <FadeIn delay={0.1} immediate>
                <p className="text-[16px] lg:text-[18px] md:w-[90%]  leading-[160%] opacity-80 mb-8">
                  {description}
                </p>
              </FadeIn>
            )}

            {items && items.length > 0 && (
              <FadeIn delay={0.15} immediate>
                <ul className="space-y-4 mb-8">
                  {items.map((item) => (
                    <li key={item._key} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-sage flex items-center justify-center">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 7.5L5.5 10L11 4"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-[16px] lg:text-[17px] leading-[150%]">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            )}

            {link?.label && link?.link && (
              <FadeIn delay={0.2} immediate>
                <ResolvedLink
                  link={link.link}
                  className="inline-flex items-center gap-2 text-[16px] font-medium text-terracotta hover:opacity-70 transition-opacity"
                >
                  {link.label}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 8H13M13 8L9 4M13 8L9 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </ResolvedLink>
              </FadeIn>
            )}
          </div>

          {/* Image side */}
          <div className={isImageLeft ? 'lg:order-1' : 'lg:order-2'}>
            {image?.asset?._ref && (
              <FadeIn delay={0.1} immediate>
                <Image
                  id={image.asset._ref}
                  alt={image.alt || heading || 'Requirements image'}
                  width={600}
                  crop={image.crop}
                  className="rounded-lg aspect-[4/3] w-full object-cover"
                />
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
