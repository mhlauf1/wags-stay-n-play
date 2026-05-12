import imageUrlBuilder from '@sanity/image-url'
import {dataset, projectId} from './api'

const builder = imageUrlBuilder({projectId, dataset})

/** Convert a Sanity image asset `_ref` to a CDN URL string at the given width. */
export function sanityImageUrl(ref: string, width: number): string {
  return builder.image(ref).width(width).auto('format').url()
}

/**
 * Convert a Sanity image asset `_ref` to a CDN URL string,
 * also parsing natural dimensions from the `_ref` pattern (image-hash-WxH-ext).
 * Useful for YARL lightbox aspect ratio calculations.
 */
export function sanityImageUrlWithDimensions(
  ref: string,
  width: number,
): {src: string; width: number; height: number} {
  const src = sanityImageUrl(ref, width)

  // Parse dimensions from Sanity asset ref: image-<hash>-<W>x<H>-<ext>
  const match = ref.match(/-(\d+)x(\d+)-/)
  const naturalWidth = match ? parseInt(match[1], 10) : width
  const naturalHeight = match ? parseInt(match[2], 10) : Math.round(width * 0.75)

  return {src, width: naturalWidth, height: naturalHeight}
}
