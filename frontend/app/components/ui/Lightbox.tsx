'use client'

import YARLightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/counter.css'

type LightboxImage = {
  src: string
  alt?: string
  width?: number
  height?: number
}

type LightboxProps = {
  images: LightboxImage[]
  open: boolean
  index: number
  onClose: () => void
}

export default function Lightbox({images, open, index, onClose}: LightboxProps) {
  if (!open) return null

  return (
    <YARLightbox
      open={open}
      close={onClose}
      index={index}
      slides={images.map((img) => ({
        src: img.src,
        alt: img.alt || '',
        width: img.width,
        height: img.height,
      }))}
      plugins={[Thumbnails, Zoom, Counter]}
      styles={{
        container: {backgroundColor: 'rgba(45, 74, 62, 0.95)'},
      }}
      thumbnails={{
        border: 0,
        borderRadius: 8,
        padding: 0,
        gap: 8,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
      }}
    />
  )
}
