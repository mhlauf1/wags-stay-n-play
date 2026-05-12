import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'

type ImageRowProps = {
  block: {
    images?: Array<{
      _key: string
      asset?: {_ref: string}
      crop?: any
      alt?: string
    }>
  }
  index: number
  pageId: string
  pageType: string
}

export default function ImageRow({block}: ImageRowProps) {
  const {images} = block

  if (!images || images.length === 0) return null

  return (
    <section className="bg-cream overflow-hidden">
      <div className="flex gap-3 px-4 lg:px-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {images.map((img, i) =>
          img.asset?._ref ? (
            <FadeIn key={img._key} delay={0.05 * i}>
              <div className="flex-shrink-0 snap-center">
                <Image
                  id={img.asset._ref}
                  alt={img.alt || ''}
                  width={400}
                  crop={img.crop}
                  className="rounded-md h-[200px] lg:h-[280px] w-auto object-cover"
                />
              </div>
            </FadeIn>
          ) : null,
        )}
      </div>
    </section>
  )
}
